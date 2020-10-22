<template>
<div v-if="loaded">
  <div class="row">
    <side-menu class="col-3 mr-0 pr-0 pt-5"/>
    <div class="col-9 py-5 admin-app">
      <title-bar class="container" v-on="$listeners"/>
      <div class="container" @click="$emit('toggle-off-navbar')">
        <h1>Connect Your Own Application</h1>
        <p>About your application</p>
        <div class="row">
          <div class="col-md-3 col-sm-12">
            <div class="mb-2">
              <div :style="bannerImage" v-if="files && files.length === 0" class="d-flex align-items-center flex-column m-2 p-2 bg-white border" style="width: 250px; height: 250px;">
                <div class="mt-5 my-auto text-center">
                  <app-logo-upload class="" :dims="dims" :contentModel="contentModel1" :showFiles="true" :mediaFiles="mediaFiles1" :limit="1" :sizeLimit="2000000" :mediaTypes="'image'" @updateMedia="setByEventLogo1($event)"/>
                </div>
              </div>
              <div v-else :style="bannerImage" class="d-flex align-items-end flex-column" style="width: 250px; height: 250px;">
                <span class="bg-dark p-1 mt-auto" style="position: relative; bottom: 0;">
                  <a class="text-white" href="#" @click.prevent="files = []" v-if="files && files.length > 0">change</a>
                </span>
              </div>
            </div>
          </div>
          <div class="col-md-9 col-sm-12">
            <b-form>
              <div class="mb-2">
                <div class="mb-2">Name</div>
                <b-input
                  id="title"
                  v-model="project.title"
                  class="mt-3"></b-input>
              </div>
              <div class="mt-3 mb-2">
                <div class="mb-2">Description</div>
                <b-input
                  ref="description"
                  v-model="project.description"
                  class="mt-3"></b-input>
              </div>
              <div class="mb-2">
                <div class="mb-2">Contract Address <a href="#" @click.prevent="useMyAddress()">(use my address)</a></div>
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
              <div class="mb-2" v-if="valid">
                <b-button variant="info" class="mt-3 mr-3 btn-lg" style="text-transform: capitalize; font-size: 14px;" @click.prevent="saveApplication()">Save Application</b-button>
                <b-button variant="danger" class="mt-3 btn-lg" style="text-transform: capitalize; font-size: 14px;" to="/admin-app">Back</b-button>
              </div>
            </b-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import utils from '@/services/utils'
import SideMenu from '@/components/admin/SideMenu'
import TitleBar from '@/components/admin/TitleBar'
import AppLogoUpload from '@/components/utils/AppLogoUpload'

export default {
  name: 'ConnectApplication',
  components: {
    AppLogoUpload,
    SideMenu,
    TitleBar
  },
  data () {
    return {
      loading: true,
      useDefaultLogo: false,
      projectId: null,
      loaded: false,
      dims: { width: 250, height: 250 },
      project: {
        logo: require('@/assets/img/Group 15980.svg'),
        contractName: '',
        contractAddress: '',
        mintPrice: '',
        title: '',
        description: ''
      },
      contentModel1: {
        title: 'Upload logo <br/> (250x250 px)',
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
  watch: {
    'project.title' (val) {
      this.project.contractName = (val) ? val.toLowerCase().replaceAll(' ', '_') : ''
    }
  },
  mounted () {
    this.projectId = this.$route.params.projectId
    if (!this.projectId) {
      this.loaded = true
    } else {
      this.$store.dispatch('projectStore/findProjectByProjectId', this.projectId).then((project) => {
        if (!project) {
          this.$router.push('/404')
          return
        }
        this.project = project
        this.setImage(project.imageUrl)
        if (project.imageUrl) this.project.logo = project.imageUrl
        this.project.contractName = project.projectId.split('.')[1]
        this.project.contractAddress = project.projectId.split('.')[0]
        this.loaded = true
      })
    }
    this.project.contractAddress = this.$store.getters[APP_CONSTANTS.KEY_PROFILE].stxAddress
  },
  methods: {
    useMyAddress: function () {
      this.project.contractAddress = this.$store.getters[APP_CONSTANTS.KEY_PROFILE].stxAddress
    },
    setByEventLogo1 (data) {
      this.files = data.media
    },
    setImage (trialImage) {
      if (!trialImage) {
        trialImage = this.defaultBadge
      }
      const $self = this
      utils.fetchBase64FromImageUrl(trialImage, document).then((data) => {
        $self.files = [{
          dataUrl: data.dataURL
        }]
      })
    },
    fileName () {
      if (this.files && this.files.length === 0) {
        return
      }
      const filename = this.files[0].name
      return filename.split(/\./)[0]
    },
    validate: function () {
      let result = true
      if (!this.project.title) {
        this.$notify({ type: 'error', title: 'Application', text: 'Please enter the title of your application' })
        result = false
      }
      if (!this.project.contractAddress) {
        this.$notify({ type: 'error', title: 'Application', text: 'Please enter the contract address of your application' })
        result = false
      }
      if (!this.project.contractName) {
        this.$notify({ type: 'error', title: 'Application', text: 'Please enter the contract name of your application' })
        result = false
      }
      if (!this.project.description) {
        this.$notify({ type: 'error', title: 'Application', text: 'Please enter a short description of your application' })
        result = false
      }
      if (!this.files.length > 0) {
        this.$notify({ type: 'error', title: 'Application', text: 'Please upload a logo for display purposes' })
        result = false
      }
      return result
    },
    valid () {
      return this.project.title && this.project.description
    },
    saveApplication: function () {
      if (this.doValidate && !this.validate()) return
      let imageData = this.defaultBadgeData
      if (this.files && this.files.length === 1) {
        imageData = utils.getBase64FromImageUrl(this.files[0].dataUrl)
      }
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      const data = {
        contractAddress: this.project.contractAddress,
        contractName: this.project.contractName,
        owner: profile.username,
        title: (this.project.title) ? this.project.title : 'my project',
        description: this.project.description
      }
      this.$store.dispatch(APP_CONSTANTS.DISP_SAVE_PROJECT, { project: data, imageData: imageData }).then((project) => {
        this.$router.push('/my-app/' + project.projectId)
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
    },
    bannerImage () {
      if (!this.files || this.files.length === 0) {
        return
      }
      return {
        padding: '0 0 0 0',
        height: '250px',
        width: '250px',
        'background-repeat': 'no-repeat',
        'background-image': `url(${this.files[0].dataUrl})`,
        'background-position': 'center center',
        '-webkit-background-size': 'cover',
        '-moz-background-size': 'cover',
        '-o-background-size': 'cover',
        'background-size': 'cover',
        opacity: 1
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
