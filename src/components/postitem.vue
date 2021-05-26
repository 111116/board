<template>
<div class="post-container">
    <img class="post-avatar" :src="author.avatarurl"/>
    <div class="bubble">
        <div class="post-author">{{author.name}}</div>
        <div class="post-content">{{content}}</div>
            <div class="post-time">{{time}}</div>
        <div class="bottom">
            <div class="comment" @click="commentToggle">{{comment.length}} 评论</div>
            <div class="fork" @click="dialogVisible=true;getBranch()">{{forkcnt}} 分支</div>
        </div>
        <div class="comments" v-if="commentVisible">
            <div class="comment-entry" v-for="(re,index) in comment" :key="`fruit-${index}`" >
                <!-- <img class="comment-avatar" :src="re.author.avatarurl"/> -->
                <span class="comment-author">{{re.author.name}}: </span>
                <span class="comment-content">{{re.content}}</span>
            </div>
            <el-form inline size="small" @submit.native.prevent>
                <el-form-item>
                    <el-input v-model="commentText" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="sendComment">评论</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
    <el-dialog title="分支剧情" :visible.sync="dialogVisible">
        <el-table :data="branchlist" v-loading="branchloading">
            <el-table-column property="author.name" label="分支作者"></el-table-column>
            <el-table-column property="branchname" label="分支名称"></el-table-column>
            <el-table-column label="跳转到分支">
                <template slot-scope="scope">
                    <a :href="'/thread/'+scope.row.story">跳转链接</a>
                </template>
            </el-table-column>
        </el-table>
        <br/>
        <el-form>
            <el-form-item label="新分支名称">
                <el-input v-model="branchname" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible=false">取消</el-button>
            <el-button type="primary" @click="dialogVisible=false;fork()">创建分支</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
import commonQueries from "@/utils/commonqueries"
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
        comment: {
            type: Array,
            default: () => []
        },
        storyid: {
            type: Number,
            default: () => -1
        },
        postid: {
            type: Number,
            default: () => -1
        },
        forkcnt: {
            type: Number,
            default: () => -1
        }
    },
    components: {
    },
    data(){
        return {
            dialogVisible: false,
            commentVisible: false,
            branchname: "",
            branchlist: [],
            branchloading: false,
            commentText: "",
        }
    },
    computed: {
    },
    beforeMount(){
    },
    methods:{
        fork() {
            console.log("forking", this.storyid, this.postid)
            let xhr = new XMLHttpRequest
            xhr.open("post","/api/thread/branch")
            xhr.send(JSON.stringify({
                story_id: this.storyid,
                message_id: this.postid,
                branch_name: this.branchname,
            }))
            xhr.onload = (e)=>{
                if (e.target.status == 200) {
                    this.$message.success("创建分支成功")
                    let resp = JSON.parse(e.target.response)
                    console.log(resp.id)
                    this.$router.push("/thread/"+resp.id)
                    this.$router.go()
                }
                else {
                    console.error("failed", e.target.status)
                    this.$message.error("创建分支失败！" + commonQueries.getErrorMsg(xhr))
                }
            }
            xhr.onerror = ()=>{this.$message.error("创建分支失败！" + commonQueries.getErrorMsg(xhr))}
        },
        getBranch() {
            let xhr = new XMLHttpRequest()
            this.branchloading = true
            xhr.open("GET", "/api/thread/getbranch?story_id="+this.storyid+"&message_id="+this.postid)
            xhr.onload = () =>{
                this.branchlist = JSON.parse(xhr.response).filter((o)=>(o.story!=this.storyid))
                this.branchloading = false
                console.log(this.post)
            }
            xhr.send()
        },
        commentToggle() {
            this.commentVisible = !this.commentVisible
        },
        sendComment() {
            if (this.commentText.length < 1) {
                this.$message.error("内容不能少于一个字")
                return
            }
            let xhr = new XMLHttpRequest()
            this.branchloading = true
            xhr.open("POST", "/api/thread/comment")
            xhr.onload = (e) =>{
                if (e.target.status == 200) {
                    this.$message.success('评论成功');
                    this.commentText = ""
                    this.$parent.getPost()
                }
                else {
                    this.$message.error("失败！" + commonQueries.getErrorMsg(xhr))
                }
            }
            xhr.send(JSON.stringify({
                story_id: this.storyid,
                message_id: this.postid,
                comment: this.commentText
            }))
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
.post-container {
    position: relative;
    margin-top: 16px;
    margin-bottom: 16px;
}
.el-pagination{
    text-align: center; 
    padding-top: 1em;
}
.post-avatar {
    position: absolute;
    left: -60px;
    top: 2px;
    height: 50px;
    border-radius: 50%;
}
.bubble {
    background-color: #eee;
    display: inline-block;
    padding-top: 10px;
    padding-bottom: 7px;
    padding-left: 12px;
    padding-right: 12px;
    border-radius: 12px;
    color: #000;
}
.post-author {
    font-weight: bold;
}
.bottom {
    float: right;
}
.comment {
    display: inline-block;
    font-size: 0.8em;
    color: #49d;
    cursor: pointer;
    margin-left: 10px;
}
.comment:hover {
    text-decoration: underline;
}
.comments .el-form-item {
    margin-top: 4px;
    margin-bottom: 2px;
}
.comment-entry {
    position: relative;
}
.comment-avatar {
    height: 30px;
    border-radius: 50%;
}
.comment-author {
    font-size: 0.8em;
    font-weight: bold;
    color: #888;
}
.comment-content {
    font-size: 0.8em;
}
.fork {
    display: inline-block;
    font-size: 0.8em;
    color: #49d;
    cursor: pointer;
    margin-left: 10px;
}
.post-time {
    display: inline-block;
    font-size: 0.8em;
    color: gray;
}
.fork:hover {
    text-decoration: underline;
}
.post-content {
    margin-top: 3px;
    margin-bottom: 3px;
    white-space: pre-wrap;
    word-spacing: 0.25em;
}
p {
  margin-bottom: 30px; /* between paragraphs */
}
</style>