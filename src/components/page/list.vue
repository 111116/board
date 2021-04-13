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
        <el-menu default-active="all" class="category-menu" mode="horizontal" @select="handleCategorySelect">
            <el-menu-item class="category" index="all">全部分类</el-menu-item>
            <el-menu-item v-for="(o,index) in categories" class="category" :index="o" :key="'cat'+index">
                {{o}}
            </el-menu-item>
            <el-menu-item class="category" index="plus">
                <el-button type="text" icon="el-icon-plus" size="mini" @click="dialogVisible=true"></el-button>
            </el-menu-item>
        </el-menu>
        <el-dialog title="添加故事分类" :visible.sync="dialogVisible">
            <el-form>
                <el-form-item label="分类名">
                    <el-input v-model="newcategoryname" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible=false">取消</el-button>
                <el-button type="primary" @click="dialogVisible=false;newcategory()">创建分类</el-button>
            </span>
        </el-dialog>
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
                        <el-button type="text" icon="el-icon-thumb" class="story-likes">{{o.likes.length}}</el-button>
                        <el-button type="text" icon="el-icon-cherry" class="story-forks">{{o.branch_cnt}}</el-button>
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
            categories: [],
            newcategoryname: "",
            dialogVisible: false,
        }
    },
    computed: {
    },
    beforeMount(){
        this.getPosts("all")
        this.getCategories()
    },
    methods:{
        newstory() {
            this.$router.push('/newstory')
        },
        getPosts(category) {
            let xhr = new XMLHttpRequest()
            xhr.open("GET", category=="all"? "/api/forum/listall": "/api/forum/listcategory?category="+category)
            xhr.onload = () =>{
                this.posts = JSON.parse(xhr.response).reverse()
                console.log("POSTS:", this.posts)
            }
            xhr.send()
        },
        handleCategorySelect(e) {
            if (e=="plus") {
                1+1 // do nothing
            }
            else {
                this.getPosts(e)
            }
        },
        newcategory() {
            let xhr = new XMLHttpRequest()
            xhr.open("POST", "/api/forum/addcategory")
            xhr.onload = () =>{
                this.getCategories()
            }
            xhr.send(JSON.stringify({category:this.newcategoryname}))
        },
        getCategories() {
            let xhr = new XMLHttpRequest()
            xhr.open("GET", "/api/forum/categories")
            xhr.onload = () =>{
                this.categories = JSON.parse(xhr.response)
                console.log("Categories:", this.categories)
            }
            xhr.send()
        }
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
.category-menu {
    height: 50px;
}
.category {
    height: 50px;
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
    right: 12px;
    top: 161px;
}
.story-category {
    color: #555;
    padding-right: 8px;
}
.story-likes {
    color: #16b;
    padding: 0px !important;
}
.story-forks {
    color: #16b;
    padding: 0px !important;
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