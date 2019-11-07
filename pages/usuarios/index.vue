<template>
    <div class="row">
      <div class="col-12">
        <ApolloQuery
            :query="require('@/graphql/queries/users.gql')" 
            :context="this.apolloContext">
            <template v-slot="{ result: { loading, error, data } }">
                <!-- Loading -->
                <div v-if="loading" class="loading apollo">Loading...</div>

                <!-- Error -->
                <div v-else-if="error" class="error apollo">An error occurred</div>

                <!-- Result -->
                <div v-else-if="data" class="result apollo">
                    <card :title="table1.title" 
                          :actions="table1.actions" 
                          @create-user-modal="showCreatedUsrModal">
                        <div slot="raw-content" class="table-responsive">
                            <b-table striped hover :class="tableClass" :items="data.users" :fields="fields">
                                <template slot="name" slot-scope="data">
                                    <i class="fa fa-circle" :class=" {'text-info': data.item.state, 
                                                                    'text-danger': !data.item.state }"></i>
                                    {{ data.item.first_name }} {{ data.item.last_name }}
                                </template>
                                <template slot="roles" slot-scope="data">
                                    {{ data.item.roles | printRoles }}
                                </template>
                                <template slot="acciones" slot-scope="data">
                                    <p-button round icon
                                                @click="() => alert('Editar: ' + data.item.id)" 
                                                type="primary" 
                                                class="btn-just-icon: ti-pencil">
                                    </p-button>
                                    <p-button round icon 
                                                @click="deleteUser(data.item)" 
                                                type="danger" 
                                                class="btn-just-icon: ti-trash">
                                    </p-button>
                                </template>
                            </b-table>
                        </div>
                    </card>
                </div>

                <!-- No result -->
                <div v-else class="no-result apollo">No result :(</div>
            </template>
        </ApolloQuery>
      </div>
      <b-modal id="create-user-modal" title="Registrar Usuario" hide-footer hide-header>
        <edit-profile-form textButton="Registrar Usuario" 
                           formTitle="Registrar Usuarios"
                           @user-created="userCreated"
                           @user-creation-error="userCreationError"
                           :updateMethod="updateCache">
        </edit-profile-form>
      </b-modal>
      <div ref="container"></div>
    </div>
</template>

<script>
import { setContext } from "apollo-link-context";
import usersList from '@/graphql/queries/users.gql';
import deleteUserMut from '@/graphql/mutations/user/DeleteUser.gql';

import EditProfileForm from './profile/UserProfile/EditProfileForm.vue'

export default {
  components: {EditProfileForm},
  layout: 'dashboard/DashboardLayout',
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
        table1: {
            title: "Usuarios",
            columns: ["Id", "Nombre", "Membresía", "Roles"],
            actions: [{name: 'Create Users', icon: 'plus-square', eventName: 'create-user-modal'  }]
        },
        modalShowed: false,
      }
  },
  computed: {
    tableClass() {
      return `table-striped`;
    },
    apolloContext() {
      return setContext((request, previousContext) => ({
                headers: {Authorization: `Bearer ${localStorage.getItem('apollo-token')}`}
              }));
    }
  },
  methods: {
    showCreatedUsrModal(e){
      this.$bvModal.show('create-user-modal')
    },
    userCreated(e){
      this.$bvModal.hide('create-user-modal')
      
      const options = {
        icon: 'ti-user',
        horizontal: 'center',
        vertical: 'top',
        message: 'El Usuario ha sido creado correctamente',
        type: 'success'
      }
      this.showNotification( options )
    },
    updateCache(store, {data: { createUser } }){
      const query = {query: usersList };

      const data = store.readQuery( query )

      data.users.push(createUser)
      // Write back to the cache
      store.writeQuery({
        ...query,
        data,
      })
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
        this.$apollo.mutate({
        // Query
        mutation: deleteUserMut,
        // Parameters
        variables: { id: user.id, roles: user.roles.map( rol => rol.id ) },
        // update: this.updateMethod
      }).then((data) => {
        this.$emit('user-created');
      }).catch((error) => {
        this.$emit('user-creation-error');
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
  },
  filters: {
    printRoles: function ( roles ) {
        return ( roles || [] )
               .map( rol => rol.name)
               .sort()
               .join(', ');
    }
  },
}
</script>

<style lang="scss" scoped>
  .modal-title {
    font-size: 2.5em;
  }
</style>
