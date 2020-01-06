<template>
  <b-form ref="sedeForm">
    <b-row>
      <b-col md="6">
        <b-card class="formCard">
          <b-form-group label="Tipo de Producto" label-for="tpProducto">
              <apollo-select
                ref="apollo_countries"
                gqlQuery="countries"
                selectedValue="1" 
                optionText="name"
                @change="onSelectChange($event, 'country')"/>
          </b-form-group>
          <b-form-group label="Nombre de la Sede" label-for="nombre_sede">
              <b-input id="nombre_sede" 
                      placeholder="Escriba el nombre de la sede"
                      required
                      v-model="name"></b-input>
          </b-form-group>
          <b-form-group label="Código" label-for="code">
              <b-input id="code" 
                      placeholder="Escriba el código de la sede"
                      required
                      v-model="code"></b-input>
          </b-form-group>
          <b-form-group label="Calendario" label-for="calendar">
              <b-input id="calendar" 
                      placeholder="Escriba el ID del calendario"
                      required
                      v-model="calendar"></b-input>
          </b-form-group>
        </b-card>
      </b-col>
      <b-col md="6">
        <b-card class="formCard">
          <div role="tablist">
            <b-card no-body class="mb-1" v-show="!showCollapse">
              <b-card-header header-tag="header" class="p-1" role="tab">
                <b-button block href="#" v-b-toggle.accordion-2 variant="info">Banners</b-button>
              </b-card-header>
              <b-collapse id="accordion-2" :visible="!showCollapse" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <section v-if="previews && previews.length" id="previews">
                    <div class="previewContainer" 
                        v-for="preview in previews"
                        :key="preview.id">
                      <img :src="`http://membresias-io.test/storage/images/${preview.image}`" 
                          :alt="preview.image"
                          width="100%" />
                      <b-button pill class="btn" variant="danger" size="sm" @click="deleteBanner(preview.id)">
                        <i class="fa fa-trash fa-lg"></i>
                      </b-button>
                    </div>
                  </section>
                </b-card-body>
              </b-collapse>
            </b-card>
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">
                <b-button block href="#" v-b-toggle.accordion-1 variant="success">Registrar Banners</b-button>
              </b-card-header>
              <b-collapse id="accordion-1" :visible="showCollapse" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-form-group v-for="(banner, index) in banners" 
                                :key="banner.id"
                                :label="getBannerText(index)"
                                :label-for="getBannerText(index, true)">
                    <b-form-file
                        accept=".jpg, .png, .gif"
                        @change="updateFileList($event, index)"
                        drop-placeholder="Drop file here..."
                        :id="getBannerText(index, true)"
                        placeholder="Seleccione la imagen"
                        ></b-form-file>
                  </b-form-group>
                  <div class="formButtonsSection">
                    <b-button variant="primary" class="formButtons" @click="addBanner()">
                            <i class="fa fa-plus fa-lg"></i>
                            Agregar Banner
                    </b-button>
                  </div>
                </b-card-body>
              </b-collapse>
            </b-card>

          </div>
          <div class="formButtonsSection margin-top-50">
            <b-button-group>
                <b-button :variant="buttonVariant" class="formButtons" @click="createSede()">
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
// import { FontAwesomeIcon } from '@fontawesome/vue-fontawesome'
import EditForm from '@/components/Mixins/EditForm'
import ApolloSelect from '@/components/ApolloSelect'
import createMutation from '@/graphql/mutations/sedes/CreateSede.gql'
import deleteBannerMutation from '@/graphql/mutations/banners/DeleteBanner.gql'
import sede from '@/graphql/queries/sedes/sede.gql'
import actions from '@/enums/actions'
import gql from 'graphql-tag'

export default {
    name: 'edit-sedes-form',
    components: {ApolloSelect},
    mixins: [EditForm],
    created(){
      this.resetForm();
    },
    data() {
      return {
        emptySede: {
          countries_id: 1,
          name: '',
          code: '',
          calendar: '',
          banners: [],
          files: []
        },
        emptyBanner: {
          image: '',
          status: true
        },
        banners: [],
        previews: []
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
      name: {
        get () {
            return this.$store.getters.field('name')
        },
        set (value) {
            this.$store.commit('changeField', {key: 'name', value})
        }
      },
      code: {
        get () {
            return this.$store.getters.field('code')
        },
        set (value) {
            this.$store.commit('changeField', {key: 'code', value})
        }
      },
      calendar: {
        get () {
            return this.$store.getters.field('calendar')
        },
        set (value) {
            this.$store.commit('changeField', {key: 'calendar', value})
        }
      },
      showCollapse() {
        return this.$store.state.action === actions.CREATE
      }
    },
    methods: {
      addBanner() {
        this.banners.push( Object.assign({},this.emptyBanner) )
      },
      createSede() {
        const form = this.$refs.sedeForm

        if (form.checkValidity() === false) {
            event.stopPropagation()
        }else {
            this.$apollo.mutate({
                mutation: this.$store.getters.mutation,
                variables: this.getVariables(),
                update: this.updateMethod
            }).then((data) => {
              this.$emit('sede-created', {action: this.$store.state.action})
              this.$apollo.query({
                query: gql`query{ banners(sede_id: 1) {id} }`
              })
              this.resetForm();
            }).catch((error) => {
                this.$emit('sede-creation-error')
            })
        }

        form.reset()
        form.classList.add('was-validated')
      },
      deleteBanner(id) {
        this.$apollo.mutate({
                mutation: deleteBannerMutation,
                variables: {id}
            }).then( ({data: {res: {id: deletedId } }}) => {
                this.previews.splice(this.previews.findIndex(p => p.id === deletedId), 1)
              })
      },
      async fillForm(id) {
          if (!!+id && id !== -1) {
            const res = await this.$apollo.query({
                query: sede,
                variables: {
                    id
                },
                fetchPolicy: 'no-cache',
            })
            
            this.$store.commit('changeSelectedItem', res.data.sede)
            const {banners} = res.data.sede 
            this.banners = banners.filter(b => b.image === "")
            this.previews = banners.filter(b => b.image !== "" && b.image !== undefined)

            if(this.$refs.apollo_countries)
            {
              this.$refs.apollo_countries.optSelected = this.$store.getters.field('country').id
            }
  
            this.setDefaultBanners()
            this.scrollToTop()
        }
      },
      getBannerText(idx, flag = false){
          let text = `Banner ${++idx}` 
          return flag ? text.toLowerCase().replace(/\s/g, '') : text 
      },
      getVariables() {
        switch (this.$store.state.action) {
          case actions.UPDATE:
            this.$store.commit('updateArrayList', {key: 'banners', list: this.banners })
            break;
          }

          return this.$store.state.selectedItem
      },
      onSelectChange(value) { 
        this.$store.commit('changeField', {key: 'countries_id', value})
      },
      resetForm(){

          if(this.$refs.sedeForm && this.$refs.sedeForm.classList){
              this.$refs.sedeForm.classList.remove('was-validated')
          }

          this.$store.dispatch('manageAction', 
                                {
                                  action: actions.CREATE, 
                                  mutation: createMutation,
                                  item: Object.assign({}, this.emptySede)
                                })
          
          if(this.$refs.apollo_countries) 
              this.$refs.apollo_countries.optSelected = 1

          this.setDefaultBanners()
      },
      setDefaultBanners() {
          this.banners.length = 0
          this.banners.push(Object.assign({},this.emptyBanner))
      },
      scrollToTop(){
          window.scrollTo(0,0)
      },
      updateFileList(event, idx) {
          this.banners[idx].image = event.target.files[0].name
          this.$store.commit('addItemToList', {key: 'files', item: event.target.files[0]})
      },
    },
}
</script>

<style>
.collapse .card-body
{
  min-height: 150px;
}

.formCard
{
    min-height: 375px;
}

.formButtonsSection
{
  bottom: 20px;
  display: flex;
  justify-content: center;
  width: 100%;
}

#previews
{
  height: 280px; 
  margin-bottom: 10px;
  overflow-y: scroll; 
}

.previewContainer
{
  position: relative;
  width: 100%;
  max-width: 475px;
}

.previewContainer img 
{
  width: 100%;
  height: auto;
}

.previewContainer .btn 
{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
}
</style>