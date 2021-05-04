<template>
<div>
  <div class="create-contract">
    <b-form >
        <div>
          <div v-if="!uploadable" class="text-info pt-5 create-container text-center">
            <div>
              <div style="font-size: 32px;">+</div>
              <media-files-upload style="font-size: 1.6rem; cursor: pointer;" class="" @lookupEvent="$emit('lookup-event')" :readonly="false" :contentModel="contentModel1" popoverId="'popover-target-1'" :parentalError="parentalError" :showFiles="true" :mediaFiles="mediaFiles1" :limit="1" :sizeLimit="2000000" :mediaTypes="'plain'" @updateMedia="setByEventLogo1($event)"/>
            </div>
          </div>
          <div v-if="uploadable">
            <div>
              <div class="mb-3">
                <b-textarea
                  ref="contractCode"
                  :value="decodedString"
                  class="py-4 my-3 my-input"
                  rows="10"
                  placeholder="Contract Code"
                ></b-textarea>
              </div>
              <div class="mt-3 d-flex justify-content-start">
                <b-button variant="info" class="mr-3 text-white" @click="deployContract()">Deploy</b-button>
                <b-button variant="outline-dark" class="text-dark " @click="cancelUpload()">Cancel</b-button>
              </div>
            </div>
          </div>
        </div>
    </b-form>
    <pre class="mt-3 mb-0">{{ result }}</pre>
  </div>
  <b-modal id="modal-err" title="Contract Not Deployed">
    <div class="row">
      <div class="col-12 my-1">
        <div class="mb-3">Error: {{result}}</div>
      </div>
    </div>
  </b-modal>
</div>
</template>

<script>
import MediaFilesUpload from '@/components/utils/MediaFilesUpload'

const NETWORK = process.env.VUE_APP_NETWORK

export default {
  name: 'DeployContractFromFile',
  components: {
    MediaFilesUpload
  },
  watch: {
  },
  props: ['project'],
  data () {
    return {
      feeAmount: 3000,
      txData: null,
      nonce: 0,
      loading: true,
      parentalError: null,
      result: null,
      contentModel1: {
        title: 'Browse computer for contract to deploy',
        errorMessage: 'A file is required.',
        popoverBody: 'Your clarity  file.'
      },
      files: []
    }
  },
  mounted () {
    this.loading = false
  },
  methods: {
    setByEventLogo1 (data) {
      this.files = data.media
    },
    plainFile () {
      if (this.files.length === 0) {
        return
      }
      const sub = 'data:application/octet-stream;base64,'
      const octets = this.files[0].dataUrl.substring(sub.length)
      const decodedString = atob(octets)
      return decodedString
    },
    cancelUpload () {
      this.files = []
    },
    deployContract: function () {
      if (!this.validate(this.project, this.plainFile())) {
        return
      }
      // contractName = this.this.files[0].name.split(/\./)[1]
      const projectPlus = this.project
      projectPlus.network = NETWORK
      projectPlus.codeBody = this.plainFile()
      this.$store.dispatch('rpayStacksStore/deployProjectContract', projectPlus).then((project) => {
        this.$emit('deployed', { error: false, project: project })
      }).catch((error) => {
        this.result = error
        // this.$emit('deployed', { error: true, reason: error })
        this.$bvModal.show('modal-err')
        // this.$notify({ type: 'error', title: 'Contracts', text: error })
      })
    },
    validate: function (project, file) {
      let result = true

      if (!file) {
        this.$notify({ type: 'error', title: 'Contract Error', text: 'Load the contract source code to continue.' })
        result = false
      }
      if (!project || !project.projectId) {
        this.$notify({ type: 'error', title: 'Contract Error', text: 'Load the contract source code to continue.' })
        result = false
      }
      const contractAddress = project.projectId.split('.')[0]
      if (!contractAddress || !contractAddress.startsWith('S')) {
        this.$notify({ type: 'error', title: 'Contract Error', text: 'The contract address must be present and must start with an S.' })
        result = false
      }
      let contractName = this.files[0].name.split(/\./)[0]
      if (!contractName) {
        contractName = project.projectId.split('.')[1]
      }
      if (!contractName || contractName.length < 3) {
        this.$notify({ type: 'error', title: 'Contract Error', text: 'The contract name must be present and at least 2 characters long.' })
        result = false
      }
      return result
    }
  },
  computed: {
    fileName () {
      if (this.files.length === 0) {
        return
      }
      const filename = this.files[0].name
      return filename.split(/\./)[0]
    },
    mediaFiles1 () {
      let files = []
      if (this.files.length > 0) {
        files = this.files
      }
      return files
    },
    decodedString () {
      if (this.files.length === 0) {
        return
      }
      const sub = 'data:application/octet-stream;base64,'
      const octets = this.files[0].dataUrl.substring(sub.length)
      const decodedString = atob(octets)
      return decodedString
    },
    uploadable () {
      return this.files && this.files.length > 0
    }
  }
}
</script>
<style lang="scss" scoped>
.create-container {
  width: 200px;
  height: 200px;
  margin: auto auto;
}
.my-input {
  background: #fff 0% 0% no-repeat padding-box;
  border-radius: 0px;
  border: none;
  padding: 50px 20px;
  color: #000;
}
</style>
