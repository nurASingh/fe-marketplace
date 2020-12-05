<template>
<div class="container-fluid mt-5" style="background-color: #F5F5F5;">
<section class="container" v-if="content">
  <!-- Vue conditional to check if there is any content in document -->
  <div class="row"><div class="col-lg-8"></div></div>
  <div class="row bg-white">
    <div class="col-lg-8">
      <div class="row">
        <div class="mt-0 pt-4 pb-5 col-lg-12">
          <div class="row">
            <div class="col-lg-4">
              <img height="auto" width="100%" :src="content.blog_home_image.url" />
            </div>
            <div class="col-lg-8">
              <h1 class="mb-5">{{ $prismic.richTextAsPlain(content.title) }}</h1>
              <p class="">
                {{ Intl.DateTimeFormat('en-US', dateOptions).format(new Date(content.date)) }} &middot; {{ author }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
          <div class="pt-5 pb-5 col-lg-10">
            <!-- Slice Block Componenet tag -->
            <div class="post-body">
              <slices-block :slices="slices" class="outer-container"/>
            </div>
          </div>
          <!-- sidebar -->
      </div>
    </div>
    <div class="pt-5 col-lg-4 sidebar">
      <div class="footer__column-content">
        <h3 class="mt-5">How It Works</h3>
        <div><router-link to="/community?uid=user-journeys-stx-funds">Getting Testnet STX</router-link></div>
        <div><router-link to="/community?uid=user-journeys-manage-listings">Mint a Loop</router-link></div>
        <h3 class="mt-5">Other Stories</h3>
        <div><router-link to="/community?uid=lambda-v-stacks">Stacks vs AWS Lmbda</router-link></div>
        <div><router-link to="/community?uid=self-owned-identity">Decentralised Identity</router-link></div>
        <div><router-link to="/community?uid=how-it-works">User Data</router-link></div>
        <h3 class="mt-5">Up Close</h3>
        <div><router-link to="/community?uid=tech-tales-clarity-registry">Registry Clarity Contract</router-link></div>
        <div><router-link to="/community?uid=tech-tales-clarity-minting">Minting Clarity Contract</router-link></div>
      </div>
    </div>
  </div>
</section>
</div>
</template>

<script>
// Importing all the slices components
// import PrismicItems from '@/components/utils/PrismicItems'
import SlicesBlock from '@/components/SlicesBlock.vue'

export default {
  name: 'post',
  components: {
    // PrismicItems,
    SlicesBlock
  },
  data () {
    return {
      dateOptions: { year: 'numeric', month: 'short', day: '2-digit' },
      documentId: '',
      author: null,
      content: null,
      slices: []
    }
  },
  watch: {
    '$route' () {
      this.getContent(this.$route.query.uid)
    }
  },
  created () {
    this.getContent(this.$route.query.uid)
  },
  beforeRouteUpdate (to, from, next) {
    this.getContent(to.params.uid)
    next()
  },
  methods: {
    getContent (uid) {
      // Query to get post content
      this.$prismic.client.getByUID('post', uid).then((document) => {
        if (document) {
          this.content = document.data
          if (document.data.author && document.data.author.length > 0) {
            this.author = document.data.author[0].text
          }
          this.slices = document.data.body
        } else {
          this.getContent('lambda-v-stacks')
        }
      }).catch((err) => {
        console.log('huh? ' + err)
      })
    }
  },
  computed: {
  }
}
</script>

<style>
/* BANNER */
/* POST */
p {
  font-size: 1.5rem;
}
.post-body {
  color: #000;
  margin: 0 auto;
}
.post-body h3 {
  margin-bottom: 1.5rem;
}
.post-body a {
  color: #352bf5;
  text-decoration: none;
}
.post-body a:hover {
  text-decoration: underline;
}
.post-body a:hover {
  color: #352bf5;
  text-decoration: none;
}
.post-body a:hover {
  text-decoration: underline;
}
.post-body .back-bottom {
  margin-top: 2.5rem;
}
/* SIDEBAR */
.sidebar {
  background-color: #F5F5F5;
  padding: 3rem !important;
}
.sidebar h3 {
  color: #000;
  font-weight: 900;
  margin-bottom: 1.5rem;
}
.sidebar .filters {
  display: none;
}
.sidebar .blog-main {
  display: grid;
  grid-template-rows: repeat(2, max-content);
  grid-template-columns: repeat(auto-fill, minmax(280px, max-content));
  column-gap: 60px;
  justify-content: flex-start;
}
.sidebar .blog-post {
  margin-bottom: 2rem;
}
.sidebar button {
  width: 141px;
  height: 43px;
  background: #5FBDC1 0% 0% no-repeat padding-box;
  border-radius: 22px;
}
.sidebar button:hover {
  background: #5FBDC1 0% 0% no-repeat padding-box;
}
.sidebar button a {
  text-align: center;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0px;
  color: #FFFFFF;
}
/* MEDIA QUERIES */
@media only screen and (max-width: 1100px) and (min-width: 992px) {
  .sidebar {
    padding: 3rem 1.5rem !important;
  }
}
@media only screen and (max-width: 991px) {
  .sidebar .blog-main {
    justify-content: center;
  }
}
@media only screen and (max-width: 991px) and (min-width: 703px) {
  .sidebar h3 {
    max-width: 620px;
    margin: 0 auto 1.5rem;
  }
  .sidebar .button-container {
    max-width: 620px;
    margin: 0 auto 1.5rem;
  }
}
@media only screen and (max-width: 702px) {
  .sidebar h3 {
    max-width: 280px;
    margin: 0 auto 1.5rem;
  }
  .sidebar .button-container {
    max-width: 280px;
    margin: 0 auto 1.5rem;
  }
}
@media only screen and (max-width: 500px) {
  .first-section .back {
    padding-left: 2rem;
  }
  .post-body {
    padding: 0 2rem;
  }
}
@media only screen and (max-width: 360px) {
  .sidebar h3 {
    max-width: 240px;
  }
  .sidebar .button-container {
    max-width: 240px;
  }
}
</style>
