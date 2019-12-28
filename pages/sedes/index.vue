<template>
    <div>
      <b-row>
        <b-col md="12">
          <b-row >
            <b-col>
                <b-button v-b-toggle.sedesTable variant="success" size="sm">
                  <i :class="{'fa': true, 'fa-caret-up': sedesTableBttnIcon, 'fa-caret-down': !sedesTableBttnIcon}"></i> 
                  Mostrar Sedes 
                </b-button>
                <b-button v-b-toggle.createSede variant="primary" size="sm">
                  <i :class="{'fa': true, 'fa-caret-up': createSedeBttnIcon, 'fa-caret-down': !createSedeBttnIcon}"></i> 
                  Crear Sede 
                </b-button>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-collapse id="createSede" ref="createSede" class="mt-2">
                  <edit-sedes-form @sede-created="sedeCreated" 
                                   @sede-creation-error="sedeCreationError"></edit-sedes-form>
              </b-collapse>
              <b-collapse id="sedesTable" class="mt-2" :visible="sedesTableBttnIcon">
                <b-card>
                  <apollo-crud ref="sedesTable"
                          :fixedTable="false"
                          @onEditOrDelete="editOrDelete"
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
import EditSedesForm from './EditSedesForm'
import ApolloCrud from '@/components/ApolloCrud'
import Crud from '@/components/Crud.vue'
import actions from '@/enums/actions'
import catalogos from '@/enums/catalogos'

import sedesList from '@/graphql/queries/sedes/sedes.gql'
import updateMutation from '@/graphql/mutations/sedes/UpdateSede.gql'
import deleteMutation from '@/graphql/mutations/sedes/DeleteSede.gql'

export default {
    layout: 'dashboard/DashboardLayout',
    components: {ApolloCrud, EditSedesForm},
    mixins: [Crud],
    mounted(){
        this.$root.$on('bv::collapse::state', (collapseId, isJustShown) => {
        this[`${collapseId}BttnIcon`] = isJustShown
        })

        this.$store.commit('changeQuery', sedesList);
        this.$store.commit('changeCatalog', catalogos.SEDES);
    },
    data(){
        return {
            fields: [
                { key: 'id', sortable: true },
                { key: 'name', label: 'Nombre', sortable: true },
                { key: 'code', label: 'Código', sortable: true },
                { key: 'country.name', label: 'País', sortable: true },
                { key: 'acciones', label: '' }
            ],
            sedesTableBttnIcon: true,
            createSedeBttnIcon: false,
            updateMutation,
            deleteMutation,
        }
    },
    methods: {
        editOrDelete(e) {
            this.changeMutation(e)
            switch (e.action) {
                case actions.DELETE:
                this.showDeleteProductAlert()
                break;
                case actions.UPDATE:
                if( !this.$refs.createSede.show ) {
                    this.$refs.createSede.show = true;
                }
                break;
            }
        },
        sedeCreated() {
            let mixin = this.$swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 4000,  
            })

            const op = e.action === actions.CREATE ? 'creada' : 'actualizada' ;
            mixin.fire(`La Sede ha sido ${op}`, '', 'success')
        },
        sedeCreationError() {
            let mixin = this.$swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 4000,  
            })

            mixin.fire(`Ocurrió un problema al crear la Sede`, '', 'error')
        },
    }
}
</script>

<style>

</style>