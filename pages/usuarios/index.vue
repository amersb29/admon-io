<template>
    <div>
      <b-row>
        <b-col md="8">
          <b-row >
            <b-col>
                <b-button v-b-toggle.usersTable variant="success" size="sm">
                  <i :class="{'fa': true, 'fa-caret-up': usersTableBttnIcon, 'fa-caret-down': !usersTableBttnIcon}"></i> 
                  Mostrar Usuarios 
                </b-button>
                <b-button v-b-toggle.createUser variant="primary" size="sm">
                  <i :class="{'fa': true, 'fa-caret-up': createUserBttnIcon, 'fa-caret-down': !createUserBttnIcon}"></i> 
                  Crear Usuario 
                </b-button>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-collapse id="createUser" class="mt-2">
                <edit-profile-form ref="form-create-user" 
                                  textButton="Registrar Usuario" 
                                  @user-created="userCreated"
                                  @user-creation-error="userCreationError"
                                  :updateMethod="updateMethod">
                </edit-profile-form>
              </b-collapse>
              <b-collapse id="usersTable" class="mt-2" :visible="usersTableBttnIcon">
                <b-card>
                  <apollo-crud ref="userTable"
                          :catalogo="getCatalogo"
                          :table_fields="fields"
                          :query="query"
                          :createMutation="createM"
                          :updateMutation="updateM"
                          :deleteMutation="deleteM"
                          :showDetailsButton="true"
                          :showFormHeader="false"
                          :fixedTable="false"
                          @onDetails="showDetails"
                          @onEditOrDelete="editOrDelete"></apollo-crud>
                </b-card>
              </b-collapse>
            </b-col>
          </b-row>
        </b-col>
        <b-col>
          <b-card style="height: 550px"></b-card>
        </b-col>
      </b-row>
    </div>
</template>

<script>
import ApolloCrud from '@/components/ApolloCrud'
import actions from '@/enums/actions'
import catalogos from '@/enums/catalogos'

import usersList from '@/graphql/queries/usuarios/users.gql';
import createMutation from '@/graphql/queries/usuarios/users.gql';
import updateMutation from '@/graphql/queries/usuarios/users.gql';
import deleteMutation from '@/graphql/mutations/user/DeleteUser.gql';

import EditProfileForm from './profile/UserProfile/EditProfileForm.vue'

export default {
  components: { ApolloCrud, EditProfileForm },
  layout: 'dashboard/DashboardLayout',
  mounted(){
    this.updateMethod = this.$refs.userTable.updateCache
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
            key: 'membership.name',
            label: 'Membresía',
            sortable: true
          },
          {
            key: 'roles',
            label: 'Roles',
            sortable: true
          },
          {
              key: 'acciones',
              label: ''
          }
        ],
        query: usersList,
        createM: createMutation,
        updateM: updateMutation,
        deleteM: deleteMutation,
        updateMethod: null,

        createUserBttnIcon: false,
        usersTableBttnIcon: true,
      }
  },
  computed: {
    tableClass() {
      return `table-striped`;
    },
    getCatalogo: () => catalogos.USUARIOS,
  },
  methods: {
    editOrDelete(e){
      if(e.action === actions.DELETE) {
        this.deleteUser( e.item )
      }
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
              this.$refs.userTable.executeMutation();
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
