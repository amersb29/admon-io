<template>
    <div class="row">
      <div class="col-6">
        <ApolloQuery
            :query="require('../../graphql/queries/users.gql')"
        >
            <template v-slot="{ result: { loading, error, data } }">
                <!-- Loading -->
                <div v-if="loading" class="loading apollo">Loading...</div>

                <!-- Error -->
                <div v-else-if="error" class="error apollo">An error occurred</div>

                <!-- Result -->
                <div v-else-if="data" class="result apollo">
                    <card :title="table1.title" :subTitle="table1.subTitle">
                        <div slot="raw-content" class="table-responsive">
                            <b-table striped hover :class="tableClass" :items="data.users" :fields="fields">
                                <template slot="name" slot-scope="data">
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
                                                @click="() => alert('Borrar: ' + data.item.first_name)" 
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
    </div>
</template>

<script>
export default {
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
            subTitle: "Usuarios registrados en la plataforma",
            columns: ["Id", "Nombre", "Membresía", "Roles"],
        },
      }
  },
  computed: {
    tableClass() {
      return `table-striped`;
    }
  },
  filters: {
    printRoles: function ( roles ) {
        if (!roles) return ''
        
        let names = [];

        roles.forEach( role => {
            names.push(role.name);
        });

        return names.sort().toString().replace(/,/g, ', ');
    }
  },
}
</script>

<style>

</style>
