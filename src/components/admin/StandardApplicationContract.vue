<template>
<div>
  <pre class="source-code" v-html="contractSourceDisplay"></pre>
</div>
</template>

<script>

export default {
  name: 'StandardApplicationContract',
  components: {
  },
  props: ['contractSourceDisplay'],
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
.source-code {
  background: #c3dee0;
  border: 2pt solid #342343;
  padding: 25px;
}
</style>
