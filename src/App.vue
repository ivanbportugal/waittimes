<template>
  <div class="page-container md-layout-row">
    <md-app md-mode="reveal">

      <md-app-toolbar class="md-primary">
        <span class="md-title">Jump In Line</span>

        <div class="md-toolbar-section-end">
          <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
            <md-icon>menu</md-icon>
          </md-button>
        </div>
      </md-app-toolbar>

      <md-app-drawer class="md-right" :md-active.sync="menuVisible">
        <md-toolbar class="md-transparent" md-elevation="0">
          <span class="md-title">Navigation</span>
        </md-toolbar>

        <md-list>
          <md-list-item @click="toggleMenu(); $router.push('/');">
            <md-icon>home</md-icon>
            <span class="md-list-item-text">Park List</span>
          </md-list-item>

          <md-list-item @click="toggleMenu(); $router.push('/about');">
            <md-icon>announcement</md-icon>
            <span class="md-list-item-text">About</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <router-view/>
        <md-content class="footer">
          <span>Powered by <a target="_BLANK" href="https://github.com/cubehouse/themeparks">Themeparks</a></span>
        </md-content>
      </md-app-content>

    </md-app>    
  </div>
</template>

<style lang="scss">
  .md-toolbar.md-theme-default.md-primary {
    background-color: #6fcdbd !important;
  }

  .page-container, .md-app {
    min-height: 100vh;
  }
  .footer {
    margin: 50px 0 0;
    padding: 20px;
    text-align: center;
  }

  .md-app-content .md-card {
    margin-left: 0px !important;
  }
</style>

<script>
  import { mapState } from 'vuex'
import { setTimeout } from 'timers';

  export default {
    name: 'HeavyWaiter',
    data: () => ({
      menuVisible: false
    }),
    methods: {
      toggleMenu () {
        this.menuVisible = !this.menuVisible
      }
    }
  }
</script>
