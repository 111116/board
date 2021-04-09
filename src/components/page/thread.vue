<template>
<div class="outer-container">
    <div class="cover-container">
        <img :src="post.bkimg"/>
    </div>
    <div class="maindiv">
        <h2 class="thread-title">{{post.title}}</h2>
        <div class="category">{{post.category}}</div>
        <el-button icon="el-icon-thumb" v-if="!likedByMe" @click="likeit">{{post.likes.length}}</el-button>
        <el-button icon="el-icon-thumb" v-if="likedByMe" style="color: #d6f;" @click="unlikeit">{{post.likes.length}}</el-button>
        <hr/>
        <postitem v-for="(re, index) in post.content"
            :key="`fruit-${index}`" :author="re.author" :content="re.content" :time="re.time" :postid="index" :storyid="id"/>
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
            <el-button v-loading="completion_status==1" @click="requestAI">帮写</el-button>
        </span>
        <div v-if="completion_status==2" class="completion-box-outer">
            <div class="completion-hint">
                帮写结果（单击以填入）
            </div>
            <div class="completion-box">
                <div class="completion-item" v-for="(o, index) in completion"
                    @click="complete"
                    :key="`fr1uit-${index}`">
                    {{o}}
                </div>
            </div>
        </div>
        <div v-if="completion_status!=2" style="height: 12em;"></div>
        <div style="height: 5em;"></div>
    </div>
</div>
</template>

<script>
import postitem from "@/components/postitem"
// import httpRequest from "@/utils/communication"
import commonQueries from "@/utils/commonqueries"
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
            post: {
                likes: []
            },
            id: undefined,
            completion: [],
            completion_status: 0,
        }
    },
    computed: {
        likedByMe() {
            let userid = commonQueries.getCookie("id")
            for (let i=0; i<this.post.likes.length; ++i)
                if (this.post.likes[i].id == userid)
                    return true
            return false
        },
    },
    beforeMount(){
        this.id = Number(this.$route.params.id)
        this.getPost()
    },
    methods:{
        getPost() {
            let xhr = new XMLHttpRequest()
            xhr.open("GET", "/api/thread/read?id="+this.id)
            xhr.onload = () =>{
                this.post = JSON.parse(xhr.response)
                console.log(this.post)
            }
            xhr.send()
        },
        getContext() {
            let context = this.post.title + " "
            for (let i=0; i<this.post.content.length; ++i)
                context += this.post.content[i].content + " "
            context += this.form.content
            return context
        },
        requestAI() {
            let xhr = new XMLHttpRequest()
            xhr.open("POST", "/api/storygen")
            this.completion_status=1
            xhr.onload = () =>{
                this.completion = JSON.parse(xhr.response).msg
                console.log(this.completion)
                this.completion_status=2
            }
            xhr.send(JSON.stringify({context:this.getContext()}))
        },
        complete(e) {
            console.log(e.target.innerText)
            this.form.content += e.target.innerText
            this.completion = []
            this.completion_status=0
        },
        likeit() {
            let xhr = new XMLHttpRequest
            xhr.open("post","/api/thread/like")
            xhr.send(JSON.stringify({id:this.id}))
            xhr.onload = (e)=>{
                if (e.target.status == 200) {
                    console.log(this.post.likes)
                    this.post.likes.push({id:commonQueries.getCookie("id")})
                }
                else {
                    console.error("failed", e.target.status)
                    this.$message.warning("点赞失败")
                }
            }
            xhr.onerror = ()=>{this.$message.warning("点赞失败")}
        },
        unlikeit() {
            let xhr = new XMLHttpRequest
            xhr.open("post","/api/thread/unlike")
            xhr.send(JSON.stringify({id:this.id}))
            xhr.onload = (e)=>{
                if (e.target.status == 200) {
                    let userid = commonQueries.getCookie("id")
                    for (let i=0; i<this.post.likes.length; ++i)
                        if (this.post.likes[i].id == userid)
                            this.post.likes.splice(i,1)
                }
                else {
                    console.error("failed", e.target.status)
                    this.$message.warning("取消点赞失败")
                }
            }
            xhr.onerror = ()=>{this.$message.warning("取消点赞失败")}
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
.completion-box-outer {
    margin-top: 10px;
}
.completion-hint {
    font-weight: bold;
}
.completion-box {
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-top: 5px;
    margin-bottom: 5px;
}
.completion-item {
    border-bottom: 1px solid #ddd;
    padding: 4px;
    cursor: pointer;
}
.completion-item:hover {
    color: white;
    background-color: #929;
}
</style>