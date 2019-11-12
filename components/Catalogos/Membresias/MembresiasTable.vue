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
import memberships from '@/graphql/queries/catalogos/memberships.gql'
import createMutation from '@/graphql/mutations/catalogos/membresias/CreateMembership.gql'
import updateMutation from '@/graphql/mutations/catalogos/membresias/UpdateMembership.gql'
import deleteMutation from '@/graphql/mutations/catalogos/membresias/DeleteMembership.gql'

export default {
    name: 'membresias-table',
    components: {
        ApolloCrud
    },
    data() {
        return {
            baseObj: { id: 0 , name: undefined, price: undefined },
            fields: [
                {
                    key: 'id',
                    label: 'ID'
                },        
                {
                    key: 'name',
                    label: 'Membresía'
                },
                {
                    key: 'price',
                    label: 'Precio'
                }, 
                {
                    key: 'acciones',
                    label: ''
                }
            ],
            query: memberships,
            createM: createMutation,
            updateM: updateMutation,
            deleteM: deleteMutation
        }
    },
    computed: {
        getCatalogo: () => catalogos.MEMBRESIAS
    },
}
</script>
