<!--login page-->
<template>
<div class="login-wrap">
    <div class="login-box">
        <div class="login-title">资产管理系统</div>
        <el-container>
            <el-main>
                <el-form>
                    <el-form-item label="用户名">
                        <el-input placeholder="请输入用户名" v-model="username"/>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input placeholder="请输入密码" v-model="password" show-password @keyup.enter.native="login"/>
                    </el-form-item>
                </el-form>
            </el-main>
            <el-footer>
                <el-button class="login-button" v-on:click="login">登录</el-button>
            </el-footer>
        </el-container>
    </div>
</div>
</template>
<script>
import httpRequest from "@/utils/communication"
export default {
    name: 'login',
    components: {
    },
    data(){
        return{
            username: "",
            password: "",
            success: false,
        }
    },
    methods: {
        login: function(){
            let xhr = new XMLHttpRequest()
            httpRequest.post(xhr, "/api/user/login", {username: this.username, password: this.password})
            xhr.onload = () => {this.checkstatus(xhr)}
        },
        checkstatus: function(xhr){
            console.log(xhr.status)
            if (xhr.status == 200){
                this.success = true
                this.$message.success('登录成功');
                this.$router.push('/')
            }else if (xhr.status == 401){
                this.$message.error('用户名或密码错误！');
            }else if (xhr.status == 500){
                this.$message.error('服务器内部错误！');
            }else {
                this.$message.error('发生了未知错误！');
            }
        }
    },
}
</script>

<style scoped>
    .login-wrap {
    }
    .login-box {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 400px;
        margin: -190px 0 0 -175px;
        border-radius: 5px;
        border: #ddd 1px solid;
    }
    .login-title {
        width: 100%;
        line-height: 60px;
        text-align: center;
        font-size: 20px;
        border-bottom: 1px solid #ddd;
    }
</style>
