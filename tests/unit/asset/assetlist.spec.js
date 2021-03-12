import {shallowMount} from '@vue/test-utils'
import Vue from 'vue'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import assetlist from "@/components/page/assets/assetlist.vue"
import "@/mock/mock"

Vue.use(ElementUI)
Vue.use(VueRouter)

describe('assetlist.vue', () => {
    const router = new VueRouter()
    const wrapper = shallowMount(assetlist, {router})

    it('assetlist test', () => {
        wrapper.vm.showdeletedbuttontext()
        wrapper.vm.toggleShowDeleted()
        wrapper.vm.readable_status("IDLE")
        wrapper.vm.getAssets()
        wrapper.vm.getCategories()
        wrapper.vm.getDepartments()
        wrapper.vm.getUserList()
        wrapper.vm.handleAdd()
        wrapper.vm.submitChange()
        wrapper.vm.handleEdit(0, 0)
        wrapper.vm.submitChange()
        wrapper.vm.handleDelete(0, 0)
        wrapper.vm.submitChange()
        wrapper.vm.operationsubmit()
        wrapper.vm.querySearch("test", ()=>{})
    })
})