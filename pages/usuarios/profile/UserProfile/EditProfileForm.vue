<template>
  <card class="card" :title="formTitle">
    <div>
      <form ref="createUsrForm">
        <b-row>
          <b-col md="4">
            <fg-input type="text"
                      label="Nombre"
                      placeholder="Escriba el Nombre"
                      required
                      v-model="firstName">
            </fg-input>
          </b-col>
          <b-col md="4">
            <fg-input type="text"
                      label="Apellido(s)"
                      placeholder="Escriba el/los Apellido(s)"
                      required
                      v-model="lastName">
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
                      v-model="password">
            </fg-input>
          </b-col>
          <b-col md="4">
            <fg-input type="password"
                      label="Confirmar Contraseña"
                      placeholder="Confirmar Contraseña"
                      required>
            </fg-input>
          </b-col>
          <b-col md="4">
            &nbsp;
          </b-col>
        </b-row>

        <b-row>
          <b-col md="4">
            <label for="countries">Pa&iacute;s</label>
            <apollo-select
              id="apollo_countries"
              gqlQuery="countries"
              selectedValue="1" 
              optionText="name"
              @change="onSelectChange($event, 'country')"
            />
          </b-col>
          <b-col md="4">
            <label for="memberships">Membres&iacute;a</label>
            <apollo-select
              id="apollo_memberships"
              gqlQuery="memberships" 
              optionText="name"
              initialNullText="Sin membresía"
              @change="onSelectChange($event, 'membership')"
            />            
          </b-col>
          <b-col md="4">
            <label for="state">Estado</label>
            <b-form-select id="state" class="custom-dropdown" v-model="state">
              <option value="0" selected>Inactivo</option>
              <option value="1" >Activo</option>
            </b-form-select>
          </b-col>
        </b-row>

        <b-row>
          <b-col md="4">
            <label for="role">Perfil</label>
            <apollo-select
              id="apollo_roles"
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

        <div class="text-center">
          <p-button type="submit"
                    round
                    @click.native.prevent="createUser">
            {{ textButton }}
          </p-button>
        </div>
        <div class="clearfix"></div>
      </form>
    </div>
  </card>
</template>

<script>
import ApolloSelect from '@/components/ApolloSelect.vue';
import createUserMut from '@/graphql/mutations/user/CreateUser.gql';
import EditForm from '@/components/Mixins/EditForm.vue';

export default {
  mixins: [EditForm],
  props: {
    formTitle: String,
    textButton: String,
    updateMethod: Function
  },
  components: {
    ApolloSelect
  },
  created(){
    this.$store.commit('changeSelectedItem', Object.assign({}, this.user))
  },
  data() {
    return {
      user: {
        company: "",
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        country: "1",
        membership: null,
        state: "0",
        roles: [4]
      }
    };
  },
  computed: {
    firstName: {
        get () {
            return this.$store.getters.field('firstName')
        },
        set (value) {
            this.$store.commit('changeField', {key: 'firstName', value})
        }
    },
    lastName: {
        get () {
            return this.$store.getters.field('lastName')
        },
        set (value) {
            this.$store.commit('changeField', {key: 'lastName', value})
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
  },
  methods: {
    onSelectChange(value, key) { this.$store.commit('changeField', {key, value}) /*this.user[ attr ] = e;*/ },
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
            firstName: this.$store.getters.field('firstName'), //this.user.firstName,
            lastName:  this.$store.getters.field('lastName'), //this.user.lastName,
            email:     this.$store.getters.field('email'), //this.user.email,
            password:  this.$store.getters.field('password'), //this.user.password,
            mem_id:    this.$store.getters.field('membership'), //this.user.membership,
            country_id: this.$store.getters.field('country'), //this.user.country,
            state: this.$store.getters.field('state'), //this.user.state,
            roles: this.$store.getters.field('roles'), //this.user.roles,
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

  }
};
</script>
<style lang="scss">
.custom-select {
  background-color: #fffcf5;
  border-color: #9A9A9A;
  color: #66615b;
}
</style>

