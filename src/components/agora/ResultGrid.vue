<template>
<div class="row mb-4">
  <div v-for="(result, index) in resultSet" :key="index" class="col-lg-4 col-sm-4 col-xs-6" >
    <result-item :result="result" />
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import ResultItem from '@/components/agora/ResultItem'

export default {
  name: 'ResultGrid',
  components: {
    ResultItem
  },
  props: ['resultSet'],
  data () {
    return {
    }
  },
  methods: {
  },
  computed: {
    application () {
      const application = this.$store.getters[APP_CONSTANTS.KEY_APP_MAP_PROJECT](this.contractId)
      return (application && application.gaiaProject) ? application : null
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
