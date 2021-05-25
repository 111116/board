<!--login page-->
<template>
<div class="login-wrap">
    <div class="login-area">
        <div class="login-title">
            <storyboardlogo color="#a2a"/>
        </div>
        <div class="login-box">
            <el-container>
                <el-main>
                    <el-form>
                        <el-form-item label="邮箱">
                            <el-input placeholder="请输入邮箱" v-model="email"/>
                        </el-form-item>
                        <el-form-item label="密码">
                            <el-input placeholder="请输入密码" v-model="password" show-password @keyup.enter.native="login"/>
                        </el-form-item>
                    </el-form>
                </el-main>
                <el-footer>
                    <el-button class="login-button" v-on:click="login" type="primary">登录</el-button>
                    <el-button class="signup-button" v-on:click="signup">没有账号？注册一个</el-button>
                </el-footer>
            </el-container>
        </div>
    </div>
</div>
</template>
<script>
import httpRequest from "@/utils/communication"
import storyboardlogo from "@/components/storyboardlogo"
import commonQueries from "@/utils/commonqueries"
export default {
    name: 'login',
    components: {
        storyboardlogo,
    },
    data(){
        return{
            email: "",
            password: "",
            success: false,
        }
    },
    methods: {
        login: function(){
            let xhr = new XMLHttpRequest()
            httpRequest.post(xhr, "/api/user/login", {email: this.email, password: this.password})
            xhr.onload = () => {this.checkstatus(xhr)}
        },
        signup() {
            this.$router.push('/signup')
        },
        checkstatus: function(xhr){
            console.log(xhr.status)
            if (xhr.status == 200){
                this.success = true
                this.$message.success('登录成功');
                this.$router.push('/')
            } else {
                this.$message.error('错误！' + commonQueries.getErrorMsg(xhr));
            }
        }
    },
}
</script>

<style scoped>
    .login-wrap {
        position: relative;
        height: 100%;
    }
    .login-area {
        position: absolute;
        top: 50%;
        left: 50%;
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }
    .login-box {
        width: 400px;
        border-radius: 5px;
        border: #ddd 1px solid;
    }
    .login-title {
        width: 100%;
        text-align: center;
        font-size: 20px;
    }
</style>
