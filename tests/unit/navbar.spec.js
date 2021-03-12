import {mount} from '@vue/test-utils'
import Vue from 'vue'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import navbar from "@/components/navbar.vue"

Vue.use(ElementUI)
Vue.use(VueRouter)

describe('navbar.vue', () => {
    const router = new VueRouter()
    const wrapper = mount(navbar, {router})

    it('navbar test', () => {
        wrapper.vm.showmyinfo()
        wrapper.vm.collapseChage()
        wrapper.vm.logout()
        wrapper.vm.handleShowMyAssets()
        wrapper.vm.handleShowMyOperations()
        wrapper.vm.checkstatus({"status" : 401, "code" : 401})
        wrapper.vm.checkstatus({"status" : 404, "code" : 404})
        wrapper.vm.checkstatus({"status" : 500, "code" : 500})
        wrapper.vm.checkstatus({"status" : 200, "code" : 200})
    })
})