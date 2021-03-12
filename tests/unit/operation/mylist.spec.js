import {shallowMount} from '@vue/test-utils'
import Vue from 'vue'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import operation_mylist from "@/components/page/operation/mylist.vue"
import "@/mock/mock"

Vue.use(ElementUI)
Vue.use(VueRouter)

describe('list.vue', () => {
    const router = new VueRouter()
    const wrapper = shallowMount(operation_mylist, {router})
    it('get my operaiton', () => {
        wrapper.vm.getOperations()
        wrapper.vm.createOperation()
        wrapper.vm.getStep({status : "等待主管审核"})
        wrapper.vm.getStep({status : "等待资产管理员确认", opeartion : "REQUIRE"})
        wrapper.vm.getStep({status : "等待资产管理员确认", opeartion : "MAINTAIN"})
        wrapper.vm.getStep({status : "完成", opeartion : "REQUIRE"})
        wrapper.vm.getStep({status : "完成", opeartion : "MAINTAIN"})
        wrapper.vm.getStep1Status({status : "等待主管审核", opeartion : "REQUIRE"})
        wrapper.vm.getStep1Status({status : "审核未通过", opeartion : "REQUIRE"})
        wrapper.vm.getStep1Status({status : "完成", opeartion : "REQUIRE"})
        wrapper.vm.getStep2Status({status : "等待主管审核", opeartion : "REQUIRE"})
        wrapper.vm.getStep2Status({status : "等待资产管理员确认", opeartion : "REQUIRE"})
        wrapper.vm.getStep2Status({status : "确认未通过", opeartion : "REQUIRE"})
        wrapper.vm.getStep2Status({status : "完成", opeartion : "REQUIRE"})
        wrapper.vm.showAssetDialog([0])
        wrapper.vm.hideAssetDialog()
        wrapper.vm.handleCurrentChange(2)
        //expect(len(wrapper.vm.users)).toBe(1)
    })
})