<template>
<div>
    <h2>菜单栏</h2>
    <div style="width:50%">
    <el-tree 
        :data="menu"
        default-expand-all
        :expand-on-click-node="false"
        @node-click="showMenuUpdDialog"
        node-key="id">
    </el-tree>
    <menuUpdDialog 
        v-bind="{visible: menuUpdDialogVisible, oldname: updName, oldurl: updURL, oldauthority: updAuth}"
        @hide="hide"
        @add="addItem"
        @remove="removeItem"
        @update="updateItem"/>
    </div>
</div>
</template>
<script>
import Consts from '@/utils/const.js'
import treeUtils from "@/utils/tree.js"
import httpRequest from "@/utils/communication.js"
import menuUpdDialog from "@/components/menuUpdDialog.vue"
import commonQueries from "@/utils/commonqueries.js"
export default {
    name: 'system_menu',
    components: {
        menuUpdDialog,
    },
    data(){
        return {
            menu: Consts.fake_menu,
            menuUpdDialogVisible: false,
            updName: '',
            updURL: '',
            updAuth: [],
            updParent: '',
        }
    },
    beforeMount(){
        commonQueries.checkOnline(this)
        this.getMenu()
        for (let i in this.menu){
            treeUtils.gen_label_children(this.menu[i])
        }
        console.log(this.menu)
    },
    methods: {
        getMenu: function(){
            let xhr = new XMLHttpRequest()
            httpRequest.post(xhr, "/api/system/menu/query/", {})
            xhr.addEventListener("load", () =>{
                if (xhr.status == 401){
                    this.$message.error('权限不足')
                }else if (xhr.status == 200){
                    console.log(xhr.responseText)
                    this.menu = JSON.parse(xhr.responseText)
                    for (let i in this.menu){
                        treeUtils.gen_label_children(this.menu[i])
                    }
                }else{
                    this.$message.error('服务器错误')
                }
            })
        },
        showMenuUpdDialog: function(data){
            this.updName = data.title
            this.updURL = data.index
            this.updAuth = this.transDict(data.authority)
            console.log(this.updAuth)
            this.updParent = data.title
            console.log(this.updParent)
            this.menuUpdDialogVisible = true
        },
        hide: function(){
            this.menuUpdDialogVisible = false
        },
        addItem: function(name, url, authority){
            this.update("add", {title: name, index: url, parent: this.updParent, authority: this.transArr(authority)})
        },
        removeItem: function(){
            this.update("remove", {title: this.updName})
        },
        updateItem: function(name, url, authority){
            this.update("update", {title: this.updName, newTitle: name, newIndex: url, newAuthority: this.transArr(authority)})
        },
        transArr: function(arr){
            console.log(arr)
            let data = {}
            for (let i in Consts.auth_options_all){
                let auth = Consts.auth_options_all[i]
                let flag = false
                for (let j in arr){
                    if (auth === arr[j]){
                        flag = true
                        break
                    }
                }
                data[auth] = flag ? true : false
            }
            console.log(data)
            return data
        },
        transDict: function(dict){
            let data = []
            for (let elem in dict)
                if (dict[elem])data.push(elem)
            return data
        },
        update: function(type, data){
            console.log(type, data)
            let xhr = new XMLHttpRequest()
            httpRequest.post(xhr, "/api/system/menu/" + type + "/", data)
            xhr.addEventListener("load", () => {
                if (xhr.status == 401){
                    this.$message.error('权限不足')
                }else if (xhr.status == 200){
                    this.$message.success('修改成功')
                    this.getMenu()
                }else{
                    this.$message.error('服务器错误')
                }
            })
        }
    }
}
</script>
<style>
</style>