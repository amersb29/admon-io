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
            <label for="memberships">Pa&iacute;s</label>
            <ApolloQuery :query="require('@/graphql/queries/select_countries.gql')">
              <template v-slot="{ result: { loading, error, data } }">
                <!-- Loading -->
                <div v-if="loading" class="loading apollo">Loading...</div>

                <!-- Error -->
                <div v-else-if="error" class="error apollo">An error occurred</div>

                <!-- Result -->
                <div v-else-if="data" class="result apollo">
                  <b-form-select id="memberships" v-model="user.country" class="custom-dropdown">
                    <option v-for="country of data.countries_combo" :value="country.id" :selected="country.id === 1" :key="country.id"> {{ country.code }}</option>
                  </b-form-select>
                </div>

                <!-- No result -->
                <div v-else class="no-result apollo">No result :(</div>
              </template>
            </ApolloQuery>
          </div>
          <div class="col-md-6">
            <label for="">Membres&iacute;a</label>
            <ApolloQuery :query="require('@/graphql/queries/select_memberships.gql')">
              <template v-slot="{ result: { loading, error, data } }">
                <!-- Loading -->
                <div v-if="loading" class="loading apollo">Loading...</div>

                <!-- Error -->
                <div v-else-if="error" class="error apollo">An error occurred</div>

                <!-- Result -->
                <div v-else-if="data" class="result apollo">
                  <b-form-select v-model="user.membership" class="custom-dropdown">
                    <option :value="null">Sin membres&iacute;a</option>
                    <option :value="mem.id" v-for="mem of data.mem_combo" :key="mem.id"> {{  mem.name }}</option>
                  </b-form-select>
                </div>

                <!-- No result -->
                <div v-else class="no-result apollo">No result :(</div>
              </template>
            </ApolloQuery>
            
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
import { log } from 'util';

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
        country: 1,
        membership: null
      }
    };
  },
  computed: {
    
  },
  methods: {
    getFlag( code ){console.log("getFlag::", require(`@/assets/img/${code}_flag.png`));
    
      return require(`@/assets/img/${code}_flag.png`);
    },
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

