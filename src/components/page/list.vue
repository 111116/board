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
                    <a :href="`/thread/${o.id}`"><h3>{{o.title}}</h3></a>
                    <div>{{o.category}}</div>
                    <div>{{o.author.name}}</div>
                    <div>{{o["time updated"]}}</div>
                    <div>{{o.firstcontent}}</div>
                    <div>{{o.likes}} likes</div>
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
    max-width: 800px;
    margin: auto;
}
.el-card {
    height: 200px; 
    margin-top: 20px;   
    margin-bottom: 20px;   
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
    left: 315px;
}
.card-content a {
    width: 100%;
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
    color: #3333cc;
    letter-spacing: 0.2px;
}

</style>