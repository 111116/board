<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <storyboardlogo color="#fff"/>
        <div class="header-right">
            <img v-if="loggedin" class="user-avatar" :src="avatarurl"/>
            <div v-if="loggedin" type="text" class="button" @click="showmyinfo">
                {{name}}
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
    import storyboardlogo from "@/components/storyboardlogo"
    export default {
    components: {
        storyboardlogo,
    },
    data() {
        return {
            userid: "",
            email: "",
            name: "",
            avatarurl: "/defaultavatar.png",
        };
    },
    computed: {
        loggedin() {
            return this.userid!=""
        },
    },
    beforeMount(){
        this.userid = commonQueries.getCookie("id")
        if (this.userid == "")
            return
        let xhr = new XMLHttpRequest
        xhr.open("GET","/api/user/info?userid="+this.userid)
        xhr.onload = ()=>{
            let info = JSON.parse(xhr.responseText)
            this.email = info.email
            this.name = info.name
            this.avatarurl = info.avatarurl
        }
        xhr.send()
    },
    methods: {
        // 侧边栏折叠
        showmyinfo() {
            this.$router.push('/profile/' + commonQueries.getCookie("id"))
        },
        collapseChage() {
            this.collapse = !this.collapse;
            // bus.$emit('collapse', this.collapse);
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
            xhr.onload = () => {
                this.userid = ""
            }
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
    background-color: #516;
    font-size: 1.1em;
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
    font-size: 0.9em;
    float: left;
    line-height: 60px;
    text-align: left;
    cursor: pointer;
    padding-top: 0px;
    padding-bottom: 0px;
    color: white;
}

.user-avatar {
    height: 50px;
    padding-top: 5px;
    float: left;
    border-radius: 50%;
}

</style>