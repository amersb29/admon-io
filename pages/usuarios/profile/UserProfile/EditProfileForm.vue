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
                      v-model="user.firstName">
            </fg-input>
          </b-col>
          <b-col md="4">
            <fg-input type="text"
                      label="Apellido(s)"
                      placeholder="Escriba el/los Apellido(s)"
                      required
                      v-model="user.lastName">
            </fg-input>
          </b-col>
          <b-col md="4">
            <fg-input type="email"
                      label="Correo electrónico"
                      placeholder="Escriba el Correo electrónico"
                      required
                      v-model="user.email">
            </fg-input>
          </b-col>
        </b-row>

        <!-- <div class="row">
          <div class="col-md-12">
            <fg-input type="email"
                      label="Correo electrónico"
                      placeholder="Escriba el Correo electrónico"
                      required
                      v-model="user.email">
            </fg-input>
          </div>
        </div> -->

        <b-row>
          <b-col md="4">
            <fg-input type="password"
                      label="Contraseña"
                      placeholder="Escriba la Contraseña"
                      required
                      v-model="user.password">
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
            <b-form-select id="state" class="custom-dropdown" v-model="user.state">
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
              :arrayModel="user.roles"
              @change="onSelectChange($event, 'roles')"
            />
          </b-col>
          <b-col md="8">
            <div class="form-group">
              <label>Notas</label>
              <textarea rows="5" class="form-control border-input"
                        placeholder="Here can be your description"
                        v-model="user.aboutMe">
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
import ApolloSelect from '../../../../components/ApolloSelect.vue';
import createUserMut from '@/graphql/mutations/user/CreateUser.gql';

export default {
  props: {
    formTitle: String,
    textButton: String,
    updateMethod: Function
  },
  components: {
    ApolloSelect
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
    
  },
  methods: {
    onSelectChange(e, attr) { this.user[ attr ] = e; },
    createUser(){
      const form = this.$refs.createUsrForm;

      if (form.checkValidity() === false) {
          event.stopPropagation();
      }else {
        this.$apollo.mutate({
          // Query
          mutation: createUserMut,
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

