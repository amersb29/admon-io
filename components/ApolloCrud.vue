<template>
    <ApolloQuery :query="require(`@/graphql/queries/${catalogo.folder}/${catalogo.id}.gql`)"
                 :context="apolloContext"
                 @result="setBusy($event, false)">
        <template v-slot="{ result: { loading, error, data } }">
            <!-- Loading -->
            <div v-if="loading" class="loading apollo">Loading...</div>

            <!-- Error -->
            <div v-else-if="error" class="error apollo">An error occurred</div>

            <!-- Result -->
            <div v-else-if="data" class="result apollo">
                <b-pagination align="right"
                            v-model="currentPage"
                            :per-page="perPage"
                            size="sm"
                            :total-rows="totalRows"
                            v-show="pagination"></b-pagination>
                <b-table borderless
                        :busy="isBusy"
                        :current-page="currentPage"
                        :fields="table_fields"
                        :filter="filter"
                        @filtered="updateTotalRows(($event.length || 0))"
                        :fixed="isFixedTable"
                        hover
                        :items="getItems(data)" 
                        :per-page="perPage"
                        responsive>
                    <template v-slot:thead-top="data" v-if="isFormHeaderShown">
                        <b-tr v-if="currentAction !== actions.DELETE">
                            <b-th v-for="field of table_fields" :key="field.key">
                                <b-input hidden 
                                        name="id"
                                        v-if="field.key === 'id'"
                                        v-model="formItem.id"/>

                                <b-input class="form-control"   
                                      :name="field.key" 
                                        :placeholder="`${getPlaceholder(field)}`"
                                        :ref="field.key"
                                        type="text"
                                        v-if="field.key !== 'id' && field.key !== 'acciones'"
                                        v-model="formItem[field.key]"/>

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
        // catalogo: null,
        filter: null,
        fixedTable: {
            type: Boolean,
            default: true
        },
        pagination: {
            type: Boolean,
            default: true
        },
        showDetailsButton: {
            type: Boolean,
            default: false
        },
        showFormHeader: {
            type: Boolean,
            default: true
        },
        table_fields: null,
        
    },
    data() {
        return {
            formItem: null,
            isBusy: true,
            token: null,

            currentPage: 1,
            perPage: 15,
            totalRows: 0,
        }
    },
    computed: {
        actions() {
            return actions
        },
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
        },
        currentAction() {
            return this.$store.state.action
        },
        selectedItem() {
            return this.$store.state.selectedItem
        },
        catalogo() {
            return this.$store.getters.catalog
        }
    },
    methods: {
        executeMutation() {
            this.$apollo.mutate({
                mutation: this.$store.getters.mutation,
                variables: this.getVariables(),
                update: this.updateCache
            }).then((data) => {                
                let mixin = this.$swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 4000,
                })

                mixin.fire(this.getMessage(this.catalogo), '', 'success')

                this.resetSelectedItem()
            }).catch((error) => {
                // console.log("ERROR", error)
            })
        },
        editOrDelete( item, action ) {
            this.formItem = Object.assign({}, item) //para los catálogos
            this.$store.dispatch('manageAction', { action, item } ) // para Usuarios y Productos
            this.$emit('onEditOrDelete', { action })
        },
        fieldChanged(value, key){            
            this.$store.commit('changeField', {key, value})
        },
        getItems( data ){
            return data[this.catalogo.id]
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
            
            let mensaje = `${catalogo.articulo_singular} ${catalogo.singular} ha sido ${action}`
            let genero = catalogo.id === catalogos.MEMBRESIAS.id ? 'a' : 'o' ;
            return mensaje.replace('#', genero);
        },
        getPlaceholder(field) {
            let placeholder = `${propiedades[field.key]} de ${this.catalogo.articulo_singular.toLowerCase()} ${this.catalogo.singular.charAt(0).toUpperCase() + this.catalogo.singular.slice(1)}`
            return placeholder.replace('de el', 'del')
        },
        getVariables(){
            let baseVariablesObj = Object.assign({}, this.formItem)

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
            this.formItem = Object.assign({}, this.baseVariablesObj )
            this.$store.commit('changeSelectedItem', Object.assign({}, this.baseVariablesObj ) )
            this.$store.commit('changeAction', actions.CREATE)
            this.$emit('onResetForm', {action: actions.CREATE})
        },
        setBusy($event, state) {
            this.isBusy = state
            this.updateTotalRows($event.data && $event.data.products ? $event.data.products.length : 0)
        },
        showDetails( id ){
            this.$emit('onDetails', {id})
        },
        updateCache(store, {data: { res } }){
            this.$store.dispatch('updateCache', {store, res}) 
        },
        updateTotalRows(length) { this.totalRows = length },
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