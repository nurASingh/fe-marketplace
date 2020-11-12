<template>
<div v-if="content" id="homepage">
  <div :style="bannerImage" class="pt-5 d-flex align-items-center flex-column">
    <div class="my-auto text-white text-center">
        <prismic-rich-text class="title-container"
          :field="content.header"
        />
        <div class="homepage__buttons--container">
          <button class="button-primary"><span v-html="content.header_buttons[0].button1[0].text"></span></button>
          <button class="button-secondary"><span v-html="content.header_buttons[0].button2[0].text"></span></button>
        </div>
    </div>
  </div>
  <!-- Items Section -->
  <div class="container" v-if="content" :key="componentKey">
    <div class="d-flex justify-content-center main-search">
      <div class="text-center no-wrap main-search--border">
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
              <div class="dropdown__whitespace"></div>
              <div class="dropdown__filler"></div>
              <div class="dropdown__items">
                <b-dropdown-item></b-dropdown-item>
                <b-dropdown-item>Application</b-dropdown-item>
                <b-dropdown-item>Artist</b-dropdown-item>
                <b-dropdown-item>Collection</b-dropdown-item>
                <b-dropdown-item>On Auction</b-dropdown-item>
                <b-dropdown-item>On Sale</b-dropdown-item>
              </div>
            </b-dropdown>
          </template>
          <b-form-input v-model="query"  size="sm" class="mr-sm-2" placeholder="Looking for something in particular?"></b-form-input>
        </b-input-group>
      </div>
    </div>
    <div class="d-flex justify-content-center homepage__categories">
      <div :class="isActive('discover')"><a href="#" @click.prevent="category = 'discover'">Discover</a></div>
      <div :class="isActive('popular')"><a href="#" @click.prevent="category = 'popular'">Popular</a></div>
      <div :class="isActive('collections')"><a href="#" @click.prevent="category = 'collections'">Collections</a></div>
      <div :class="isActive('artists')"><a href="#" @click.prevent="category = 'artists'">Artists</a></div>
      <div :class="isActive('applications')"><a href="#" @click.prevent="category = 'applications'">Applications</a></div>
    </div>
    <div class="row mb-4">
      <div v-for="(item, index) in block1Items" :key="index" class="col-lg-3 col-md-4 col-6" >
        <!--<div @mouseleave="hoverOut()" @mouseover="hoverIn(index)" class="mb-4">-->
          <div class="mb-4 homepage__items">
            <img width="100%" :src="item.b1_image1.url"/>
            <!--<div class="homepage__items--description" v-if="dHover[index]" v-html="item.b1_text1[0].text"></div>-->
            <div class="homepage__items--overlay">
              <a href="#" class="homepage__items--like-btn"><b-icon icon="heart"></b-icon></a>
              <div class="homepage__items--description">
                <div class="d-flex justify-content-between">
                  <div class="homepage__items--title">Block 1 Item 1</div>
                  <div class="homepage__items--amount">Σ 0.5</div>
                </div>
                <div class="d-flex justify-content-between">
                  <div class="homepage__items--by">By <span class="homepage__items--artist">Alice</span></div>
                  <div class="homepage__items--price">£1.50</div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
  <div class="d-flex justify-content-center homepage__categories--more-button">
    <button class="button-primary">See more collectables</button>
  </div>
  <div class="container"><div class="homepage__divider"></div></div>
  <!-- Applications Section -->
  <div class="container d-flex justify-content-lg-between justify-content-center homepage__applications">
    <div class="homepage__applications--whitespace d-lg-block d-none"></div>
    <div>
      <h3>Featured Applications</h3>
    </div>
    <div class="homepage__applications--view-all d-lg-block d-none">
      <a class="text-info">View all applications <b-icon icon="caret-right-fill"/></a>
    </div>
  </div>
  <div class="container my-5" v-if="content">
    <div class="row">
      <div v-for="(item, index1) in block2Items" :key="index1" class="col-md-3 col-6 homepage__applications--item">
        <div class="mb-4">
          <img width="50%" :src="content.block1[index1].b1_image1.url"/>
          <img width="50%" :src="content.block1[index1 + 1].b1_image1.url"/>
          <img width="100%" :src="item.app_image.url"/>
          <div class="text-center" v-html="item.app_text[0].text"></div>
        </div>
      </div>
    </div>
    <!-- Mobile design for "View all applications" link -->
    <div class="d-lg-none d-flex justify-content-end homepage__applications--view-all">
      <a class="text-info">View all applications <b-icon icon="caret-right-fill"/></a>
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
<!-- Collections Section -->
<div class="container"><div class="homepage__divider"></div></div>
  <div class="container d-flex justify-content-lg-between justify-content-center mb-5 homepage__collections">
    <div class="homepage__collections--whitespace d-lg-block d-none"></div>
    <div>
      <h3>Featured Collections</h3>
    </div>
    <div class="homepage__collections--view-all d-lg-block d-none">
      <a class="text-info">View all collections <b-icon icon="caret-right-fill"/></a>
    </div>
  </div>
  <div class="container my-5" v-if="content">
    <div class="row">
      <div v-for="(item, index3) in block1Items" :key="index3" class="col-md-3 col-6" >
        <div class="mb-4 homepage__items" v-if="index3 < 4">
          <img width="100%" :src="item.b1_image1.url"/>
          <div class="homepage__items--overlay">
              <div class="homepage__items--description">
                <div class="homepage__items--title">Collection Name</div>
                <div class="homepage__items--by">by <span class="homepage__items--artist">Collector Username</span></div>
              </div>
            </div>
        </div>
      </div>
    </div>
    <!-- Mobile design for "View all collections" link -->
    <div class="d-lg-none d-flex justify-content-end homepage__collections--view-all">
      <a class="text-info">View all collections <b-icon icon="caret-right-fill"/></a>
    </div>
  </div>
  <div class="container"><div class="homepage__divider homepage__divider--categories"></div></div>
  <!-- Categories Section -->
  <section class="homepage__categories-sn">
    <div class="container">
      <h2 class="text-white text-center">Categories</h2>
      <div class="row justify-content-center">
        <div class="homepage__categories-sn--category"><img src="" alt=""><div class="homepage__categories-sn--text">Digital Art</div></div>
        <div class="homepage__categories-sn--category"><img src="" alt=""><div class="homepage__categories-sn--text">Trading Cards</div></div>
        <div class="homepage__categories-sn--category"><img src="" alt=""><div class="homepage__categories-sn--text">Certificates</div></div>
        <div class="homepage__categories-sn--category"><img src="" alt=""><div class="homepage__categories-sn--text">Digital Property</div></div>
        <div class="homepage__categories-sn--category"><img src="" alt=""><div class="homepage__categories-sn--text">Gaming</div></div>
      </div>
    </div>
  </section>
  <!-- Marketplace Section -->
  <div class="container flex-column align-items-center homepage__marketplace-section">
    <div class="row">
      <div class="col-12 text-center">
        <prismic-rich-text
          :field="content.info"
        />
        <div>
          <button class="button-primary button-primary--alternative-marketplace">How It Works</button>
          <button class="button-secondary button-secondary--alternative-marketplace">About Risidio</button>
        </div>
      </div>
    </div>
  </div>
  <!-- trading section with background -->
  <div :style="tradingImage" class="d-flex align-items-center flex-column homepage__trading-banner">
    <div class="my-auto text-white text-center">
        <prismic-rich-text
          :field="content.trading[0].trading_info"
        />
        <div class="homepage__buttons--container">
          <button class="button-primary"><span v-html="content.trading_buttons[0].button1[0].text"></span></button>
          <button class="button-secondary"><span v-html="content.trading_buttons[0].button2[0].text"></span></button>
        </div>
    </div>
  </div>
  <!-- news and blog section -->
  <div class="container homepage__blog-section">
    <h3 class="text-center mb-5">News and Blogs</h3>
    <div class="row">
      <div v-for="(item, index2) in content.blogs" :key="index2" class="col-md-3 col-sm-6 col-xs-12" >
        <div class="mb-5">
          <img width="100%" :src="item.image1.url"/>
          <div class="mt-3" v-html="item.words[0].text"></div>
        </div>
      </div>
    </div>
    <div class="text-center"><button class="button-primary button-primary--alternative-marketplace">Read More</button></div>
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
        return 'active'
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
        height: '465px',
        width: '100%',
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
<style lang="scss">
/* $info --> #50B1B5 */
#homepage {

  /* 1ST SECTION STYLE */
  & .title-container h1 {
    margin-bottom: 24px;
  }
  & .title-container h2 {
    margin-bottom: 38px;
  }
  & .homepage__buttons--container .button-primary {
    margin-right: 18px;
  }

  /* MAIN SEARCH BAR */
  & .main-search {
    margin-top: -28.5px;
    z-index: 2;
  }
  & .main-search--border {
    width: 100%;
    max-width: 800px;
  }

  /* MAIN SEARCH BAR -- INPUT */
  & .input-group {
    background: #FFFFFF;
    border: 1px solid #F5F5F5;
    border-radius: 36px;
    align-items: center;
    height: 57px;
    box-shadow: 0px 3px 6px #00000029;
  }
  & .input-group input {
    font-size: 11px;
    font-weight: 300;
    color: #000;
    height: 26px;
    padding: 0.25rem 25px;
    border-left: 1px solid #E5E5E5;
    border-top: none;
    border-right: none;
    border-bottom: none;
    border-radius: 0 !important;
    z-index: 2;
  }
  & .input-group input:focus {
    box-shadow: none;
  }

  /* MAIN SEARCH BAR -- BTN */
  & .main-search .btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 600;
    color: #000;
    text-transform: none;
    background: transparent;
    border: none;
    padding-left: 30px;
    padding-right: 30px;
    z-index: 2;
  }
  & .main-search .btn:focus {
    box-shadow: none;
  }
  & .main-search .btn.dropdown-toggle::after {
    font-size: 16px;
  }

  /* MAIN SEARCH BAR -- DROPDOWN MENU */
  & .input-group .dropdown-menu {
    width: 177px;
    margin: 0;
    padding: 0;
    border: none;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    position: absolute;
    top: -7px !important;
    left: 0;
    z-index: 1;
  }
  & .input-group .dropdown-menu .dropdown__whitespace {
    height: 30px;
    border: none;
    background: transparent;
  }
  & .input-group .dropdown-menu .dropdown__filler {
    height: 27px;
    border: none;
    border-left: 1px solid #F5F5F5;
    background: #fff;
  }
  & .input-group .dropdown-menu .dropdown__items {
    padding: 0 0 20px;
    border-top: none;
    border-bottom: 1px solid #F5F5F5;
    border-right: 1px solid #F5F5F5;
    border-left: 1px solid #F5F5F5;
    border-radius: 0 0 26px 26px;
    background: #fff;
    box-shadow: 0px 3px 6px -1px rgba(0, 0, 0, 0.161);
  }
  & .input-group .dropdown-menu.show {
    transform: none !important;
  }
  & .input-group .dropdown-item {
    padding: 0 30px;
  }
  & .input-group li:not(:last-child) .dropdown-item {
    margin-bottom: 15px;
  }
  & .input-group li:first-child .dropdown-item {
    border-top: 1px solid #F5F5F5;
    padding-top: 18px;
  }

  /* MAIN SEARCH BAR -- LOOP ICON */
  & .input-group-append svg {
    font-size: 20px;
    font-weight: bold;
    color: #50B1B5;
    margin-right: 22px;
    margin-left: 1px;
  }

  /* CATEGORIES BUTTONS */
  & .homepage__categories {
    border-bottom: 1px solid #E3E3E3;
    margin: 42px 0;
  }
  & .homepage__categories a {
    font-size: 12px;
    font-weight: 700;
    color: #000;
  }
  & .homepage__categories a {
    margin: 0 20px;
  }
  & .homepage__categories .active a {
    color: #50B1B5;
  }
  & .homepage__categories div {
    padding-bottom: 14.5px;
  }
  & .homepage__categories .active {
    border-bottom: 2px solid #50B1B5;
  }
  & .homepage__categories--more-button {
    margin-top: 38px;
  }

  & .homepage__divider {
    margin: 50px 0;
    border-bottom: 1px solid #E3E3E3;
  }

  /* ITEMS STYLE */
  & .homepage__items {
    position: relative;
    width: 100%;
  }

  & .homepage__items--overlay {
    display: flex;
    align-items: flex-end;
    position: absolute;
    width: 100%;
    height: 100%;
    bottom: 0;
    cursor: pointer;
  }

  & .homepage__items--description {
    width: 100%;
    padding: 11px 18px;
    color: #fff;
    text-shadow: 0px 3px 6px #00000029;
    background: #50B1B5;
    opacity: 0;
    transition: opacity ease 0.3s;
  }

  & .homepage__items--overlay:hover .homepage__items--description {
    opacity: 0.95;
  }

  & .homepage__items--title {
    font-size: 14px;
    font-weight: 400;
  }

  & .homepage__items--amount {
    font-size: 12px;
    font-weight: 600;
    align-self: center;
  }

  & .homepage__items--by {
    font-size: 10px;
    font-weight: 300;
  }

  & .homepage__items--artist {
    font-size: 10px;
    font-weight: 700;
  }

  & .homepage__items--price {
    font-size: 9px;
    font-weight: 400;
  }

  & .homepage__items--like-btn {
    position: absolute;
    top: 0;
    right: 0;
    color: #FFFFFF;
    font-size: 13px;
    background-color: #50B1B5;
    padding: 10px 13px;
    border-radius: 50%;
  }

  /* APPLICATION SECTION */
  & .homepage__applications {
    margin-bottom: 42px;
  }

  & .homepage__applications--view-all {
    align-self: center;
    font-size: 11px;
    font-weight: 700;
  }

  & .homepage__applications--whitespace {
    width: 121.45px;
    visibility: hidden;
  }

  & .homepage__applications--item div.text-center div {
    font-size: 13px;
    font-weight: 500;
    margin: 20px 0 8px;
  }

  & .homepage__applications--item p {
    font-size: 10px;
    font-weight: 300;
    text-align: center;
  }

    & .homepage__applications--item p span {
    font-size: 10px;
    font-weight: 700;
  }

  /* COLLECTIONS SECTION */
  & .homepage__collections {
    margin-bottom: 42px;
  }

  & .homepage__collections--view-all {
    align-self: center;
    font-size: 11px;
    font-weight: 700;
  }

  & .homepage__collections--whitespace {
    width: 90.29px;
    visibility: hidden;
  }

  /* CATEGORIES SECTION */
  & .homepage__divider--categories {
    margin-bottom: 70px;
  }

  & .homepage__categories-sn {
    background: transparent linear-gradient(180deg, #220E95 0%, #071764 100%);
  }
  & .homepage__categories-sn .container {
    padding-top: 50px;
    padding-bottom: 50px;
  }
  & .homepage__categories-sn h2 {
    margin-bottom: 35px;
  }
  & .homepage__categories-sn--category {
    width: 208px;
    height: 180px;
    background-color: rgba(95, 189, 193, 0.1);
    border-radius: 25px;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
  }
  & .homepage__categories-sn--category {
    margin: 0 10px 12px;
  }
  & .homepage__categories-sn--text {
    font-size: 16px;
    color: #fff;
    margin-top: 20px;
  }

  /* MARKETPLACE SECTION */
  & .homepage__marketplace-section {
    padding-top: 120px;
    padding-bottom: 120px;
  }
  & .homepage__marketplace-section h1 {
    margin-bottom: 24px;
  }
  & .homepage__marketplace-section h2 {
    margin-bottom: 0;
  }
  & .homepage__marketplace-section p {
    text-align: center;
    margin: 30px auto;
    width: 50%;
  }
  & .button-primary--alternative-marketplace {
    width: 141px;
    margin-right: 20px;
  }
  & .button-secondary--alternative-marketplace {
    width: 141px;
    background-color: rgba(80, 177, 181, 0.1);
  }

  /* TRADING SECTION */
  & .homepage__trading-banner h1 {
    margin-bottom: 24px;
  }
  & .homepage__trading-banner .homepage__buttons--container .button-primary {
    margin-right: 20px;
    margin-top: 22px;
  }

  /* BLOG SECTION */
  & .homepage__blog-section {
    padding-top: 120px;
    padding-bottom: 120px;
  }
  & .homepage__blog-section p {
    font-size: 17px;
    font-weight: 500;
  }

}

/* MOBILE DESIGN */
@media only screen and (max-width: 499px) {
  #homepage {

  /* CATEGORIES SECTION */
  & .homepage__categories a {
    font-size: 10px;
    margin: 0 10px;
  }

  /* MARKETPLACE SECTION */
  & .homepage__marketplace-section p {
    width: 100%;
  }

  /* BUTTONS ON 1ST SECTION AND TRADING BANNER */
  & .homepage__buttons--container {
    display: flex;
    flex-flow: column;
    align-items: center;
  }
  & .homepage__buttons--container .button-primary, .homepage__trading-banner .homepage__buttons--container .button-primary {
    width: 156px;
    margin-bottom: 14px;
    margin-right: 0;
  }
  & .homepage__buttons--container .button-secondary {
    width: 126px;
  }

  /* BLOG SECTION */
  & .homepage__blog-section {
    width: 80%;
  }

  }
}

@media only screen and (max-width: 359px) {
  #homepage .homepage__categories a {
    font-size: 10px;
    margin: 0 7px;
  }
}
</style>
