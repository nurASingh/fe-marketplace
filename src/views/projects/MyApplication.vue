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
              <div v-if="project.interface">
                <div class="text-light" v-if="appmapProject">
                  Application registered (id={{appmapProject.appCounter}})
                </div>
                <div v-else>
                  connect app:
                  <a href="#" class="mr-3" @click.prevent="connectApp('risidio')">risidio</a>
                  <a href="#" class="" @click.prevent="connectApp('stacks')">stacks</a>
                </div>
              </div>
            </div>
            <a href="#" class="mr-3" @click.prevent="openApp(project)">edit</a>
            <a v-if="!project.interface" href="#" class="" @click.prevent="deleteApp(project)">delete</a>
          </div>
          <div class="text-light" v-if="project.interface">
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
          <div class="text-light" v-if="appmapProject">
            <div>{{appmapProject.baseTokenUri}}
              <div v-for="(asset, index) in appmapProject.assets" :key="index">
                <pre>Owner: {{asset.owner}}</pre>
                <pre>Asset hash: {{asset.assetHash}}</pre>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
  <b-modal scrollable id="app-modal" title="Connecting Contract">
    <div class="row">
      <div class="col-12 my-1">
        <p>{{result}}</p>
      </div>
    </div>
  </b-modal>
</div>
</template>

<script>
import SideMenu from '@/components/admin/SideMenu'
import TitleBar from '@/components/admin/TitleBar'
import { APP_CONSTANTS } from '@/app-constants'
import {
  intCV,
  bufferCV
} from '@stacks/transactions'

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
      result: null,
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
    connectApp: function (provider) {
      const appmapContractId = this.$store.getters[APP_CONSTANTS.KEY_APP_MAP_CONTRACT_ID]
      const owner = this.$store.getters[APP_CONSTANTS.KEY_PROFILE].username
      // const cvOwner = bufferCVFromString(owner) // (Buffer.from(owner, 'hex'))
      // const cvProjId = bufferCVFromString(this.projectId) // bufferCV(Buffer.from(utils.stringToHex(this.projectId)))
      // const storage = intCV(0x00)

      // const functionArgs = [cvOwner, cvProjId] // , cvProjId] // , intCV(0x00)]
      // const functionArgs = ClarityValue[bufferCV(Buffer.from('somestring'))]
      // const functionArgs = utils.getClarityValueArray([cvOwner, cvProjId, intCV(0x00)]) // [cvOwner, cvProjId, intCV(0x00)]
      const functionArgs = [bufferCV(Buffer.from(owner)), bufferCV(Buffer.from(this.projectId)), intCV(0)]
      const data = {
        contractAddress: appmapContractId.split('.')[0],
        contractName: appmapContractId.split('.')[1],
        functionName: 'register-app',
        functionArgs: functionArgs,
        eventCode: 'connect-application'
      }
      data.provider = provider
      this.connectApplication(data) // $emit('updateEventCode', data)
    },
    connectApplication (data) {
      /**
      const bufArr = []
      for (let i = 0; i < data.functionArgs.length; i++) {
        const element = data.functionArgs[i]
        if (element.startsWith('0x')) {
          bufArr.push(intCV(element))
        } else {
          bufArr.push(bufferCV(Buffer.from(element)))
        }
      }
      data.functionArgs = bufArr
      **/
      const method = (data.provider === 'risidio') ? 'stacksStore/callContractRisidio' : 'stacksStore/callContractBlockstack'
      this.$store.dispatch(method, data).then((result) => {
        this.result = result
        this.$bvModal.show('app-modal')
      }).catch((error) => {
        this.result = error
        this.$bvModal.show('app-modal')
      })
    },
    /**
    connectApplication (data) {
      this.$store.dispatch('stacksStore/callContractRisidio', data).then((result) => {
        console.log(result)
      }).catch((result) => {
        console.log(result)
      })
    },
    **/
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
