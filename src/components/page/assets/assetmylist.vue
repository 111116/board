<template>
<div>
    <h2>资产列表</h2>
    <!-- buttons -->
    <el-button @click="batchOperation" :disabled="operationDisabled">对选中资产发起申请</el-button>

    <!-- custom search options -->
    <el-collapse>
        <el-collapse-item title="高级查找" name="1">
            <el-form :inline="true">
                <el-form-item label="ID">
                    <el-input v-model="searchform.id" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="searchform.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="searchform.description" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="分类">
                    <el-cascader 
                        v-model="searchform.category"
                        :options="categories.children"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="挂账人">
                    <el-input v-model="searchform.maintainer" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="挂账部门">
                    <el-cascader 
                        v-model="searchform.department"
                        :options="departments.children"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="使用人">
                    <el-input v-model="searchform.currentuser" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="searchform.status" placeholder="请选择该资产的状态">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="闲置" value="IDLE"></el-option>
                        <el-option label="使用中" value="IN_USE"></el-option>
                        <el-option label="维护中" value="IN_MAINTAIN"></el-option>
                        <el-option label="已清退" value="RETIRED"></el-option>
                        <!-- <el-option label="已删除" value="DELETED"></el-option> -->
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button @click="clearsearch">清除筛选条件</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="applysearch">查询</el-button>
                </el-form-item>
            </el-form>
        </el-collapse-item>
    </el-collapse>

    <!-- operation dialog -->
    <el-dialog :visible.sync="operation.visible">
        <el-form>
            <!-- <el-form-item label="资产ID" :label-width="formLabelWidth">
                <el-input type="请输入资产编号" autocomplete="off"></el-input>
            </el-form-item> -->
            <el-form-item label="申请类型" :label-width="formLabelWidth">
                <el-select v-model="operation.operation" placeholder="请选择申请类型" width="100%">
                    <el-option label="转移" value="TRANSFER"></el-option>
                    <el-option label="维护" value="MAINTAIN"></el-option>
                    <el-option label="退库" value="RETURN"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="转移对象"
                    :label-width="formLabelWidth"
                    v-if="operation.operation=='TRANSFER'">
                <el-autocomplete
                    class="inline-input"
                    v-model="operation.target"
                    placeholder="转移对象的用户名"
                    style="width:100%;"
                    :fetch-suggestions="querySearch"/>
            </el-form-item>
            <el-form-item label="申请描述" :label-width="formLabelWidth">
                <el-input v-model="operation.description" style="width:80%" type="textarea" :rows="5"></el-input>
            </el-form-item>
        </el-form>
        <div class="footer" align="center">
            <el-button type="primary" @click="operationsubmit">提交申请</el-button>
        </div>
    </el-dialog>

    <!-- asset list -->
    <div>
        <el-table align="center"
            :data="display_filtered"
            @selection-change="handleSelectionChange"
            style="width: 100%">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                prop="id"
                label="ID"
                width="120">
            </el-table-column>
            <el-table-column
                prop="name"
                label="名称"
                width="250">
            </el-table-column>
            <el-table-column
                prop="category"
                label="类别"
                width="150">
            </el-table-column>
            <el-table-column
                prop="maintainer"
                label="挂账人"
                width="130">
            </el-table-column>
            <el-table-column
                prop="status"
                label="状态"
                width="130">
                <template slot-scope="props">
                    {{ readable_status(props.row.status) }}
                </template>
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
                    <p>当前价值: ￥{{ props.row.value/100 }} </p>
                    <p>入库时间: {{ new Date(props.row.date*1000).toLocaleString() }}</p>
                    <p>使用期限: {{ props.row.lifespan==0? "--": new Date((props.row.date+props.row.lifespan)*1000).toLocaleString() }}</p>
                    <assetlabel v-bind="props.row"/>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            layout="prev, pager, next"
            :total="filtered.length"
            :page-size="pageSize"
            @current-change="handleCurrentChange"/>
    </div>

</div>
</template>

<script>
import assetlabel from "@/components/assetlabel"
import httpRequest from "@/utils/communication"
import commonQueries from "@/utils/commonqueries"
import Consts from "@/utils/const"
import treeUtils from "@/utils/tree"
export default {
    name: 'assetmylist',
    components: {
        assetlabel,
    },
    data(){
        return{
            operation: {
                operation: "",
                target: "",
                visible: false,
                description: ""
            },
            curPage: 0,
            pageSize: 10,
            myusername: "",
            showdeleted: false,
            editVisible: false,
            editIdx: 0,
            editRow: null,
            searchform: {
                id: '',
                name: '',
                maintainer: '',
                description: '',
                status: '',
                parentid: '',
                category: '',
                serial: '',
                brand: '',
                model: '',
                location: '',
                currentuser: '',
                department: '',
                value: '',
            },
            emptysearchform: {
                id: '',
                name: '',
                maintainer: '',
                description: '',
                status: '',
                parentid: '',
                category: '',
                serial: '',
                brand: '',
                model: '',
                location: '',
                currentuser: '',
                department: '',
                value: '',
            },
            formLabelWidth: '120px',
            categories: Consts.fake_categories,
            departments: Consts.fake_departments,
            users: ["admin", "user"],
            assets: [
                {
                    id: "10492",
                    name: "Sennheiser HD 800 S",
                    status: "IN_USE",
                    maintainer: "qb",
                    description: "每日骂顺丰 盒子给我撞两个裂口 😡🤬🤯"
                },
                {
                    id: "20001",
                    name: "Sennheiser HD 800 S",
                    status: "DELETED",
                    maintainer: "qb",
                    description: "每日骂顺丰 盒子给我撞两个裂口 😡🤬🤯"
                }
            ],
            selectedRows: [],
            form: {},
            emptyform: {},
        }
    },
    computed: {
        operationDisabled() {
            return this.selectedRows.length == 0
        },
        filtered(){
            return this.assets.filter(row=>(this.showdeleted?true:row.status!="DELETED"));
        },
        display_filtered: function(){
            return this.filtered.slice(this.curPage * this.pageSize, (this.curPage + 1) * this.pageSize)
        }
    },
    beforeMount(){
        commonQueries.checkOnline(this)
        this.getCategories()
        this.getDepartments()
        this.getAssets()
        this.getUserList()
        this.myusername = commonQueries.getCookie("username")
        let mydepartment = commonQueries.getCookie("department")
        this.mydepartment = mydepartment != "" ? JSON.parse(JSON.parse(mydepartment)) : ""
        if (this.emptyform){
            this.emptyform.maintainer = this.myusername
            this.emptyform.department = this.mydepartment
            this.emptyform.status = "IDLE"
        }
    },
    methods:{
        applysearch(){
            if (this.searchform.category != "")this.searchform.category = this.searchform.category[this.searchform.category.length - 1]
            if (this.searchform.department != "")this.searchform.department = this.searchform.department[this.searchform.department.length - 1]
            this.getAssets()
        },
        clearsearch(){
            Object.assign(this.searchform, this.emptysearchform)
        },
        showdeletedbuttontext(){
            return this.showdeleted? "隐藏已删除资产": "显示已删除资产";
        },
        toggleShowDeleted(){
            this.showdeleted = !this.showdeleted;
        },
        handleCurrentChange: function(val){
            this.curPage = val - 1;
        },
        readable_status(status){
            return {
                "IDLE": "闲置",
                "IN_USE": "使用中",
                "IN_MAINTAIN": "维护中",
                "RETIRED": "已清退",
                "DELETED": "已删除",
            }[status]
        },
        getAssets: function(){
            let cookie = document.cookie.match(new RegExp("token=([^;])"))
            if (cookie == null){
                this.$router.push('/login')
            }
            let xhr = new XMLHttpRequest()
            httpRequest.post(xhr, "/api/assets/mylist/", this.searchform)
            this.assets = []
            xhr.addEventListener("load", () =>{
                let resp = eval("(" + xhr.responseText + ")")
                for (let i in resp)
                    this.assets.push(resp[i])
            })
            console.log(this.assets)
        },
        getCategories: function(){
            let xhr = new XMLHttpRequest()
            httpRequest.post(xhr, "/api/assets/category/query/", {})
            xhr.addEventListener("load", () =>{
                if (xhr.status == 200){
                    this.categories = eval('(' + xhr.responseText + ')')
                    treeUtils.gen_label_value(this.categories)
                    console.log(this.categories)
                }
            })
        },
        getDepartments: function(){
            let xhr = new XMLHttpRequest()
            httpRequest.post(xhr, "/api/department/query/", {})
            xhr.addEventListener("load", () =>{
                if (xhr.status == 200){
                    this.departments = eval('(' + xhr.responseText + ')')
                    treeUtils.gen_label_value(this.departments)
                    console.log(this.departments)
                }
            })
        },
        getUserList: function(){
            let xhr = new XMLHttpRequest()
            httpRequest.post(xhr, "/api/user/query/", {department:""})
            xhr.addEventListener("load", () =>{
                if (xhr.status == 200){
                    this.users = []
                    let resp = eval('(' + xhr.responseText + ')')
                    for (let i in resp){
                        this.users.push(resp[i].username)
                    }
                    console.log(this.users)
                }
            })
        },
        handleAdd() {
            this.editIdx = -1
            this.editRow = null
            Object.assign(this.form, this.emptyform)
            this.form.date = new Date().getTime()
            this.editVisible = true
        },
        handleDelete(index, row) {
            this.editIdx = index
            this.editRow = row
            Object.assign(this.form, row)
            this.form.status = "DELETED"
            this.submitChange()
        },
        handleEdit(index, row) {
            this.editIdx = index
            this.editRow = row
            this.form = Object.assign(this.form, row)
            this.editVisible = true
        },
        submitChange() {
            //console.log(this.form.department)
            if (this.form.category && typeof this.form.category == 'object')this.form.category = this.form.category[this.form.category.length - 1]
            if (this.form.department && typeof this.form.department == 'object')this.form.department = this.form.department[this.form.department.length - 1]
            console.log(this.form.department)
            if (this.editRow) {
                // edit
                Object.assign(this.editRow, this.form)
                let xhr = new XMLHttpRequest
                xhr.open("post","/api/assets/update/")
                xhr.send(JSON.stringify({assets:[this.form]}))
                xhr.onload = (e)=>{
                    if (e.target.status == 200)
                        this.$message.success("编辑成功")
                    else {
                        console.error("edit failed", e.target.status)
                        this.$message.error("编辑失败")
                    }
                }
                xhr.onerror = ()=>{this.$message.error("编辑失败")}
            }
            else {
                // create
                this.assets.push(Object.assign({}, this.form))
                let xhr = new XMLHttpRequest
                xhr.open("post","/api/assets/add/")
                xhr.send(JSON.stringify({assets:[this.form]}))
                xhr.onload = (e)=>{
                    if (e.target.status == 200) {
                        this.$message.success("添加成功")
                        this.getAssets()
                    }
                    else {
                        console.error("edit failed", e.target.status)
                        this.$message.error("添加失败")
                    }
                }
                xhr.onerror = ()=>{this.$message.error("添加失败")}
            }
            this.editVisible = false
        },
        handleSelectionChange(rows) {
            this.selectedRows = rows
        },
        batchOperation() {
            this.operation.visible = true
        },
        operationsubmit() {
            let assetsid = []
            for (let i=0; i<this.selectedRows.length; ++i)
                assetsid.push(this.selectedRows[i].id)
            let xhr = new XMLHttpRequest()
            httpRequest.post(xhr, "/api/operation/apply/", {
                assetsid: assetsid,
                operation: this.operation.operation,
                applier: commonQueries.getCookie("username"),
                target: this.operation.target,
                description: this.operation.description
            })
            xhr.addEventListener("load", () => {
                if (xhr.status == 200){
                    this.$message.success('提交成功！')
                }else{
                    this.$message.error('提交失败！')
                }
            })
            this.operation.visible = false
        },
        querySearch(queryString, cb) {
            let results = queryString ? this.users.filter(
                user=>(user.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
            ) : this.users
            let results_dict = []
            for (let i in results){
                results_dict.push({value: results[i]})
            }
            console.log(results)
            cb(results_dict)
        },
    }
}
</script>

<style scoped>
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