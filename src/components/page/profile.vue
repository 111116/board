<!--login page-->
<template>
    <div class="text-center">
        <img v-if="userAvatar" :src="userAvatar">
        <el-button id="pick-avatar">上传图片</el-button>
        <avatar-cropper
            @uploaded="handleUploaded"
            trigger="#pick-avatar"
            upload-url="/api/img/upload" />
    </div>
</template>
<script>
// import httpRequest from "@/utils/communication"
import AvatarCropper from "vue-avatar-cropper"
export default {
    name: 'profile',
    components: {
        AvatarCropper
    },
    data(){
        return{
            email: "",
            password: "",
            success: false,
            userAvatar: undefined,
        }
    },
    methods: {
        handleUploaded(resp) {
            // this.userAvatar = resp.relative_url;
            console.log(resp)
        }
    },
}
</script>

<style scoped>

</style>
