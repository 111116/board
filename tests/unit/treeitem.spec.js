import {mount} from '@vue/test-utils'
import Vue from 'vue'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import treeitem from "@/components/treeItem.vue"
import "@/mock/mock"

Vue.use(ElementUI)
Vue.use(VueRouter)

describe('treeitem.vue', () => {
    const router = new VueRouter()
    const wrapper = mount(treeitem, {router})

    it('treeitem test', () => {
        wrapper.vm.toggle()
        wrapper.vm.addItem1("wuhu")
        wrapper.vm.addItem("father", "wuhu")
        wrapper.vm.removeItem1()
        wrapper.vm.removeItem("wuhu")
        wrapper.vm.renameItem1("wuhu")
        wrapper.vm.renameItem("wuuhuu")
        wrapper.vm.showDialog()
        wrapper.vm.hideDialog()
    })
})