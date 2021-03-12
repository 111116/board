import {shallowMount} from '@vue/test-utils'
import Vue from 'vue'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import statistics from "@/components/page/assets/statistics.vue"
import "@/mock/mock"

Vue.use(ElementUI)
Vue.use(VueRouter)

describe('statistics.vue', () => {
    const router = new VueRouter()
    const wrapper = shallowMount(statistics, {router})
    it('item operaitons', () => {
        wrapper.vm.getData({"responseText": '[{"id": "1", "serial": "", "name": "\u7535\u81111", "description": "", "status": "DELETED", "currentuser": "user2", "parentid": "", "category": "\u4e2a\u4eba\u7535\u8111", "brand": "", "model": "", "location": "", "department": "\u5f00\u53d1\u90e8", "maintainer": "user2", "value": 8189, "date": 1606283551, "lifespan": 100000}]'})
        wrapper.vm.render()
    })
})