<template>
<div v-if="content" >
  <div :style="bannerImage" class="pt-5 d-flex align-items-center flex-column">
    <div class="my-auto text-white text-center">
        <prismic-rich-text
          :field="content.header"
        />
        <div>
          <b-button class="mr-3"><span v-html="content.header_buttons[0].button1[0].text"></span></b-button>
          <b-button class="ml-3"><span v-html="content.header_buttons[0].button2[0].text"></span></b-button>
        </div>
    </div>
  </div>
  <div class="d-flex justify-content-center main-search">
    <div class="text-center no-wrap">
      <b-input-group>
        <template v-slot:append>
          <a href="#"  @click.prevent="doSearch"><b-icon icon="search"/></a>
        </template>
        <template v-slot:prepend>
          <b-dropdown caret>
            <!-- Using 'button-content' slot -->
            <template v-slot:button-content>
              <span>Search by</span>
            </template>
            <b-dropdown-item></b-dropdown-item>
            <b-dropdown-item>Application</b-dropdown-item>
            <b-dropdown-item>Artist</b-dropdown-item>
            <b-dropdown-item>Collection</b-dropdown-item>
            <b-dropdown-item>On Auction</b-dropdown-item>
            <b-dropdown-item>On Sale</b-dropdown-item>
          </b-dropdown>
        </template>
        <b-form-input v-model="query"  size="sm" style="width: 500px" class="mr-sm-2" placeholder=""></b-form-input>
      </b-input-group>
    </div>
  </div>
  <div class="mt-5 d-flex justify-content-center main-search">
    <div><a class="mx-2" :class="isActive('discover')" href="#" @click.prevent="category = 'discover'">Discover</a></div>
    <div><a class="mx-2" :class="isActive('popular')" href="#" @click.prevent="category = 'popular'">Popular</a></div>
    <div><a class="mx-2" :class="isActive('collections')" href="#" @click.prevent="category = 'collections'">Collections</a></div>
    <div><a class="mx-2" :class="isActive('artists')" href="#" @click.prevent="category = 'artists'">Artists</a></div>
    <div><a class="mx-2" :class="isActive('applications')" href="#" @click.prevent="category = 'applications'">Applications</a></div>
  </div>

  <div class="container" v-if="content" :key="componentKey">
    <div class="row mb-4">
      <div v-for="(item, index) in block1Items" :key="index" class="col-md-3 col-sm-4 col-xs-6" >
        <div @mouseleave="hoverOut()" @mouseover="hoverIn(index)" class="mb-4">
          <img width="100%" :src="item.b1_image1.url"/>
          <div class="desc-text" v-if="dHover[index]" v-html="item.b1_text1[0].text"></div>
        </div>
      </div>
    </div>
  </div>
  <div class="d-flex justify-content-center my-5">
    <div class="text-center no-wrap">
      <b-button>See more collectables</b-button>
    </div>
  </div>

  <div class="container d-flex justify-content-between my-5">
    <div class="text-center no-wrap">&nbsp;</div>
    <div class="text-center no-wrap">
      <h1>Featured Applications</h1>
    </div>
    <div class="text-right no-wrap">
      <a class="text-info">View all applications <b-icon icon="caret-right-fill"/></a>
    </div>
  </div>
  <div class="container my-5" v-if="content">
    <div class="row">
      <div v-for="(item, index1) in block2Items" :key="index1" class="col-md-3 col-sm-6 col-xs-12" >
        <div class="mb-4">
          <img width="50%" :src="content.block1[index1].b1_image1.url"/>
          <img width="50%" :src="content.block1[index1 + 1].b1_image1.url"/>
          <img width="100%" :src="item.app_image.url"/>
          <div class="text-center" v-html="item.app_text[0].text"></div>
        </div>
      </div>
    </div>
  </div>
<!--
  <div class="container d-flex justify-content-between my-5">
    <div class="text-center no-wrap">&nbsp;</div>
    <div class="text-center no-wrap">
      <h1>Featured Collections</h1>
    </div>
    <div class="text-right no-wrap">
      <a class="text-info">View all collections <b-icon icon="caret-right-fill"/></a>
    </div>
  </div>
  <div class="container my-5" v-if="content">
    <div class="row">
      <div v-for="(item, index2) in block1Items" :key="index2" class="col-md-3 col-sm-6 col-xs-12" >
        <div class="mb-4">
          <img width="50%" :src="content.block1[index2].b1_image1.url"/>
          <img width="50%" :src="content.block1[index2 + 1].b1_image1.url"/>
          <img width="50%" :src="content.block1[index2 + 2].b1_image1.url"/>
          <img width="50%" :src="content.block1[index2 + 3].b1_image1.url"/>
          <div class="text-center" v-html="item.app_text[0].text"></div>
        </div>
      </div>
    </div>
  </div>
-->

  <div class="container d-flex justify-content-between my-5">
    <div class="text-center no-wrap">&nbsp;</div>
    <div class="text-center no-wrap">
      <h1>Featured Artists</h1>
    </div>
    <div class="text-right no-wrap">
      <a class="text-info">View all artists <b-icon icon="caret-right-fill"/></a>
    </div>
  </div>
  <div class="container my-5" v-if="content">
    <div class="row">
      <div v-for="(item, index3) in block1Items" :key="index3" class="col-md-3 col-sm-6 col-xs-12" >
        <div class="mb-4" v-if="index3 < 4">
          <img width="100%" :src="item.b1_image1.url"/>
          <div class="desc-text" v-html="item.b1_text1[0].text"></div>
        </div>
      </div>
    </div>
  </div>

  <div class="pt-5 d-flex align-items-center flex-column mx-5" style="height: 70vh; border-top: 1pt solid #d3e7e8;">
    <div class="my-auto text-dark text-center">
      <prismic-rich-text
        :field="content.info"
      />
    </div>
  </div>
  <!-- trading section with background -->
  <div :style="tradingImage" class="pt-5 d-flex align-items-center flex-column">
    <div class="my-auto text-white text-center">
        <prismic-rich-text
          :field="content.trading[0].trading_info"
        />
        <div>
          <b-button class="mr-3"><span v-html="content.trading_buttons[0].button1[0].text"></span></b-button>
          <b-button class="ml-3"><span v-html="content.trading_buttons[0].button2[0].text"></span></b-button>
        </div>
    </div>
  </div>
  <!-- news and blog section -->
  <div class="container">
    <div class="row">
      <div v-for="(item, index2) in content.blogs" :key="index2" class="col-md-3 col-sm-6 col-xs-12" >
        <div class="mb-4">
          <img width="100%" :src="item.image1.url"/>
          <div class="text-center" v-html="item.words[0].text"></div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'Homepage',
  components: {
  },
  data () {
    return {
      query: null,
      componentKey: 0,
      category: 'discover',
      dHover: [false, false, false, false, false, false, false, false, false, false, false, false]
    }
  },
  mounted () {
    this.loading = false
  },
  methods: {
    hoverIn (index) {
      this.dHover[index] = true
      this.componentKey += 1
    },
    hoverOut () {
      this.dHover = [false, false, false, false, false, false, false, false, false, false, false, false]
      this.componentKey += 1
    },
    doSearch () {
      if (this.$route.name !== 'marketplace') {
        this.$router.push('/marketplace')
      }
      this.$store.dispatch('searchStore/findBySearchTerm', this.query)
    },
    isActive (category) {
      if (this.category === category) {
        return 'text-success'
      }
      return ''
    },
    explore () {
      this.$router.push('/marketplace')
    }
  },
  computed: {
    bannerImage () {
      const content = this.$store.getters['contentStore/getHomepage']
      if (!content) {
        return
      }
      return {
        'z-index': -1,
        padding: '0 0 0 0',
        height: '378px',
        width: '100%',
        position: 'relative',
        top: '-78px',
        'background-repeat': 'no-repeat',
        'background-image': `url(${content.image.url})`,
        'background-position': 'center center',
        '-webkit-background-size': 'cover',
        '-moz-background-size': 'cover',
        '-o-background-size': 'cover',
        'background-size': 'cover',
        opacity: 1
      }
    },
    tradingImage () {
      const content = this.$store.getters['contentStore/getHomepage']
      if (!content) {
        return
      }
      return {
        'z-index': -1,
        padding: '0 0 0 0',
        height: '378px',
        width: '100%',
        position: 'relative',
        top: '-78px',
        'background-repeat': 'no-repeat',
        'background-image': `url(${content.trading[0].trading_image.url})`,
        'background-position': 'center center',
        '-webkit-background-size': 'cover',
        '-moz-background-size': 'cover',
        '-o-background-size': 'cover',
        'background-size': 'cover',
        opacity: 1
      }
    },
    sectionDimensions () {
      const height = this.$store.getters[APP_CONSTANTS.KEY_SECTION_HEIGHT]
      return 'min-height: ' + height + 'px; width: auto;'
    },
    block2Items () {
      const content = this.$store.getters['contentStore/getHomepage']
      return content.block2
    },
    block1Items () {
      const content = this.$store.getters['contentStore/getHomepage']
      return content.block1
    },
    content () {
      const content = this.$store.getters['contentStore/getHomepage']
      return content
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/custom.scss";
.main-search {
  position: relative;
  top: -100px;
}
.desc-text {
  position: absolute;;
  width: 256px;
  bottom: 23px;
  background: $success;
  padding: 5px;
  height: 56px;
  background: #50B1B5 0% 0% no-repeat padding-box;
  opacity: 0.95;
  color: #fff;
}
</style>
