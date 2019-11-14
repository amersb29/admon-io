<template>
          <ApolloQuery :query="require(`@/graphql/queries/${catalogo.folder}/${catalogo.id}.gql`)"
                       :context="apolloContext"
                    @result="setBusy(false)">
        <template v-slot="{ result: { loading, error, data } }">
            <!-- Loading -->
            <div v-if="loading" class="loading apollo">Loading...</div>

            <!-- Error -->
            <div v-else-if="error" class="error apollo">An error occurred</div>

            <!-- Result -->
            <div v-else-if="data" class="result apollo">
                <b-table borderless
                            :busy="isBusy"
                            :fields="table_fields"
                            :fixed="isFixedTable"
                            hover
                            :items="getItems(data)" 
                            responsive>
                    <template v-slot:thead-top="data" v-if="isFormHeaderShown">
                        <b-tr v-if="currentAction !== actions.DELETE">
                            <b-th v-for="field of table_fields" :key="field.key">
                                <b-input hidden 
                                        name="id"
                                        v-if="field.key === 'id'"
                                        v-model="selectedItem.id"/>

                                <b-input class="form-control" 
                                        :id="field.key"
                                        :name="field.key" 
                                        :placeholder="`${getPlaceholder(field)}`"
                                        :ref="field.key"
                                        type="text"
                                        v-if="field.key !== 'id' && field.key !== 'acciones'"
                                        v-model="selectedItem[field.key]"/>

                                <div v-if="field.key === 'acciones'" class="buttonsContainer">
                                    <b-button :variant="buttonVariant" 
                                          @click="executeMutation()"
                                          size="sm">
                                        <i :class="`fa fa-${actionButton} fa-2x`"></i>
                                    </b-button>
                                    <b-button variant="danger" 
                                            @click="resetSelectedItem()"
                                            size="sm">
                                        <i class="fa fa-ban fa-2x"></i>
                                    </b-button>
                                </div>
                            </b-th>
                        </b-tr>
                        <b-tr v-else>
                            <b-th>&nbsp;</b-th>
                            <b-th colspan="2">
                                Está seguro que desea borrar {{ catalogo.articulo_singular.toLowerCase() }} {{catalogo.singular}} "{{ selectedItem.name || selectedItem.description }}"?
                            </b-th>
                            <b-th>
                                <div class="buttonsContainer">
                                <b-button variant="success" 
                                          @click="executeMutation()"
                                          size="sm">
                                    <i class="fa fa-check fa-2x"></i>
                                </b-button>
                                <b-button variant="danger" 
                                          @click="resetSelectedItem()"
                                          size="sm">
                                    <i class="fa fa-ban fa-2x"></i>
                                </b-button>
                                </div>
                            </b-th>
                        </b-tr>
                    </template>
                    <template v-slot:cell(name)="data" v-if="catalogo.id === 'users'">
                        <i class="fa fa-circle" :class=" {'text-info': data.item.state, 
                                                            'text-danger': !data.item.state }"></i>
                        {{ data.item.first_name }} {{ data.item.last_name }}
                    </template>
                    <template v-slot:cell(roles)="data">
                        {{ data.value | printRoles }}
                    </template>
                    <template v-slot:cell(price)="data">
                        {{ data.value | currency }}
                    </template>
                    <template v-slot:cell(acciones)="data">
                            <div class="form-buttons-section buttonsContainer">
                            <b-button @click="editOrDelete(data.item, actions.UPDATE)"
                                    variant="warning"
                                    size="sm">
                                    <i class="fa fa-pencil fa-lg"></i>
                            </b-button>
                            <b-button @click="editOrDelete(data.item, actions.DELETE)"
                                    variant="danger"
                                    size="sm">
                                    <i class="fa fa-trash fa-lg"></i>
                            </b-button>
                            <b-button @click="showDetails(data.item.id)"
                                    v-if="showDetailsButton"
                                    variant="primary"
                                    size="sm">
                                    <i class="fa fa-eye fa-lg"></i>
                            </b-button>
                        </div>
                    </template>
                </b-table>
            </div>

            <!-- No result -->
            <div v-else class="no-result apollo">No result :(</div>
        </template>
    </ApolloQuery>
</template>

<script>
import accounting from 'accounting'
import actions from '@/enums/actions'
import catalogos from '@/enums/catalogos'
import propiedades from '@/enums/propiedades'


export default {
    name: 'apollo-crud',
    beforeMount(){
        this.token = localStorage.getItem('apollo-token')
    },
    created(){
        this.resetSelectedItem()  
    },
    props: {
        
        baseVariablesObj: {},
        catalogo: null,
        table_fields: null,
        showDetailsButton: {
            type: Boolean,
            default: false
        },
        showFormHeader: {
            type: Boolean,
            default: true
        },
        fixedTable: {
            type: Boolean,
            default: true
        },

        query: null,
        createMutation: null,
        updateMutation: null,
        deleteMutation: null,
        
    },
    data() {
        return {
            actions: actions,
            currentAction: -1, 
            isBusy: true,
            selectedItem: null,
            token: null,
        }
    },
    computed: {
        actionButton() {
            return this.currentAction === actions.CREATE ? 'save' : 'pencil' 
        },
        apolloContext() {
          return {headers: {'Authorization': `Bearer ${this.token}`}}        
        },
        buttonVariant(){
            return this.currentAction === actions.CREATE ? 'primary' : 'warning'
        },
        formatedPrice: {
            get: function() { return this.selectedItem.price ? accounting.formatMoney(this.selectedItem.price) : '' },
            set: function(value) { this.selectedItem.price = accounting.unformat(value) }
        },
        isFixedTable(){
            return this.fixedTable
        },
        isFormHeaderShown() {
            return this.showFormHeader
        }
    },
    methods: {
        executeMutation() {
            this.$apollo.mutate({
                mutation: this.getMutation(),
                variables: this.getVariables(),
                update: this.updateCache
            }).then((data) => {                
                let mixin = this.$swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 4000,
                    timerProgressBar: true,
                })

                mixin.fire(this.getMessage(this.catalogo), '', 'success')

                this.resetSelectedItem()
            }).catch((error) => {
                // console.log("ERROR", error)
            })
        },
        editOrDelete( item, action ) {
            this.currentAction = action
            this.selectedItem = {...item}
            this.$emit('onEditOrDelete', {action: this.currentAction, item: this.selectedItem})
        },
        getItems( data ){
            return data[this.catalogo.id]
        },
        getMutation(){
          switch (this.currentAction) {
              case actions.CREATE: 
                  return this.createMutation
                  break
              case actions.UPDATE:
                  return this.updateMutation
                  break;
              case actions.DELETE:
                  return this.deleteMutation 
                  break
          }
        },
        getMessage(catalogo){
            let action = null
             
            switch (this.currentAction) {
              case actions.CREATE: 
                  action = 'cread#'
                  break
              case actions.UPDATE:
                  action = 'actualizad#'
                  break;
              case actions.DELETE:
                  action = 'borrad#' 
                  break
            }
            
            let mensaje = `${catalogo.articulo_singular} ${catalogo.singular} ha sido ${action} correctamente`
            let genero = catalogo.id === catalogos.MEMBRESIAS.id ? 'a' : 'o' ;
            return mensaje.replace('#', genero);
        },
        getPlaceholder(field) {
            let placeholder = `${propiedades[field.key]} de ${this.catalogo.articulo_singular.toLowerCase()} ${this.catalogo.singular.charAt(0).toUpperCase() + this.catalogo.singular.slice(1)}`
            return placeholder.replace('de el', 'del')
        },
        getQuery(){debugger 
            return this.queryString
        },
        getVariables(){
            let baseVariablesObj = { ...this.selectedItem }

           switch (this.currentAction) {
              case actions.CREATE:
                  delete baseVariablesObj.id
                  break
              case actions.DELETE:
                  Object.keys(baseVariablesObj).map( prop => {
                      if(prop !== 'id') {
                          delete baseVariablesObj[prop]
                      }
                  })
                  break
          }  

          return baseVariablesObj
        },
        resetSelectedItem() {
            this.selectedItem = {...this.baseVariablesObj}
            this.currentAction = actions.CREATE
        },
        setBusy(state) {
            this.isBusy = state
        },
        showDetails( id ){
            this.$emit('onDetails', {id})
        },
        updateCache(store, {data: { res } }){
            const query = {query: this.query };

            const data = store.readQuery( query )

            if(this.currentAction === actions.CREATE){
                data[this.catalogo.id].push(res)
            }

            if(this.currentAction === actions.DELETE){
                let index = data[this.catalogo.id].findIndex( obj => obj.id === res.id )
                data[this.catalogo.id].splice(index, 1)
            }

            // Write back to the cache
            store.writeQuery({
                ...query,
                data,
            })
        },
    }

}
</script>

<style>
    .buttonsContainer {
        margin-left: 15px;
    }

    th:first-child {
        width: 10%;
    }

    th, td {
        vertical-align: middle !important;
    }
</style>