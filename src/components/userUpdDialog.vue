<template>
    <el-dialog
        style="text-align: center"
        title="修改用户属性"
        :show-close=false
        :visible.sync="visible"
        width="30%">
        <el-form label-width="80px">
            <el-form-item label="用户">
                <el-input
                    v-model="username"
                    :disabled="true"
                    class="select">
                </el-input>
            </el-form-item>
            <el-form-item label="用户角色">
                <el-checkbox-group v-model="new_authority" class="auth-select">
                    <el-checkbox
                        v-for="auth in auth_options"
                        :key="auth"
                        :label="auth"
                    >{{auth_ch[auth]}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="部门">
                <el-cascader 
                    v-model="new_department"
                    class="select"
                    :options="departments.children"
                ></el-cascader>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button v-on:click="cancel">取 消</el-button>
            <el-button type="primary" v-on:click="confirm">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import httpRequest from "@/utils/communication"
import Consts from "@/utils/const"
import treeUtils from "@/utils/tree"
export default {
    name: "authUpdDialog",
    props: {
        username: {
            type: String,
            default: () => "",
        },
        authority: {
            type: Array,
            default: () => [],
        },
        department: {
            type: String,
            default: () => "",
        },
        visible: {
            type: Boolean,
            default: () => true,
        }
    },
    data(){
        return {
            new_authority: [],
            new_department: "",
            auth_options: Consts.auth_options,
            auth_ch: Consts.auth_ch,
            departments: Consts.fake_departments
        }
    },
    beforeMount(){
        this.getDepartments()
    },
    methods: {
        getDepartments: function(){
            let xhr = new XMLHttpRequest()
            httpRequest.post(xhr, "/api/department/query/", {})
            xhr.addEventListener("load", () =>{
                if (xhr.status == 200){
                    this.departments = eval('(' + xhr.responseText + ')')
                    treeUtils.gen_label_value(this.departments)
                    console.log(this.departments)
                }else{
                    this.$message.error('服务器错误')
                }
            })
        },
        cancel: function() {
            this.$emit("hide")
        },
        confirm: function() {
            let xhr = new XMLHttpRequest()
            if (typeof this.new_department == 'object')this.new_department = this.new_department[this.new_department.length - 1]
            let data = {
                username: this.username, 
                department: this.new_department,
            }
            for (let i in this.auth_options){
                let auth = this.auth_options[i]
                let flag = false
                for (let j in this.new_authority){
                    if (auth === this.new_authority[j]){
                        flag = true
                        break
                    }
                }
                data[auth] = flag ? "True" : "False"
            }
            httpRequest.post(xhr, "/api/user/update/", data)
            xhr.addEventListener("load", () =>{
                this.checkStatus(xhr)
            })
            this.cancel()
        },
        checkStatus: function(xhr){
            if (xhr.status == 500){
                this.$message.error('服务器错误')
            }else if (xhr.status == 401){
                this.$message.error('用户权限不足')
            }else if (xhr.status == 400){
                this.$message.error('用户不存在')
            }else if (xhr.status == 200){
                this.$message.success('修改成功')
                this.$emit("refresh") 
            }else{
                this.$message.error('发生未知错误')
            }
        }
    },
    watch:{
        "authority": function(val){
            this.new_authority = val
            console.log(this.new_authority)
        },
        "department": function(val){
            this.new_department = val
        }
    },
}
</script>

<style scoped>
    .select {
        width: 80%;
    }
    .auth-select{
        width: 0%;
        padding-left: 40px;
    }
</style>