<template>
<div class="outer-container">
    <div class="cover-container">
        <img :src="post.bkimg"/>
        <el-upload type="text" v-if="loggedin" action="/api/img/upload" class="el-icon-picture changecover" :on-success="handleUploadedCover"> 更换封面</el-upload>
    </div>
    <div class="maindiv">
        <h1 class="thread-title">{{post.title}}</h1>
        <div class="category">{{post.category}}</div>
        <el-button class="like-button" icon="el-icon-thumb" type="text" v-if="!likedByMe" @click="likeit">{{post.likes.length}}</el-button>
        <el-button class="unlike-button" icon="el-icon-thumb" type="text" v-if="likedByMe" @click="unlikeit">{{post.likes.length}}</el-button>
        <el-button type="text" icon="el-icon-cherry" class="story-fork" @click="branchlistVisible=true">{{post.branchlist.length}} 显示分支列表</el-button>
        <el-button type="text" icon="el-icon-download" class="story-export" @click="exportstory">导出故事文本</el-button>
        <hr/>
        <el-dialog title="分支剧情列表" :visible.sync="branchlistVisible">
            <el-table :data="post.branchlist">
                <el-table-column property="author.name" label="分支作者"></el-table-column>
                <el-table-column property="branchname" label="分支名称"></el-table-column>
                <el-table-column label="跳转到分支">
                    <template slot-scope="scope">
                        <a :href="'/thread/'+scope.row.id">跳转链接</a>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <postitem v-for="(re, index) in post.content"
            :key="`fruit-${index}`" :author="re.author" :content="re.content" :time="re.time" :postid="index" :storyid="id" :forkcnt="post.fork_cnt[index]"/>
        <!-- reply -->
        <hr/>
        <template v-if="loggedin">
            <el-form :model="form">
                <el-form-item>
                    <el-input type="textarea" v-model="form.content" rows="5" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitReply">发布</el-button>
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
        </template>
        <div class="el-icon-info" v-if="!loggedin" style="color:gray">
            您还未登录，请先登录以续写故事或发表评论
        </div>
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
            branchlistVisible: false,
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
        loggedin() {
            console.log(commonQueries.getCookie("id"))
            return commonQueries.getCookie("id")!=""
        }
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
        handleUploadedCover(e) {
            console.log(e)
            let xhr = new XMLHttpRequest()
            xhr.open("POST", "/api/thread/editimg")
            xhr.send(JSON.stringify({imgsrc: "/api/img/filename?name=" + e.filename, story_id: this.id}))
            xhr.onload = (e)=>{
                if (e.target.status == 200) {
                    this.$router.go()
                }
                else {
                    this.$message.warning("更换封面失败")
                }
            }
            e.filename
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
        },
        exportstory() {
            let text = this.post.title
            for (let i=0; i<this.post.content.length; ++i)
                text += "\n\n" + this.post.content[i].content
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', "story"+this.post.id+".txt");
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
    }
}
</script>

<style scoped>
.thread-title {
    font-size: 2em;
    line-height: 3em;
}
.category {
    display: inline-block;
}
.like-button {
    display: inline-block;
    padding-left: 10px;
    color: #2c3e50;
}
.unlike-button {
    display: inline-block;
    padding-left: 10px;
}
.story-fork {
    color: #2c3e50;
    font-weight: normal;
}
.story-export {
    color: #2c3e50;
    font-weight: normal;
}
.outer-container {
}
.cover-container {
    overflow: hidden;
    position: relative;
}
.changecover {
    position: absolute;
    right: 10px;
    bottom: 15px;
    font-size: 1em;
    font-weight: bold;
    color: #fff;
    text-shadow: 0px 1px 4px rgba(0,0,0,0.5);
}
.cover-container img {
    width: 100%;
    object-fit: cover;
    max-height: 400px;
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
form {
    margin-top: 15px;
}
.dialog-footer {
}
.completion-box-outer {
    margin-top: 18px;
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
