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
import tiposProducto from '@/graphql/queries/catalogos/tiposProducto.gql'
import createMutation from '@/graphql/mutations/catalogos/tiposProducto/CreateTiposProducto.gql'
import updateMutation from '@/graphql/mutations/catalogos/tiposProducto/UpdateTiposProducto.gql'
import deleteMutation from '@/graphql/mutations/catalogos/tiposProducto/DeleteTiposProducto.gql'

export default {
    name: 'tipos-producto-table',
    components: {
        ApolloCrud
    },
    data() {
        return {
            baseObj: { id: 0 , description: undefined },
            fields: [
                {
                    key: 'id',
                    label: 'ID'
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
            query: tiposProducto,
            createM: createMutation,
            updateM: updateMutation,
            deleteM: deleteMutation
        }
    },
    computed: {
        getCatalogo: () => catalogos.TIPOS_PRODUCTO
    },
}
</script>