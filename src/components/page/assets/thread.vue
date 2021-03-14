<template>
<div>
    <h2>{{post.title}}</h2>
    <template v-for="(re, index) in post.content">
        <postitem :key="`fruit-${index}`" :author="re[0]" :content="re[1]"/>
    </template>
    <!-- reply -->
    <el-form :model="form">
        <el-form-item label="接着讲一段">
            <el-input type="textarea" v-model="form.content" autocomplete="off"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitReply">发布</el-button>
    </span>
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
            form: {
                content: "",
            },
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
        submitReply() {
            if (this.form.content.length < 1) {
                this.$message.error("内容不能少于一个字")
                return
            }
            let xhr = new XMLHttpRequest
            xhr.open("post","/api/thread/update")
            xhr.send(JSON.stringify({content:this.form.content,id:this.id}))
            xhr.onload = (e)=>{
                if (e.target.status == 200) {
                    this.$message.success("发布成功")
                    this.$router.push('/')
                }
                else {
                    console.error("edit failed", e.target.status)
                    this.$message.error("发布失败")
                }
            }
            xhr.onerror = ()=>{this.$message.error("发布失败")}
        }
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