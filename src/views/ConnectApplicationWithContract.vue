<template>
<div v-if="loaded">
  <h1>Connect Your DC Application</h1>
  <p>Connect your digital collectibles application to the marketplace...</p>
  <b-form>
    <div class="row">
      <div class="col-8">
        <div class="mt-4 mb-2">
          <div class="mb-2">Application Name</div>
          <b-input
            id="name"
            v-model="project.name"
            class="mt-3"></b-input>
        </div>

        <div class="mt-3 mb-2">
          <div class="mb-2">Application Description</div>
          <b-input
            ref="description"
            v-model="project.description"
            class="mt-3"></b-input>
        </div>
        <div class="mb-2">
          <div class="mb-2">Contract Address</div>
          <b-input
            id="contractAddress"
            ref="contractAddress"
            v-model="project.contractAddress"
            class="mt-3"></b-input>
        </div>

        <div class="mt-4 mb-2">
          <div class="mb-2">Contract Name</div>
          <b-input
            id="contractName"
            ref="contractName"
            v-model="project.contractName"
            class="mt-3"></b-input>
        </div>
      </div>
      <div class="col-4">
        <div class="mb-2" v-if="!showLogo">
          <div class="m-2 p-2 bg-light border" style="width: 300px; height: 300px;">
            <div class="mt-5 my-auto text-center">
              <media-files-upload style="font-size: 16px; cursor: pointer;" class="" @lookupEvent="$emit('lookup-event')" :readonly="false" :contentModel="contentModel1" popoverId="'popover-target-1'" :parentalError="parentalError" :showFiles="true" :mediaFiles="mediaFiles1" :limit="1" :sizeLimit="2000000" :mediaTypes="'image'" @updateMedia="setByEventLogo1($event)"/>
            </div>
          </div>
        </div>
        <div class="mb-2" v-else>
          <img width="300px" height="300px" :src="project.logo"/>
          <a href="#" @click.prevent="showLogo = !showLogo">change logo (300x300px)</a>
        </div>
      </div>
    </div>

    <div class="mb-2" v-if="valid">
      <b-button variant="info" class="mt-3 mr-3 btn-lg" style="text-transform: capitalize; font-size: 14px;" @click.prevent="saveApplication()">Save Application</b-button>
      <b-button variant="danger" class="mt-3 btn-lg" style="text-transform: capitalize; font-size: 14px;" to="/connect-app">Cancel</b-button>
    </div>
  </b-form>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import MediaFilesUpload from '@/components/utils/MediaFilesUpload'
import utils from '@/services/utils'

export default {
  name: 'ConnectApplicationWithContract',
  components: {
    MediaFilesUpload
  },
  data () {
    return {
      loading: true,
      showLogo: true,
      contractId: null,
      loaded: false,
      project: {
        logo: require('@/assets/img/Group 15980.svg'),
        contractName: '',
        contractAddress: '',
        mintPrice: '',
        name: '',
        description: ''
      },
      parentalError: null,
      contentModel1: {
        title: 'Application logo <br/> (250x250 px)',
        errorMessage: 'A file is required.',
        popoverBody: 'Your logo  file.'
      },
      files: [],
      result: null,
      doValidate: true,
      defaultBadge: require('@/assets/img/Group 15980.svg'),
      defaultBadgeData: null
    }
  },
  mounted () {
    this.contractId = this.$route.params.contractId
    if (!this.contractId) {
      this.loaded = true
    } else {
      this.$store.dispatch('projectStore/findProjectByContractId', this.contractId).then((project) => {
        this.project = project
        if (this.project && !this.project.logo) {
          this.project.logo = this.defaultBadge
        } else {
          this.$notify({ type: 'error', title: 'Application Error', text: 'No contract found for id ' + this.contractId })
        }
        this.loaded = true
      })
    }
    this.contractAddress = this.$store.getters[APP_CONSTANTS.KEY_PROFILE].stxAddress
    const $self = this
    utils.fetchBase64FromImageUrl(this.defaultBadge, document).then((data) => {
      $self.defaultBadgeData = data
    })
  },
  methods: {
    setByEventLogo1 (data) {
      this.files = data.media
    },
    fileName () {
      if (this.files.length === 0) {
        return
      }
      const filename = this.files[0].name
      return filename.split(/\./)[0]
    },
    validate: function () {
      let result = true
      if (!this.name) {
        this.$notify({ type: 'error', title: 'Application Details', text: 'Please enter the name of your project' })
        result = false
      }
      if (!this.contractAddress) {
        this.$notify({ type: 'error', title: 'Application Details', text: 'Please enter the contract address of your project' })
        result = false
      }
      if (!this.contractName) {
        this.$notify({ type: 'error', title: 'Application Details', text: 'Please enter the contract name of your project' })
        result = false
      }
      if (!this.description) {
        this.$notify({ type: 'error', title: 'Application Details', text: 'Please enter a short description of your project' })
        result = false
      }
      return result
    },
    valid () {
      return this.name && this.description
    },
    saveApplication: function () {
      if (this.doValidate && !this.validate()) return
      let imageData = this.defaultBadgeData
      if (this.files && this.files.length === 1) {
        imageData = utils.getBase64FromImageUrl(this.files[0].dataUrl)
      }
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      const data = {
        contractAddress: this.contractAddress,
        contractName: this.contractName,
        owner: profile.username,
        name: (this.name) ? this.name : 'my project',
        description: this.description
      }
      this.$store.dispatch(APP_CONSTANTS.DISP_SAVE_PROJECT, { project: data, imageData: imageData }).then((result) => {
        this.$emit('transferEvent', result)
      }).catch((error) => {
        this.$notify({ type: 'error', title: 'Transfers', text: 'Error message: ' + error })
      })
    }
  },
  computed: {
    mediaFiles1 () {
      let files = []
      if (this.files.length > 0) {
        files = this.files
      }
      return files
    },
    contractAddressUser () {
      return this.$store.getters[APP_CONSTANTS.KEY_PROFILE].stxAddress
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
