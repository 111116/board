<template>
<div>
    <h2>系统日志</h2>
    <div class="centering">
    <div class="timescale">
        <span>时间：</span>
        <el-date-picker
            class="datepick"
            v-model="startdate"
            type="date"
            placeholder="起始日期">
        </el-date-picker>
        <span>到</span>
        <el-date-picker
            class="datepick"
            v-model="enddate"
            type="date"
            placeholder="结束日期">
        </el-date-picker>
    </div>
    <el-menu mode="horizontal" @select="handleSelect">
        <el-menu-item index="1" class="item-half">登陆日志</el-menu-item>
        <el-menu-item index="2" class="item-half">关键数据修改日志</el-menu-item>
    </el-menu>
    <el-input
        type="textarea"
        :rows="20"
        placeholder=""
        v-model="logtext">
    </el-input>
    <el-button class="downloadbtn" @click="download">点击下载<i class="el-icon-download"/></el-button>
    </div>
</div>
</template>
<script>
import httpRequest from "@/utils/communication.js"
import authorityUtils from "@/utils/authority.js"
import commonQueries from "@/utils/commonqueries.js"
export default {
    name: 'systemlog',
    components: {
    },
    beforeMount(){
        commonQueries.checkOnline(this)
        authorityUtils.checkAuthority(this, ["ITmanager", "usermanager"])
    },
    data(){
        return {
            logtext: '暂无日志信息',
            startdate: '',
            enddate: '',
            key: 1,
        }
    },
    methods: {
        getLog: function(key, isdownload) {
            let xhr = new XMLHttpRequest()
            let download = isdownload
            if (this.startdate === '' || this.enddate === ''){
                this.$message.error("请填写日期")
                return
            }
            httpRequest.post(xhr, "/api/system/log/", {
                startdate: this.tostr(this.startdate),
                enddate: this.tostr(this.enddate),
                type: key == 1 ? "login" : "dataupdate",
            })
            xhr.addEventListener("load", () => {this.checkstatus(xhr, download)})
        },
        tostr: function(date){
            return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        },
        handleSelect: function(key){
            this.key = key
            this.getLog(key, false)
        },
        download: function(){
            //this.getLog(this.key, true)
            let fileName = 'log.txt'
            let link = document.createElement('a')
            link.download = fileName
            link.style.display = 'none'
            let blob = new Blob([this.logtext])
            link.href = URL.createObjectURL(blob)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        },
        checkstatus: function(xhr, isdownload){
            if (xhr.status == 500){
                this.$message.error('服务器错误')
            }else if (xhr.status == 401){
                this.$message.error('用户权限不足')
            }else if (xhr.status == 200){
                let resp = eval('(' + xhr.responseText + ')')
                this.logtext = ''
                console.log(xhr.responseText)
                for (let i in resp)
                    if (resp[i].content.indexOf("query") == -1)this.logtext = this.logtext + resp[i].timestamp + "，" + resp[i].content + "\n"
                if (isdownload){
                    let fileName = 'log.txt'
                    let link = document.createElement('a')
                    link.download = fileName
                    link.style.display = 'none'
                    let blob = new Blob([this.logtext])
                    link.href = URL.createObjectURL(blob)
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                }
                
            }else{
                this.$message.error('发生未知错误')
            }
        },
    }
}
</script>
<style scoped>
.centering {
    width: 70%;
    margin-left : 15%;
}
.timescale {
    width: 60%;
    margin-left: 20%;
}
.datepick {
    margin-left: 1em;
    margin-right: 1em;
}
.item-half {
    width: 50%;
    text-align: center;
}
.downloadbtn {
    width: 110px;
    text-align: center;
    margin-left: 42%;
    margin-top: 1em;
}
</style>
