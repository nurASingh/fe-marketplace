<template>
  <div id="app">
    <router-view name="header" @showConnect="showConnect"/>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/marketplace">Marketplace</router-link>
    </div>
    <router-view/>
    <lsat-entry v-if="showConnector" :paymentConfig="loginConfiguration" @paymentEvent="connectEvent"/>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
  },
  data () {
    return {
      results: null,
      showConnector: false
    }
  },
  // mounted () { },
  methods: {
    showConnect (connectData) {
      if (connectData.connectCode === 'login') {
        this.showConnector = true
      }
    },
    connectEvent: function (connectEventData) {
      const data = connectEventData.detail[0]
      this.$store.dispatch('authStore/startLogin').then(() => {
        this.$emit('paymentEvent', data)
      })
    }
  },
  computed: {
    loginConfiguration () {
      const configuration = this.$store.getters['paymentStore/getConfiguration']('login')
      window.risidioPaymentConfig = JSON.stringify(configuration)
      return configuration
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  text-align: center;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
