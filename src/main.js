// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '../src/styles/index.scss'
import '@/utils/httpRequest'
import store from '@/store/index'
import '@/icons'
import '@/api/common/permission'
import vFilters from '@/utils/filters'
import { checkPermission, checkSuperUser } from '@/utils/checkPermission'

// require('./mock'); //引入mock数据，关闭则注释该行

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.prototype.checkPermission = checkPermission
Vue.prototype.checkSuperUser = checkSuperUser

Object.keys(vFilters).forEach(key => {
  Vue.filter(key, vFilters[key])
})



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
}).$mount('#app')
