<template>
<div class="d-flex justify-content-between border-bottom pb-4 mb-5">
  <h1>For Developers</h1>
  <div class="account-menu"><b-icon @click="$emit('toggle-on-navbar')" icon="list"/></div>
</div>
</template>

<script>

export default {
  name: 'TitleBar',
  components: {
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
<style lang="scss">
@import "@/assets/scss/custom.scss";
.account-menu {
  padding: 10px 13px;
  background: $secondary;
  cursor: pointer;
  color: #fff;
  border-radius: 50%;
  font-size: 1.2rem;
  width: 46px;
  height: 46px;
}

</style>
