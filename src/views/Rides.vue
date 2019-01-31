<template>

  <div class="rides-container">

    <div>
      <div class="flex-title">
        <md-button @click="$router.push('/')"><md-icon class="md-primary">arrow_back</md-icon>&nbsp;&nbsp;Back to Parks</md-button>
        <md-button class="sort-button" @click="showSortDialog=true"><md-icon class="md-primary">sort</md-icon>&nbsp;&nbsp;Sort</md-button>
      </div>
      <h3 v-if="visiblePark">{{ visiblePark.name }}</h3>
    </div>

    <!-- Modal -->
    <md-dialog :md-active.sync="showSortDialog">
      <md-dialog-title>Sort</md-dialog-title>

      <md-dialog-content>
        <md-field>
          <label for="sortBy">Field</label>
          <md-select v-model="sortModel.field" name="sortBy">
            <md-option value="name">Ride Name</md-option>
            <md-option value="waittime">Wait Time</md-option>
          </md-select>
          
        </md-field>

        <md-radio v-model="sortModel.asc" :value="true">Ascending</md-radio>
        <md-radio v-model="sortModel.asc" :value="false">Descending</md-radio>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="showSortDialog = false; sortWaitTimes()">Close</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-empty-state
      v-if="isLoading"
      md-rounded
      md-icon="access_time"
      md-label="Wait Some More"
      md-description="Seems ironic that you are waiting for wait times to load...">
    </md-empty-state>

    <md-empty-state
      v-if="!hasNotFetchedDataYet && !isLoading && waitTimes.length == 0"
      md-rounded
      md-icon="star"
      md-label="Congratulations!"
      md-description="Looks like you WILL be the heavy wait champion of the world, since there are no active rides at this park...">
    </md-empty-state>

    <!-- Favorite list -->
    <span class="md-subheading" v-if="favoriteRides[this.park] && favoriteRides[this.park].length > 0">Favorites</span>

    <md-list class="fav-list" v-if="favoriteRides[this.park] && favoriteRides[this.park].length > 0">

      <transition-group tag="div"
          name="favorite">

        <div v-for="ride in favoriteRides[this.park]" :key="ride.name" class="favorite-item">

          <md-list-item md-expand>
            <md-avatar class="md-avatar-icon md-accent">
              <md-ripple>{{ ride.waittime }}</md-ripple>
            </md-avatar>

            <span class="md-list-item-text">{{ ride.name }}</span>
            <md-list slot="md-expand">
              <md-list-item class="md-inset">Status: {{ ride.status }}</md-list-item>
              <md-list-item class="md-inset">FastPass Available: {{ ride.fastPass }}</md-list-item>
              <md-list-item class="md-inset">Active: {{ ride.active }}</md-list-item>
            </md-list>

            <md-chip class="md-accent" v-if="ride.fastPass">FP</md-chip>
            <md-chip v-if="!ride.active">Not Active</md-chip>

            <md-button class="md-icon-button md-list-action" @click="unFavoriteClicked(ride)">
              <md-icon class="md-primary">star</md-icon>
            </md-button>            
          </md-list-item>

          <md-divider class="md-inset"></md-divider>
        
        </div>
      </transition-group>

    </md-list>


    <!-- Normal List -->
    <span class="md-subheading">All Open Rides</span>
    <md-list>

      <transition-group tag="div"
          name="favorite">

        <div v-for="ride in waitTimesMinusFavorites" :key="ride.name" class="favorite-item">

          <md-list-item md-expand>
            <md-avatar class="md-avatar-icon md-accent">
              <md-ripple>{{ ride.waittime }}</md-ripple>
            </md-avatar>

            <span class="md-list-item-text">{{ ride.name }}</span>
            <md-list slot="md-expand">
              <md-list-item class="md-inset">Status: {{ ride.status }}</md-list-item>
              <md-list-item class="md-inset">FastPass Available: {{ ride.fastPass }}</md-list-item>
              <md-list-item class="md-inset">Active: {{ ride.active }}</md-list-item>
            </md-list>

            <md-chip class="md-accent" v-if="ride.fastPass">FP</md-chip>
            <md-chip v-if="!ride.active">Not Active</md-chip>

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
  .flex-title {
    display: flex;
    justify-content: space-between;
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
  .md-empty-state {
    max-width: 100% !important;
  }
  .md-list-item-text {
    white-space: normal !important;
    margin-right: 7px;
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
    waitTimesMinusFavorites: [],
    visiblePark: undefined,
    showSortDialog: false,
    hasNotFetchedDataYet: true
  }),
  methods: {
    favoriteClicked: function(ride) {
      this.$store.dispatch('favorite', { parkId: this.park, ride: ride })
    },
    unFavoriteClicked: function(ride) {
      this.$store.dispatch('unFavorite', { parkId: this.park, ride: ride })
    },
    sortWaitTimes: function() {
      this.$store.dispatch('setSortModel', this.sortModel)
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
    this.hasNotFetchedDataYet = false;
  },
  computed: {
    ...mapState([
      'waitTimes',
      'parkList',
      'favoriteRides',
      'currentPark',
      'sortModel',
      'isLoading'
    ]),
  },
  watch: {
    waitTimes(newWaits, oldWaits) {
      console.log('wait times updated (view)')
      this.visiblePark = this.$store.state.parkList.find(park => park.id === this.park)
      this.$store.dispatch('setCurrentPark', { currentPark: this.visiblePark })
      this.waitTimesMinusFavorites = JSON.parse(JSON.stringify(newWaits))

      this.snackbarContent = 'wait times updated'
      this.showSnackbar = true;
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
    },
    isLoading(newLoading, oldLoading) {
      if (newLoading) {
        this.snackbarContent = 'loading wait times...'
        this.showSnackbar = true;
      }
    }
  }
}
</script>
