import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      redirect: '/404',
    },
    {
      path: '/',
      name: 'home',
      component: () => import('./views/About.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./views/About.vue'),
    },
    {
      path: '/404',
      name: 'error404',
      component: () => import('./views/error/404.vue'),
    },
    {
      path: '/401',
      name: 'error401',
      component: () => import('./views/error/401.vue'),
    },
    {
      path: '*',
      redirect: '/401',
    },
  ]
})
