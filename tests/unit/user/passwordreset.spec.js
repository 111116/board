import {shallowMount} from '@vue/test-utils'
import Vue from 'vue'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import user_passwordreset from "@/components/page/user/passwordreset.vue"
import "@/mock/mock"

Vue.use(ElementUI)
Vue.use(VueRouter)

describe('passwordreset.vue', () => {
    const router = new VueRouter()
    const wrapper = shallowMount(user_passwordreset, {router})
    it('repeat password', () => {
        expect(wrapper.vm.password_valid).toBe(false)
    })
    wrapper.vm.reset()
    wrapper.vm.checkstatus({"status" : 401, "code" : 401})
    wrapper.vm.checkstatus({"status" : 404, "code" : 404})
    wrapper.vm.checkstatus({"status" : 500, "code" : 500})
    wrapper.vm.checkstatus({"status" : 200, "code" : 200})
})