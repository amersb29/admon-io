<template>
    <div>
      <b-row>
        <b-col md="12">
          <b-row >
            <b-col>
                <b-button v-b-toggle.productsTable variant="success" size="sm">
                  <i :class="{'fa': true, 'fa-caret-up': productsTableBttnIcon, 'fa-caret-down': !productsTableBttnIcon}"></i> 
                  Mostrar Productos 
                </b-button>
                <b-button v-b-toggle.createProduct variant="primary" size="sm">
                  <i :class="{'fa': true, 'fa-caret-up': createProductBttnIcon, 'fa-caret-down': !createProductBttnIcon}"></i> 
                  Crear Producto 
                </b-button>
                <b-button v-b-toggle.filterProduct variant="primary" size="sm" v-if="productsTableBttnIcon">
                  <i :class="{'fa': true, 'fa-caret-up': filterProductBttnIcon, 'fa-caret-down': !filterProductBttnIcon}"></i> 
                  Filtros
                </b-button>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-collapse id="filterProduct" class="mt-2">
                <b-card>
                  <apollo-select
                    @change="onSelectChange($event)"
                    filter
                    gqlQuery="tiposProducto"
                    id="tpProducto_filter" 
                    initialNullText="Todas las categorías"
                    optionText="description"/>
                </b-card>
              </b-collapse>
              <b-collapse id="createProduct" class="mt-2">
                  Product Form
                <!-- <edit-profile-form ref="form-create-user" 
                                  textButton="Registrar Usuario" 
                                  @user-created="userCreated"
                                  @user-creation-error="userCreationError"
                                  :updateMethod="updateMethod">
                </edit-profile-form> -->
              </b-collapse>
              <b-collapse id="productsTable" class="mt-2" :visible="productsTableBttnIcon">
                <b-card>
                  <apollo-crud ref="productsTable"
                          :catalogo="getCatalogo"
                          :filter="filter"
                          :fixedTable="false"
                          @onDetails="showDetails"
                          @onEditOrDelete="editOrDelete"
                          :showDetailsButton="false"
                          :showFormHeader="false"
                          :table_fields="fields"
                          :createMutation="createM"
                          :deleteMutation="deleteM"
                          :updateMutation="updateM"
                          :query="query"></apollo-crud>
                </b-card>
              </b-collapse>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </div>
</template>

<script>
import ApolloCrud from '@/components/ApolloCrud'
import ApolloSelect from '@/components/ApolloSelect'
import actions from '@/enums/actions'
import catalogos from '@/enums/catalogos'

import productsList from '@/graphql/queries/productos/products.gql'
import createMutation from '@/graphql/queries/productos/edit_productos.gql'
import updateMutation from '@/graphql/queries/productos/edit_productos.gql'
import deleteMutation from '@/graphql/mutations/user/DeleteUser.gql'

export default {
  components: { ApolloCrud, ApolloSelect },
  layout: 'dashboard/DashboardLayout',
  mounted(){
    this.updateMethod = this.$refs.productsTable.updateCache
    this.$root.$on('bv::collapse::state', (collapseId, isJustShown) => {
      this[`${collapseId}BttnIcon`] = isJustShown
    })
  },
  data() {
      return {        
        fields: [
            {
                key: 'id',
                sortable: true
            },
            {
                key: 'name',
                label: 'Nombre',
                sortable: true
            },
            {
                key: 'tipoProducto.description',
                label: 'Categoría',
                sortable: true
            },
            {
                key: 'acciones',
                label: ''
            }
        ],
        filter: null,
        query: productsList,
        createM: createMutation,
        updateM: updateMutation,
        deleteM: deleteMutation,
        updateMethod: null,

        createProductBttnIcon: false,
        filterProductBttnIcon: false,
        productsTableBttnIcon: true,
      }
  },
  computed: {
    tableClass() {
      return `table-striped`;
    },
    getCatalogo: () => catalogos.PRODUCTOS,
  },
  methods: {
    editOrDelete(e){
      if(e.action === actions.DELETE) {
        this.deleteUser( e.item )
      }
    },
    onSelectChange(e) { this.filter = e && e.target ? e.target.value : e; console.log(this.filter);
    },
    showDetails(e) {
      console.log(e)
    },
    userCreated(e){
      this.$root.$emit('bv::toggle::collapse', 'createUser')
      
      let mixin = this.$swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
        })

        mixin.fire('El Usuario ha sido creado correctamente', '', 'success')
    },
    userCreationError(e) {
      const options = {
        icon: 'ti-user',
        horizontal: 'center',
        vertical: 'top',
        message: 'Hubo un error al crear al Usuario',
        type: 'danger'
      }
      this.showNotification( options )
    },
    deleteUser( user ) {
        this.$swal(
          {
            title: '<i class="fa fa-exclamation-circle" style="font-size: 7rem !important; color: #F3BB45 !important; width: 100%;"></i> ¡Cuidado!',
            text: `¿Desea borrar al usuario ${user.first_name} ${user.last_name}?`,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Sí, bórralo!',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar'
          }).then( result => {
            if(result.value){                  
              this.$refs.productsTable.executeMutation();
            }
          })
    },
    showNotification( options ) {
      this.$notify({
        // component: NotificationTemplate,
        message: options.message,
        icon: options.icon,
        horizontalAlign: options.horizontal,
        verticalAlign: options.vertical,
        type: options.type
      });
    }
  }
}
</script>

<style lang="scss">
  .swal2-title {
    flex-direction: column;
  }
</style>