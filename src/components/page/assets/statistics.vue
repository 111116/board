<template>
<div>
    <h2>资产统计</h2>
    <el-row>
        <el-col :span="12"><v-chart :options="options_pie"/></el-col>
        <el-col :span="12"><v-chart class="half" :options="options_line"/></el-col>
    </el-row>
</div>
</template>

<script>
import httpRequest from "@/utils/communication"
import commonQueries from "@/utils/commonqueries"
import ECharts from 'vue-echarts'
import Consts from "@/utils/const"
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
export default {
    name: 'statistics',
    components: {
        // assetedit
        'v-chart' : ECharts
    },
    data(){
        return{
            department: '',
            status: ["IDLE", "IN_USE", "IN_MAINTAIN", "RETIRED", "DELETED"],
            status_ch: ["闲置", "使用中", "维护中", "已清退", "已删除"],
            statusCount: [0, 0, 0, 0, 0],
            departments: [],
            departmentCount: [],
            options_pie: {},
            options_line: {},
            statusData: [],
            departmentData: [],
            valueData: [],
        }
    },
    computed: {
        filtered: function() {
            return this.history.filter(row=>(this.form.operation=="all" || this.form.operation==row.operation));
        }
    },
    beforeMount(){
        commonQueries.checkOnline(this)
        this.department = commonQueries.getCookie("department")
        this.getAssets()
    },
    methods:{
        getAssets: function(){
            let xhr = new XMLHttpRequest()
            httpRequest.post(xhr, "/api/assets/query/", Consts.emptyform)
            this.assets = []
            this.statusCount = [0, 0, 0, 0, 0]
            this.departmentCount = []
            //let sum = 0
            xhr.addEventListener("load", () =>{
                this.getData(xhr)
            })
        },
        getData: function(xhr){
            console.log(xhr.responseText)
            let resp = eval("(" + xhr.responseText + ")")
            for (let i in resp){
                this.assets.push(resp[i])
                this.statusCount[this.status.indexOf(resp[i].status)] += 1
                if (this.departments.indexOf(resp[i].department)){
                    this.departments.push(resp[i].department)
                    this.departmentCount.push(0)
                }
                this.departmentCount[this.departments.indexOf(resp[i].department)] += 1
                //sum += 1
            }
            this.statusData = []
            for (let i in this.statusCount){
                this.statusData.push({
                    name: this.status_ch[i],
                    value: this.statusCount[i],
                })
            }
            this.departmentData = []
            for (let i in this.departmentCount){
                this.departmentData.push({
                    name: this.departments[i],
                    value: this.departmentCount[i],
                })
            }
            this.getValueData()
        },
        getValueData: function(){
            let xhr = new XMLHttpRequest()
            httpRequest.post(xhr, "/api/assets/getvalue/", {})
            this.valueData = []
            xhr.addEventListener("load", () => {
                if (xhr.status == 200){
                    let resp = eval("(" + xhr.responseText + ")")
                    for (let i in resp)this.valueData.push([i, parseInt(resp[i])])
                    this.render()
                }
            })
        },
        render: function(){
            console.log(this.valueData)
            this.options_pie = {
                title: [{
                    text: '资产状态分布',
                    left: '50%',
                    top: '47.5%',
                    textStyle: {
                        fontSize: 20,
                        fontWeight: 'bold',
                    },
                    textAlign: 'center'
                }, {
                    text: '资产部门分布',
                    left: '50%',
                    top: '95%',
                    textAlign: 'center'
                }],
                tooltip: [{
                    trigger: 'item',
                    formatter: '{b}: {c} ({d}%)'
                }],
                series: [{
                    type: 'pie',
                    radius: ['50%', '70%'],
                    center: ['50%', '50%'],
                    data: this.statusData,
                    animation: true,
                    label: {
                        position: 'outer',
                        alignTo: 'labelLine',
                        bleedMargin: 10,
                        fontSize: 13,
                    },
                    left: 0,
                    top: 0,
                    bottom: '50%',
                }, {
                    type: 'pie',
                    radius: ['50%', '70%'],
                    center: ['50%', '50%'],
                    data: this.departmentData,
                    animation: true,
                    label: {
                        position: 'outer',
                        alignTo: 'labelLine',
                        bleedMargin: 10,
                        fontSize: 13,
                    },
                    left: 0,
                    top: '50%',
                    bottom: 0
                }]
            }
            this.options_line = {
                title: [{
                    text: '最近30次操作资产净值变化曲线',
                    left: '50%',
                    top: '0%',
                    textAlign: 'center'
                }],
                xAxis: {
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    type: 'line',
                    data: this.valueData,
                    smooth: true,
                }],
            }
        }
    }
}
</script>

<style scoped>
.echarts {
    width: 600px;
    height: 700px;
}
.echarts.half {
    height: 400px;
}
</style>