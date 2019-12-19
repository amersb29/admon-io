<template>
  <b-container>
    <b-row>
      <b-col md="8">
        <div role="tablist">
            <accordion-card v-for="c of catalogos" 
                            :catalogo="c.catalogo"
                            :group="group"
                            :id="`accordion-${c.id}`"
                            :key="c.id"
                            :query="c.query"
                            :title="c.title"
                            :visible="c.visible"/>
          </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import _catalogos from '@/enums/catalogos'

import AccordionCard from "@/components/Catalogos/AccordionCard";

import memberships from '@/graphql/queries/catalogos/memberships.gql'
import paymentMethods from '@/graphql/queries/catalogos/paymentMethods.gql'
import countries from '@/graphql/queries/catalogos/countries.gql'
import roles from '@/graphql/queries/catalogos/roles.gql'
import tiposProducto from '@/graphql/queries/catalogos/tiposProducto.gql'

export default {
    layout: 'dashboard/DashboardLayout',
    components: {
        AccordionCard
    },
    created(){
      this.$store.commit('changeQuery', memberships);
      this.$store.commit('changeCatalog', _catalogos.MEMBRESIAS);
    },
    data() {
      return {
        catalogos: [
            {id: 1, title: 'Membresías', visible: true, query: memberships, catalogo: _catalogos.MEMBRESIAS},
            {id: 2, title: 'Métodos de Pago', query: paymentMethods, catalogo: _catalogos.METODOS_PAGO},
            {id: 3, title: 'Países', query: countries, catalogo: _catalogos.PAISES},
            {id: 4, title: 'Roles', query: roles, catalogo: _catalogos.ROLE},
            {id: 5, title: 'Tipos de Producto', query: tiposProducto, catalogo: _catalogos.TIPOS_PRODUCTO},
        ],
        group: 'catalogos'
      }
    }
}
</script>

<style>

</style>