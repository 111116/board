<!--signup page-->
<template>
<div class="signup-wrap">
    <div class="signup-box">
        <div class="signup-title">Storyboard</div>
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
