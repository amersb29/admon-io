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
            <fg-input type="text"
                      label="Country"
                      placeholder="Country"
                      v-model="user.country">
            </fg-input>
          </div>
          <div class="col-md-6">
            <label for="">Membres&iacute;a</label>
            <b-form-select v-model="user.membership" class="custom-dropdown">
              <option :value="null">Selecciona una opci&oacute;n</option>
              <option value="a">Option A</option>
              <option value="b">Option B</option>
            </b-form-select>
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
import createUserMut from '@/graphql/mutations/CreateUser.gql';

export default {
  props: {
    formTitle: String,
    textButton: String,
  },
  data() {
    return {
      user: {
        company: "",
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        aboutMe: "",
        membership: ""
      }
    };
  },
  methods: {
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
        }
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

