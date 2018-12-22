<template>
  <div class="rides-container">

    <!-- Favorite list -->

    <!-- Normal List -->
    <md-list class="md-triple-line">
      <div v-for="ride in waitTimes" :key="ride.name">
        <md-list-item>
          <md-avatar class="md-avatar-icon md-large md-accent">
            <md-ripple>{{ ride.waittime }}</md-ripple>
          </md-avatar>

          <div class="md-list-item-text">
            <span>{{ ride.name }}</span>
            <span>Status: {{ ride.status }}</span>
            <p>FastPass Available: {{ ride.fastPass }}. Active: {{ ride.active }}</p>
          </div>

          <md-button class="md-icon-button md-list-action">
            <md-icon class="md-primary">star</md-icon>
          </md-button>

          
        </md-list-item>
        <md-divider class="md-inset"></md-divider>
      </div>

    </md-list>

    <!-- Snackin' -->
    <md-snackbar :md-position="'center'" :md-duration="5000" :md-active.sync="showSnackbar" md-persistent>
      <span>{{ snackbarContent }}</span>
      <md-button class="md-primary" @click="showSnackbar = false">Dismiss</md-button>
    </md-snackbar>

  </div>
</template>

<style lang="scss">
  // .park-list-container {
  //   display: grid;
  //   grid-gap: 10px;
  //   grid-template-columns: repeat(auto-fill, minmax(400px, 1fr))
  // }
  // .park {
  //   width: 100%;
  //   .md-card {
  //     height: 100%;
  //     .md-card-actions {
  //       position: absolute;
  //       bottom: 0;
  //       right: 0;
  //     }
  //     .md-card-content {
  //       margin-bottom: 40px;
  //     }
  //   }
  // }
</style>


<script>
// @ is an alias to /src
import { mapState } from 'vuex'

export default {
  name: 'home',
  props: ['park'],
  data: () => ({
    showSnackbar: false,
    snackbarContent: ''
  }),
  mounted() {
    if (this.$route.params && this.$route.params) {
      this.$store.dispatch('loadWaitTimes', this.$route.params.park)
    } else {
      this.snackbarContent = 'need park name to get wait times'
      this.showSnackbar = true;
    }
  },
  computed: mapState([
    'waitTimes'
  ])
}
</script>
