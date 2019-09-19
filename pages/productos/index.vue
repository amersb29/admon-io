<template>
    <b-row>
        <b-col sm="8">
        <ApolloQuery :query="require('@/graphql/queries/productos/productos.gql')">
            <template v-slot="{ result: { loading, error, data } }">
                <!-- Loading -->
                <div v-if="loading" class="loading apollo">Loading...</div>

                <!-- Error -->
                <div v-else-if="error" class="error apollo">An error occurred</div>

                <!-- Result -->
                <div v-else-if="data" class="result apollo">
                    <card :title="table.title" 
                          :actions="table.actions">
                        <div slot="raw-content" class="table-responsive">
                            <b-table striped hover 
                                    :class="tableClass" 
                                    :items="data.products" 
                                    :fields="fields" 
                                    :filter="filter"
                                    :current-page="currentPage"
                                    :per-page="perPage">
                                <template slot="name" slot-scope="data">
                                    {{ data.item.name }}
                                </template>
                                <template slot="categoria" slot-scope="data">
                                    {{ data.item.tipoProducto.description }}
                                </template>
                                <template slot="acciones" slot-scope="data">
                                    <p-button round icon
                                                @click="function(){ alert('Hola' + data.item.id)}" 
                                                type="primary" 
                                                class="btn-just-icon: ti-pencil">
                                    </p-button>
                                    <p-button round icon 
                                                @click="function(){ alert('Hola')}" 
                                                type="danger" 
                                                class="btn-just-icon: ti-trash">
                                    </p-button>
                                </template>
                            </b-table>
                            <b-pagination v-model="currentPage"
                                        :total-rows="95"
                                        :per-page="perPage"
                                        align="fill"
                                        size="sm"
                                        ></b-pagination>
                        </div>
                    </card>
                </div>

                <!-- No result -->
                <div v-else class="no-result apollo">No result :(</div>
            </template>
        </ApolloQuery>
        </b-col>
        <b-col sm="4">
            <b-card title="Filtros" style="max-width: 20rem;">
                <label for="apollo_tpProducto">Categoría</label>
                <apollo-select
                    v-model="filter"
                    id="apollo_tpProducto"
                    gqlQuery="tiposProducto" 
                    optionText="description"
                    @change="onSelectChange($event)"/>
            </b-card>
        </b-col>
    </b-row>
</template>

<script>
import ApolloSelect from '../../components/ApolloSelect.vue';

export default {
    layout: 'dashboard/DashboardLayout',
    components: {
        ApolloSelect
    },
    data() {
        return {
            fields: [
                {
                    key: 'id',
                    sortable: true
                },
                {
                    key: 'name',
                    label: 'Nombre',
                    sortable: true
                },
                {
                    key: 'tipoProducto.description',
                    label: 'Categoría',
                    sortable: true
                },
                {
                    key: 'acciones',
                    label: ''
                }
            ],
            table: {
                title: "Productos",
                columns: ["Id", "Nombre", "Categoría"],
                actions: [{name: 'Añadir Producto', icon: 'plus-square', eventName: 'create-user-modal'  }]
            },
            currentPage: 1,
            perPage: 5,
            filter: null,
        }
    },
    methods: {
      onSelectChange(e, attr) { this.filter = e; console.log(e); },
    },
    computed: {
        tableClass() {
            return `table-striped`;
        },
    },
}
</script>

<style>

</style>