<template>
<div>
    <div class="post-author">{{author}}</div>
    <div class="post-time">{{time}}</div>
    <div class="post-content">{{content}}</div>
</div>
</template>

<script>
export default {
    name: 'postitem',
    props: {
        author: {
            type: String,
            default: () => "Name"
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
.cascade {
    width: 100%;
}
.el-pagination{
    text-align: center; 
    padding-top: 1em;
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
    
}
</style>