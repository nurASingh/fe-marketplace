<template>
<div class="row">
  <div class="col-6 mb-5">
    <div role="group">
      <label for="input-live"><span class="text2">Starting Price</span></label>
      <b-input-group>
        <b-form-input type="number" v-model="startingPrice" class="input" placeholder="STX"></b-form-input>
      </b-input-group>
    </div>
  </div>
  <div class="col-6 mb-5">
    <div role="group">
      <label for="input-live"><span class="text2">Reserve Price</span></label>
      <b-input-group>
        <b-form-input type="number" v-model="reservePrice" class="input" placeholder="STX"></b-form-input>
      </b-input-group>

      <label for="input-live"><span class="text2">Increment</span></label>
      <b-input-group>
        <b-form-input type="number" v-model="incrementPrice" class="input" placeholder="STX"></b-form-input>
      </b-input-group>

      <label for="input-live"><span class="text2">Bidding Ends</span></label>
      <datetime type="datetime" input-id="biddingEndTime" v-model="biddingEndTime">
        <input id="biddingEndTime">
      </datetime>
    </div>
  </div>
</div>
</template>

<script>
import moment from 'moment'
import { Datetime } from 'vue-datetime'

export default {
  name: 'SellAuction',
  components: {
    Datetime
  },
  props: ['submitData'],
  watch: {
    submitData: function () {
      this.submit()
    }
  },
  data () {
    return {
      saleData: {
        saleType: 'auction',
        incrementPrice: 1,
        startingPrice: null,
        reservePrice: null,
        biddingEndTime: null
      }
    }
  },
  mounted () {
    this.loading = false
    this.assetHash = this.$route.params.assetHash
    const asset = this.$store.dispatch('searchStore/findArtworkById', this.assetHash)
    if (asset.saleData && asset.saleData.biddingEndTime) {
      this.biddingEndTime = moment(asset.saleData.biddingEndTime).format()
    } else {
      const dd = moment({}).add(2, 'days')
      dd.hour(10)
      dd.minute(0)
      this.biddingEndTime = dd.format()
    }
  },
  methods: {
    submit: function () {
      if (!this.saleData.incrementPrice || this.saleData.incrementPrice < 0) {
        this.$notify({ type: 'error', title: 'Increment', text: 'Please enter the increment for bidding.' })
        return
      } else if (!this.saleData.startingPrice || this.saleData.startingPrice < 0) {
        this.$notify({ type: 'error', title: 'Starting Price', text: 'Please enter the starting price for bidding.' })
        return
      } else if (!this.saleData.reservePrice || this.saleData.reservePrice < 0) {
        this.$notify({ type: 'error', title: 'Reserve Price', text: 'Please enter the reserve.' })
        return
      }
      if (!this.saleData.reservePrice || this.saleData.reservePrice < 0) {
        this.$notify({ type: 'error', title: 'Reserve Price', text: 'Please enter the reserve.' })
        return
      }
      this.$emit('setSaleData', this.saleData)
    },
    checkEndTime () {
      const now = moment({}).valueOf()
      const diff = this.saleData.biddingEndTime - now
      return diff > 0
    }
  },
  computed: {
  }
}
</script>
<style lang="scss">
</style>
