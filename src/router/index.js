import Vue from 'vue'
import VueRouter from 'vue-router'

// pages
import home from '@/components/home.vue'
import profile from '@/components/page/profile.vue'
import login from '@/components/page/login.vue'
import signup from '@/components/page/signup.vue'
import pagenotfound from '@/components/page/404.vue'

import list      from '@/components/page/list.vue'
import assetimport      from '@/components/page/assets/assetimport.vue'
import thread from '@/components/page/thread.vue'
import newstory from '@/components/page/newstory.vue'

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
    path: '/signup',
    name: 'signup',
    component: signup
  },
  {
    path: '/',
    component: home,
    children: [
      {
        path: 'list',
        component: list,
      },
      {
        path: 'thread/:id',
        component: thread,
      },
      {
        path: 'newstory',
        component: newstory,
      },
      {
        path: 'assetimport',
        component: assetimport,
      },
      {
        path: 'profile/:id',
        component: profile,
      },
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
