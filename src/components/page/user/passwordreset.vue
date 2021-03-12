<template>
<div class="reset-box">
    <h2>重设用户密码</h2>
    <el-form>
        <el-form-item label="用户名">
            <el-input placeholder="请输入用户名" v-model="username"/>
        </el-form-item>
        <el-form-item label="新密码">
            <el-input placeholder="请输入密码" v-model="password" show-password/>
        </el-form-item>
        <el-form-item label="再次输入新密码">
            <el-input placeholder="请再次输入密码" v-model="password_checkout" show-password/>
        </el-form-item>
        <span v-if="password_valid===false" style="color: red">两次密码输入不一致!</span>
    </el-form>
    <div class="button-wrapper">
    <el-button v-on:click="reset" 
        type="primary"
        class="reset-button"
        :disabled="password_valid===false">设置</el-button>
    </div>
</div>
</template>
<script>
import httpRequest from "@/utils/communication"
//import authorityUtils from "@/utils/authority"
import commonQueries from "@/utils/commonqueries"
export default {
    name: 'user_passwordreset',
    beforeMount(){
        commonQueries.checkOnline(this)
        //authorityUtils.checkAuthority(this, ["usermanager", "ITmanager"])
    },
    data(){
        return{
            username: this.$route.query.username,
            password: "",
            password_checkout: "",
            password_valid: false,
            success: false,
        }
    },
    watch:{
        "password": function(val){
            this.password_valid = val == this.password_checkout
        },
        "password_checkout": function(val){
            this.password_valid = val == this.password
        },
        username: function(val){
            this.$router.push({ query: { ...this.$route.query, username: val } })
        },
        "$route.query.username": function(val){
            this.username = val
        }
    },
    methods:{
        reset: function(){
            let cookie = document.cookie.match(new RegExp("token=([^;])"))
            if (cookie == null){
                this.$router.push('/login')
            }
            let xhr = new XMLHttpRequest()
            httpRequest.post(xhr, "/api/user/resetpwd/", {
                username: this.username,
                password: this.password,
            })
            xhr.addEventListener("load", () =>{
                this.checkstatus(xhr)
            })
        },
        checkstatus: function(xhr){
            if (xhr.status == 500 || xhr.status == 404){
                this.$message.error('服务器错误')
            }else if (xhr.status == 200){
                console.log(xhr.responseText)
                this.$message.success('修改成功')
                this.success = true
            }else if (xhr.status == 401){
                this.$message.error('用户不存在')
            }else{
                this.$message.error('发生未知错误')
            }
        }
    }
}
</script>
<style scoped>
    .reset-box {
        width: 50%;
        margin-left: 25%;
    }
    .button-wrapper {
        margin-top: 20px;
    }
</style>