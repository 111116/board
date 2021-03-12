import {shallowMount} from '@vue/test-utils'
import Vue from 'vue'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import userlist from "@/components/userlist.vue"

Vue.use(ElementUI)
Vue.use(VueRouter)

describe('userlist.vue', () => {
    const router = new VueRouter()
    const wrapper = shallowMount(userlist, {router})

    it('user test', () => {
        wrapper.vm.get_icon(0)
        wrapper.vm.get_opt_lock_name(0)
        wrapper.vm.reverse_lock(0)
        wrapper.vm.change_prop(0)
        wrapper.vm.remove_user(0)
        wrapper.vm.hide_user_upd_dialog()
        wrapper.vm.refresh()
        wrapper.vm.checkStatus({"status" : 401, "code" : 401}, false)
        wrapper.vm.checkStatus({"status" : 400, "code" : 400}, false)
        wrapper.vm.checkStatus({"status" : 404, "code" : 404}, false)
        wrapper.vm.checkStatus({"status" : 500, "code" : 500}, false)
        wrapper.vm.checkStatus({"status" : 200, "code" : 200}, false)
        wrapper.vm.checkStatusRemove({"status" : 401, "code" : 401})
        wrapper.vm.checkStatusRemove({"status" : 400, "code" : 400})
        wrapper.vm.checkStatusRemove({"status" : 404, "code" : 404})
        wrapper.vm.checkStatusRemove({"status" : 500, "code" : 500})
        wrapper.vm.checkStatusRemove({"status" : 200, "code" : 200})
    })
})