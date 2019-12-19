<template>
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
                            v-model="name"></b-input>
                </b-form-group>
                <b-form-group label="Descripción del Producto" label-for="desc_producto">
                    <b-form-textarea id="desc_producto" 
                                    placeholder="Escriba la descripción del producto"
                                    required
                                    rows="10"
                                    v-model="description">
                    </b-form-textarea>
                </b-form-group>
                <b-form-group label="Imagen del producto" label-for="img_producto">
                    <div v-if="!product.image || toggleImg" class="imageFileSelect">
                        <b-form-file
                            accept=".jpg, .png, .gif"
                            @change="updateFileList($event)"
                            drop-placeholder="Drop file here..."
                            id="img_producto"
                            placeholder="Seleccione la imagen del producto..."
                            v-model="image"
                            ></b-form-file>
                        <b-button size="sm" variant="danger" class="toggleImgBtn" @click="toggleImgFile()" v-if="product.image">
                            <i class="fa fa-ban fa-lg"></i>
                        </b-button>
                    </div>
                    <div v-else>
                        <span id="product-image" class="btn btn-warning">Imagen del Producto</span>
                        <b-tooltip target="product-image" triggers="hover" placement="top">
                            <img :src="`http://membresias-io.test/storage/image/${product.image}`" :alt="product.image" />
                        </b-tooltip>
                        <b-button variant="primary" @click="toggleImgFile()">
                            <i class="fa fa-plus fa-lg"></i>
                            Actualizar Imagen
                        </b-button>
                    </div>
                </b-form-group>
                </b-card>
            </b-col>
            <b-col md="6">
                <b-card class="formCard">
                <b-form-group label="Cuaderno de trabajo" label-for="notebook_producto">
                    <b-form-file
                        accept=".doc, .pdf, .txt"
                        @change="updateFileList($event)"
                        drop-placeholder="Drop file here..."
                        id="notebook_producto"
                        placeholder="Seleccione el cuaderno de trabajo..."
                        v-model="notebook"
                        ></b-form-file>
                </b-form-group>
                <b-form-group v-for="(video, index) in videos" :key="video.vimeo_id"
                        :label="getVideoText(video.is_preview, index)"
                        :label-for="getVideoText(video.is_preview, index, true)">
                    <b-input :id="getVideoText(video.is_preview, index, true)"
                                :required="isRequired(video, index)"
                                placeholder="Escriba el ID de Vimeo"
                                @change="saveVimeoId($event, index)"
                                :value="getVimeoId(index)"></b-input>
                </b-form-group>
                <div class="formButtonsSection">
                    <b-button variant="primary" class="formButtons" @click="addVideo()">
                            <i class="fa fa-plus fa-lg"></i>
                            Agregar Video
                    </b-button>
                    <b-button-group>
                        <b-button :variant="buttonVariant" class="formButtons" @click="createProduct()">
                            <i :class="`fa fa-${actionButton} fa-lg`"></i>
                            {{ actionButtonTxt }}
                        </b-button>

                        <b-button variant="danger" class="formButtons" @click="resetForm()">
                            <i class="fa fa-ban fa-lg"></i>
                            Cancelar
                        </b-button>
                    </b-button-group>
                </div>
                </b-card>
            </b-col>
        </b-row>
    </b-form>
</template>

<script>
import ApolloSelect from '../../components/ApolloSelect.vue'
import product from '@/graphql/queries/productos/product.gql'
import createProducts from '@/graphql/mutations/product/CreateProduct.gql'
import updateProducts from '@/graphql/mutations/product/UpdateProduct.gql'

import actions from '@/enums/actions'

export default {
    name: 'edit-products-form',
    components: {ApolloSelect},
    created(){
        this.resetForm();

        this.$store.watch(
            (state, getters) => getters.selectedItemId,
            (newId, oldId) => {
                if (this.$store.state.action !== actions.DELETE)
                    this.fillProductForm( newId )
            }
        )
    },
    data() {
        return {
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
            selValue: "1",
            toggleImg: false,
        }
    },
    methods: {
        addVideo() {
            this.$store.commit('addVideo', Object.assign({},this.emptyVideoObj));
        },
        getVimeoId(index){
            return this.$store.getters.vimeoId(index)
        },
        getVideoText(isPreview, idx, flag = false){
            let text = isPreview || idx === 0 ? 'Preview' : `Video ${idx}` 
            return flag ? text.toLowerCase().replace(/\s/g, '') : text 
        },
        isRequired(video, idx){
            return !!+video.is_preview || idx === 0 || idx === 1
        },
        saveVimeoId(event, index) {
            let value = event !== "" ? event : null
            this.$store.commit('updateVideo', { index, value });
        },
        createProduct(){
            const form = this.$refs.productsForm

            if (form.checkValidity() === false) {
                event.stopPropagation()
            }else {
                this.$apollo.mutate({
                    mutation: this.$store.getters.mutation,
                    variables: this.getVariables(this.$store.state.selectedItem),
                    update: this.updateMethod
                }).then((data) => {
                    this.$emit('product-created', {action: this.$store.state.action})
                    this.resetForm();
                }).catch((error) => {
                    console.log(error)
                    this.$emit('product-creation-error')
                })
            }

            form.classList.add('was-validated')
        },
        async fillProductForm(idx) {
            if (!!+idx && idx !== -1) {
                const res = await this.$apollo.query({
                    query: product,
                    variables: {
                        id: idx
                    }
                })

                this.$store.commit('changeSelectedItem', res.data.product);

                this.$refs.tpProducto.optSelected = this.$store.getters.tipoProductoId;

                if ( !this.$store.getters.videosLength ) {
                    this.setDefaultVideos()
                }
        
                this.scrollToTop()
            }
        },
        getVariables( {id, name, description, tipoProducto: {id: tipo_producto_id} } ){
            
            let videos = this.$store.getters.videos
            videos.forEach( 
                (v,idx) => {
                    this.$store.dispatch('updateVideoProps', {idx, name})
                })

            let old_videos = videos.filter(video => video.id && video.id !== -1);
            let new_videos = videos.filter(video => video.id === undefined || video.id === -1)
                                    .map( video => { 
                                        delete video.id
                                        return video
                                    });

            if(tipo_producto_id === -1)
                tipo_producto_id = this.$refs.tpProducto.optSelected

            let files = this.$store.getters.fileList
            let image = this.$store.getters.imageName
            let document = this.$store.getters.docName

            let variables = Object.assign({}, {id, name, description, tipo_producto_id,  image, document, new_videos, old_videos, files });

            if( this.$store.state.action === actions.CREATE )
                delete variables.id

            return variables
        },
        onTpProducto(e) { this.$store.commit('updateTipoProducto', e) },
        resetForm(){
            this.toggleImg = false

            if(this.$refs.productsForm && this.$refs.productsForm.classList){
                this.$refs.productsForm.classList.remove('was-validated')
            }

            this.$store.dispatch('manageAction', 
                                 {
                                    action: actions.CREATE, 
                                    mutation: createProducts,
                                    item: Object.assign({}, this.emptyProduct)
                                 })
            
            if(this.$refs.tpProducto) 
                this.$refs.tpProducto.optSelected = 1

            this.setDefaultVideos()
        },
        setDefaultVideos() {
            let videos = [ Object.assign({},this.emptyVideoObj), Object.assign({},this.emptyVideoObj) ];
            this.$store.commit('updateVideoList', videos);
        },
        scrollToTop(){
            window.scrollTo(0,0)
        },
        toggleImgFile() {
            this.toggleImg = !this.toggleImg
        },
        updateMethod(store, {data: { res } }){
            this.$store.dispatch('updateCache', {store, res}) 
        },
        updateFileList(event) {            
            this.$store.dispatch('manageFile', event.target.files[0])
        }
    },
    computed: {
        actionButton() {
            return this.$store.state.action === actions.CREATE ? 'save' : 'pencil' 
        },
        actionButtonTxt() {
            return this.$store.state.action === actions.CREATE ? 'Salvar' : 'Actualizar' 
        },
        buttonVariant(){
            return this.$store.state.action === actions.CREATE ? 'primary' : 'warning'
        },
        product() {
            return this.$store.state.selectedItem
        },
        videos() {
            return this.$store.state.selectedItem.videos
        },
        name: {
            get () {
                return this.$store.getters.name
            },
            set (value) {
                this.$store.commit('updateName', value)
            }
        },
        description: {
            get () {
                return this.$store.getters.description
            },
            set (value) {
                this.$store.commit('updateDescription', value)
            }
        },
        image: {
            get () {
                return this.$store.getters.image
            },
            set (file) {
                this.$store.commit('updateImage', file)
            }
        },
        notebook: {
            get () {
                return this.$store.getters.document
            },
            set (file) {
                this.$store.commit('updateDocument', file)
            }
        },
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
    width: 100%;
}
.imageFileSelect {
    display: flex;
}
.toggleImgBtn {
    margin-left: 10px;
}
.tooltip {
    display: flex !important;
    justify-content: center;
    opacity: 1 !important;
    transform: translate3d(200px, 404px, 0px) !important;
}
.tooltip-inner {
    max-width: min-content;
}
.arrow {
    left: unset !important;
}
</style>