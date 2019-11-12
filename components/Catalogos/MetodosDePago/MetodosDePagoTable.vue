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
import paymentMethods from '@/graphql/queries/catalogos/paymentMethods.gql'
import createMutation from '@/graphql/mutations/catalogos/metodosPago/CreatePaymentMethod.gql'
import updateMutation from '@/graphql/mutations/catalogos/metodosPago/UpdatePaymentMethod.gql'
import deleteMutation from '@/graphql/mutations/catalogos/metodosPago/DeletePaymentMethod.gql'

export default {
    name: 'payment-methods-table',
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
                    label: 'Método de Pago'
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
            query: paymentMethods,
            createM: createMutation,
            updateM: updateMutation,
            deleteM: deleteMutation
        }
    },
    computed: {
        getCatalogo: () => catalogos.METODOS_PAGO
    },
}
</script>
