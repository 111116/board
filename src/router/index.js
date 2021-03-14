import Vue from 'vue'
import VueRouter from 'vue-router'

// pages
import home from '@/components/home.vue'
import login from '@/components/page/login.vue'
import pagenotfound from '@/components/page/404.vue'

import assetlist      from '@/components/page/assets/assetlist.vue'
import thread from '@/components/page/assets/thread.vue'
import newstory from '@/components/page/assets/newstory.vue'

import '@/assets/main.css'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/list'
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/',
    component: home,
    children: [
      {
        path: '/list',
        component: assetlist,
      },
      {
        path: 'thread',
        component: thread,
      },
      {
        path: 'newstory',
        component: newstory,
      }
    ]
  },
  {
    path: '*',
    component: pagenotfound
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
