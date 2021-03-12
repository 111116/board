<template>
<div class="create-box">
    <h2>创建用户</h2>
    <el-form>
        <el-form-item label="用户名">
            <el-input placeholder="请输入用户名" v-model="username" class="input"/>
        </el-form-item>
        <el-form-item label="员工姓名">
            <el-input placeholder="请输入姓名" v-model="staffname"/>
        </el-form-item>
        <el-form-item label="密码">
            <el-input placeholder="请输入密码" v-model="password" show-password/>
        </el-form-item>
        <el-form-item label="再次输入密码">
            <el-input placeholder="请再次输入密码" v-model="password_checkout" show-password/>
        </el-form-item>
        <el-form-item label="用户角色">
            <el-checkbox-group v-model="authority" class="auth-select">
                <el-checkbox
                    v-for="auth in auth_options"
                    :key="auth"
                    :label="auth"
                >{{auth_ch[auth]}}</el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="部门">
            <el-cascader 
                v-model="department"
                class="create-select"
                :options="departments.children"
            ></el-cascader>
        </el-form-item>
        <span v-if="password_valid===false" style="color: red">两次密码输入不一致!</span>
    </el-form>
    <div class="button-wrapper">
    <el-button v-on:click="register" 
        class="create-button"
        type="primary"
        :disabled="password_valid===false">创建</el-button>
    </div>
</div>
</template>
<script>
import httpRequest from "@/utils/communication"
import Consts from "@/utils/const"
import authorityUtils from "@/utils/authority"
import treeUtils from "@/utils/tree"
import commonQueries from "@/utils/commonqueries.js"
export default {
    name: 'user_create',
    components: {
    },
    data(){
        return{
            username: "",
            staffname: "",
            password: "",
            password_checkout: "",
            password_valid: false,
            authority: [],
            auth_options: Consts.auth_options,
            auth_ch: Consts.auth_ch,
            auth_flag: {},
            department: [],
            departments: Consts.fake_departments,
            success: false,
        }
    },
    beforeMount(){
        commonQueries.checkOnline(this)
        authorityUtils.checkAuthority(this, ["usermanager", "ITmanager"])
        this.getDepartments()
        //treeUtils.gen_label_value(this.departments)
    },
    watch:{
        "password": function(val){
            this.password_valid = val == this.password_checkout
        },
        "password_checkout": function(val){
            this.password_valid = val == this.password
        }
    },
    methods:{
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
        register: function(){
            console.log(this.authority)
            let data = {
                username: this.username, 
                staffname: this.staffname, 
                password: this.password,
                department: this.department[this.department.length - 1],
            }
            console.log(data)
            for (let i in this.auth_options){
                let auth = this.auth_options[i]
                let flag = false
                for (let j in this.authority){
                    if (auth === this.authority[j]){
                        flag = true
                        break
                    }
                }
                data[auth] = flag ? "True" : "False"
            }
            let xhr = new XMLHttpRequest()
            httpRequest.post(xhr, "/api/user/create/", data)
            xhr.addEventListener("load", () => {this.checkstatus(xhr)})
        },
        checkstatus: function(xhr){
            if (xhr.status == 500){
                this.$message.error('服务器错误')
            }else if (xhr.status == 401){
                this.$message.error('用户权限不足')
            }else if (xhr.status == 400){
                this.$message.error('用户已存在')
            }else if (xhr.status == 200){
                this.success = true
                this.$message.success('创建成功')
            }else{
                this.$message.error('发生未知错误')
            }
        },
    }
}
</script>
<style scoped>
    .create-box {
        width: 50%;
        margin-left: 25%;
    }
    .button-wrapper {
        margin-top: 20px;
    }
    .create-select {
        width: 100%;
    }
    .auth-select {
        width: 100%;
    }
</style>