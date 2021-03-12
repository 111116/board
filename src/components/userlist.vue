<!--user list-->
<template>
    <div>
        <el-table align="center"
            :data="users"
            style="width: 100%">
        <el-table-column
            prop="username"
            label="用户名"
            width="150">
        </el-table-column>
        <el-table-column
            prop="staffname"
            label="员工姓名"
            width="150">
        </el-table-column>
        <el-table-column
            prop="auth_str"
            label="角色"
            width="200"
            :filters="[{text: 'IT管理员', value: 'IT管理员'}, {text: '系统管理员', value: '系统管理员'}, {text: '资产管理员', value: '资产管理员'}, {text: '主管', value: '主管'}, {text: '普通员工', value: '普通员工'}]"
            :filter-method="filter_sub">
        </el-table-column>
        <el-table-column
            prop="department"
            label="部门"
            width="150"
            :filters="get_departments()"
            :filter-method="filter_equal">
        </el-table-column>
        <el-table-column
            prop="status"
            label="状态"
            width="100"
            :filters="[{text: '正常', value: '正常'}, {text: '锁定', value: '锁定'}]"
            :filter-method="filter_equal">
        </el-table-column>
        <el-table-column
            label="操作"
            width="300">
            <template slot-scope="scope">
                <el-button @click="reverse_lock(scope.$index)" type="text" size="small" :icon="get_icon(scope.$index)">{{get_opt_lock_name(scope.$index)}}</el-button>
                <el-button @click="change_prop(scope.$index)" type="text" size="small" icon="el-icon-edit">修改属性</el-button>
                <el-button @click="reset_pwd(scope.$index)" type="text" size="small" icon="el-icon-setting">修改密码</el-button>
                <el-button @click="remove_user(scope.$index)" type="text" class="text-danger" size="small" icon="el-icon-delete">移除</el-button>
            </template>
        </el-table-column>
        </el-table>
        <userUpdDialog
            v-bind="{username: updUsername, authority: updAuth, department: updDepartment, visible:userUpdDialogVisible}"
            v-on:hide="hide_user_upd_dialog"
            v-on:refresh="refresh"
        />
    </div>
</template>

<script>
import httpRequest from "@/utils/communication"
import userUpdDialog from "@/components/userUpdDialog.vue"
export default {
    name: "userlist",
    components: {
        userUpdDialog
    },
    props: {
        users: {
            type: Array,
            default: () => [{
                username: "admin",
                staffname: "张三",
                authority: "IT管理员",
                department: "技术开发部",
                locked: true,
                password: "123456",
            }]
        }
    },
    data(){
        return {
            userUpdDialogVisible: false,
            updUsername: "",
            updAuth: [],
        }
    },
    methods: {
        get_icon: function(index){
            return this.users[index].locked ? "el-icon-unlock" : "el-icon-lock"
        },
        get_opt_lock_name: function(index){
            return this.users[index].locked ? "解锁" : "锁定"
        },
        reverse_lock: function(index){
            let xhr = new XMLHttpRequest()
            let user = this.users[index]
            httpRequest.post(xhr, user.locked ? "/api/user/unlock/" : "/api/user/lock/", {
                username: user.username,
            })
            xhr.addEventListener("load", () =>{
                this.checkStatus(xhr, user.locked)
            })
        },
        change_prop: function(index){
            let user = this.users[index]
            this.updUsername = user.username
            this.updAuth = user.auth_list
            this.updDepartment = user.department
            this.userUpdDialogVisible = true
        },
        reset_pwd: function(index){
            let user = this.users[index]
            console.log(user.username)
            this.$router.push('/user/passwordreset?username=' + user.username)
        },
        remove_user: function(index){
            let user = this.users[index]
            let xhr = new XMLHttpRequest()
            httpRequest.post(xhr, "/api/user/remove/", {username: user.username})
            xhr.addEventListener("load", () =>{
                this.checkStatusRemove(xhr)
            })
        },
        hide_user_upd_dialog: function(){
            this.userUpdDialogVisible = false
        },
        refresh: function(){
            this.$emit("refresh")
        },
        get_departments: function(){
            let departments = []
            let ret = []
            for (let i in this.users){
                let x = this.users[i].department
                if (departments.indexOf(x) < 0){
                    departments.push(x)
                    ret.push({text: x, value: x})
                }
            }
            return ret
        },
        filter_sub: function(value, row){
            console.log(row)
            return row.auth_str.indexOf(value) >= 0
        },
        filter_equal: function(value, row, column){
            const property = column['property']
            return row[property] === value
        },
        checkStatus: function(xhr, locked){
            if (xhr.status == 500){
                this.$message.error('服务器错误')
            }else if (xhr.status == 401){
                this.$message.error('用户权限不足')
            }else if (xhr.status == 200){
                this.$message.success(locked ? '解锁成功' : '锁定成功')
                this.$emit("refresh")
            }else{
                this.$message.error('发生未知错误')
            }
        },
        checkStatusRemove: function(xhr){
            console.log(xhr.status)
            if (xhr.status == 500){
                this.$message.error('服务器错误')
            }else if (xhr.status == 401){
                this.$message.error('用户权限不足')
            }else if (xhr.status == 200){
                this.$message.success('删除成功')
                this.$emit("refresh")
            }else if (xhr.status == 400){
                this.$message.error('该用户名下还有资产')
            }else{
                this.$message.error('发生未知错误')
            }
        }
    },
}
</script>

<style scoped>
.text-danger{
    color:#F56C6C;
}
.el-pagination{
    text-align: center; 
    padding-top: 1em;
}
</style>
