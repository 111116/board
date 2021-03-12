<template>
<div>
    <h2>操作历史</h2>
    <!-- asset edit dialog -->
    <div title="操作历史" >
        <el-form :inline="true">
            <el-form-item label="ID">
                <el-input v-model="assetid" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit">查询</el-button>
            </el-form-item>
            <el-form-item label="筛选申请类型" :label-width="formLabelWidth">
                <el-select v-model="form.operation" placeholder="请选择要查看的申请类型">
                    <el-option label="全部" value="all"></el-option>
                    <el-option label="领用" value="REQUIRE"></el-option>
                    <el-option label="转移" value="TRANSFER"></el-option>
                    <el-option label="维护" value="MAINTAIN"></el-option>
                    <el-option label="退库" value="RETURN"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <el-form>
        </el-form>
        <el-table align="center"
            :data="filtered"
            style="width: 100%">
            <el-table-column
                prop="id"
                label="操作序号"
                width="100">
            </el-table-column>
            <el-table-column
                prop="assetsid_str"
                label="资产ID"
                width="120">
            </el-table-column>
            <el-table-column
                prop="applier"
                label="申请人"
                width="120">
            </el-table-column>
            <el-table-column
                prop="operation"
                label="操作类型"
                width="150">
                <template slot-scope="props">
                    {{ readable_operation(props.row.operation) }}
                </template>
            </el-table-column>
            <el-table-column
                prop="target"
                label="转移对象"
                width="150">
            </el-table-column>
            <el-table-column
                prop="status"
                label="状态"
                width="120">
            </el-table-column>
            <el-table-column
                prop="optime"
                label="操作时间"
                width="210">
            </el-table-column>
            <el-table-column
                prop="department"
                label="部门"
                width="150">
            </el-table-column>
        </el-table>
    </div>
</div>
</template>

<script>
// import httpRequest from "@/utils/communication"
import commonQueries from "@/utils/commonqueries"
export default {
    name: 'assethistory',
    components: {
        // assetedit
    },
    data(){
        return{
            assetid: this.$route.query.assetid || "",
            history: [],
            form: {
                operation: "all",
            }
        }
    },
    computed: {
        filtered: function() {
            return this.history.filter(row=>(this.form.operation=="all" || this.form.operation==row.operation));
        }
    },
    beforeMount(){
        commonQueries.checkOnline(this)
        if (this.assetid != "")
            this.submit()
    },
    methods:{
        submit() {
            let xhr = new XMLHttpRequest
            xhr.open("post","/api/assets/history/")
            xhr.send(JSON.stringify({id:this.assetid}))
            xhr.onload = (e)=>{
                if (e.target.status == 200) {
                    this.$message.success("查询成功")
                    this.history = JSON.parse(e.target.responseText)
                    // preprocess
                    for (let i=0; i<this.history.length; ++i) {
                        console.log(this.history[i])
                        let t = ((o)=>(o.step2time || o.step1time || o.starttime))(this.history[i])
                        console.log("t",t)
                        this.history[i].optime = new Date(t).toLocaleString()
                        this.history[i].assetsid_str = this.history[i].assetsid.join(',')
                    }
                }
                else {
                    console.error("edit failed", e.target.status)
                    this.$message.error("查询失败")
                }
            }
            xhr.onerror = ()=>{this.$message.error("查询失败")}
        },
        readable_operation(op) {
            return {
                "REQUIRE": "领用",
                "TRANSFER": "转移",
                "MAINTAIN": "维护",
                "RETURN": "退库"
            }[op] || op
        },
    }
}
</script>

<style scoped>
hr {
    height: 1px;
    border: none;
    color: #EBEEF5;
    background-color: #EBEEF5;
}
</style>