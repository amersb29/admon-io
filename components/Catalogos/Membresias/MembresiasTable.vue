<template>
    <apollo-crud :baseVariablesObj="baseObj"
                  :table_fields="fields"
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
    mounted(){
        // this.$store.commit('changeQuery', memberships);
        this.$store.commit('changeCatalog', catalogos.MEMBRESIAS);
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
            createM: createMutation,
            updateM: updateMutation,
            deleteM: deleteMutation
        }
    },
}
</script>
