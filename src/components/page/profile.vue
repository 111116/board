<!--login page-->
<template>
    <div class="maindiv">
        <br/>
        <hr/>
        <div class="profile-id">#{{id}}</div>
        <div class="profile-name">{{name}}</div>
        <div class="profile-email">{{email}}</div>
        <br/>
        <img class="profile-avatar" :src="avatarurl"/>
        <div class="text-center">
            <img v-if="userAvatar" :src="userAvatar">
            <el-button id="pick-avatar">上传头像</el-button>
            <avatar-cropper
                @uploaded="handleUploaded"
                trigger="#pick-avatar"
                upload-url="/api/img/upload" />
        </div>
    </div>
</template>
<script>
// import httpRequest from "@/utils/communication"
import AvatarCropper from "vue-avatar-cropper"
import commonQueries from "@/utils/commonqueries"
export default {
    name: 'profile',
    components: {
        AvatarCropper
    },
    data(){
        return{
            id: "",
            email: "",
            name: "",
            password: "",
            avatarurl: "/defaultavatar.png",
            success: false,
            userAvatar: undefined,
        }
    },
    beforeMount() {
        this.id = commonQueries.getCookie("id")
        let xhr = new XMLHttpRequest
        xhr.open("GET","/api/user/info?userid="+this.id)
        xhr.onload = ()=>{
            let info = JSON.parse(xhr.responseText)
            this.email = info.email
            this.name = info.name
            this.avatarurl = info.avatarurl
        }
        xhr.send()
    },
    methods: {
        handleUploaded(resp) {
            // this.userAvatar = resp.relative_url;
            console.log(resp)
            this.avatarurl = "/api/img/filename?name=" + resp.filename
            this.updateUserInfo()
        },
        updateUserInfo() {
            let xhr = new XMLHttpRequest
            xhr.open("POST","/api/user/update")
            xhr.send(JSON.stringify({name: this.name, avatarurl: this.avatarurl}))
            xhr.onload = (e)=>{
                if (e.target.status == 200) {
                    this.$message.success("编辑成功")
                }
                else {
                    this.$message.error("编辑失败")
                }
            }
        }
    },
}
</script>

<style scoped>

hr {
    height: 1px;
    border: none;
    color: #ddd;
    background-color: #ddd;
}
.maindiv {
    max-width: 800px;
    margin: auto;
}
.profile-id {
    color: gray;
}
.profile-name {
    font-size: 1.5em;
    font-weight: bold;
}
.profile-email {
}
.profile-avatar {
    height: 200px;
    border-radius: 5%;
    border: 1px solid #ddd;
}
</style>
