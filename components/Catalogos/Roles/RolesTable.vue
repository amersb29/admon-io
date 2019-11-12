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
import roles from '@/graphql/queries/catalogos/roles.gql'
import createMutation from '@/graphql/mutations/catalogos/roles/CreateRol.gql'
import updateMutation from '@/graphql/mutations/catalogos/roles/UpdateRol.gql'
import deleteMutation from '@/graphql/mutations/catalogos/roles/DeleteRol.gql'

export default {
    name: 'roles-table',
    components: {
        ApolloCrud
    },
    data() {
        return {
            baseObj: { id: 0 , name: undefined, description: undefined },
            fields: [
                {
                    key: 'id',
                    label: 'ID'
                },        
                {
                    key: 'name',
                    label: 'Rol'
                },
                {
                    key: 'description',
                    label: 'Descripción'
                }, 
                {
                    key: 'acciones',
                    label: ''
                }
            ],
            query: roles,
            createM: createMutation,
            updateM: updateMutation,
            deleteM: deleteMutation
        }
    },
    computed: {
        getCatalogo: () => catalogos.ROLE
    },
}
</script>
