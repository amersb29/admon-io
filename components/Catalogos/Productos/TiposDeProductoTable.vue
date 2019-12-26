<template>
    <apollo-crud :baseVariablesObj="baseObj"
                  :table_fields="fields"
                  :pagination="false"
                  @onEditOrDelete="changeMutation"
                  @onResetForm="changeMutation"></apollo-crud>
</template>

<script>
import Crud from '@/components/Crud'

import createMutation from '@/graphql/mutations/catalogos/tiposProducto/CreateTiposProducto.gql'
import updateMutation from '@/graphql/mutations/catalogos/tiposProducto/UpdateTiposProducto.gql'
import deleteMutation from '@/graphql/mutations/catalogos/tiposProducto/DeleteTiposProducto.gql'

export default {
    name: 'tipos-producto-table',
    mixins: [Crud],
    data() {
        return {
            baseObj: { id: 0 , description: undefined, price: 0 },
            fields: [
                { key: 'id', label: 'ID' },
                { key: 'description', label: 'Descripción' }, 
                { key: 'price', label: 'Precio' }, 
                { key: 'acciones', label: '' }
            ],
            createMutation,
            updateMutation,
            deleteMutation
        }
    },
}
</script>