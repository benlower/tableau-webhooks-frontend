<template>
  <nav class="navbar navbar-default">
    <div class="navbar-header">
      <img src="../assets/webhooks.png" width="50px"/>
      <router-link to="/" class="navbar-brand">Tableau Webhooks Front-end</router-link>
    </div>
    <ul class="nav navbar-nav navbar-right">
      <!-- <li>
        <button class="btn btn-danger log" @click="handleLogout()">Log out </button>
        <button class="btn btn-info log" @click="handleLogin()">Log In</button>
      </li> -->
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'app-nav',
  methods: {
    handleLogin () {
      login()
    },
    handleLogout () {
      logout()
    },
    isLoggedIn () {
      return isLoggedIn()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.navbar-right { margin-right: 0px !important}

.log {
  margin: 5px 10px 0 0;
}
</style>
