import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

import VueWait from 'vue-wait'

Vue.config.productionTip = false

Vue.use(VueMaterial)
Vue.use(VueWait)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  wait: new VueWait({
    useVuex: true
  }),
})