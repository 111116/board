import {shallowMount} from '@vue/test-utils'
import Vue from 'vue'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import categoryUpdDialog from "@/components/categoryUpdDialog.vue"
import "@/mock/mock"

Vue.use(ElementUI)
Vue.use(VueRouter)

describe('categoryUpdDialog.vue', () => {
    const router = new VueRouter()
    const wrapper = shallowMount(categoryUpdDialog, {router})

    it('login test', () => {
        wrapper.vm.confirm()
        wrapper.vm.cancel()
    })
})