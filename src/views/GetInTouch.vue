<template>
  <section id="getInTouchSection" class="d-flex align-items-center flex-column">
    <div class="my-auto text-center text-white">
      <div class="my-4"><h2 class="text-white">Get In Touch</h2></div>
      <div class="mb-3"><h1 class="text-white">Any Questions?</h1></div>
      <div class="mb-4 blurb"><span>We can most easily be found on discord - click the link below to request an invite - or drop us an email.</span></div>
      <div class="m-5 d-flex justify-content-center">
        <a title="join us on discord" class="mr-4" href="https://discord.com/invite/sQaKVft"><img :src="social.discord.dark" alt="discord-icon" @mouseover="hoverOver(social.discord, $event)" @mouseout="hoverOut(social.discord, $event)" /></a>
        <a title="send an email" href="mailTo:info@risidio.com"><img :src="social.mail.dark" alt="mail-icon" @mouseover="hoverOver(social.mail, $event)" @mouseout="hoverOut(social.mail, $event)" /></a>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'GetInTouch',
  components: {
  },
  data () {
    return {
      social: {
        discord: {
          dark: require('@/assets/img/Group 15783.svg'),
          light: require('@/assets/img/Group 15783Light.svg')
        },
        mail: {
          dark: require('@/assets/img/Group 15784.svg'),
          light: require('@/assets/img/Group 15784Light.svg')
        }
      }
    }
  },
  methods: {
    hoverOver: function (img, ev) {
      ev.currentTarget.src = img.light
    },
    hoverOut: function (img, ev) {
      ev.currentTarget.src = img.dark
    }
  },
  computed: {
  }
}
</script>
<style lang="scss">

#getInTouchSection {
  min-height: 100vh;
  margin-top: 128px;
  background-color: #5154A1;
}

#getInTouchSection .blurb {
  width: 50%;
  margin: 0 auto;
}

</style>
