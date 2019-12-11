<template>
    <div>
        <b-form ref="productsForm">
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
                            drop-placeholder="Drop file here..."
                            v-model="product.image"
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
                            drop-placeholder="Drop file here..."
                            v-model="product.notebook"
                            ></b-form-file>
                    </b-form-group>
                    <b-form-group label="Preview" label-for="preview">
                        <b-input id="preview" 
                                 required
                                 placeholder="Escriba el ID de Vimeo"
                                 v-model="product.videos[0].vimeo_id"></b-input>
                    </b-form-group>
                    <b-form-group label="Video 1" label-for="video1">
                        <b-input id="video1"
                                 placeholder="Escriba el ID de Vimeo"
                                 v-model="product.videos[1].vimeo_id"></b-input>
                    </b-form-group>
                    <b-form-group label="Video 2" label-for="video2">
                        <b-input id="video2"
                                 placeholder="Escriba el ID de Vimeo"
                                 v-model="product.videos[2].vimeo_id"></b-input>
                    </b-form-group>
                    <b-form-group label="Video 3" label-for="video3">
                        <b-input id="video3" 
                                 placeholder="Escriba el ID de Vimeo"
                                 v-model="product.videos[3].vimeo_id"></b-input>
                    </b-form-group>
                    <b-form-group label="Video 4" label-for="video4">
                        <b-input id="video4"
                                 placeholder="Escriba el ID de Vimeo"
                                 v-model="product.videos[4].vimeo_id"></b-input>
                    </b-form-group>
                    <div class="formButtonsSection">
                        <b-button-group>
                            <b-button variant="primary" class="formButtons" @click="createProduct()">
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
import ApolloSelect from '../../components/ApolloSelect.vue'
import product from '@/graphql/queries/productos/product.gql'
import createProducts from '@/graphql/mutations/product/CreateProduct.gql'

import actions from '@/enums/actions'

export default {
    name: 'edit-products-form',
    components: {ApolloSelect},
    created(){
        this.createProductsMut = createProducts;
        this.resetForm();
    },
    props: {
        productId: { type: Number },
        action: { type: Number, default: 0 },
        updateMethod: Function
    },
    data() {
        return {
            createProductsMut: null,
            emptyProduct: {
                description: '',
                id: '',
                name: '',
                tipoProducto: { id: -1 },
                image: null,
                notebook: null,
                videos: []
            },
            emptyVideoObj: {
                id: -1,
                is_preview: 0,
                vimeo_id: null
            },
            product: null,
            selValue: "1",
        }
    },
    methods: {
        createProduct(){
            const form = this.$refs.productsForm

            if (form.checkValidity() === false) {
                event.stopPropagation()
            }else {
                this.$apollo.mutate({
                    mutation: this.getMutation(this.action),
                    variables: this.getVariables(this.product),
                    update: this.updateMethod
                }).then((data) => {
                    this.resetForm();
                    this.$emit('product-created')
                }).catch((error) => {
                    console.log(error)
                    this.$emit('product-creation-error')
                })
            }

            form.classList.add('was-validated');
        },
        async fillProductForm(idx) {
            if (idx !== -1) {
                this.resetForm()
    
                const res = await this.$apollo.query({
                    query: product,
                    variables: {
                        id: idx
                    }
                })

                this.product = Object.assign( {}, res.data.product )
                this.$refs.tpProducto.optSelected = this.product.tipoProducto.id

                for (let index = 0; index <= (4 - res.data.product.videos.length) ; index++) {
                    this.product.videos.push( Object.assign({},this.emptyVideoObj) )
                }
            }
        },
        getMutation( action ) { 
            switch (action) {
                case actions.CREATE:
                    return this.createProductsMut
                    break;
            }
            
        },
        getVariables( {id, name, description, tipoProducto: {id: tipo_producto_id} , image, notebook, videos} ){
            videos = videos.filter( video => video.vimeo_id !== null)
                    .map( (video, index) => {
                        if( this.action === actions.CREATE )
                            delete video.id

                        video.name = name

                        if(index === 0){
                            video.is_preview = 1
                            video.name += ' - Preview'
                        } else {
                            video.name += ` - video ${index}`
                        }

                        return video
                        
                    })

            if(tipo_producto_id === -1)
                tipo_producto_id = this.$refs.tpProducto.optSelected

            let variables = Object.assign({}, {id, name, description, tipo_producto_id, videos, url_img: image.name, files: [image, notebook]});

            if( this.action === actions.CREATE )
                delete variables.id

            return variables
        },
        onTpProducto(e) { this.product.tipoProducto.id = e },
        resetForm(){ 
            this.product = Object.assign({}, this.emptyProduct) 
            
            if(this.$refs.tpProducto) 
                this.$refs.tpProducto.optSelected = 1

            for (let index = 0; index <= 4; index++) {
                this.product.videos.push( Object.assign({},this.emptyVideoObj) )   
            }
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