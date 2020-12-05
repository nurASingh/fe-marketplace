<template>
<div class="px-0" style="margin-top: 128px;">
  <post />
</div>
</template>

<script>
import Post from './Post'

export default {
  name: 'Community',
  components: {
    Post
  },
  data () {
    return {
    }
  },
  mounted () {
    this.loading = false
  },
  methods: {
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
