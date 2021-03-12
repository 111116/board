import {shallowMount} from '@vue/test-utils'
import Vue from 'vue'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import userUpdDialog from "@/components/userUpdDialog.vue"
import "@/mock/mock"

Vue.use(ElementUI)
Vue.use(VueRouter)

describe('userUpdDialog.vue', () => {
    const router = new VueRouter()
    const wrapper = shallowMount(userUpdDialog, {router})

    it('login test', () => {
        wrapper.vm.confirm()
        wrapper.vm.checkStatus({"status" : 401, "code" : 401})
        wrapper.vm.checkStatus({"status" : 400, "code" : 400})
        wrapper.vm.checkStatus({"status" : 404, "code" : 404})
        wrapper.vm.checkStatus({"status" : 500, "code" : 500})
        wrapper.vm.checkStatus({"status" : 200, "code" : 200})
    })
})