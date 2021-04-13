<template>
<div class="post-container">
    <img class="post-avatar" :src="author.avatarurl"/>
    <div class="bubble">
        <div class="post-author">{{author.name}}</div>
        <div class="post-content">{{content}}</div>
            <div class="post-time">{{time}}</div>
        <div class="bottom">
            <div class="comment" @click="comment">0 评论</div>
            <div class="fork" @click="dialogVisible = true">{{forkcnt}} 分支</div>
        </div>
    </div>
    <el-dialog title="分支剧情" :visible.sync="dialogVisible">
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
            branchname: "",
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
                    this.$message.error("创建分支失败")
                }
            }
            xhr.onerror = ()=>{this.$message.error("创建分支失败")}
        },
        comment() {

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