<!--signup page-->
<template>
<div class="signup-wrap">
    <div class="signup-box">
        <div class="signup-title">Storyboard</div>
        <el-container>
            <el-main>
                <el-form>
                    <el-form-item label="用户名">
                        <el-input placeholder="请输入用户名" v-model="username"/>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input placeholder="请输入密码" v-model="password" show-password />
                    </el-form-item>
                    <el-form-item label="密码确认">
                        <el-input placeholder="请重复密码" v-model="passwordrepeat" show-password @keyup.enter.native="signup"/>
                    </el-form-item>
                </el-form>
            </el-main>
            <el-footer>
                <el-button class="signup-button" v-on:click="signup">注册</el-button>
            </el-footer>
        </el-container>
    </div>
</div>
</template>
<script>
import httpRequest from "@/utils/communication"
export default {
    name: 'signup',
    components: {
    },
    data(){
        return{
            username: "",
            password: "",
            passwordrepeat: "",
            success: false,
        }
    },
    methods: {
        signup: function(){
            if (this.username.length<3) {
                this.$message.error('用户名太短');
                return;
            }
            if (this.password.length<6) {
                this.$message.error('密码太短');
                return;
            }
            if (this.passwordrepeat != this.password) {
                this.$message.error('两次输入密码不同');
                return;
            }
            let xhr = new XMLHttpRequest()
            httpRequest.post(xhr, "/api/user/create", {username: this.username, password: this.password})
            xhr.onload = () => {this.checkstatus(xhr)}
        },
        checkstatus: function(xhr){
            console.log(xhr.status)
            if (xhr.status == 200){
                this.success = true
                this.$message.success('注册成功');
                this.$router.push('/login')
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
    .signup-wrap {
    }
    .signup-box {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 400px;
        margin: -190px 0 0 -175px;
        border-radius: 5px;
        border: #ddd 1px solid;
    }
    .signup-title {
        width: 100%;
        line-height: 60px;
        text-align: center;
        font-size: 20px;
        border-bottom: 1px solid #ddd;
    }
</style>
