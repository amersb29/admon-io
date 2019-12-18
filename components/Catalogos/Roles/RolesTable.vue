<template>
    <apollo-crud :baseVariablesObj="baseObj"
                  :table_fields="fields"
                  :pagination="false"
                  @onEditOrDelete="changeMutation"
                  @onResetForm="changeMutation"></apollo-crud>
</template>

<script>
import Crud from '@/components/Crud'

import createMutation from '@/graphql/mutations/catalogos/roles/CreateRol.gql'
import updateMutation from '@/graphql/mutations/catalogos/roles/UpdateRol.gql'
import deleteMutation from '@/graphql/mutations/catalogos/roles/DeleteRol.gql'

export default {
    name: 'roles-table',
    mixins: [Crud],
    data() {
        return {
            baseObj: { id: 0 , name: undefined, description: undefined },
            fields: [
                { key: 'id', label: 'ID' },        
                { key: 'name', label: 'Rol' },
                { key: 'description', label: 'Descripción' }, 
                { key: 'acciones', label: '' }
            ],
            createMutation,
            updateMutation,
            deleteMutation
        }
    },
}
</script>
