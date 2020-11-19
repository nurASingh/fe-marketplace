<template>
<b-sidebar id="login-sidebar" right bg-variant="white" width="232px">
  <div class="">
    <div class="login-sidebar__username login-sidebar--border-bottom">
      <div>
        <span class="mr-4" v-html="avatar"></span> Hi, <span class="text-info">{{ username }}</span>
      </div>
    </div>
    <account-links/>
    <div class="login-sidebar__item-group">
      <div class="text2"><span @click="logout()"><b-icon class="mr-2" icon="power" /> Logout</span></div>
    </div>
  </div>
</b-sidebar>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import AccountLinks from '@/components/layout/AccountLinks'

export default {
  name: 'SideBar',
  components: {
    AccountLinks
  },
  data () {
    return {
    }
  },
  methods: {
    logout () {
      // this.$emit('updateEventCode', { eventCode: 'connect-logout' })
      this.$store.dispatch('authStore/startLogout').then(() => {
        localStorage.clear()
        sessionStorage.clear()
      })
    }
  },
  computed: {
    balance () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return (profile && profile.wallet) ? profile.wallet.balance : 0
    },
    stxAddress () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      if (profile.wallet && profile.wallet.keyInfo.address) {
        return profile.wallet.keyInfo.address.substring(0, 3) + '...' + profile.wallet.keyInfo.address.substring(profile.wallet.keyInfo.address.length - 3)
      }
      return 'n/a'
    },
    username () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      if (!profile) {
        return 'unknown'
      } else if (profile.name && profile.name.length > 0) {
        return profile.name
      } else if (profile.username && profile.username.length > 0) {
        return profile.username
      } else {
        return profile.identityAddress
      }
    },
    avatar () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      if (profile.loggedIn) {
        if (profile.avatarUrl) {
          return (
            '<img style="width: 30px; height: 30px; border-radius: 20px;" src="' +
            profile.avatarUrl +
            '"/>'
          )
        }
      }
      return null
    }
  }
}
</script>

<style lang="scss">
#login-sidebar {
  height: 101vh;
}
#login-sidebar:hover {
  cursor: default;
}
#login-sidebar header {
  padding: 11.5px;
}
#login-sidebar header button {
  margin: 0 0 0 auto;
  font-size: 1px;
}
#login-sidebar header button svg {
  font-size: 15px;
}
.login-sidebar__item-group {
  padding: 30px 40px;
}
.login-sidebar__item-group div:not(:last-child) {
  margin-bottom: 20px;
}
.login-sidebar__username {
  height: 82px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
}
.login-sidebar__username span {
  font-weight: 700;
}
.login-sidebar__username div {
  margin-bottom: 38px;
}
.login-sidebar--border-bottom {
  border-bottom: 1px solid #E3E3E3;
}
</style>
