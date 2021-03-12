import {shallowMount} from '@vue/test-utils'
import Vue from 'vue'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import assethistory from "@/components/page/assets/assethistory.vue"
import "@/mock/mock"

Vue.use(ElementUI)
Vue.use(VueRouter)

describe('assethistory.vue', () => {
    const router = new VueRouter()
    const wrapper = shallowMount(assethistory, {router})
    it('asset history', () => {
        wrapper.vm.submit()
    })
})