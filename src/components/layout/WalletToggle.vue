<template>
<div class="text2 mr-5 text-white">
  <b-form-checkbox @change="changeWalletMode()" name="check-button" switch>
  <span v-if="walletMode === 'risidio'">Internal</span>
  <span v-else>Connect</span> Wallet
  </b-form-checkbox>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'WalletToggle',
  components: {
  },
  data () {
    return {
    }
  },
  methods: {
    changeWalletMode () {
      this.$store.commit(APP_CONSTANTS.COMMIT_TOGGLE_WALLET_MODE)
    }
  },
  computed: {
    walletMode () {
      const walletMode = this.$store.getters[APP_CONSTANTS.KEY_WALLET_MODE]
      return walletMode
    }
  }
}
</script>

<style lang="scss">
</style>
