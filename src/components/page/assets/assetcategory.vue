<template>
<div>
    <h2>资产分类树</h2>
    <el-tree 
        :data="category"
        default-expand-all
        :expand-on-click-node="false"
        @node-click="showCategoryUpdDialog"
        node-key="id"
    />
    <categoryUpdDialog
        v-bind="{visible: categoryUpdDialogVisible, oldname: updName}"
        @hide="hide"
        @add="addItem"
        @remove="removeItem"
        @rename="renameItem"
    />
</div>
</template>
<script>
import httpRequest from "@/utils/communication.js"
import authorityUtils from "@/utils/authority.js"
import Const from "@/utils/const.js"
import treeUtils from "@/utils/tree.js"
import categoryUpdDialog from "@/components/categoryUpdDialog.vue"
import commonQueries from "@/utils/commonqueries.js"
export default {
    name: 'assetcategory',
    components: {
        categoryUpdDialog,
    },
    beforeMount(){
        commonQueries.checkOnline(this)
        authorityUtils.checkAuthority(this, ["ITmanager"])
        this.getAssetCategory()
    },
    data(){
        return {
            category: [Const.fake_categories],
            categoryUpdDialogVisible: false,
            updName: "",
        }
    },
    methods: {
        getAssetCategory: function(){
            let xhr = new XMLHttpRequest()
            httpRequest.post(xhr, "/api/assets/category/query/", {})
            xhr.addEventListener("load", () =>{
                if (xhr.status == 200){
                    this.category = eval('(' + xhr.responseText + ')')
                    treeUtils.gen_label_value(this.category)
                    this.category = [this.category]
                    console.log(this.category)
                }
            })
        },
        showCategoryUpdDialog: function(data){
            console.log(data.label)
            this.updName = data.label
            this.categoryUpdDialogVisible = true
        },
        hide: function(){
            this.categoryUpdDialogVisible = false
        },
        addItem: function(itemName){
            this.update("add", {
                parent: this.updName,
                name: itemName,
            })
        },
        removeItem: function(){
            this.update("remove", {
                name: this.updName,
            })
        },
        renameItem: function(newName){
            this.update("rename", {
                oldname: this.updName,
                newname: newName,
            })
        },
        update: function(type, data){
            let xhr = new XMLHttpRequest()
            httpRequest.post(xhr, "/api/assets/category/" + type + "/", data)
            xhr.addEventListener("load", () => {
                if (xhr.status == 401){
                    this.$message.error('权限不足')
                }else if (xhr.status == 200){
                    this.$message.success('修改成功')
                    this.getAssetCategory()
                }else{
                    this.$message.error('服务器错误')
                }
            })
        },
    }
}
</script>
<style scoped>
.block {
    display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
}
.title {
    font-size: 1.5em; 
    font-weight: bold;
}
</style>
