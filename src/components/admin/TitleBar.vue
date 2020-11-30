<template>
<div class="d-flex justify-content-between border-bottom pb-3 mb-3">
  <h1 class="text-17-500">{{title}}</h1>
  <div class="account-menu"><b-icon @click="$emit('toggle-on-navbar')" icon="list"/></div>
</div>
</template>

<script>

export default {
  name: 'TitleBar',
  components: {
  },
  props: ['title'],
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
.account-menu {
  padding: 5px 0 0 10px;
  background: #5154A1;
  cursor: pointer;
  color: #fff;
  border-radius: 50%;
  font-size: 1.2rem;
  width: 46px;
  height: 46px;
  font-size: 2.6rem;
}

</style>
