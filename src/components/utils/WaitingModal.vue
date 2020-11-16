<template>
  <b-modal id="waiting-modal">
    <b-container class="text-white" fluid>
    <div class="row">
      <div class="col-12 my-1">
      </div>
    </div>
    </b-container>
      <template #modal-header>
        <div class="w-100 text-center mt-5">
          <b-icon icon="circle-fill" animation="throb" variant="light" font-scale="8"></b-icon>
        </div>
      </template>
      <template #modal-footer class="text-center">
        <div class="w-100">
          <p class="footer-text text-white">{{modalMessage}}</p>
        </div>
      </template>
  </b-modal>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'WaitingModal',
  components: {
  },
  data () {
    return {
    }
  },
  methods: {
  },
  computed: {
    modalMessage () {
      return this.$store.getters[APP_CONSTANTS.KEY_MODAL_MESSAGE]
    }
  }
}
</script>
<style lang="scss" >
</style>
