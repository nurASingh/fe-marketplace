<template>
<div>
  <h1>Connect Your DC Application</h1>
  <p>Connect your digital collectibles application to the marketplace...</p>
  <div class="mb-5" v-if="projectOption === 0">
    <b-button to="/connect-app-with-contract" variant="info" class="mt-3 mr-3 btn-lg" style="text-transform: capitalize; font-size: 14px;">I Have a Contract</b-button>
    <b-button to="/connect-app-without-contract" variant="warning" @click="projectOption = 2" class="mt-3 btn-lg" style="text-transform: capitalize; font-size: 14px;">I Need a Contract</b-button>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'ConnectApplication',
  components: {
  },
  data () {
    return {
      loading: true,
      projectOption: 0,
      contractAddress: null
    }
  },
  mounted () {
    this.contractAddress = this.$store.getters[APP_CONSTANTS.KEY_PROFILE].stxAddress
  },
  methods: {
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
