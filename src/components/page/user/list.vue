<!--asset list-->
<template>
    <div>
        <h2>用户列表</h2>
        <userlist 
            v-bind="{users: display_users}"
            v-on:refresh="getUsers"/>
        <el-pagination
            layout="prev, pager, next"
            :total="users.length"
            :page-size="pageSize"
            @current-change="handleCurrentChange"/>
    </div>
</template>

<script>
import userlist from "@/components/userlist.vue"
import httpRequest from "@/utils/communication"
import Consts from "@/utils/const"
//import authorityUtils from "@/utils/authority"
import commonQueries from "@/utils/commonqueries"
export default {
    name: "user_list",
    components: {
        userlist,
    },
    props: {
    },
    data(){
        return{
            users: [{
                username: "admin",
                staffname: "张三",
                authority: "IT管理员",
                department: "技术开发部",
                locked: false,
                password: "123456",
            }],
            pageSize: 10,
            curPage: 0,
        }
    },
    beforeMount(){
        commonQueries.checkOnline(this)
        //authorityUtils.checkAuthority(this, ["usermanager", "ITmanager"])
        this.getUsers()
    },
    methods: {
        getUsers: function(){
            let xhr = new XMLHttpRequest()
            httpRequest.post(xhr, "/api/user/query/", {department: ''})
            this.users = []
            xhr.addEventListener("load", () =>{
                console.log(xhr.responseText)
                this.parseUsers(xhr)
                this.curPage = 0
                console.log(xhr.responseText)
            })
        },
        parseUsers: function(xhr){
            let resp = eval("(" + xhr.responseText + ")")
            for (let i in resp){
                this.users.push(resp[i])
                let auth = {
                    ITmanager: false,
                    usermanager: false,
                    assetmanager: false,
                    supervisor: false,
                    staff: false,
                }
                if (resp[i].ITmanager === true)auth.ITmanager = true
                if (resp[i].usermanager === true)auth.usermanager = true
                if (resp[i].assetmanager === true)auth.assetmanager = true
                if (resp[i].supervisor === true)auth.supervisor = true
                if (resp[i].staff === true)auth.staff = true
                this.users[i].authority = auth
                //console.log(auth)
                this.users[i].auth_list = []
                if (auth.ITmanager)this.users[i].auth_list.push("ITmanager")
                if (auth.usermanager)this.users[i].auth_list.push("usermanager")
                if (auth.assetmanager)this.users[i].auth_list.push("assetmanager")
                if (auth.supervisor)this.users[i].auth_list.push("supervisor")
                if (auth.staff)this.users[i].auth_list.push("staff")
                let auth_ch_list = []
                for (let j in this.users[i].auth_list)auth_ch_list.push(Consts.auth_ch[this.users[i].auth_list[j]])
                this.users[i].auth_str = auth_ch_list.join("；")
                if (!this.users[i].auth_list.length)this.users[i].auth_str = "普通员工"
                this.users[i].status = this.users[i].locked ? "锁定" : "正常"
            }
        },
        handleCurrentChange: function(val){
            this.curPage = val - 1
        },
    },
    computed: {
        display_users: function(){
            return this.users.slice(this.curPage * this.pageSize, (this.curPage + 1) * this.pageSize)
        }
    }
}
</script>
<style scoped>
.el-pagination{
    text-align: center; 
    padding-top: 1em;
}
</style>

