import {mount} from '@vue/test-utils'
import Vue from 'vue'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import login from "@/components/page/login.vue"
import "@/mock/mock"

Vue.use(ElementUI)
Vue.use(VueRouter)

describe('login.vue', () => {
    const router = new VueRouter()
    const wrapper = mount(login, {router})

    it('login test', () => {
        expect(wrapper.vm.success).toBe(false)
        wrapper.vm.login()
        wrapper.vm.checkstatus({"status" : 401, "code" : 401})
        wrapper.vm.checkstatus({"status" : 404, "code" : 404})
        wrapper.vm.checkstatus({"status" : 500, "code" : 500})
        wrapper.vm.checkstatus({"status" : 200, "code" : 200})
        expect(wrapper.vm.success).toBe(true)
    })
})