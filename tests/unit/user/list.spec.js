import {shallowMount} from '@vue/test-utils'
import Vue from 'vue'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import user_passwordreset from "@/components/page/user/list.vue"
import "@/mock/mock"

Vue.use(ElementUI)
Vue.use(VueRouter)

describe('list.vue', () => {
    const router = new VueRouter()
    const wrapper = shallowMount(user_passwordreset, {router})
    console.log(wrapper.vm.users)
    it('get user', () => {
        wrapper.vm.getUsers()
        wrapper.vm.parseUsers({
            "responseText" : '[{"username": "admin", \
                               "staffname": "Administrator", \
                               "department": "Wuhu", \
                               "locked": false,\
                               "assetmanager": true,\
                               "usermanager": true,\
                               "supervisor": true,\
                               "ITmanager": true}]'
        })
        //expect(len(wrapper.vm.users)).toBe(1)
    })
})