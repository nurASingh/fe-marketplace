<template>
<div>
  <div class="row mb-5">
    <side-menu class="col-3 mr-0 pr-0 pt-5"/>
    <div class="col-9 pt-5">
      <title-bar class="container" v-on="$listeners"/>
      <div class="container" @click="$emit('toggle-off-navbar')">
        <div class="pl-4">
          <p class="text-light">My Application</p>
          <div class="row my-5">
            <div class="col-4">
              <img width="250px" height="250px" :src="project.imageUrl"/>
            </div>
            <div class="col-8">
              <p>App Name: {{project.title}}</p>
              <p>Contract Id: <br/><span style="font-size: 12px;">{{project.projectId}}</span></p>
              <p>Owner: {{project.owner}}</p>
              <p>Description: {{project.description}}</p>
              <p>TxId: {{project.txId}}</p>
              <p>
                <a href="#" class="mr-3" @click.prevent="openApp(project)">edit</a>
                <a v-if="!project.txId" href="#" class="" @click.prevent="deleteApp(project)">delete</a>
                <a v-if="project.txId && !appmapProject" href="#" class="" @click.prevent="connectApp(project)">connect app</a>
              </p>
            </div>
          </div>
          <div class="text-light" v-if="appmapProject">
            Connected to appmap {{appmapProject}}
          </div>
          <div class="text-light" v-if="project.txId">
            Explorer: <a :href="openContractUrl()" target="_blank">{{project.projectId}}</a>
            <div v-if="showContractData">
              <pre class="source-code">{{project.codeBody}}</pre>
            </div>
          </div>
          <div v-else>
            <div class="mb-5">
              <h2>Deploy a contract</h2>
              <h4>Contract Id: <br/>{{project.projectId}}</h4>
              <p>Click 'I need a contract' to customise a smart contract template and deploy to the Stacks blockchain.
                If you have a contract which conforms to the interface click 'I have a contract'.</p>
              <b-button :to="'/upload-contract/' + project.projectId" variant="info" class="mt-3 mr-3 btn-lg" style="text-transform: capitalize; font-size: 14px;">I Have a Contract</b-button>
              <b-button :to="'/customise-contract/' + project.projectId" variant="warning" class="mt-3 btn-lg" style="text-transform: capitalize; font-size: 14px;">I Need a Contract</b-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <b-modal scrollable id="contract-modal" title="Looking for contract">
    <div class="row">
      <div class="col-12 my-1">
        <p>If you've deployed your contract using <a :href="openContractUrl()" target="_blank">explorer</a> check it has the correct contract Id.
        You can edit the contract id on the <router-link :to="'/connect-app/' + project.projectId">in project details</router-link></p>
      </div>
      <div class="col-12 my-1">
        <p>Looking for contract: {{projectId}}</p>
      </div>
    </div>
  </b-modal>
</div>
</template>

<script>
import SideMenu from '@/components/admin/SideMenu'
// import utils from '@/services/utils'
import TitleBar from '@/components/admin/TitleBar'
import { APP_CONSTANTS } from '@/app-constants'
import {
  bufferCV
} from '@blockstack/stacks-transactions'

const STACKS_API = process.env.VUE_APP_API_STACKS

export default {
  name: 'MyApplication',
  components: {
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
      showContractData: false
    }
  },
  mounted () {
    this.projectId = this.$route.params.projectId
    /**
    this.$store.dispatch('projectStore/findProjectByProjectId', this.projectId).then((project) => {
      this.project = project
      this.lookupContract()
      this.loaded = true
    })
    **/
  },
  methods: {
    connectApp: function () {
      const appmapContractId = this.$store.getters[APP_CONSTANTS.KEY_APP_MAP_CONTRACT_ID]
      const owner = this.$store.getters[APP_CONSTANTS.KEY_PROFILE].username
      const cvOwner = bufferCV(owner) // (Buffer.from(owner, 'hex'))
      // const cvProjId = bufferCVFromString(this.projectId) // bufferCV(Buffer.from(utils.stringToHex(this.projectId)))
      // , intCV(0x00)
      // const functionArgs = [cvOwner, cvProjId] // , cvProjId] // , intCV(0x00)]
      const args = [bufferCV(Buffer.from('815'))]
      // const functionArgs = [cvOwner] // , cvProjId] // , intCV(0x00)]
      const data = {
        contractAddress: appmapContractId.split('.')[0],
        contractName: appmapContractId.split('.')[1],
        functionName: 'add-app',
        functionArgs: args,
        eventCode: 'connect-application'
      }
      this.$emit('updateEventCode', data)
    },
    openContractUrl () {
      if (this.projectId) {
        return STACKS_API + '/v2/contracts/source/' + this.projectId.split('.')[0] + '/' + this.projectId.split('.')[1] + '?proof=0'
      }
    },
    openApp (project) {
      if (project.projectId) {
        this.$router.push('/connect-app/' + project.projectId)
      } else {
        // this.$notify({ type: 'error', title: 'Project', text: 'Unable to open project - no project id.' })
      }
    }
  },
  computed: {
    project () {
      let project = this.$store.getters[APP_CONSTANTS.KEY_MY_PROJECT](this.projectId)
      if (!project) {
        project = {
          imageUrl: require('@/assets/img/Group 15980.svg'),
          mintPrice: '',
          title: '',
          description: ''
        }
      }
      return project
    },
    appmapProject () {
      const appmap = this.$store.getters[APP_CONSTANTS.KEY_APP_MAP_PROJECT](this.projectId)
      return appmap
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
