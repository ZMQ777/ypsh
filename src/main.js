// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueResource from 'vue-resource';
import App from './App';
import router from './router';
import XLSX from 'xlsx';

Vue.use(ElementUI);
Vue.use(VueResource);
Vue.use(XLSX);

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  var loginstate = localStorage.getItem('loginUSer');

  if (to.path == '/login') {
    localStorage.setItem('loginUSer', null);
    localStorage.setItem('auth_list', null);
    next();
  } else if (
    loginstate == 'null' ||
    loginstate == 'false' ||
    loginstate == null
  ) {
    next({
      path: '/login'
    });
  } else {
    next();
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
