<template>
    <ApolloQuery :query="require( `@/graphql/queries/select_${gqlQuery}.gql` )">
        <template v-slot="{ result: { loading, error, data } }">
        <!-- Loading -->
        <div v-if="loading" class="loading apollo">Loading...</div>

        <!-- Error -->
        <div v-else-if="error" class="error apollo">An error occurred</div>

        <!-- Result -->
        <div v-else-if="data" class="result apollo">
            <b-form-select :id="gqlQuery" class="custom-dropdown mb-3" @change="onOptionChange" :multiple="arrayModel !== undefined" v-model="selected">
                <option v-if="selectedValue === undefined && !arrayModel" :value="null">{{ initialNullText || 'Seleccione una opción' }}</option>
                <option v-for="el of data[`${gqlQuery}_combo`]" :value="optionValue(el)" :selected="String(el.id) === selectedValue" :key="el.id"> {{ el[optionText] }}</option>
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
        initialNullText: String,
        model: String,
        arrayModel: Array,
        filter: Boolean
    },
    computed: {
        selected: {
            get: function (){
                    if (this.arrayModel !== undefined)
                        return this.arrayModel
                    else if ( this.selectedValue !== undefined )
                        return this.optSelected
                    else
                        return null
                },
            set: function ( val ) {
                this.optSelected = val
            }
        },
    },
    data() {
        return {
            optSelected: this.selectedValue
        }
    },
    methods: {
        onOptionChange( $event ){
            this.$emit('change', $event);
        },
        optionValue(el) {
            return this.filter ? el.description : el.id ;
        }
    }
}
</script>

<style>

</style>