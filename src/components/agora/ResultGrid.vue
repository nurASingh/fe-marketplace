<template>
<div class="row mb-4">
  <div v-for="(result, index) in resultSet" :key="index" :class="gridClasses" class="px-0">
    <result-item :result="result" />
  </div>
</div>
</template>

<script>
import ResultItem from '@/components/agora/ResultItem'

export default {
  name: 'ResultGrid',
  components: {
    ResultItem
  },
  props: ['resultSet', 'gridClasses'],
  data () {
    return {
    }
  },
  methods: {
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
