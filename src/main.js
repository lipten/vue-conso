// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router_config'
import * as moment from 'moment'

/* eslint-disable no-new */
Vue.prototype.$global = window
moment.locale('zh-en');
window.VM = new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  beforeCreate: function () {
    window.VUE = Vue;
    window.moment = moment;
  },
})