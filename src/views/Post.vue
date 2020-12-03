<template>
<section class="bg-white" :sectionDimensions="sectionDimensions">
  <!-- Vue conditional to check if there is any content in document -->
  <div :style="bannerImage" class="d-flex align-items-center flex-column first-section">
    <div class="my-auto text-center heading">
      <h2 class="mb-5 text-white">{{ $prismic.richTextAsPlain(fields.title) }}</h2>
      <p class="text-white">
        {{ Intl.DateTimeFormat('en-US', dateOptions).format(new Date(fields.date)) }} &middot; {{ fields.author }}
      </p>
    </div>
    <div class="mb-4 back">
      <router-link to="./"><span class="text-danger">&#10094;</span> Back to Blog</router-link>
      <!-- Button to edit document in dashboard
      <prismic-edit-button :documentId="documentId"/> -->
    </div>
    <div class="banner-overlay"></div>
  </div>
  <div class="row">
      <div class="pt-5 pb-5 col-lg-8">
        <!-- Slice Block Componenet tag -->
        <div class="post-body">
          <slices-block :slices="slices" class="outer-container"/>
              <div class="back-bottom">
                <router-link to="./"><span class="text-danger">&#10094;</span> Back to Blog</router-link>
                <!-- Button to edit document in dashboard
                <prismic-edit-button :documentId="documentId"/> -->
              </div>
        </div>
      </div>
      <!-- sidebar -->
      <div class="col-lg-4 sidebar">
        <h3>Related Post</h3>
        <div class="button-container"><button><router-link to="./">View All</router-link></button></div>
      </div>
  </div>
</section>
</template>

<script>
// Importing all the slices components
import SlicesBlock from '../components/SlicesBlock.vue'

export default {
  name: 'post',
  components: {
    SlicesBlock
  },
  data () {
    return {
      dateOptions: { year: 'numeric', month: 'short', day: '2-digit' },
      documentId: '',
      fields: {
        title: null,
        date: null,
        author: null,
        img: null
      },
      slices: []
    }
  },
  methods: {
    getContent (uid) {
      // Query to get post content
      this.$prismic.client.getByUID('post', uid)
        .then((document) => {
          if (document) {
            this.documentId = document.id
            this.fields.title = document.data.title
            this.fields.date = document.data.date
            this.fields.img = document.data.blog_home_image.url
            if (document.data.author && document.data.author.length > 0) {
              this.fields.author = document.data.author[0].text
            }

            // Set slices as variable
            this.slices = document.data.body
          } else {
            // returns error page
            this.$router.push({ name: 'not-found' })
          }
        })
    }
  },
  created () {
    this.getContent(this.$route.params.uid)
  },
  beforeRouteUpdate (to, from, next) {
    this.getContent(to.params.uid)
    next()
  },
  computed: {
  }
}
</script>

<style>
/* BANNER */
.first-section p {
  text-align: center;
  margin: 0;
}
.first-section .banner-overlay {
  background-color: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
}
.first-section .heading {
  z-index: 1;
}
.first-section .back {
  z-index: 1;
  width: 100%;
  padding-left: 5rem;
}
.first-section .back a {
  color: #fff;
  font-size: 10px;
}
/* POST */
.post-body {
  color: #000;
  padding: 0 5rem;
  margin: 0 auto;
}
.post-body h3 {
  margin-bottom: 1.5rem;
}
.post-body a {
  color: #E9493D;
  text-decoration: underline;
}
.post-body a:hover {
  color: #E9493D;
  text-decoration: underline;
}
.post-body .back-bottom {
  margin-top: 2.5rem;
}
.post-body .back-bottom a {
  font-size: 12px;
  text-decoration: none;
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
  font-size: 11px;
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
