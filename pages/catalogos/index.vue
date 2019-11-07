<template>
  <div role="tablist">
    <AccordionCard id="accordion-1" group="catalogos" title="Membresías" visible />
    <AccordionCard id="accordion-2" group="catalogos" title="Métodos de pago"/>
    <AccordionCard id="accordion-3" group="catalogos" title="Países"/>
    <AccordionCard id="accordion-4" group="catalogos" title="Roles"/>
    <AccordionCard id="accordion-5" group="catalogos" title="Tipos de Producto"/>
  </div>
</template>

<script>
import AccordionCard from "@/components/Catalogos/AccordionCard";

export default {
    layout: 'dashboard/DashboardLayout',
    mounted(){
    },
    components: {
        AccordionCard
    },
    data() {
      return {
        
      }
    },
    methods: {

    }
}
</script>

<style>

</style>