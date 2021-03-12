import {shallowMount} from '@vue/test-utils'
import Vue from 'vue'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import operation_list from "@/components/page/operation/list.vue"
import "@/mock/mock"

Vue.use(ElementUI)
Vue.use(VueRouter)

describe('list.vue', () => {
    const router = new VueRouter()
    const wrapper = shallowMount(operation_list, {router})
    it('get operaiton', () => {
        wrapper.vm.getOperations()
        wrapper.vm.createOperation()
        console.log(wrapper.vm.operations)
        wrapper.vm.checkStatus(0)
        wrapper.vm.approve(0, true)
        wrapper.vm.showAssignDialog(0)
        wrapper.vm.showAssetDialog([0])
        wrapper.vm.handleCurrentChange(2)
        //expect(len(wrapper.vm.users)).toBe(1)
    })
})