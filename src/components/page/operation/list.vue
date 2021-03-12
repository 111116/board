<!--asset list-->
<template>
    <div>
        <h2>申请列表</h2>
        <el-checkbox v-model="showWait">等待我审批的申请</el-checkbox>
        <el-table align="center"
            :data="display_operations"
            style="width: 100%">
        <el-table-column
            prop="id"
            label="申请编号"
            width="150"
        />
        <el-table-column
            prop="applier"
            label="请求用户"
            width="150">
        </el-table-column>
        <el-table-column
            prop="starttime"
            label="发起时间"
            width="250">
        </el-table-column>
        <el-table-column
            prop="chOperation"
            label="请求类型"
            width="150">
        </el-table-column>
        <el-table-column
            prop="status"
            label="状态"
            width="150">
        </el-table-column>
        <el-table-column
            label="操作"
            width="200">
            <template slot-scope="scope">
                <el-button 
                    v-if="!isAssign(scope.$index)"
                    @click="approve(scope.$index, true)" 
                    type="text" 
                    size="small" 
                    v-bind:class="{'text-accept': checkStatus(scope.$index), 'text-disabled': !checkStatus(scope.$index)}"
                    :disabled="checkStatus(scope.$index)==false">同意</el-button>
                <el-button
                    v-if="isAssign(scope.$index)"
                    @click="showAssignDialog(scope.$index)"
                    type="text"
                    size="small"
                    v-bind:class="{'text-accept': checkStatus(scope.$index), 'text-disabled': !checkStatus(scope.$index)}"
                    :disabled="!checkStatus(scope.$index)"
                >分配资产</el-button>
                <el-button 
                    @click="approve(scope.$index, false)" 
                    type="text" 
                    size="small" 
                    v-bind:class="{'text-danger': checkStatus(scope.$index), 'text-disabled': !checkStatus(scope.$index)}" 
                    :disabled="checkStatus(scope.$index)==false">拒绝</el-button>
            </template>
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
                <p v-if="props.row.operation==='TRANSFER'">转移信息：从{{props.row.applier}}转移到{{props.row.target}}</p>
            </template>
        </el-table-column>
        </el-table>
        <el-pagination
            layout="prev, pager, next"
            :total="operations.length"
            :page-size="pageSize"
            @current-change="handleCurrentChange"/>
        <assignDialog
            v-bind="{visible: assignDialogVisible, id: op_id.toString(), category: op_category, number: op_number}"
            @hide="hideAssignDialog"
            @refresh="getOperations"/>
        <assetDialog
            v-bind="{visible: assetDialogVisible, id: assets_id, is_user: false}"
            @hide="hideAssetDialog"/>
    </div>
</template>

<script>
import httpRequest from "@/utils/communication"
import authorityUtils from "@/utils/authority"
import assignDialog from "@/components/assignDialog.vue"
import assetDialog from "@/components/assetDialog.vue"
import commonQueries from "@/utils/commonqueries.js"
export default {
    name: "operation_list",
    props: {
    },
    components: {
        assignDialog,
        assetDialog,
    },
    data(){
        return{
            full_operations: [],
            op_name: {
                "REQUIRE": "领用",
                "MAINTAIN": "维护",
                "RETURN": "退库",
                "TRANSFER": "转移"
            },
            showWait: this.$route.query.todo === "true",
            curPage: 0,
            pageSize: 10,
            op_id: '',
            op_category: '',
            op_number: 1,
            assets_id: [],
            assignDialogVisible: false,
            assetDialogVisible: false,
        }
    },
    watch: {
        showWait: function(val){
            this.$router.push({ query: { ...this.$route.query, todo: val } })
        },
        "$route.query.username": function(val){
            this.showWait = val === "true"
        }
    },
    beforeMount(){
        commonQueries.checkOnline(this)
        //authorityUtils.checkAuthority(this, ["supervisor", "assetmanager", "ITmanager"])
        this.getOperations()
        //this.createOperation()
    },
    methods: {
        getOperations: function(){
            let xhr = new XMLHttpRequest()
            httpRequest.post(xhr, "/api/operation/query/", {})
            this.full_operations = []
            xhr.addEventListener("load", () => {
                if (xhr.status == 200){
                    this.full_operations = []
                    let cnt = 0
                    //console.log(xhr.responseText)
                    let resp = eval("(" + xhr.responseText + ")")
                    for (let i in resp){
                        if (!(resp[i].operation in this.op_name))continue
                        this.full_operations.push(resp[i])
                        if (this.full_operations[cnt].assetsid)
                            this.full_operations[cnt].assetsid_str = this.full_operations[cnt].assetsid.join(',')
                        this.full_operations[cnt].chOperation = this.op_name[this.full_operations[cnt].operation]
                        cnt += 1
                    }
                    this.full_operations.sort((a, b) => {
                        if (a.starttime > b.starttime) return -1
                            else if (a.starttime < b.starttime)return 1
                                else return 0
                    })
                    this.curPage = 0
                }else if (xhr.status == 401){
                    this.$message.error('用户权限不足！')
                }else{
                    this.$message.error('服务器错误！')
                }
            })
        },
        checkStatus: function(index){
            if (authorityUtils.existAuthority("supervisor") && this.display_operations[index].status === "等待主管审核")return true
            if (authorityUtils.existAuthority("assetmanager") && this.display_operations[index].status === "等待资产管理员确认")return true
            return false
            //return true
        },
        isAssign: function(index){
            return this.display_operations[index].status === "等待资产管理员确认" && this.display_operations[index].operation === "REQUIRE"
        },
        approve: function(index, approved){
            let xhr = new XMLHttpRequest()
            httpRequest.post(xhr, "/api/operation/approval/", {
                id: this.display_operations[index].id,
                response: approved ? "approve" : "reject"
            })
            xhr.addEventListener("load", () => {
                if (xhr.status == 200){
                    this.$message.success('审批完成！')
                    this.getOperations()
                }else if (xhr.status == 401){
                    this.$message.error('审批请求不合法！')
                }else{
                    this.$message.error('服务器内部错误！')
                }
            })
        },
        showAssignDialog: function(index){
            this.op_id = this.display_operations[index].id
            this.op_category = this.display_operations[index].category
            this.op_number = this.display_operations[index].number
            this.assignDialogVisible = true
        },
        showAssetDialog: function(assetsid){
            this.assets_id = assetsid
            this.assetDialogVisible = true
        },
        hideAssignDialog: function(){
            this.assignDialogVisible = false
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
                assetsid: "",
                category: "平板电脑",
                number: 2,
                applier: "admin",
                operation: "REQUIRE",
                chOperation: "领用",
                department: "Wuhu",
                transfer: "",
                status: "等待资产管理员确认",
            })
        }
    },
    computed: {
        operations: function(){
            return this.full_operations.filter(row => 
                (this.showWait ? row.status === "等待主管审核" && authorityUtils.existAuthority("supervisor") || row.status === "等待资产管理员确认" && authorityUtils.existAuthority("assetmanager"): true)
            )
        },
        display_operations: function(){
            return this.operations.slice(this.curPage * this.pageSize, (this.curPage + 1) * this.pageSize)
        }
    }
}
</script>

<style scoped>
.text-accept{
    color: #67C23A;
}
.text-danger{
    color:#F56C6C;
}
.text-disabled{
    color:#909399;
}
.el-pagination{
    text-align: center; 
    padding-top: 1em;
}
.el-table{
    padding-top: 1em;
}
</style>