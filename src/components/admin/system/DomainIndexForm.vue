<template>
<div class="row">
  <div class="col-8 mb-2">
    <div role="group">
      <label for="input-live"><span class="text2">Project Id</span></label>
      <div>
        <b-form-select v-model="domainIndexModel.projectId" :options="applications"></b-form-select>
      </div>
    </div>
  </div>
  <div class="col-8 mb-2">
    <div role="group">
      <label for="input-live"><span class="text2">Owner</span></label>
      <b-input-group>
        <b-form-input v-model="domainIndexModel.owner" class="input" placeholder="owner"></b-form-input>
      </b-input-group>
    </div>
  </div>

  <div class="col-8 mb-2">
      <label for="input-live"><span class="text2">Domain</span></label>
      <b-input-group>
        <b-form-input v-model="domainIndexModel.domain" class="input" placeholder="domain"></b-form-input>
      </b-input-group>
  </div>

  <div class="col-8 mb-2">
      <label for="input-live"><span class="text2">Index File Name (name of the meta data file stored in Gaia)</span></label>
      <b-input-group>
        <b-form-input v-model="domainIndexModel.indexFiles[0].indexFileName" class="input" placeholder="Index File Name"></b-form-input>
      </b-input-group>
  </div>

  <div class="col-8 mb-2">
      <label for="input-live"><span class="text2">Index Category (artwork, written_word, etc)</span></label>
      <div>
        <b-form-select v-model="domainIndexModel.indexFiles[0].category" :options="categories"></b-form-select>
      </div>
  </div>

  <div class="col-8 mt-3">
    <div>
      <b-button size="lg" class="mb-3" variant="info" @click="submit">Submit</b-button>
    </div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'DomainIndexForm',
  components: {
  },
  data () {
    return {
      domainIndexModel: {
        projectId: null,
        owner: null,
        domain: location.hostname,
        storeageModel: 0,
        indexFiles: [{
          indexFileName: 'loopbomb_v03.json',
          category: 'artwork'
        }]
      }
    }
  },
  mounted () {
    this.domainIndexModel.owner = this.$store.getters[APP_CONSTANTS.KEY_PROFILE].username
  },
  methods: {
    submit: function () {
      if (!this.domainIndexModel.projectId) {
        this.$notify({ type: 'error', title: 'projectId', text: 'Please select projectId.' })
        return
      } else if (!this.domainIndexModel.owner) {
        this.$notify({ type: 'error', title: 'owner', text: 'Please enter the owner.' })
        return
      } else if (!this.domainIndexModel.domain) {
        this.$notify({ type: 'error', title: 'domain', text: 'Please enter the domain.' })
        return
      }
      if (!this.domainIndexModel.indexFiles || !this.domainIndexModel.indexFiles.length === 1) {
        this.$notify({ type: 'error', title: 'Index file', text: 'Please enter the index file name and category.' })
        return
      }
      this.$store.dispatch('projectStore/saveDomainIndex', this.domainIndexModel)
    }
  },
  computed: {
    applications () {
      const appmap = this.$store.getters[APP_CONSTANTS.KEY_APP_MAP]
      if (appmap) {
        return appmap.apps.map(function (a) { return { value: a.contractId, text: a.contractId } })
      }
      return []
    },
    categories () {
      const categories = this.$store.getters[APP_CONSTANTS.KEY_CATEGORIES]
      if (categories) {
        return categories.map(function (a) { return { value: a.name, text: a.displayName } })
      }
      return []
    }
  }
}
</script>
<style lang="scss">
</style>
