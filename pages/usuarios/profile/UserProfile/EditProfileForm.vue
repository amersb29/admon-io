<template>
  <b-card :title="formTitle">
    <form ref="createUsrForm">
      <b-row>
        <b-col md="4">
          <fg-input type="text"
                    label="Nombre"
                    placeholder="Escriba el Nombre"
                    required
                    v-model="first_name">
          </fg-input>
        </b-col>
        <b-col md="4">
          <fg-input type="text"
                    label="Apellido(s)"
                    placeholder="Escriba el/los Apellido(s)"
                    required
                    v-model="last_name">
          </fg-input>
        </b-col>
        <b-col md="4">
          <fg-input type="email"
                    label="Correo electrónico"
                    placeholder="Escriba el Correo electrónico"
                    required
                    v-model="email">
          </fg-input>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="4">
          <fg-input type="password"
                    label="Contraseña"
                    placeholder="Escriba la Contraseña"
                    required
                    v-model="password"
                    :class='{valid:passwordValidation.valid}'>
          </fg-input>
        </b-col>
        <b-col md="4">
          <fg-input type="password"
                    label="Confirmar Contraseña"
                    placeholder="Confirmar Contraseña"
                    required
                    v-model.lazy='checkPassword'>
          </fg-input>
        </b-col>
        <b-col md="4">
          <transition name="hint" appear>
            <div v-if='passwordValidation.errors.length > 0' class='hints'>
              <ul>
                <li v-for='(error, index) in passwordValidation.errors' :key="index">{{error}}</li>
              </ul>
            </div>
          </transition>
          <div class="matches" v-if='notSamePasswords'>
            <p>Passwords don't match.</p>
          </div>
          <div class="matches" v-else>
            <p>
              <i class="fa fa-check fa-2x"></i>
            </p>
          </div>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="4">
          <label for="countries">Pa&iacute;s</label>
          <apollo-select
            ref="apollo_countries"
            gqlQuery="countries"
            selectedValue="1" 
            optionText="name"
            @change="onSelectChange($event, 'country')"
          />
        </b-col>
        <b-col md="4">
          <label for="memberships">Membres&iacute;a</label>
          <!-- <b-select v-model="membership">
            <option :selected="membership === 0" value="0">Sin membres&iacute;a</option>
            <option :selected="membership === 1" value="1">Premium</option>
            <option :selected="membership === 2" value="2">Platinum</option>
          </b-select> -->
          <apollo-select
            @change="onSelectChange($event, 'membership')"
            gqlQuery="memberships" 
            initialNullText="Sin membresía"
            optionText="name"
            ref="apollo_memberships"/>            
        </b-col>
        <b-col md="4">
          <label for="state">Estado</label>
          <b-form-select ref="state" id="state" class="custom-dropdown" v-model="state">
            <option value="0" selected>Inactivo</option>
            <option value="1" >Activo</option>
          </b-form-select>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="4">
          <label for="role">Perfil</label>
          <apollo-select
            ref="apollo_roles"
            gqlQuery="roles"
            optionText="name"
            multiple
            :arrayModel="roles"
            @change="onSelectChange($event, 'roles')"
          />
        </b-col>
        <b-col md="8">
          <div class="form-group">
            <label>Notas</label>
            <textarea rows="5" class="form-control border-input"
                      placeholder="Here can be your description"
                      v-model="notes">
            </textarea>
          </div>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <div class="formButtonsSection">
              <b-button-group>
                  <b-button :variant="buttonVariant" 
                            class="formButtons" 
                            @click.native.prevent="createProduct()"
                            :disabled="notSamePasswords && passwordValidation.errors.length">
                      <i :class="`fa fa-${actionButton} fa-lg`"></i>
                      {{ actionButtonTxt }}
                  </b-button>

                  <b-button variant="danger" class="formButtons" @click="resetUserForm()">
                      <i class="fa fa-ban fa-lg"></i>
                      Cancelar
                  </b-button>
              </b-button-group>
          </div>
        </b-col>
      </b-row>
      <div class="clearfix"></div>
    </form>
  </b-card>
</template>

<script>
import actions from '@/enums/actions'
import ApolloSelect from '@/components/ApolloSelect.vue';

import usuarioGQL from '@/graphql/queries/usuarios/usuario.gql'
import createMutation from '@/graphql/mutations/user/CreateUser.gql';

export default {
  props: {
    formTitle: String,
    textButton: String,
    updateMethod: Function
  },
  components: {
    ApolloSelect
  },
  created(){
    this.resetUserForm();

    this.$store.watch(
        (state, getters) => getters.selectedItemId,
        (newId, oldId) => {
            if (this.$store.state.action !== actions.DELETE)
                this.fillUserForm( newId )
        }
    )
  },
  data() {
    return {
      checkPassword:'',
      rules: [
				{ message:'One lowercase letter required.', regex:/[a-z]+/ },
				{ message:"One uppercase letter required.",  regex:/[A-Z]+/ },
				{ message:"8 characters minimum.", regex:/.{8,}/ },
				{ message:"One number required.", regex:/[0-9]+/ }
			],
      user: {
        company: "",
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        country: "1",
        membership: "0",
        password: null,
        state: "0",
        roles: [4]
      }
    };
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
    first_name: {
        get () {
            return this.$store.getters.field('first_name')
        },
        set (value) {
            this.$store.commit('changeField', {key: 'first_name', value})
        }
    },
    last_name: {
        get () {
            return this.$store.getters.field('last_name')
        },
        set (value) {
            this.$store.commit('changeField', {key: 'last_name', value})
        }
    },
    email: {
        get () {
            return this.$store.getters.field('email')
        },
        set (value) {
            this.$store.commit('changeField', {key: 'email', value})
        }
    },
    membership: {
      get () {
            return this.$store.getters.field('membership')
      },
      set (value) {
          this.$store.commit('changeField', {key: 'membership', value})
      }
    },
    password: {
        get () {
            return this.$store.getters.field('password')
        },
        set (value) {
            this.$store.commit('changeField', {key: 'password', value})
        }
    },
    state: {
        get () {
            return this.$store.getters.field('state')
        },
        set (value) {
            this.$store.commit('changeField', {key: 'state', value})
        }
    },
    roles: {
        get () {
            return this.$store.getters.field('roles')
        },
        set (value) {
            this.$store.commit('changeField', {key: 'roles', value})
        }
    },
    notes: {
        get () {
            return this.$store.getters.field('notes')
        },
        set (value) {
            this.$store.commit('changeField', {key: 'notes', value})
        }
    },
    passwordValidation () {
			let errors = []
			for (let condition of this.rules) {
				if (!condition.regex.test(this.password)) {
					errors.push(condition.message)
				}
			}
			if (errors.length === 0) {
				return { valid:true, errors }
			} else {
				return { valid:false, errors }
			}
    },
    passwordsFilled () {
			return (this.password !== '' && this.checkPassword !== '')
		},
    notSamePasswords () {
			if (this.passwordsFilled) {
				return (this.password !== this.checkPassword)
			} else {
				return false
			}
		},
  },
  methods: {
    onSelectChange(value, key) { this.$store.commit('changeField', {key, value}) },
    createUser(){
      const form = this.$refs.createUsrForm;

      if (form.checkValidity() === false) {
          event.stopPropagation();
      }else {
        this.$apollo.mutate({
          // Query
          mutation: this.$store.getters.mutation,
          // Parameters
          variables: {
            first_name: this.$store.getters.field('first_name'), 
            last_name:  this.$store.getters.field('last_name'), 
            email:     this.$store.getters.field('email'), 
            password:  this.$store.getters.field('password'), 
            mem_id:    this.$store.getters.field('membership'), 
            country_id: this.$store.getters.field('country'), 
            state: this.$store.getters.field('state'), 
            roles: this.$store.getters.field('roles'), 
          },
          update: this.updateMethod
        }).then((data) => {
          this.resetUserForm()
          this.$emit('user-created')
        }).catch((error) => {
          this.$emit('user-creation-error')
        })
      }
      form.classList.add('was-validated')
    },
    async fillUserForm(idx) {
      if (!!+idx && idx !== -1) {
          const res = await this.$apollo.query({
              query: usuarioGQL,
              variables: {
                  idx
              },
              context: this.$store.getters.gqlContext
          })

          const usuario = this.formatResult(res.data.user)
          this.$refs.apollo_countries.optSelected = usuario.country 
          this.$refs.apollo_memberships.$props.selectedValue.set(usuario.membership)
          this.$store.commit('changeSelectedItem', usuario)  
      }
    },
    formatResult(obj){
      Object.entries(obj).forEach(([key,value])=>{
        if ( Array.isArray(value) ) {
            obj[key] = value.map( v => v.id ? v.id : v )
        } else if (typeof value === 'object'){
            obj[key] = value.id
        } 
      })
      delete obj.__typename
      return obj
    },
    resetUserForm() {

      if(this.$refs.createUsrForm && this.$refs.createUsrForm.classList){
        this.$refs.createUsrForm.classList.remove('was-validated')
        this.$refs.createUsrForm.reset()
      }

      this.$store.dispatch('manageAction', 
                            {
                              action: actions.CREATE, 
                              mutation: createMutation,
                              item: Object.assign({}, this.user)
                            }
                          )      
    }
  }
};
</script>
<style lang="scss">
.custom-select {
  background-color: #fffcf5;
  border-color: #9A9A9A;
  color: #66615b;
}
.hints ul li {
  color: red;
}
</style>

