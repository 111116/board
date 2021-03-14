<template>
<div>
    <h2>{{post.title}}</h2>
    <template v-for="(re, index) in post.content">
        <postitem :key="`fruit-${index}`" :author="re[0]" :content="re[1]"/>
    </template>
</div>
</template>

<script>
import postitem from "@/components/postitem"
// import httpRequest from "@/utils/communication"
export default {
    name: 'thread',
    components: {
        postitem,
    },
    data(){
        return {
            post: {},
            id: undefined,
        }
    },
    computed: {
    },
    beforeMount(){
        this.id = this.$route.query.id
        this.getPost()
    },
    methods:{
        getPost() {
            let xhr = new XMLHttpRequest()
            console.log("fuck")
            xhr.open("GET", "/api/thread/read?id="+this.id)
            xhr.onload = () =>{
                this.post = JSON.parse(xhr.response)
                console.log(this.post)
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