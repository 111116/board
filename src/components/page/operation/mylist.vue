<!--asset list-->
<template>
    <div>
        <h2>我的申请</h2>
        <el-table align="center"
            :data="display_operations"
            style="width: 100%">
        <el-table-column
            prop="id"
            label="申请编号"
            width="150"
        />
        <el-table-column
            prop="starttime"
            label="发起时间"
            width="300">
        </el-table-column>
        <el-table-column
            prop="chOperation"
            label="请求类型"
            width="200">
        </el-table-column>
        <el-table-column
            prop="status"
            label="状态"
            width="200">
        </el-table-column>
        <el-table-column type="expand">
            <template slot-scope="props">
                <el-row v-if="props.row.operation!='REQUIRE' || props.row.status==='完成'">
                    <el-col :span="12">
                        资产编号： {{props.row.assetsid_str}}
                    </el-col>
                    <el-col :span="12">
                    <el-button size="small" @click="showAssetDialog(props.row.assetsid)">
                        详细信息
                    </el-button>
                    </el-col>
                </el-row>
                <p v-if="props.row.operation==='REQUIRE'">申请描述：{{props.row.description}}</p>
                <p v-if="props.row.operation==='TRANSFER'">转移对象：{{props.row.target}}</p>
                <el-steps :active="getStep(props.row)" finish-status="success" style="padding-top:10px">
                    <el-step title="发起申请" :description="props.row.applier+' '+props.row.starttime"/>
                    <el-step title="主管审核" v-if="props.row.operation!='RETURN' && props.row.operation!='MAINTAIN'" :description="props.row.supervisorname+' '+props.row.step1time" :status="getStep1Status(props.row)"/>
                    <el-step title="资产管理员确认" v-if="props.row.operation!='TRANSFER'" :description="props.row.assetmanagername+' '+props.row.step2time" :status="getStep2Status(props.row)"/>
                    <el-step title="完成"/>
                </el-steps>
            </template>
        </el-table-column>
        </el-table>
        <el-pagination
            layout="prev, pager, next"
            :total="operations.length"
            :page-size="pageSize"
            @current-change="handleCurrentChange"/>
        <assetDialog
            v-bind="{visible: assetDialogVisible, id: assets_id, is_user: true}"
            @hide="hideAssetDialog"/>
    </div>
</template>

<script>
import httpRequest from "@/utils/communication"
import assetDialog from "@/components/assetDialog.vue"
import commonQueries from "@/utils/commonqueries.js"
export default {
    name: "operation_mylist",
    props: {
    },
    components: {
        assetDialog,
    },
    data(){
        return{
            full_operations: [],
            op_name: {
                "" : "未知",
                "REQUIRE": "领用",
                "MAINTAIN": "维护",
                "RETURN": "退库",
                "TRANSFER": "转移"
            },
            showWait: false,
            curPage: 0,
            pageSize: 10,
            assets_id: [],
            assetDialogVisible: false,
        }
    },
    watch: {
    },
    beforeMount(){
        commonQueries.checkOnline(this)
        this.getOperations()
        //this.createOperation()
    },
    methods: {
        getOperations: function(){
            let xhr = new XMLHttpRequest()
            httpRequest.post(xhr, "/api/operation/mylist/", {})
            this.full_operations = []
            xhr.addEventListener("load", () => {
                if (xhr.status == 200){
                    console.log(xhr.responseText)
                    let resp = eval("(" + xhr.responseText + ")")
                    for (let i in resp){
                        this.full_operations.push(resp[i])
                        this.full_operations[i].assetsid_str = this.full_operations[i].assetsid.join(',')
                        this.full_operations[i].chOperation = this.op_name[this.full_operations[i].operation]
                    }
                    this.full_operations.sort((a, b) => {
                        if (a.starttime > b.starttime) return -1
                            else if (a.starttime < b.starttime)return 1
                                else return 0
                    })
                    this.curPage = 0
                }else{
                    this.$message.error('服务器错误！')
                }
            })
        },
        getStep: function(obj){
            if (obj.status === '等待主管审核' || obj.status === '审核未通过')return 1
            if (obj.status === '等待资产管理员确认' || obj.status === '确认未通过'){
                if (obj.operation === 'REQUIRE')return 2
                    else return 1
            }
            if (obj.operation === 'REQUIRE')return 4
                else return 3
        },
        getStep1Status: function(obj){
            if (obj.status === '等待主管审核')return "process"
            if (obj.status === '审核未通过')return "error"
            return "success"
        },
        getStep2Status: function(obj){
            if (obj.status === '等待主管审核' || obj.status === '审核未通过')return "wait"
            if (obj.status === '等待资产管理员确认')return "process"
            if (obj.status === '确认未通过')return "error"
            return "success"
        },
        showAssetDialog: function(assetsid){
            this.assets_id = assetsid
            this.assetDialogVisible = true
        },
        hideAssetDialog: function(){
            this.assetDialogVisible = false
        },
        handleCurrentChange: function(val){
            this.curPage = val - 1;
        },
        createOperation: function(){
            this.full_operations.push({
                id: "1",
                assetsid: ["2"],
                assetsid_str: "2",
                category: "平板电脑",
                number: 2,
                applier: "admin",
                operation: "MAINTAIN",
                chOperation: "维保",
                department: "Wuhu",
                transfer: "user",
                status: "等待资产管理员确认",
                description: "iPad Pro，想要",
                starttime: "2020-11-11 11:11:11",
                step1time: "2020-11-11 13:30:00",
                step2time: "2020-11-11 17:43:26",
                supervisorname: "admin",
                assetmanagername: "admin",
            })
        }
    },
    computed: {
        operations: function(){
            return this.full_operations
        },
        display_operations: function(){
            return this.operations.slice(this.curPage * this.pageSize, (this.curPage + 1) * this.pageSize)
        }
    }
}
</script>

<style scoped>
.el-pagination{
    text-align: center; 
    padding-top: 1em;
}
.el-table{
    padding-top: 1em;
}
</style>