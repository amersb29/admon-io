<template>
  <b-container>
    <b-row>
      <b-col md="8">
        <div role="tablist">
            <accordion-card v-for="c of catalogos" 
                            :group="group"
                            :id="`accordion-${c.id}`"
                            :key="c.id"
                            :title="c.title"
                            :visible="c.visible"/>
          </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import AccordionCard from "@/components/Catalogos/AccordionCard";

export default {
    layout: 'dashboard/DashboardLayout',
    components: {
        AccordionCard
    },
    data() {
      return {
        catalogos: [
            {id: 1, title: 'Membresías', visible: true},
            {id: 2, title: 'Métodos de Pago'},
            {id: 3, title: 'Países'},
            {id: 4, title: 'Roles'},
            {id: 5, title: 'Tipos de Producto'},
        ],
        group: 'catalogos'
      }
    }
}
</script>

<style>

</style>