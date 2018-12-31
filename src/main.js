import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

import { MdButton, MdContent, MdApp, MdToolbar, MdIcon, MdList, MdDrawer, MdCard, MdRipple, MdDivider, MdSnackbar, MdAvatar, MdEmptyState } from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

Vue.config.productionTip = false

Vue.use(MdApp)
Vue.use(MdButton)
Vue.use(MdContent)
Vue.use(MdToolbar)
Vue.use(MdIcon)
Vue.use(MdList)
Vue.use(MdDrawer)
Vue.use(MdCard)
Vue.use(MdRipple)
Vue.use(MdDivider)
Vue.use(MdSnackbar)
Vue.use(MdAvatar)
Vue.use(MdEmptyState)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})


