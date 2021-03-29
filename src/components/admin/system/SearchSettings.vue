<template>
<div>
  <div class="mb-4">
    <div class="d-flex justify-content-between">
      <div>
        <a class="mx-2" href="#" @click.prevent="findApplications">projects</a>
        <a class="mx-2" href="#" @click.prevent="findAssets">assets</a>
        <a class="mx-2" href="#" @click.prevent="findUsers">users</a>
      </div>
    </div>
    <div class="p-4">
      <b-table striped hover
        :items="values()"
        :fields="fields()"
        :sort-by.sync="sortBy"
      >
        <template #cell(assetUrl)="data">
          <span v-html="data.value"></span>
        </template>
        <template #cell(zonefile)="data">
          <span v-html="data.value"></span>
        </template>
      </b-table>
      <div v-if="searchResults">{{searchResults[0]}}</div>
    </div>
  </div>
</div>
</template>

<script>
import moment from 'moment'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'SearchSettings',
  components: {
  },
  data () {
    return {
      projectOption: 0,
      searchResults: null,
      result: null,
      searchType: null,
      users: 'brightblock.id,mikecohen.id,mijoco.id.blockstack,madeleine.id.blockstack,feekster.id.blockstack,yakahead.id.blockstack,figis.id.blockstack,radicle_art.id.blockstack,mike.personal.id,rosemarry.id.blockstack,antoniomeic.id.blockstack',
      usersMin: 'radicle_art.id.blockstack',
      sortBy: 'updated'
    }
  },
  methods: {
    fields () {
      if (this.searchType === 'users') {
        return ['name', 'zonefile', 'app count']
      } else if (this.searchType === 'projects') {
        return ['id', 'owner', 'updated', 'title', 'assetUrl']
      } else {
        return ['owner', 'updated', 'title', 'assetUrl', 'projectId']
      }
    },
    /**
    sortBy () {
      if (!this.searchResults) return
      if (this.searchType === 'users') {
        return 'name'
      } else if (this.searchType === 'projects') {
        return 'updated'
      } else {
        return 'updated'
      }
    },
    **/
    values () {
      if (!this.searchResults) return
      let mapped = []
      const $self = this
      if (this.searchType === 'users') {
        mapped = this.searchResults.map(function (a) { return { name: a.name, 'app count': $self.countApps(a.apps), zonefile: '<a href="' + $self.parseProfile(a.zonefile) + '">profile</a>' } })
      } else if (this.searchType === 'projects') {
        mapped = this.searchResults.map(function (a) { return { id: $self.contract(a.contractId), owner: a.owner, updated: moment(a.updated).format('YYYY-MM-DD HH:mm:SS'), title: a.gaiaProject.title, type: a.gaiaProject.objType, assetUrl: '<img width="50px" height="50px" src="' + a.gaiaProject.imageUrl + '"/>' } })
      } else {
        mapped = this.searchResults.map(function (a) { return { owner: a.owner, updated: moment(a.updated).format('YYYY-MM-DD HH:mm:SS'), title: a.title, assetUrl: '<a href="' + a.assetProjectUrl + '" target="_blank"><img width="50px" height="50px" src="' + a.assetUrl + '"/></a>', projectId: a.projectId } })
      }
      return mapped
    },
    countApps (apps) {
      if (apps) {
        try {
          return apps.split('http').length
        } catch (error) {
          return 0
        }
      }
      return 0
    },
    parseProfile (zonefile) {
      if (zonefile.indexOf('"http') > -1) {
        try {
          const parts = zonefile.split('"')
          let found
          parts.forEach(function (part) {
            if (part.startsWith('http')) {
              if (part.endsWith('json')) {
                found = part.split('.json')[0] + '.json'
              } else if (part.endsWith('id')) {
                found = part.split('.id')[0] + '.id'
              }
            }
          })
          return found
        } catch (error) {
          return 'error'
        }
      }
    },
    findUsers () {
      this.$store.dispatch('searchStore/findUsers').then((results) => {
        this.searchResults = results
        this.searchType = 'users'
      })
    },
    findApplications () {
      const appmap = this.$store.getters[APP_CONSTANTS.KEY_APP_MAP]
      this.searchResults = appmap.apps
      this.searchType = 'projects'
    },
    contract (contractId) {
      return contractId.substring(0, 10) + '...'
    },
    findAssets () {
      this.$store.dispatch('searchStore/findAssets').then((results) => {
        this.searchResults = results
        this.searchType = 'assets'
      })
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
