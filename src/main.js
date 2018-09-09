// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import jquery from 'jquery'
import comjs from './js/common.js'
import {AceEditor} from "vue2-ace-editor"
import moment from "moment"
import App from './App'

Vue.use(ElementUI)
Vue.use(VueAxios, axios)
Vue.use(jquery)
Vue.use(moment)

Vue.config.productionTip = false

//api根路径
//axios.defaults.baseURL = 'http://127.0.0.1:8020/beedo'
//axios.defaults.headers.
//Vue.prototype.axios = axios

Vue.prototype.$comjs = comjs
// 路由跳转
Vue.prototype.$goRoute = function (index) {
  this.$router.push(index)
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App,AceEditor },
  template: '<App/>'
})
