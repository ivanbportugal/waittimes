<template>
  <div class="rides-container">

    <!-- Favorite list -->
    <span class="md-subheading" v-if="favoriteRides[this.park] && favoriteRides[this.park].length > 0">Favorites</span>

    <md-list class="md-triple-line fav-list" v-if="favoriteRides[this.park] && favoriteRides[this.park].length > 0">

      <transition-group tag="div"
          name="favorite">

        <div v-for="ride in favoriteRides[this.park]" :key="ride.name" class="favorite-item">

          <md-list-item>
            <md-avatar class="md-avatar-icon md-large md-accent">
              <md-ripple>{{ ride.waittime }}</md-ripple>
            </md-avatar>

            <div class="md-list-item-text">
              <span>{{ ride.name }}</span>
              <span>Status: {{ ride.status }}</span>
              <p>FastPass Available: {{ ride.fastPass }}. Active: {{ ride.active }}</p>
            </div>

            <md-button class="md-icon-button md-list-action" @click="unFavoriteClicked(ride)">
              <md-icon class="md-primary">star</md-icon>
            </md-button>            
          </md-list-item>

          <md-divider class="md-inset"></md-divider>
        
        </div>
      </transition-group>

    </md-list>


    <!-- Normal List -->
    <md-empty-state
      v-if="waitTimes.length == 0"
      md-rounded
      md-icon="access_time"
      md-label="Wait Some More"
      md-description="Seems ironic that you are waiting for wait times to load...">
    </md-empty-state>
    <span class="md-subheading">All Rides</span>

    <md-list class="md-triple-line">

      <transition-group tag="div"
          name="favorite">

        <div v-for="ride in waitTimesMinusFavorites" :key="ride.name" class="favorite-item">

          <md-list-item>
            <md-avatar class="md-avatar-icon md-large md-accent">
              <md-ripple>{{ ride.waittime }}</md-ripple>
            </md-avatar>

            <div class="md-list-item-text">
              <span>{{ ride.name }}</span>
              <span>Status: {{ ride.status }}</span>
              <p>FastPass Available: {{ ride.fastPass }}. Active: {{ ride.active }}</p>
            </div>

            <md-button class="md-icon-button md-list-action" @click="favoriteClicked(ride)">
              <md-icon>star_border</md-icon>
            </md-button>
            
          </md-list-item>
          <md-divider class="md-inset"></md-divider>
        
        </div>
      </transition-group>

    </md-list>

    <!-- Snackin' -->
    <md-snackbar :md-position="'center'" :md-duration="5000" :md-active.sync="showSnackbar" md-persistent>
      <span>{{ snackbarContent }}</span>
      <md-button class="md-primary" @click="showSnackbar = false">Dismiss</md-button>
    </md-snackbar>

  </div>
</template>

<style lang="scss">
  .fav-list {
    overflow: hidden;
  }
  div[class*="favorite"], .md-triple-line {
    transition: all 500ms;
  }
  .favorite-enter, .favorite-leave-to {
    opacity: 0;
    transform: translateX(300px);
    max-height: 0;
  }
  .favorite-leave, .favorite-enter-to {
    opacity: 1;
    transform: translateX(0);
    max-height: auto;
  }
  
</style>


<script>
// @ is an alias to /src
import { mapState } from 'vuex'

export default {
  name: 'home',
  props: ['park'],
  data: () => ({
    showSnackbar: false,
    snackbarContent: '',
    waitTimesMinusFavorites: []
  }),
  methods: {
    favoriteClicked: function(ride) {
      this.$store.dispatch('favorite', { parkId: this.park, ride: ride })
    },
    unFavoriteClicked: function(ride) {
      this.$store.dispatch('unFavorite', { parkId: this.park, ride: ride })
    }
  },
  mounted() {
    if (this.park) {
      // Load wait times for this park
      this.$store.dispatch('loadWaitTimes', { park: this.park })

      // Sometimes the user navigates to this page directly and we want the entire list for more details on a given park
      if (this.parkList.length == 0) {
        this.$store.dispatch('loadParkList')
      }
    } else {
      this.snackbarContent = 'need park name to get wait times'
      this.showSnackbar = true;
    }
  },
  computed: mapState([
    'waitTimes',
    'parkList',
    'favoriteRides'
  ]),
  watch: {
    parkList(newList, oldList) {

      // Populate the app with the current park's details do it can show up in the title or anywhere else
      let entireParkDetails = newList.find(park => park.id === this.park)
      this.$store.dispatch('setCurrentPark', { currentPark: entireParkDetails })
    },
    waitTimes(newWaits, oldWaits) {
      this.waitTimesMinusFavorites = JSON.parse(JSON.stringify(newWaits))
    },
    favoriteRides(newFavs, oldFavs) {

      // Remove
      let thisParkNewFavs = newFavs[this.park]

      if (thisParkNewFavs && thisParkNewFavs.length > 0) {
        let waitTimesCopy = JSON.parse(JSON.stringify(this.waitTimes))
        for (let i = 0; i < waitTimesCopy.length; i++) {
          if (thisParkNewFavs.some(newFav => newFav['name'] === waitTimesCopy[i].name)) {
            // Remove this favorite from the main list
            waitTimesCopy.splice(i, 1)
            i--
          }
        }
        this.waitTimesMinusFavorites = JSON.parse(JSON.stringify(waitTimesCopy))
      } else {
        this.waitTimesMinusFavorites = JSON.parse(JSON.stringify(this.waitTimes))
      }
    }
  }
}
</script>
