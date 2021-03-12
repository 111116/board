<template>
<div>
    <h2>部门层级树</h2>
    <el-tree 
        :data="department"
        default-expand-all
        :expand-on-click-node="false"
        @node-click="showDepartmentUpdDialog"
        node-key="id">
    </el-tree>
    <departmentUpdDialog 
        v-bind="{visible: departmentUpdDialogVisible, oldname: updName, full_departments: department[0]}"
        @hide="hide"
        @add="addItem"
        @remove="removeItem"
        @rename="renameItem"/>
</div>
</template>
<script>
import httpRequest from "@/utils/communication.js"
//import authorityUtils from "@/utils/authority.js"
import Const from "@/utils/const.js"
import departmentUpdDialog from "@/components/departmentUpdDialog.vue"
import treeUtils from "@/utils/tree.js"
export default {
    name: 'departmentcategory',
    components: {
        departmentUpdDialog
    },
    beforeMount(){
        //authorityUtils.checkAuthority(this, ["ITmanager"])
        this.getDepartmentCategory()
    },
    data(){
        return {
            departmentUpdDialogVisible: false,
            department: Const.fake_departments,
            updName: "",
        }
    },
    methods: {
        getDepartmentCategory: function(){
            let xhr = new XMLHttpRequest()
            httpRequest.post(xhr, "/api/department/query/", {})
            xhr.addEventListener("load", () =>{
                if (xhr.status == 401){
                    this.$message.error('权限不足')
                }else if (xhr.status == 200){
                    this.department = eval('(' + xhr.responseText + ')')
                    treeUtils.gen_label_value(this.department)
                    this.department = [this.department]
                }else{
                    this.$message.error('服务器错误')
                }
            })
        },
        showDepartmentUpdDialog: function(data){
            this.updName = data.name
            this.departmentUpdDialogVisible = true
        },
        hide: function(){
            this.departmentUpdDialogVisible = false
        },
        addItem: function(itemName){
            this.update("add", {
                parent: this.updName,
                name: itemName,
            })
        },
        removeItem: function(transfer){
            this.update("remove", {
                name: this.updName,
                transfer: transfer,
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
            httpRequest.post(xhr, "/api/department/" + type + "/", data)
            xhr.addEventListener("load", () => {
                if (xhr.status == 401){
                    this.$message.error('权限不足')
                }else if (xhr.status == 200){
                    this.$message.success('操作成功')
                    this.getDepartmentCategory()
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
