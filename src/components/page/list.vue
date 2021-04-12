<template>
<div class="maindiv">
    <h2>故事列表</h2>
    <div style="margin-top: 20px;">
        <div style="position:relative;height: 40px;">
            <el-input class="story-search" placeholder="THIS DOESN'T WORK" v-model="searchinput">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-button class="newstory-button" icon="el-icon-plus" @click="newstory">创建新故事</el-button>
        </div>
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
                        <span class="story-likes el-icon-thumb">{{o.likes.length}}</span>
                        <svg class="story-fork-icon" height="14" viewBox="0 0 16 16" version="1.1" width="14" aria-hidden="true"><path fill-rule="evenodd" d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z"></path></svg>
                        <span class="story-forks">{{o.fork_cnt.reduce((a,b)=>a+b)}}</span>
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
<style>
.el-input__inner {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
}
.el-input-group__append {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
}
</style>
<style scoped>
.maindiv {
    width: 800px;
    margin: auto;
    margin-bottom: 20px;
}
.story-search {
    width: 80%;
    height: 40px;
    position: absolute;
    top:0px;
    left:0px;
}
.newstory-button {
    margin-left: 2%;
    width: 18%;
    height: 40px;
    position: absolute;
    top:0px;
    right: 0px;
    border-radius: 12px;
}
.el-card {
    height: 200px; 
    margin-top: 20px;   
    position: relative;
    border-radius: 10px;
    border: 1px solid #ddd;
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
    padding-right: 8px;
}
.story-likes:before {
    padding-right: 3px;
}
.story-likes {
    color: #15a;
    padding-right: 6px;
}
.story-forks:before {
    padding-right: 3px;
}
.story-fork-icon {
    fill: #15a;
    padding-top: 5px;
    top: 5px;
    transform: translate(0px,1px);
}
.story-forks {
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