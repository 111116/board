import {shallowMount} from '@vue/test-utils'
import Vue from 'vue'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import operation_new from "@/components/page/operation/new.vue"
import "@/mock/mock"

Vue.use(ElementUI)
Vue.use(VueRouter)

describe('list.vue', () => {
    const router = new VueRouter()
    const wrapper = shallowMount(operation_new, {router})
    it('get operaiton', () => {
        wrapper.vm.submit()
        //expect(len(wrapper.vm.users)).toBe(1)
    })
})