<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <a class="logo" href="/">Storyboard</a>
        <div class="header-right">
            <div type="text" class="button" @click="showmyinfo">
                {{myname}}
            </div>
            <el-button v-if="!loggedin" type="text" class="button" @click="login">
                登入
            </el-button>
            <el-button v-if="!loggedin" type="text" class="button" @click="signup">
                注册
            </el-button>
            <el-button v-if="loggedin" type="text" class="button" @click="logout">
                登出
            </el-button>
        </div>
    </div>
</template>

<script>
    import httpRequest from "@/utils/communication"
    import commonQueries from "@/utils/commonqueries"
    export default {
    components: {
    },
    data() {
        return {
            myname: "",
        };
    },
    computed: {
        loggedin() {
            return this.myname!=""
        },
    },
    beforeMount(){
        this.checkstatus()
    },
    methods: {
        // 侧边栏折叠
        showmyinfo() {
            this.userinfoVisible = true
        },
        collapseChage() {
            this.collapse = !this.collapse;
            // bus.$emit('collapse', this.collapse);
        },
        checkstatus() {
            this.myname = commonQueries.getCookie("username")
            console.log("name:", this.myname)
        },
        login() {
            this.$router.push('/login')
        },
        signup() {
            this.$router.push('/signup')
        },
        // 全屏事件
        logout() {
            let xhr = new XMLHttpRequest()
            httpRequest.post(xhr, "/api/user/logout")
            xhr.onload = () => {this.checkstatus(xhr)}
        },
    }
};
</script>

<style scoped>

.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 60px;
    color: #fff;
    background-color: #333;
}
.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 60px;
}
.header .logo {
    width: 250px;
    margin: 20px;
    line-height: 60px;
    text-align: left;
    color: white;
    text-decoration: none;
    cursor: pointer;
}
.header-right {
    float: right;
    padding-right: 50px;
}
.header-right .button {
    padding-left: 20px;
    padding-right: 20px;
}
.header .button {
    float: left;
    line-height: 60px;
    text-align: left;
    cursor: pointer;
}

</style>