<template>
    <apollo-crud :baseVariablesObj="baseObj"
                  :table_fields="fields"
                  :pagination="false"
                  @onEditOrDelete="changeMutation"
                  @onResetForm="changeMutation"></apollo-crud>
</template>

<script>
import Crud from '@/components/Crud'

import createMutation from '@/graphql/mutations/catalogos/paises/CreateCountry.gql'
import updateMutation from '@/graphql/mutations/catalogos/paises/UpdateCountry.gql'
import deleteMutation from '@/graphql/mutations/catalogos/paises/DeleteCountry.gql'

export default {
    name: 'countries-table',
    mixins: [Crud],
    data() {
        return {
            baseObj: { id: 0 , name: undefined, code: undefined },
            fields: [
                { key: 'id', label: 'ID' },        
                { key: 'name', label: 'País' },
                { key: 'code', label: 'Código' }, 
                { key: 'acciones', label: '' }
            ],
            createMutation,
            updateMutation,
            deleteMutation
        }
    },
}
</script>
