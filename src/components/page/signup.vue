<!--signup page-->
<template>
<div class="signup-wrap">
    <div class="signup-area">
        <div class="signup-title">
            <storyboardlogo color="#a2a"/>
        </div>
        <div class="signup-box">
            <el-container>
                <el-main>
                    <el-form>
                        <el-form-item label="邮箱">
                            <el-input placeholder="请输入邮箱" v-model="email"/>
                        </el-form-item>
                        <el-form-item label="昵称">
                            <el-input placeholder="请输入昵称" v-model="name"/>
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
                    <el-button class="signup-button" v-on:click="signup" type="primary">注册</el-button>
                    <el-button class="login-button" v-on:click="login">已有账号？登录</el-button>
                </el-footer>
            </el-container>
        </div>
    </div>
</div>
</template>
<script>
import httpRequest from "@/utils/communication"
import storyboardlogo from "@/components/storyboardlogo"
export default {
    name: 'signup',
    components: {
        storyboardlogo,
    },
    data(){
        return{
            name: "",
            email: "",
            password: "",
            passwordrepeat: "",
            success: false,
        }
    },
    methods: {
        signup: function(){
            if (this.name.length<1) {
                this.$message.error('昵称必须非空');
                return;
            }
            if (this.email.length<1) {
                this.$message.error('邮箱必须非空');
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
            httpRequest.post(xhr, "/api/user/create", {
                name: this.name,
                email: this.email,
                password: this.password,
                avatarurl: "/avatar1.jpeg"
            })
            xhr.onload = () => {this.checkstatus(xhr)}
        },
        login() {
            this.$router.push('/login')
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
        position: relative;
        height: 100%;
    }
    .signup-area {
        position: absolute;
        top: 50%;
        left: 50%;
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }
    .signup-box {
        width: 400px;
        border-radius: 5px;
        border: #ddd 1px solid;
    }
    .signup-title {
        width: 100%;
        text-align: center;
        font-size: 20px;
    }
</style>
