<template>
    <ApolloQuery :query="require( `@/graphql/queries/select_${gqlQuery}.gql` )">
        <template v-slot="{ result: { loading, error, data } }">
        <!-- Loading -->
        <div v-if="loading" class="loading apollo">Loading...</div>

        <!-- Error -->
        <div v-else-if="error" class="error apollo">An error occurred</div>

        <!-- Result -->
        <div v-else-if="data" class="result apollo">
            <b-form-select :id="gqlQuery" class="custom-dropdown" @change="onOptionChange">
            <option v-if="selectedValue === undefined" :value="null" :selected=true>{{ initialNullText || 'Seleccione una opción' }}</option>
            <option v-for="el of data[`${gqlQuery}_combo`]" :value="el.id" :selected="String(el.id) === selectedValue" :key="el.id"> {{ el[optionText] }}</option>
            </b-form-select>
        </div>

        <!-- No result -->
        <div v-else class="no-result apollo">No result :(</div>
        </template>
    </ApolloQuery>
</template>

<script>
export default {
    props: {
        gqlQuery: String,
        selectedValue: String, 
        optionText: String,
        initialNullText: String
    },
    computed: {
        
    },
    data() {
        return {
            id: ''
        }
    },
    methods: {
        onOptionChange( $event ){
            this.$emit('change', $event);
        }
    }
}
</script>

<style>

</style>