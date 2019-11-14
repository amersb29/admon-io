<template>
  <b-row>
      <b-col md="12">
          <b-card-body>
              <ApolloQuery :query="require('@/graphql/queries/usuarios/users.gql')"
                           :context="apolloContext">
                <template v-slot="{ result: { loading, error, data } }">
                    <div v-if="loading" class="loading apollo">Loading...</div>
                    <div v-else-if="error" class="error apollo">An error occurred</div>
                    <div v-else-if="data" class="result apollo">{{data.users}}</div>
                </template>   
              </ApolloQuery>
              <!-- {{this.$apollo}} -->
          </b-card-body>
      </b-col>
  </b-row>
</template>

<script>
export default {
    layout: 'dashboard/DashboardLayout',
    beforeMount(){debugger
        this.token = localStorage.getItem('apollo-token')
    },
    data(){
        return {
            token: null
        }
    },
    computed: {
        apolloContext() {
            return {headers: {'Authorization': `Bearer ${this.token}`}}        
        }
    }
}
</script>

<style>

</style>