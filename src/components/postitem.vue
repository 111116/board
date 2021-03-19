<template>
<div class="post-container">
    <img class="post-avatar" :src="author.avatarurl"/>
    <div class="post-author">{{author.name}}</div>
    <div class="post-time">{{time}}</div>
    <div class="post-content">{{content}}</div>
</div>
</template>

<script>
export default {
    name: 'postitem',
    props: {
        author: {
            type: Object,
            default: () => {}
        },
        content: {
            type: String,
            default: () => "ID123"
        },
        time: {
            type: String,
            default: () => "unknown"
        },
    },
    components: {
    },
    data(){
        return {
        }
    },
    computed: {
    },
    beforeMount(){
    },
    methods:{
    }
}
</script>

<style scoped>
.red {
    color: #ff0000;
}
hr {
    height: 1px;
    border: none;
    color: #EBEEF5;
    background-color: #EBEEF5;
}
.post-container {
    position: relative;
}
.el-pagination{
    text-align: center; 
    padding-top: 1em;
}
.post-avatar {
    position: absolute;
    left: -60px;
    top: 5px;
    height: 50px;
    border-radius: 50%;
}
.post-author {
    margin-top: 1em;
    font-size: 1.1em;
    line-height: 2em;
    font-weight: bold;
}
.post-time {
    font-size: 0.8em;
    color: gray;
}
.post-content {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    white-space: pre-wrap;
}
</style>