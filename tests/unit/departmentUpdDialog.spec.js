import {shallowMount} from '@vue/test-utils'
import Vue from 'vue'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import departmentUpdDialog from "@/components/departmentUpdDialog.vue"
import "@/mock/mock"

Vue.use(ElementUI)
Vue.use(VueRouter)

describe('departmentUpdDialog.vue', () => {
    const router = new VueRouter()
    const wrapper = shallowMount(departmentUpdDialog, {router})

    it('login test', () => {
        wrapper.vm.confirm()
        wrapper.vm.cancel()
    })
})