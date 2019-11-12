<template>
    <apollo-crud :baseVariablesObj="baseObj"
                  :catalogo="getCatalogo"
                  :table_fields="fields"
                  :query="query"
                  :createMutation="createM"
                  :updateMutation="updateM"
                  :deleteMutation="deleteM"></apollo-crud>
</template>

<script>

import ApolloCrud from '@/components/ApolloCrud'

import catalogos from '@/enums/catalogos'
import countries from '@/graphql/queries/catalogos/countries.gql'
import createMutation from '@/graphql/mutations/catalogos/paises/CreateCountry.gql'
import updateMutation from '@/graphql/mutations/catalogos/paises/UpdateCountry.gql'
import deleteMutation from '@/graphql/mutations/catalogos/paises/DeleteCountry.gql'

export default {
    name: 'countries-table',
    components: {
        ApolloCrud
    },
    data() {
        return {
            baseObj: { id: 0 , name: undefined, code: undefined },
            fields: [
                {
                    key: 'id',
                    label: 'ID'
                },        
                {
                    key: 'name',
                    label: 'País'
                },
                {
                    key: 'code',
                    label: 'Código'
                }, 
                {
                    key: 'acciones',
                    label: ''
                }
            ],
            query: countries,
            createM: createMutation,
            updateM: updateMutation,
            deleteM: deleteMutation
        }
    },
    computed: {
        getCatalogo: () => catalogos.PAISES
    },
}
</script>
