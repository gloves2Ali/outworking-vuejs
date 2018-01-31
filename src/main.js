import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import App from './App'
// 路由列表
import routers from './routers'
import MintUI from 'mint-ui'
import vux from 'vux'
// 注册过滤器
import date from './filters/date'
import time from './filters/time'
// store
//import store from './store'

Vue.use(VueRouter)
Vue.use(VueResource)
// Vue.use(MintUI)
// 不加跨域xhr会发起options请求
Vue.http.options.headers = {
    'Content-Type': 'application/json;charset=UTF-8'
}

Vue.filter('date', date)
Vue.filter('time', time)

// const FastClick = require('fastclick')
// FastClick.attach(document.body)

const router = new VueRouter({
  routes: routers
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  //store,
  template: '<App/>',
  components: { App }
})
