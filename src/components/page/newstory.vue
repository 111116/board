<template>
<div class="maindiv">
    <h2>创建故事</h2>
    <el-form :model="form">
        <el-form-item label="标题">
            <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        
        <el-form-item label="内容">
            <el-input type="textarea" v-model="form.content" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类">
            <el-select v-model="form.category" placeholder="Select">
                <el-option
                  v-for="item in categories"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
            </el-select>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="editVisible = false">取消</el-button> -->
        <el-button type="primary" @click="submit">发布</el-button>
    </span>
</div>
</template>

<script>
// import httpRequest from "@/utils/communication"
export default {
    name: 'newstory',
    components: {
    },
    data(){
        return {
            formLabelWidth: '120px',
            categories: ['悬疑','校园'],
            form: {
                title: "",
                content: "",
                category: "",
                bkimg: "/background.jpeg",
            },
        }
    },
    computed: {
    },
    beforeMount(){
    },
    methods:{
        submit() {
            let xhr = new XMLHttpRequest
            xhr.open("post","/api/thread/new")
            xhr.send(JSON.stringify(this.form))
            xhr.onload = (e)=>{
                if (e.target.status == 200) {
                    this.$message.success("编辑成功")
                    this.$router.push('/')
                }
                else {
                    console.error("edit failed", e.target.status)
                    this.$message.error("编辑失败")
                }
            }
            xhr.onerror = ()=>{this.$message.error("编辑失败")}
        }
    }
}
</script>

<style scoped>
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
.cascade {
    width: 100%;
}
.el-pagination{
    text-align: center; 
    padding-top: 1em;
}
</style>