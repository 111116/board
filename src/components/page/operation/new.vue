<!--asset list-->
<template>
<div>
    <div class="reqbox">
        <div class="title">领用申请</div>
        <el-container>
            <el-main>
                <el-form>
                    <el-form-item label="资产分类">
                        <el-cascader 
                        v-model="category"
                        :options="categories.children"
                        style="width:80%"
                        ></el-cascader>
                    </el-form-item>
                    <el-form-item label="领用数量">
                        <el-input v-model="number" style="width:80%"></el-input>
                    </el-form-item>
                    <el-form-item label="申请理由">
                        <el-input v-model="description" style="width:80%" type="textarea" :rows="5"></el-input>
                    </el-form-item>
                </el-form>
                <div class="footer" align="center">
                    <el-button type="primary" @click="submit">提交申请</el-button>
                </div>
            </el-main>
        </el-container>
    </div>
</div>
</template>

<script>
import httpRequest from "@/utils/communication"
import Consts from "@/utils/const"
import commonQueries from "@/utils/commonqueries"
import treeUtils from "@/utils/tree"
export default {
    name: "operation_new",
    props: {
    },
    data(){
        return{
            category: '',
            categories: Consts.fake_categories,
            number: 0,
            description: '',
        }
    },
    beforeMount(){
        commonQueries.checkOnline(this)
        this.getCategories()
        //treeUtils.gen_label_value(this.categories)
    },
    methods: {
        getCategories: function(){
            let xhr = new XMLHttpRequest()
            httpRequest.post(xhr, "/api/assets/category/query/", {})
            xhr.addEventListener("load", () =>{
                if (xhr.status == 200){
                    this.categories = eval('(' + xhr.responseText + ')')
                    console.log(this.categories)
                    treeUtils.gen_label_value(this.categories)
                }else{
                    this.$message.error('服务器错误')
                }
            })
        },
        submit: function(){
            let xhr = new XMLHttpRequest()
            httpRequest.post(xhr, "/api/operation/apply/", {
                operation: "REQUIRE",
                applier: commonQueries.getCookie("username"),
                category: this.category[this.category.length - 1],
                description: this.description,
                number: this.number,
            })
            xhr.addEventListener("load", () => {
                if (xhr.status == 200){
                    this.$message.success('提交成功！')
                }else{
                    this.$message.error('提交失败！')
                }
            })
        },
    }
}
</script>

<style scoped>
    .reqbox {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 500px;
        margin: -190px 0 0 -175px;
        border-radius: 5px;
        border: #ddd 1px solid;
    }
    .title {
        width: 100%;
        line-height: 60px;
        text-align: center;
        font-size: 20px;
        border-bottom: 1px solid #ddd;
    }
    .footer {
    }
</style>