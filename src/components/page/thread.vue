<template>
<div class="outer-container">
    <div class="cover-container">
        <img :src="post.bkimg"/>
    </div>
    <div class="maindiv">
        <h2 class="thread-title">{{post.title}}</h2>
        <div class="category">{{post.category}}</div>
        <div class="likes">{{post.likes}} likes</div>
        <hr/>
        <postitem v-for="(re, index) in post.content"
            :key="`fruit-${index}`" :author="re.author" :content="re.content" :time="re.time"/>
        <!-- reply -->
        <el-form :model="form">
            <el-form-item label="接着讲一段">
                <el-input type="textarea" v-model="form.content" rows="5" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitReply">发布</el-button>
        </span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="requestAI">帮写</el-button>
        </span>
        <div class="completion-item" v-for="(o, index) in completion"
            @click="complete"
            :key="`fr1uit-${index}`">
            {{o}}
        </div>
    </div>
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
            completion: [],
        }
    },
    computed: {
    },
    beforeMount(){
        this.id = this.$route.params.id
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
        getContext() {
            return this.post.title + " " + this.form.content
        },
        requestAI() {
            let xhr = new XMLHttpRequest()
            xhr.open("POST", "/api/storygen")
            xhr.onload = () =>{
                this.completion = JSON.parse(xhr.response).msg
                console.log(this.completion)
            }
            xhr.send(JSON.stringify({context:this.getContext()+this.form.content}))
        },
        complete(e) {
            console.log(e.target.innerText)
            this.form.content += e.target.innerText
            this.completion = []
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
                    this.$router.go()
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
.thread-title {
}
.outer-container {
}
.cover-container {
    overflow: hidden;
}
.cover-container img {
    width: 100%;
    object-fit: cover;
    max-height: 300px;
}
.maindiv {
    max-width: 800px;
    margin: auto;
}
.red {
    color: #ff0000;
}
hr {
    height: 1px;
    border: none;
    color: #EBEEF5;
    background-color: #EBEEF5;
}
.el-pagination{
    text-align: center; 
    padding-top: 1em;
}
.completion-item {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 2px;
    margin-top: 2px;
    margin-bottom: 2px;
    cursor: pointer;
}
</style>