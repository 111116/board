<template>
    <el-dialog
        style="text-align: center"
        title="资产详细信息"
        :show-close=false
        :visible.sync="visible"
        width="50%">
        <el-table 
            :data="assets"
            style="width:100%"
            align="center">
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
        <div class="remark" v-if="is_user"><span>备注：无法查看未挂账在自己名下的资产信息</span></div>
        <span slot="footer" class="dialog-footer">
            <el-button v-on:click="cancel">确认</el-button>
        </span>
    </el-dialog>
</template>
<script>
import httpRequest from "@/utils/communication"
import commonQueries from "@/utils/commonqueries"
export default {
    name: "assetDialog",
    props: {
        visible: {
            type: Boolean,
            default: () => true,
        },
        id: {
            type: Array,
            default: () => [],
        },
        is_user: {
            type: Boolean,
            defalut: () => true,
        }
    },
    data(){
        return {
            assets: [],
        }
    },
    methods: {
        getAssets: function(){
            let requirements = {
                status: '',
                department: JSON.parse(JSON.parse(commonQueries.getCookie("department"))),
                category: '',
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
            let xhr = new XMLHttpRequest()
            if (this.is_user)httpRequest.post(xhr, "/api/assets/mylist/", requirements)
                else httpRequest.post(xhr, "/api/assets/query/", requirements)
            this.assets = []
            console.log(this.id)
            xhr.addEventListener("load", () =>{
                let resp = eval("(" + xhr.responseText + ")")
                for (let i in resp){
                    console.log(resp[i].id)
                    for (let j in this.id)
                        if (resp[i].id.toString() === this.id[j])this.assets.push(resp[i])
                }
            })
            console.log(this.assets)
        },
        cancel: function(){
            this.$emit("hide")
        },
    },
    watch: {
        id: function(){
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
.remark{
    padding-top: 15px;
}
</style>