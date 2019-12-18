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
              <b-collapse id="createProduct" ref="createProduct" class="mt-2">
                <edit-products-form @product-created="productCreated"
                                    @product-creation-error="productCreationError"></edit-products-form>
              </b-collapse>
              <b-collapse id="productsTable" class="mt-2" :visible="productsTableBttnIcon">
                <b-card>
                  <apollo-crud ref="productsTable"
                          :catalogo="getCatalogo"
                          :deleteMutation="deleteM"
                          :filter="filter"
                          :fixedTable="false"
                          @onEditOrDelete="editOrDelete"
                          :query="query"
                          :showDetailsButton="false"
                          :showFormHeader="false"
                          :table_fields="fields"></apollo-crud>
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
import EditProductsForm from './EditProductsForm'

import actions from '@/enums/actions'
import catalogos from '@/enums/catalogos'

import productsList from '@/graphql/queries/productos/products.gql'
import deleteMutation from '@/graphql/mutations/product/DeleteProduct.gql'
import updateMutation from '@/graphql/mutations/product/UpdateProduct.gql'

export default {
  components: { ApolloCrud, ApolloSelect, EditProductsForm },
  layout: 'dashboard/DashboardLayout',
  mounted(){
    this.$root.$on('bv::collapse::state', (collapseId, isJustShown) => {
      this[`${collapseId}BttnIcon`] = isJustShown
    })

    this.$store.commit('changeQuery', productsList);
    this.$store.commit('changeCatalog', catalogos.PRODUCTOS);
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
        deleteM: deleteMutation,

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
      this.$store.dispatch('manageAction', 
                            {
                              action: e.action, 
                              mutation: this.getMutation(e.action),
                              selectedItem: e.item
                            }
                          )

      switch (e.action) {
        case actions.DELETE:
          this.deleteProduct( this.$store.state.selectedItem )
          break;
        case actions.UPDATE:
          if( !this.$refs.createProduct.show ) {
            this.$refs.createProduct.show = true;
          }
          break;
      }
    },
    getMutation(action){
      switch (action) {
          case actions.CREATE: 
              return createMutation
              break
          case actions.UPDATE:
              return updateMutation
              break;
          case actions.DELETE:
              return deleteMutation 
              break
      }
    },
    onSelectChange(e) { this.filter = e && e.target ? e.target.value : e; console.log(this.filter);
    },
    productCreated(e){
    let mixin = this.$swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 4000,  
        timerProgressBar: true,
      })

      const op = e.action === actions.CREATE ? 'creado' : 'actualizado' ;
      mixin.fire(`El Producto ha sido ${op}`, '', 'success')
      
    },
    productCreationError(e) {
      const options = {
        icon: 'ti-user',
        horizontal: 'center',
        vertical: 'top',
        message: 'Hubo un error al crear al Usuario',
        type: 'danger'
      }
      this.showNotification( options )
    },
    deleteProduct( product ) {
        this.$swal(
          {
            title: '<i class="fa fa-exclamation-circle" style="font-size: 7rem !important; color: #F3BB45 !important; width: 100%;"></i> ¡Cuidado!',
            text: `¿Desea borrar el producto ${product.name}?`,
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
    },
  }
}
</script>

<style lang="scss">
  .swal2-title {
    flex-direction: column;
  }
</style>