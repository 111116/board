<template>
<div class="maindiv">
    <h2>故事列表</h2>
    <el-button @click="newstory">创建新故事</el-button>
    <div style="margin-top: 20px;">
        <el-input placeholder="THIS DOESN'T WORK" v-model="searchinput">
            <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-row v-for="(o, index) in posts" :key="index">
            <el-card :body-style="{ padding: '0px' }" shadow="always">
                <img :src="o.bkimg" class="card-image">
                <div class="card-content">
                    <a :href="`/thread/${o.id}`"><h3 class="story-title">{{o.title}}</h3></a>
                    <img class="author-avatar" :src="o.author.avatarurl"/>
                    <div class="author-info">
                        <span class="author-name">{{o.author.name}}</span>
                        <span class="story-time">{{o["time updated"]}}</span>
                    </div>
                    <div class="story-info">
                        <span class="story-category">{{o.category}}</span>
                        <span class="story-likes">{{o.likes.length}}赞</span>
                    </div>
                    <div class="story-firstcontent">{{o.firstcontent}}</div>
                    <!-- <div class="bottom clearfix">
                        <time class="time">{{ currentDate }}</time>
                        <el-button type="text" class="button">Operating</el-button>
                    </div> -->
                </div>
            </el-card>
        </el-row>
    </div>
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
            searchinput: "",
            posts: [],
        }
    },
    computed: {
    },
    beforeMount(){
        this.getPosts()
    },
    methods:{
        newstory() {
            this.$router.push('/newstory')
        },
        getPosts() {
            let xhr = new XMLHttpRequest()
            console.log("fuck")
            xhr.open("GET", "/api/forum/listall")
            xhr.onload = () =>{
                this.posts = JSON.parse(xhr.response).reverse()
                console.log(this.posts)
            }
            xhr.send()
        },
    }
}
</script>

<style scoped>
.maindiv {
    width: 800px;
    margin: auto;
}
.el-card {
    height: 200px; 
    margin-top: 20px;   
    position: relative;
}
.card-image {
    height: 200px;
    width: 300px;
    object-fit: cover;
    position: absolute;
}
.card-content {
    position: absolute;
    line-height: 1.5em;
    width: 480px;
    left: 315px;
}
.card-content h3 {
    width: 100%;
    margin-top: 15px;
    padding-bottom: 0px;
}
.story-firstcontent {
    position: absolute;
    top: 50px;
    width: 470px;
    height: 90px;
    color: #666;
    overflow: hidden;
    text-overflow: ellipsis;
}
.author-avatar {
    height: 35px;
    position: absolute;
    left: 0px;
    top: 155px;
    border-radius: 50%;
}
.author-info {
    position: absolute;
    left: 40px;
    top: 160px;
}
.author-name {
    font-size: 0.9em;
    font-weight: bold;
    padding-left: 5px;
}
.story-title {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
.story-time {
    color: gray;
    padding-left: 10px;
    font-size: 0.8em;
}
.story-info {
    font-size: 0.9em;
    position: absolute;
    right: 10px;
    top: 160px;
}
.story-category {
    color: #555;
    padding-right: 6px;
}
.story-likes {
    color: #15a;
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
a {
    text-decoration: none;
    color: black;
}
a:hover {
    color: #1144aa;
}

</style>