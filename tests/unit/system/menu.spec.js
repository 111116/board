import {shallowMount} from '@vue/test-utils'
import Vue from 'vue'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import system_menu from "@/components/page/system/menu.vue"
import "@/mock/mock"

Vue.use(ElementUI)
Vue.use(VueRouter)

describe('menu.vue', () => {
    const router = new VueRouter()
    const wrapper = shallowMount(system_menu, {router})
    it('menu operations', () => {
        wrapper.vm.getMenu()
        wrapper.vm.showMenuUpdDialog({title:"wuhu", index:"wuhu", auth:{usermanager: true}})
        wrapper.vm.hide()
        wrapper.vm.addItem("wuhu", "wuhu" , ["assetmanager"])
        wrapper.vm.updateItem("wuhu", "wuuhuu", ["usermanager"])
        wrapper.vm.removeItem()
    })
})