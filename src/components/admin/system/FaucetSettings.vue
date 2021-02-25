<template>
<div class="mb-4">
  <div class="col-md-8 col-sm-12">
    <b-form>
      <div class="mb-4">
        <div class="mb-2">Amount STX <a href="#" @click.prevent="sendMax()">(send max)</a></div>
        <b-input
          id="title"
          v-model="amountStx"
          ></b-input>
      </div>
      <div class="mb-4">
        <div class="mb-2">Destination STX Address <a href="#" @click.prevent="useMyAddress()">(use my address)</a></div>
        <b-input
          id="title"
          v-model="recipient"
          ></b-input>
      </div>
      <div class="col-8 mt-3">
        <div>
          <b-button size="lg" class="mb-3" variant="info" @click="makeTransfer">Submit</b-button>
        </div>
      </div>
    </b-form>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'FaucetSettings',
  components: {
  },
  data () {
    return {
      recipient: null,
      amountStx: null
    }
  },
  methods: {
    useMyAddress: function () {
      this.recipient = this.$store.getters[APP_CONSTANTS.KEY_PROFILE].stxAddress
    },
    sendMax: function () {
      this.amountStx = 20
    },
    makeTransfer: function () {
      this.$store.dispatch('stacksStore/makeTransferRisidio', { amountStx: this.amountStx, recipient: this.recipient })
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
