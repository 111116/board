import {shallowMount} from '@vue/test-utils'
import Vue from 'vue'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import systemlog from "@/components/page/system/log.vue"
import "@/mock/mock"

Vue.use(ElementUI)
Vue.use(VueRouter)

describe('log.vue', () => {
    const router = new VueRouter()
    const wrapper = shallowMount(systemlog, {router})
    it('item operations', () => {
        wrapper.vm.getLog(1, true)
        wrapper.vm.getLog(1, false)
        wrapper.vm.handleSelect(1)
        wrapper.vm.checkstatus({"status" : 401, "code" : 401}, false)
        wrapper.vm.checkstatus({"status" : 404, "code" : 404}, false)
        wrapper.vm.checkstatus({"status" : 500, "code" : 500}, false)
        wrapper.vm.checkstatus({"status" : 200, "code" : 200}, false)
    })
})