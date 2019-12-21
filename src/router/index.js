import Vue from 'vue';
import Router from 'vue-router';
import login from '../components/pages/login';
import shenhe from '../components/pages/shenhe';
import mainBox from '../components/pages/mainBox';
import userBox from '../components/pages/userBox';
import drugListBox from '../components/pages/drugListBox';
import drugToDatabase from '../components/pages/drugToDatabase';
import drugSelect from '../components/pages/drugSelect';
import HelloWorld from '../components/HelloWorld';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: shenhe
    },
    {
      path: '/login',
      name: 'loginBox',
      component: login
    },
    {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/mainBox',
      name: 'mainBox',
      component: mainBox,
      children: [
        {
          path: '/shenhe',
          name: 'shenhe',
          component: shenhe
        },
        {
          path: '/userBox',
          name: 'userBox',
          component: userBox
        },
        {
          path: '/drugListBox',
          name: 'drugListBox',
          component: drugListBox
        },
        {
          path: '/drugToDatabase',
          name: 'drugToDatabase',
          component: drugToDatabase
        },
        {
          path: '/drugSelect',
          name: 'drugSelect',
          component: drugSelect
        }
      ]
    }
  ]
});
