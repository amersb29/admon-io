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
          <b-form-group label="Código" label-for="codigo">
              <b-input id="codigo" 
                      placeholder="Escriba el código de la sede"
                      required
                      v-model="codigo"></b-input>
          </b-form-group>
          <b-form-group label="Calendario" label-for="calendario">
              <b-input id="calendario" 
                      placeholder="Escriba el ID del calendario"
                      required
                      v-model="calendario"></b-input>
          </b-form-group>
        </b-card>
      </b-col>
      <b-col md="6">
        <b-card class="formCard">
          <b-form-group v-for="(banner, index) in banners" :key="banner.id"
                        :label="getBannerText(index)"
                        :label-for="getBannerText(index, true)">
              <b-form-file
                  accept=".jpg, .png, .gif"
                  @change="updateFileList($event)"
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
import ApolloSelect from '@/components/ApolloSelect'
import createMutation from '@/graphql/mutations/sedes/CreateSede.gql'
import actions from '@/enums/actions'

export default {
    name: 'edit-sedes-form',
    components: {ApolloSelect},
    created(){
      this.resetForm();

      this.$store.watch(
          (state, getters) => getters.selectedItemId,
          (newId, oldId) => {
              if (this.$store.state.action !== actions.DELETE)
                  this.fillSedeForm( newId )
          }
      )
    },
    data() {
      return {
        emptySede: {
          countries_id: 1,
          name: '',
          code: '',
          calendar: '',
          banners: []
        },
        emptyBanner: {

        }
      }
    },
    computed: {
      actionButton() {
          return this.$store.state.action === actions.CREATE ? 'save' : 'pencil' 
      },
      actionButtonTxt() {
          return this.$store.state.action === actions.CREATE ? 'Salvar' : 'Actualizar' 
      },
      banners() {
          return this.$store.state.selectedItem.banners
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
      codigo: {
        get () {
            return this.$store.getters.field('codigo')
        },
        set (value) {
            this.$store.commit('changeField', {key: 'codigo', value})
        }
      },
      calendario: {
        get () {
            return this.$store.getters.field('calendario')
        },
        set (value) {
            this.$store.commit('changeField', {key: 'calendario', value})
        }
      },
    },
    methods: {
      addBanner() {
        this.$store.commit('addItemToList', {key: 'banners', item: Object.assign({},this.emptyVideoObj)});
      },
      createSede() {
        const form = this.$refs.sedeForm

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
      getBannerText(idx, flag = false){
          let text = `Banner ${++idx}` 
          return flag ? text.toLowerCase().replace(/\s/g, '') : text 
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
          let banners = [ Object.assign({},this.emptyBanner) ];
          this.$store.commit('updateArrayList', {key: 'banners', list: banners});
      },
      updateFileList(event) {            
          this.$store.dispatch('manageFile', event.target.files[0])
      }
    }
}
</script>

<style>
.formCard{
    height: 365px;
}
</style>