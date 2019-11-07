<template>
    <b-row>
        <b-col>
        <ApolloQuery :query="require('@/graphql/queries/productos/productos.gql')"
                     @result="updateTotalRows($event.data && $event.data.products ? $event.data.products.length : 0)">
            <template v-slot="{ result: { loading, error, data } }">
                <!-- Loading -->
                <div v-if="loading" class="loading apollo">Loading...</div>

                <!-- Error -->
                <div v-else-if="error" class="error apollo">An error occurred</div>

                <!-- Result -->
                <div v-else-if="data" class="result apollo">
                    <b-row class="mb-3">
                        <b-col sm="6">
                            <b-button v-b-toggle.collapse-1 variant="primary" size="sm">Filtros</b-button>
                            <b-collapse id="collapse-1" class="mt-2">
                                <b-card>
                                    <b-tabs content-class="mt-3">
                                        <b-tab title="Categoría" active>
                                            <apollo-select
                                                @change="onSelectChange($event)"
                                                filter
                                                gqlQuery="tiposProducto"
                                                id="tpProducto_filter" 
                                                initialNullText="Todas"
                                                optionText="description"/>
                                        </b-tab>
                                        <b-tab title="Nombre">
                                            <b-form-input @change="onSelectChange($event)" 
                                                          id="name_filter"
                                                          placeholder="Escriba el nombre del producto" 
                                                          type="text">
                                            </b-form-input>
                                        </b-tab>
                                    </b-tabs>
                                </b-card>
                            </b-collapse>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col md="7">
                        <card :title="table.title">
                            <div slot="raw-content" class="table-responsive">
                                <b-pagination v-model="currentPage"
                                            :total-rows="totalRows"
                                            :per-page="perPage"
                                            align="center"
                                            size="sm"
                                            ></b-pagination>
                                <b-table striped hover 
                                        :class="tableClass" 
                                        :items="data.products" 
                                        :fields="fields" 
                                        :filter="filter"
                                        @filtered="updateTotalRows(($event.length || 0))"
                                        :current-page="currentPage"
                                        :per-page="perPage">
                                    <template slot="name" slot-scope="data">
                                        {{ data.item.name }}
                                    </template>
                                    <template slot="categoria" slot-scope="data">
                                        {{ data.item.tipoProducto.description }}
                                    </template>
                                    <template slot="acciones" slot-scope="data">
                                        <div class="form-buttons-section">
                                            <b-button class="btn-just-icon: ti-pencil" 
                                                    @click="fillProductForm($event, data.item.id)"
                                                    variant="primary"
                                                    pill>
                                                <i ></i>
                                            </b-button>
                                            <b-button class="btn-just-icon: ti-trash"
                                                    variant="danger"
                                                    pill>
                                            </b-button>
                                        </div>
                                    </template> 
                                </b-table>
                                <b-pagination v-model="currentPage"
                                            :total-rows="totalRows"
                                            :per-page="perPage"
                                            align="center"
                                            size="sm"
                                            ></b-pagination>
                            </div>
                        </card>
                        </b-col>
                        <b-col sm="5">
                            <div class="form-section">
                            <b-tabs align="center">
                                <b-tab title="Información del Producto">
                                    <div class="tab-form">
                                    <b-form>
                                    <b-form-group label="Tipo de Producto" label-for="tpProducto">
                                        <apollo-select
                                            @change="onTpProducto($event)"
                                            gqlQuery="tiposProducto"
                                            ref="tpProducto" 
                                            :selectedValue="selValue"
                                            optionText="description"/>
                                    </b-form-group>
                                    <b-form-group label="Nombre del Producto" label-for="nombre_producto">
                                        <b-input id="nombre_producto" 
                                                 placeholder="Escriba el nombre del producto"
                                                 required
                                                 v-model="product.name"></b-input>
                                    </b-form-group>
                                    <b-form-group label="Descripción del Producto" label-for="desc_producto">
                                        <b-form-textarea id="desc_producto" 
                                                            placeholder="Escriba la descripción del producto"
                                                            required
                                                            rows="10"
                                                            v-model="product.description">
                                        </b-form-textarea>
                                    </b-form-group>
                                    <b-form-group label="Imagen del producto" label-for="img_producto">
                                        <b-form-file
                                            accept=".jpg, .png, .gif"
                                            id="img_producto"
                                            v-model="product.image"
                                            placeholder="Seleccione la imagen del producto..."
                                            required
                                            drop-placeholder="Drop file here..."
                                            ></b-form-file>
                                    </b-form-group>
                                    </b-form>
                                    </div>
                                </b-tab>
                                <b-tab title="Videos del Producto">
                                    <div class="tab-form">
                                    <b-form>
                                        <b-form-group label="Preview" label-for="preview">
                                            <b-input id="preview" required v-model="product.videos.preview"></b-input>
                                        </b-form-group>
                                        <b-form-group label="Video 1" label-for="video1">
                                            <b-input id="video1" v-model="product.videos.video1"></b-input>
                                        </b-form-group>
                                        <b-form-group label="Video 2" label-for="video2">
                                            <b-input id="video2" v-model="product.videos.video2"></b-input>
                                        </b-form-group>
                                        <b-form-group label="Video 3" label-for="video3">
                                            <b-input id="video3" v-model="product.videos.video3"></b-input>
                                        </b-form-group>
                                        <b-form-group label="Video 4" label-for="video4">
                                            <b-input id="video4" v-model="product.videos.video4"></b-input>
                                        </b-form-group>
                                    </b-form>
                                    </div>
                                </b-tab>
                                <div class="tab-form-buttons-section">
                                    <b-button type="reset" variant="danger" @click="resetForm()">Reiniciar</b-button>
                                    <b-button type="submit" variant="primary">Guardar</b-button>
                                </div>
                            </b-tabs>
                            </div>
                        </b-col>
                    </b-row>
                </div>

                <!-- No result -->
                <div v-else class="no-result apollo">No result :(</div>
            </template>
        </ApolloQuery>
        </b-col>
        
    </b-row>
</template>

<script>
import ApolloSelect from '../../components/ApolloSelect.vue';
import edit_products from '@/graphql/queries/productos/edit_productos.gql';

export default {
    layout: 'dashboard/DashboardLayout',
    created(){
        this.resetForm();
    },
    components: {
        ApolloSelect
    },
    data() {
        return {
            emptyProduct: {
                tpProducto: 0,
                name: '',
                description: '',
                image: '',
                videos: {
                    preview: '',
                    video1: '',
                    video2: '',
                    video3: '',
                    video4: '',
                }
            },
            product: null,
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
            filter: null,
            perPage: 15,
            totalRows: 0,
            selValue: "1"
        }
    },
    methods: {
      async fillProductForm(e, idx) {
        this.resetForm();

        const res = await this.$apollo.query({
            query: edit_products,
            variables: {
                id: idx
            }
        })

        let { tipoProducto, name, description, videos } = res.data.product

        this.$refs.tpProducto.optSelected = tipoProducto.id

        this.product.name = name
        this.product.tpProducto = tipoProducto.id
        this.product.description = description

        videos.forEach( (video, index) => {
            let name = video.is_preview ? 'preview' : `video${index}` 
            this.product.videos[ name ] = video ? video.vimeo_id : null 
        });
      },
      onSelectChange(e) { this.filter = e && e.target ? e.target.value : e },
      onTpProducto(e) { this.product.tpProducto = e },
      resetForm(){ 
          this.product = Object.assign({}, this.emptyProduct) 
          this.product.videos = Object.assign({}, this.emptyProduct.videos) 
          if(this.$refs.tpProducto) 
            this.$refs.tpProducto.optSelected = 1
      },
      updateTotalRows(length) { this.totalRows = length },
    },
    computed: {
        tableClass() {
            return `table-striped`;
        },
    },
}
</script>

<style>
.form-buttons-section {
    display: flex; 
    justify-content: space-evenly;
}
.tab-form-buttons-section {
    display: flex; 
    justify-content: space-evenly;
    margin: 35px;
}
.tab-form {
    height: 550px;
    padding: 30px;
}
.form-section {
    background-color: white;
}
</style>