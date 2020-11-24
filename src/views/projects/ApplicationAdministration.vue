<template>
<div class="row">
  <side-menu class="col-3 mr-0 pr-0 pt-5"/>
  <div class="col-9 pt-5 admin-app">
    <title-bar title="For Developers" class="container" v-on="$listeners"/>
    <div class="container" @click="$emit('toggle-off-navbar')">
      <p class="text-40-300">Add Your Own Application</p>
      <p class="text-12-700">How it works</p>
      <p class="w-75">
        Connect your digital collectibles application to
        provide a decentralised marketplace for your users.</p>
      <p class="w-75">
        First, tell us about your project. Set a logo, name and description
        for users to be able to easily find your content on the marketplace.
        Next, tell us about your smart contract. We provide 2 ways to connect.
        'I have a contract' if you've already deployed
        a smart contract and 'I need a contract' if you want to go with our
        super simple contract template - you'll just need to provide a few
        parameters and click deploy and we'll do the heavy lifting!
      </p>
      <div class="mb-5">
        <b-button to="/connect-app" variant="info" class="mt-3 mr-3 btn-lg" style="text-transform: capitalize; font-size: 1.4rem;">Continue</b-button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import SideMenu from '@/components/admin/SideMenu'
import TitleBar from '@/components/admin/TitleBar'

export default {
  name: 'ApplicationAdministration',
  components: {
    SideMenu,
    TitleBar
  },
  data () {
    return {
      showNavbar: false,
      projectOption: 0
    }
  },
  mounted () {
    this.loading = false
    this.$store.dispatch('projectStore/fetchMyProjects')
  },
  methods: {
    editProject (contractName) {
      console.log(contractName)
    }
  },
  computed: {
  }
}
</script>
<style lang="scss">
</style>
