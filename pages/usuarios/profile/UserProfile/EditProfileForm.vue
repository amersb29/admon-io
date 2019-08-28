<template>
  <card class="card" :title="formTitle">
    <div>
      <form>
        <div class="row">
          <div class="col-md-6">
            <fg-input type="text"
                      label="First Name"
                      placeholder="First Name"
                      required
                      v-model="user.firstName">
            </fg-input>
          </div>
          <div class="col-md-6">
            <fg-input type="text"
                      label="Last Name"
                      placeholder="Last Name"
                      v-model="user.lastName">
            </fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <fg-input type="email"
                      label="Email"
                      placeholder="Email"
                      v-model="user.email">
            </fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <fg-input type="password"
                      label="Contraseña"
                      placeholder="Contraseña"
                      v-model="user.password">
            </fg-input>
          </div>
          <div class="col-md-6">
            <fg-input type="password"
                      label="Confirmar Contraseña"
                      placeholder="Confirmar Contraseña">
            </fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <label for="countries">Pa&iacute;s</label>
            <apollo-select
              id="apollo_countries"
              gqlQuery="countries"
              selectedValue="1" 
              optionText="name"
              @change="onSelectChange($event, 'country')"
            />
          </div>
          <div class="col-md-6">
            <label for="memberships">Membres&iacute;a</label>
            <apollo-select
              id="apollo_memberships"
              gqlQuery="memberships" 
              optionText="name"
              initialNullText="Sin membresía"
              @change="onSelectChange($event, 'membership')"
            />            
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <label for="state">Estado</label>
            <b-form-select id="state" class="custom-dropdown" v-model="user.state">
              <option value="0" selected>Inactivo</option>
              <option value="1" >Activo</option>
            </b-form-select>
          </div>
          <div class="col-md-6">
            <label for="role">Perfil</label>
            <apollo-select
              id="apollo_roles"
              gqlQuery="roles"
              optionText="name"
              multiple
              :arrayModel="user.roles"
              @change="onSelectChange($event, 'roles')"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <label>Notas</label>
              <textarea rows="5" class="form-control border-input"
                        placeholder="Here can be your description"
                        v-model="user.aboutMe">
              </textarea>
            </div>
          </div>
        </div>
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

