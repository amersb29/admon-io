<template>
  <div class="container">
    <b-card style="max-width: 315px">
      <template v-slot:header>
        <h3 class="mb-0">InteligenciaObjetiva</h3>
      </template>
      <b-form novalidate ref="loginForm" @submit.prevent="login($event)">
        <b-input-group>
          <b-input-group-prepend class="prepend">
            <i class="fa fa-envelope"></i>
          </b-input-group-prepend>
          <b-input  required
                    type="email"  
                    v-model="loginObj.username"
                    placeholder="Escriba su correo electrónico"></b-input>
          <div class="invalid-feedback">
            Escriba su correo electr&oacute;nico.
          </div>
        </b-input-group>
        <b-input-group>
          <b-input-group-prepend class="prepend">
            <i class="fa fa-eye-slash"></i>
          </b-input-group-prepend>
          <b-input  required
                    type="password"
                    v-model="loginObj.password"
                    placeholder="Escriba su contraseña"></b-input>
          <div class="invalid-feedback">
            Escriba su contrase&ntilde;a.
          </div>
        </b-input-group>
        <div class="errorContainer">
          <span class="errorTxt" v-for="(err, idx) of errorsArr" :key="idx">
            {{ err.message }}
          </span>
        </div>
        <b-button variant="primary" type="submit">Entrar</b-button>
        <b-button variant="danger">Olvid&eacute; mi contrase&ntilde;a</b-button>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import loginMut from '@/graphql/mutations/login/Login.gql';

export default {
  data() {
    return {
      errorsArr: [],
      loginObj: {
        username: '',
        password: ''
      }
    }
  },
  components: {
    
  },
  computed: {
    logo: () => 'https://adamdehaven.com/wp-content/uploads/key.jpg' //require("@/assets/img/logo.png")
  },
  methods: {
    async login( event ) {
      const form = this.$refs.loginForm

      if (form.checkValidity() === false) {
          event.stopPropagation();
      }else{
        try {
          const res = await this.$apollo.mutate({
            mutation: loginMut,
            variables: { username: this.loginObj.username, password: this.loginObj.password}
          }).then( ( {data: { login = null } } = res) => login )
          this.$store.commit('updateToken', res.access_token)
          localStorage.setItem('apollo-token', res.access_token)
          localStorage.setItem('user.id', res.user.id)
          localStorage.setItem('user.first_name', res.user.first_name)
          localStorage.setItem('user.email', res.user.email)
          
          this.$router.replace({ path: 'dashboard' })

        } catch (error) {
          this.errorsArr = error.graphQLErrors
        }
      }

      form.classList.add('was-validated');
    }
  }
}
</script>

<style>
body {
  background-color: #363636 !important;
}

.container {
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.errorContainer{
  height: 30px;
  margin: 20px 0;
  text-align: center;
}
.errorTxt {
  color: #B33C12;
}

.invalid-feedback {
  text-align: center;
}

.prepend {
    align-items: center;
    border: 2px solid #427C89;
    border-radius: 50%;
    color: #427C89;
    display: flex;
    font-size: 1.2rem;
    height: 35px;
    justify-content: center;
    margin: 3px 10px 3px 3px;
    width: 35px;
}
</style>
