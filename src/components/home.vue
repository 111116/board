<template>
    <el-container class="wtf">
        <el-header class="fuckingheader">
            <navbar/>
        </el-header>
        <el-main class="content-box">
            <router-view></router-view>
        </el-main>
    </el-container>
</template>

<script>
import navbar from "@/components/navbar"
export default {
    components: {
        navbar
    },
    data() {
        return {
        };
    }
};
</script>

<style scoped>
    .wtf {
        height: 100%;
    }
    .fuckingheader{
        padding: 0px;
    }
    .content-box {
        padding: 0px;
    }
</style>
