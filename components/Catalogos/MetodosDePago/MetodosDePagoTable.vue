<template>
    <apollo-crud :baseVariablesObj="baseObj"
                  :table_fields="fields"
                  :pagination="false"
                  @onEditOrDelete="changeMutation"
                  @onResetForm="changeMutation"></apollo-crud>
</template>

<script>
import Crud from '@/components/Crud'

import createMutation from '@/graphql/mutations/catalogos/metodosPago/CreatePaymentMethod.gql'
import updateMutation from '@/graphql/mutations/catalogos/metodosPago/UpdatePaymentMethod.gql'
import deleteMutation from '@/graphql/mutations/catalogos/metodosPago/DeletePaymentMethod.gql'

export default {
    name: 'payment-methods-table',
    mixins: [Crud],
    // beforeUpdate(){
    //     this.$store.commit('changeQuery', paymentMethods);
    //     this.$store.commit('changeCatalog', catalogos.METODOS_PAGO);
    // },
    data() {
        return {
            baseObj: { id: 0 , name: undefined, description: undefined },
            fields: [ 
                { key: 'id', label: 'ID' },        
                { key: 'name', label: 'Método de Pago' },
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
