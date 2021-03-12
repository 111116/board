import {shallowMount} from '@vue/test-utils'
import Vue from 'vue'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import departmentcategory from "@/components/page/departmentcategory.vue"
import "@/mock/mock"

Vue.use(ElementUI)
Vue.use(VueRouter)

describe('list.vue', () => {
    const router = new VueRouter()
    const wrapper = shallowMount(departmentcategory, {router})
    it('item operations', () => {
        wrapper.vm.addItem("parent", "child")
        wrapper.vm.removeItem("child")
        wrapper.vm.renameItem("parent", "father")
    })
})