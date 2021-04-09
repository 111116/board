<template>
<div class="post-container">
    <img class="post-avatar" :src="author.avatarurl"/>
    <div class="bubble">
        <div class="post-author">{{author.name}}</div>
        <div class="post-time">{{time}}</div>
        <div class="post-content">{{content}}</div>
    </div>
    <div class="fork" @click="fork">fork</div>
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
        fork() {
            this.$confirm('你将要从此处分支剧情，并创建一个新的续写故事。是否继续？', '创建故事分支', {
                confirmButtonText: '创建分支',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                console.log("forking", this.storyid, this.postid)
                let xhr = new XMLHttpRequest
                xhr.open("post","/api/thread/fork")
                xhr.send(JSON.stringify({story_id: this.storyid, message_id: this.postid+1}))
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
            })
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
    padding-bottom: 10px;
    padding-left: 12px;
    padding-right: 12px;
    border-radius: 12px;
    color: #000;
}
.post-author {
    font-weight: bold;
}
.fork {
    float: right;
    font-size: 0.8em;
    color: #49d;
    cursor: pointer;
}
.fork:hover {
    text-decoration: underline;
}
.post-time {
    font-size: 0.8em;
    color: gray;
}
.post-content {
    margin-top: 3px;
    white-space: pre-wrap;
}
p {
  margin-bottom: 30px; /* between paragraphs */
}
</style>