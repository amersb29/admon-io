<template>
    <b-card no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block href="#" variant="info" @click="showContent()">{{title}}</b-button>
      </b-card-header>
      <b-collapse :id="id" :visible="visible" :accordion="group" role="tabpanel">
        <b-card-body>
          <b-container>
            <b-row>
              <b-col>
                <component :is="table | eliminarAcentos"></component>
              </b-col>
            </b-row>            
          </b-container>
        </b-card-body>
      </b-collapse>
    </b-card>
</template>

<script>
import MembresiasTable from "./Membresias/MembresiasTable";
import PaisesTable from "./Paises/PaisesTable";
import RolesTable from "./Roles/RolesTable";
import TiposDeProductoTable from "./Productos/TiposDeProductoTable";
import MetodosDePagoTable from "./MetodosDePago/MetodosDePagoTable";

export default {
    name: 'accordion-card',
    components: {
        MembresiasTable,
        PaisesTable,
        RolesTable,
        TiposDeProductoTable,
        MetodosDePagoTable, 
    },
    props: {
        id: String,
        group: String,
        title: String,
        visible: Boolean,
        text: String,
        catalogo: Object,
        query: Object,
    },
    computed: {
       table () {
           return `${this.title.toLowerCase()}-table`
       },
       form () {
         return `${this.title.toLowerCase()}-form`
       }
    },
    methods: {
       showContent() {
          this.$root.$emit('bv::toggle::collapse', this.id)

          this.$store.commit('changeQuery', this.query);
          this.$store.commit('changeCatalog', this.catalogo);
       },
    }
}
</script>

<style>

</style>