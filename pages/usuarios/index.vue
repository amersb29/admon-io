<template>
    <div class="row">
      <div class="col-12">
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
                            <table class="table" :class="tableClass">
                                <thead>
                                    <slot name="columns">
                                        <th v-for="column in table1.columns" :key="column">{{column}}</th>
                                    </slot>
                                </thead>
                                <tbody>
                                    <tr v-for="user in data.users" :key="user.id">
                                        <slot :row="user">
                                            <td>
                                                {{ user.id }}
                                            </td>
                                            <td>
                                                {{ user.first_name }} {{ user.last_name }}
                                            </td>
                                            <td>
                                                <span v-if="user.membership">
                                                    {{ user.membership.name }}
                                                </span>
                                            </td>
                                             <td>
                                                <span v-if="user.roles">
                                                    {{ user.roles | printRoles }}
                                                </span>
                                            </td>
                                            <td>
                                                <p-button round icon 
                                                          type="primary" 
                                                          class="btn-just-icon: ti-pencil">
                                                </p-button>
                                                <p-button round icon 
                                                          type="danger" 
                                                          class="btn-just-icon: ti-trash">
                                                </p-button>
                                            </td>
                                        </slot>
                                    </tr>
                                </tbody>
                            </table>
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
