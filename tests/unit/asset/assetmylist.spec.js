import {shallowMount} from '@vue/test-utils'
import Vue from 'vue'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import assetmylist from "@/components/page/assets/assetmylist.vue"
import "@/mock/mock"

Vue.use(ElementUI)
Vue.use(VueRouter)

describe('assetmylist.vue', () => {
    const router = new VueRouter()
    const wrapper = shallowMount(assetmylist, {router})

    it('assetlist test', () => {
        wrapper.vm.applysearch()
        wrapper.vm.clearsearch()
        wrapper.vm.showdeletedbuttontext()
        wrapper.vm.toggleShowDeleted()
        wrapper.vm.handleCurrentChange()
        wrapper.vm.readable_status("IDLE")
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