<template>
    <apollo-crud :baseVariablesObj="baseObj"
                  :table_fields="fields"
                  :pagination="false"
                  @onEditOrDelete="changeMutation"
                  @onResetForm="changeMutation"></apollo-crud>
</template>

<script>
import Crud from '@/components/Crud'

import createMutation from '@/graphql/mutations/catalogos/membresias/CreateMembership.gql'
import updateMutation from '@/graphql/mutations/catalogos/membresias/UpdateMembership.gql'
import deleteMutation from '@/graphql/mutations/catalogos/membresias/DeleteMembership.gql'

export default {
    name: 'membresias-table',
    mixins: [Crud],
    data() {
        return {
            baseObj: { id: 0 , name: undefined, price: undefined },
            fields: [
                { key: 'id', label: 'ID' },        
                { key: 'name', label: 'Membresía' },
                { key: 'price', label: 'Precio' }, 
                { key: 'acciones', label: '' }
            ],
            
            createMutation,
            updateMutation,
            deleteMutation,
        }
    },
}
</script>
