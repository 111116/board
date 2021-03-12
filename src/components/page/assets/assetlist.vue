<template>
<div>
    <h2>故事列表</h2>
    <template v-for="item in posts">
        {{item.title}}
        <template v-for="re in item.content">
            {{re[1]}}
        </template>
    </template>
</div>
</template>

<script>
// import httpRequest from "@/utils/communication"
export default {
    name: 'assetlist',
    components: {
    },
    data(){
        return {
            posts: [],
        }
    },
    computed: {
    },
    beforeMount(){
        this.getPosts()
    },
    methods:{
        getPosts() {
            let xhr = new XMLHttpRequest()
            console.log("fuck")
            xhr.open("GET", "/api/forum/listall")
            xhr.onload = () =>{
                this.posts = JSON.parse(xhr.response)
                console.log(this.posts)
            }
            xhr.send()
        },
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
</style>