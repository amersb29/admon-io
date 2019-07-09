<template>
    <div>
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
                    <ul>
                        <li v-for="user of data.users" :key="user.id">
                            {{ user.first_name }} {{ user.last_name }}
                        </li>
                    </ul>
                </div>

                <!-- No result -->
                <div v-else class="no-result apollo">No result :(</div>
            </template>
        </ApolloQuery>
    </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
    // data(){
    //     return {
    //         users: []
    //     }
    // },
    // apollo: {
    //     // Simple query that will update the 'hello' vue property
    //     users: gql`{
    //         users{
    //             id
    //             first_name
    //             last_name
    //         }
    //     }`,
    // },
}
</script>

<style>

</style>
