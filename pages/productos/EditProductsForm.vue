<template>
    <div>
        <b-form>
            <b-row>
                <b-col md="6">
                    <b-card class="formCard">
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
                            placeholder="Seleccione la imagen del producto..."
                            required
                            drop-placeholder="Drop file here..."
                            ></b-form-file>
                    </b-form-group>
                    </b-card>
                </b-col>
                <b-col md="6">
                    <b-card class="formCard">
                    <b-form-group label="Cuaderno de trabajo" label-for="notebook_producto">
                        <b-form-file
                            accept=".doc, .pdf, .txt"
                            id="notebook_producto"
                            placeholder="Seleccione el cuaderno de trabajo..."
                            required
                            drop-placeholder="Drop file here..."
                            ></b-form-file>
                    </b-form-group>
                    <b-form-group label="Preview" label-for="preview">
                        <b-input id="preview" 
                                 required 
                                 v-model="product.videos.preview"
                                 placeholder="Escriba el ID de Vimeo"></b-input>
                    </b-form-group>
                    <b-form-group label="Video 1" label-for="video1">
                        <b-input id="video1" 
                                 v-model="product.videos.video1"
                                 placeholder="Escriba el ID de Vimeo"></b-input>
                    </b-form-group>
                    <b-form-group label="Video 2" label-for="video2">
                        <b-input id="video2" 
                                 v-model="product.videos.video2"
                                 placeholder="Escriba el ID de Vimeo"></b-input>
                    </b-form-group>
                    <b-form-group label="Video 3" label-for="video3">
                        <b-input id="video3" 
                                 v-model="product.videos.video3"
                                 placeholder="Escriba el ID de Vimeo"></b-input>
                    </b-form-group>
                    <b-form-group label="Video 4" label-for="video4">
                        <b-input id="video4" 
                                 v-model="product.videos.video4"
                                 placeholder="Escriba el ID de Vimeo"></b-input>
                    </b-form-group>
                    <div class="formButtonsSection">
                        <b-button-group>
                            <b-button variant="primary" class="formButtons">
                                <i class="fa fa-save fa-lg"></i>
                                Salvar
                            </b-button>
                            <b-button variant="danger" class="formButtons">
                                <i class="fa fa-ban fa-lg"></i>
                                Cancelar
                            </b-button>
                        </b-button-group>
                    </div>
                    </b-card>
                </b-col>
            </b-row>
        </b-form>
    </div>
</template>

<script>
import ApolloSelect from '../../components/ApolloSelect.vue';
import product from '@/graphql/queries/productos/product.gql'
import createProductsMut from '@/graphql/mutations/product/CreateProduct.gql';

import actions from '@/enums/actions'

export default {
    name: 'edit-products-form',
    components: {ApolloSelect},
    created(){
        this.resetForm();
    },
    props: {
        productId: { type: Number },
        action: { type: Number, default: 0 }
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
            selValue: "1",
        }
    },
    methods: {
        createUser(){
            const form = this.$refs.productsForm;

            if (form.checkValidity() === false) {
                event.stopPropagation();
            }else {
                this.$apollo.mutate({
                    // Query
                    mutation: getMutation(),
                    // Parameters
                    variables: {
                    firstName: this.user.firstName,
                    lastName:  this.user.lastName,
                    email:     this.user.email,
                    password:  this.user.password,
                    mem_id:    this.user.membership,
                    country_id: this.user.country,
                    state: this.user.state,
                    roles: this.user.roles,
                    },
                    update: this.updateMethod
                }).then((data) => {
                    this.$emit('user-created');
                }).catch((error) => {
                    this.$emit('user-creation-error');
                })
            }

            form.classList.add('was-validated');
        },
        async fillProductForm(idx) {
            if (idx !== -1) {
                this.resetForm();
    
                const res = await this.$apollo.query({
                    query: product,
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
            }
        },
        getMutation( action ) { 
            switch (action) {
                case actions.CREATE:
                    return this.createProductsMut
                    break;
                
            }
            
        },
        onTpProducto(e) { this.product.tpProducto = e },
        resetForm(){ 
            this.product = Object.assign({}, this.emptyProduct) 
            this.product.videos = Object.assign({}, this.emptyProduct.videos) 
            if(this.$refs.tpProducto) 
                this.$refs.tpProducto.optSelected = 1
        },
    },
    watch: {
        productId: function (newId, oldId) {
            this.fillProductForm( newId )
        }
    },
}
</script>

<style>
.formCard{
    height: 585px;
}
.formButtonsSection{
    bottom: 30px;
    display: flex;
    justify-content: space-evenly;
    position: absolute;
    width: 100%;
}
.formButtons {
    width: 135px;
}
</style>