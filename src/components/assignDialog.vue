<template>
    <el-dialog
        style="text-align: center"
        title="分配资产"
        :show-close=false
        :visible.sync="visible"
        width="50%">
        <el-row>
        <el-col :span="12"><span>请求资产分类：{{category}}</span></el-col>
        <el-col :span="12"><span>数量：{{number}}</span></el-col>
        </el-row>
        <el-table 
            :data="assets"
            style="width:100%"
            align="center"
            @selection-change="handleSelectionChange">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                prop="id"
                label="ID"
                width="150">
            </el-table-column>
            <el-table-column
                prop="name"
                label="名称"
                width="250">
            </el-table-column>
            <el-table-column
                prop="maintainer"
                label="挂账人"
                width="150">
            </el-table-column>
            <el-table-column type="expand">
                <template slot-scope="props">
                    <p>名称: {{ props.row.name }}</p>
                    <p>描述: {{ props.row.description }}</p>
                    <p>分类: {{ props.row.category }}</p>
                    <hr/>
                    <p>挂账人: {{ props.row.maintainer }}</p>
                    <p>使用人: {{ props.row.currentuser }}</p>
                    <p>挂账部门: {{ props.row.department }}</p>
                    <p>当前位置: {{ props.row.location }}</p>
                    <hr/>
                    <p>品牌: {{ props.row.brand }}</p>
                    <p>型号: {{ props.row.model }}</p>
                    <p>序列号: {{ props.row.serial }}</p>
                    <p>从属资产: {{ props.row.parentid }}</p>
                    <hr/>
                    <p>当前价值: {{ props.row.value }}</p>
                    <p>入库时间: {{ new Date(props.row.date*1000).toLocaleString() }}</p>
                    <p>使用期限: {{ props.row.lifespan==0? "--": new Date((props.row.date+props.row.lifespan)*1000).toLocaleString() }}</p>
                </template>
            </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-button v-on:click="cancel">取 消</el-button>
            <el-button type="primary" v-on:click="confirm">确认分配</el-button>
        </span>
    </el-dialog>
</template>
<script>
import httpRequest from "@/utils/communication"
import commonQueries from "@/utils/commonqueries"
export default {
    name: "assignDialog",
    props: {
        visible: {
            type: Boolean,
            default: () => true,
        },
        id: {
            type: String,
            default: () => '',
        },
        category: {
            type: String,
            default: () => '',
        },
        number: {
            type: Number,
            default: () => 1,
        }
    },
    data(){
        return {
            assets: [],
            selected: [],
        }
    },
    methods: {
        getAssets: function(){
            console.log(this.category)
            let requirements = {
                status: "IDLE",
                department: JSON.parse(JSON.parse(commonQueries.getCookie("department"))),
                category: this.category,
                id: '',
                name: '',
                maintainer: '',
                description: '',
                parentid: '',
                serial: '',
                brand: '',
                model: '',
                location: '',
                currentuser: '',
                value: '',
            }
            console.log(requirements)
            let xhr = new XMLHttpRequest()
            httpRequest.post(xhr, "/api/assets/query/", requirements)
            this.assets = []
            let category = this.category
            xhr.addEventListener("load", () =>{
                let resp = eval("(" + xhr.responseText + ")")
                for (let i in resp)
                    if (resp[i].category === category)
                        this.assets.push(resp[i])
            })
            console.log(this.assets)
        },
        handleSelectionChange(val){
            this.selected = val
        },
        confirm: function(){
            if (this.selected.length != this.number){
                this.$message.error('分配资产数量和请求数量不匹配')
                return
            }
            let assetsid = []
            for (let i in this.selected)assetsid.push(this.selected[i].id)
            let xhr = new XMLHttpRequest()
            httpRequest.post(xhr, "/api/operation/assign/", {
                id: this.id,
                assetsid: assetsid
            })
            xhr.addEventListener("load", () =>{
                if (xhr.status == 401){
                    this.$message.error('请求格式错误')
                }else if (xhr.status == 200){
                    this.$message.success('分配成功')
                    this.$emit("refresh")
                }else{
                    this.$message.error('服务器错误')
                }
            })
            this.cancel()
        },
        cancel: function(){
            this.$emit("hide")
        },
    },
    watch: {
        category: function(){
            this.getAssets()
        }
    }
}
</script>
<style scoped>
.select{
    width: 100%;
}
.el-dialog__body{
    padding: 10px 10px;
}
</style>