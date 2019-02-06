<template>
  <div class="park-list-outer">

    <md-empty-state
      v-if="$wait.any"
      md-rounded
      md-icon="access_time"
      md-label="Wait Some More"
      md-description="Seems ironic that you are waiting for wait times to load...">
    </md-empty-state>

    <md-progress-bar md-mode="indeterminate" v-if="$wait.any"></md-progress-bar>

    <h1 class="headline">Select a park.</h1>
    
    <div class="park-list-container">
      <div class="park" v-for="park in parkList" :key="park.id">
        <md-card class="" md-theme="black-card" md-with-hover>
          <md-ripple>
            <md-card-header>
              <div class="md-title">{{ park.name }}</div>
              <div class="md-subhead">{{ park.timezone }}</div>
            </md-card-header>

            <md-card-content>
              Currently in {{ park.timezone }}
              ({{ park.id }})
            </md-card-content>

            <md-card-actions>
              <md-button class="action-button md-raised md-primary" @click="$router.push('/rides/' + park.id);">See Wait Times</md-button>
            </md-card-actions>
          </md-ripple>
        </md-card>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .md-progress-bar {
    position: absolute !important;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
  }
  .md-empty-state {
    max-width: calc(100vw - 15px) !important;
  }
  @media all and (max-width: 380px) {
    .md-card-content, .md-button {
      font-size: 12px !important;
    }
    .md-title {
      font-size: 18px !important;
    }
  }
  .park-list-outer {
    min-height: calc(100% - 150px);
  }
  .park-list-container {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  }
  .park {
    width: 100%;
    max-width: calc(100vw - 15px);
    .md-card {
      height: 100%;
      .md-card-actions {
        position: absolute;
        bottom: 0;
        right: 0;
      }
      .md-card-content {
        margin-bottom: 40px;
      }
    }
  }
  .headline, .subheadline {
    text-align: center;
  }
  .action-button.md-button.md-raised {
    background-color: #448aff;
    color: #fff;
  }
</style>


<script>
// @ is an alias to /src
import { mapState } from 'vuex'

export default {
  name: 'home',
  mounted() {
    this.$wait.start('loadParkList')
    this.$store.dispatch('loadParkList')
  },
  computed: mapState([
    'parkList'
  ]),
  watch: {
    parkList(newParks, oldParks) {
      this.$wait.end('loadParkList')
    }
  }
  // components: {
  //   HelloWorld
  // }
}
</script>
