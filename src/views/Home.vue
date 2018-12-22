<template>
  <div class="park-list-container">
    
    <div class="park" v-for="park in parkList" :key="park.id">
      <md-card class="" md-theme="black-card" md-with-hover>
        <md-ripple>
          <md-card-header>
            <div class="md-title">{{ park.name }}</div>
            <div class="md-subhead">{{ park.timezone }}</div>
          </md-card-header>

          <md-card-content>
            TBD description ({{ park.id }})
          </md-card-content>

          <md-card-actions>
            <md-button @click="$router.push('/rides/' + park.id);">Wait Times</md-button>
          </md-card-actions>
        </md-ripple>
      </md-card>
    </div>
  </div>
</template>

<style lang="scss">
  .park-list-container {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr))
  }
  .park {
    width: 100%;
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
</style>


<script>
// @ is an alias to /src
import { mapState } from 'vuex'

export default {
  name: 'home',
  mounted() {
    this.$store.dispatch('loadParkList')
  },
  computed: mapState([
    'parkList'
  ])
  // components: {
  //   HelloWorld
  // }
}
</script>
