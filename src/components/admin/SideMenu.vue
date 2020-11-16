<template>
<div>
    <div class="px-3 px-md-5"><p class="text-sm">My Dashboard</p></div>
    <account-links/>
</div>
</template>

<script>
import AccountLinks from '@/components/layout/AccountLinks'

export default {
  name: 'SideMenu',
  components: {
    AccountLinks
  },
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
