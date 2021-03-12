import {shallowMount} from '@vue/test-utils'
import Vue from 'vue'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import assetcategory from "@/components/page/assets/assetcategory.vue"
import "@/mock/mock"

Vue.use(ElementUI)
Vue.use(VueRouter)

describe('list.vue', () => {
    const router = new VueRouter()
    const wrapper = shallowMount(assetcategory, {router})
    it('item operaitons', () => {
        wrapper.vm.addItem("parent", "child")
        wrapper.vm.removeItem("child")
        wrapper.vm.renameItem("parent", "father")
    })
})