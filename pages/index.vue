<template>
  <div class="container">
    <b-card :img-src="logo"
            img-alt="InteligenciaObjetiva"
            img-top
            style="max-width: 315px">
      <template v-slot:header>
        <h3 class="mb-0">InteligenciaObjetiva</h3>
      </template>
      <b-form>
        <b-input-group>
          <b-input-group-prepend class="prepend">
            <i class="fa fa-envelope"></i>
          </b-input-group-prepend>
          <b-input  required
                    type="email"  
                    v-model="loginObj.username"
                    placeholder="Escriba su correo electrónico"></b-input>
        </b-input-group>
        <b-input-group>
          <b-input-group-prepend class="prepend">
            <i class="fa fa-eye-slash"></i>
          </b-input-group-prepend>
          <b-input  required
                    type="password"
                    v-model="loginObj.password"
                    placeholder="Escriba su contraseña"></b-input>
        </b-input-group>
        <div class="errorContainer">
          <span class="errorTxt">
            
          </span>
        </div>
        <b-button variant="primary" @click="login()">Entrar</b-button>
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
    login() {
      this.$apollo.mutate({
        mutation: loginMut,
        variables: { username: this.loginObj.username, password: this.loginObj.password}
      }).then( ( {data: { login = null } } = res) => {
        if(login){
          localStorage.setItem('token', login.access_token)
          localStorage.setItem('user.id', login.user.id)
          localStorage.setItem('user.first_name', login.user.first_name)
          localStorage.setItem('user.email', login.user.email)
        }
      }).catch( error => {
        console.log(error)
      });
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
  min-height: 100vh;
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
