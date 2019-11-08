<template>
    <ApolloQuery :query="require('@/graphql/queries/catalogos/membresias.gql')"
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
                            :fields="fields"
                            fixed
                            hover
                            :items="data.memberships" 
                            responsive>
                    <template v-slot:thead-top="data">
                        <b-tr v-if="currentAction !== actions.DELETE">
                            <b-th style="width: 60px">
                                <b-input hidden 
                                            name="id"
                                            ref="itemId"
                                            v-model="selectedItem.id"/>
                            </b-th>
                            <b-th style="width: 225px">
                                <b-input class="form-control" 
                                        id="memName"
                                        name="name" 
                                        placeholder="Nombre de la Membresía"
                                        ref="memName"
                                        type="text"
                                        v-model="selectedItem.name"/>
                            </b-th>
                            <b-th style="width: 225px">
                                <b-input hidden ></b-input>
                                <b-input class="form-control"
                                        id="memPrice"
                                        name="price"
                                        placeholder="Precio de la Membresía"
                                        ref="memPrice"
                                        type="text"
                                        v-model="formatedPrice"/>
                            </b-th>
                            <b-th>
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
                            </b-th>
                        </b-tr>
                        <b-tr v-else>
                            <b-th style="width: 60px">&nbsp;</b-th>
                            <b-th style="width: 450px" colspan="2">
                                Está seguro que desea borrar la membresía "{{ selectedItem.name }}"?
                            </b-th>
                            <b-th>
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
                            </b-th>
                        </b-tr>
                    </template>
                    <template v-slot:cell(id)="data">
                        {{ data.value }}
                    </template>
                    <template v-slot:cell(name)="data">
                        {{ data.value }}
                    </template>
                    <template v-slot:cell(price)="data">
                        {{ data.value | currency }}
                    </template>
                    <template v-slot:cell(acciones)="data">
                            <div class="form-buttons-section">
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
import memberships from '@/graphql/queries/catalogos/membresias.gql'
import createMemMutation from '@/graphql/mutations/catalogos/CreateMembership.gql'
import updateMemMutation from '@/graphql/mutations/catalogos/UpdateMembership.gql'
import deleteMemMutation from '@/graphql/mutations/catalogos/DeleteMembership.gql'

export default {
    name: 'membresias-table',
    created() {
        this.resetSelectedItem()        
    },
    data() {
        return {
            actions: actions,
            currentAction: -1, 
            isBusy: true,
            fields: [
                {
                    key: 'id',
                    label: 'ID'
                },        
                {
                    key: 'name',
                    label: 'Membresía'
                },
                {
                    key: 'price',
                    label: 'Precio'
                }, 
                {
                    key: 'acciones',
                    label: ''
                }
            ],
            originalItem: { id: 0 , name: undefined, price: 0.0 },
            selectedItem: null
        }
    },
    computed: {
        formatedPrice: {
            get: function() { return this.selectedItem.price ? accounting.formatMoney(this.selectedItem.price) : '' },
            set: function(value) { this.selectedItem.price = accounting.unformat(value) }
        },
        actionButton() {
            return this.currentAction === actions.CREATE ? 'save' : 'pencil' 
        },
        buttonVariant(){
            return this.currentAction === actions.CREATE ? 'primary' : 'warning'
        }
    },
    methods: {
        executeMutation() {
            this.$apollo.mutate({
                mutation: this.getMutation(),
                variables: this.getVariables(),
                update: this.updateCache
            }).then((data) => {                
                this.$notify({
                    icon: 'ti-user',
                    horizontal: 'center',
                    vertical: 'top',
                    message: this.getMessage(catalogos.MEMBRESIAS),
                    type: 'success'
                })
                this.resetSelectedItem()
            }).catch((error) => {
                console.log("ERROR", error)
            })
        },
        editOrDelete( item, action ) {
            this.currentAction = action
            this.selectedItem = {...item}
        },
        getMutation(){
          switch (this.currentAction) {
              case actions.CREATE: 
                  return createMemMutation
                  break
              case actions.UPDATE:
                  return updateMemMutation
                  break;
              case actions.DELETE:
                  return deleteMemMutation 
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
        getVariables(){
            let baseVariablesObj = { id: this.selectedItem.id,
                                     name: this.selectedItem.name, 
                                     price:  this.selectedItem.price 
                                   }

           switch (this.currentAction) {
              case actions.CREATE:
                  delete baseVariablesObj.id
                  break
              case actions.DELETE:
                  delete baseVariablesObj.name
                  delete baseVariablesObj.price
                  break
          }  

          return baseVariablesObj
        },
        resetSelectedItem() {
            this.selectedItem = {...this.originalItem}
            this.currentAction = this.actions.CREATE
        },
        setBusy(state) {
            this.isBusy = state
        },
        updateCache(store, {data: { res } }){
            const query = {query: memberships };

            const data = store.readQuery( query )

            if(this.currentAction === actions.CREATE){
                data.memberships.push(res)
            }

            if(this.currentAction === actions.DELETE){
                let index = data.memberships.findIndex( mem => mem.id === res.id )
                console.log(index)
                data.memberships.splice(index, 1)
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
input, th {
    max-width: 200px;
}
</style>