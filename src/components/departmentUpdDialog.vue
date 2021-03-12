<template>
    <el-dialog
        style="text-align: center"
        title="修改部门信息"
        :show-close=false
        :visible.sync="visible"
        width="30%">
        <el-form label-width="80px">
            <el-form-item label="原部门名称">
                <el-input v-model="oldname" class="auth-select" :disabled="true"/>
            </el-form-item>
            <el-form-item label="操作">
                <el-select v-model="operation" class="select">
                    <el-option
                        v-for="op in operations"
                        :key="op"
                        :label="op"
                        :value="op"/>
                </el-select>
            </el-form-item>
            <el-form-item label="新部门名称" v-if="operation!='删除当前部门'">
                <el-input v-model="name" class="auth-select" :disabled="operation=='删除当前部门'"/>
            </el-form-item>
            <el-form-item label="该部门下员工和资产的操作" v-if="operation==='删除当前部门'">
                <el-select v-model="belongoperation" class="select">
                    <el-option
                        v-for="op in belongoperations"
                        :key="op"
                        :label="op"
                        :value="op"/>
                </el-select>
            </el-form-item>
            <el-form-item label="转移部门名称" v-if="operation==='删除当前部门'">
                <el-cascader
                    v-model="transfer"
                    :options="full_departments.children"
                    :show-all-levels="false"
                    :disabled="belongoperation!='转移至其他部门'"
                    class="cascade"
                ></el-cascader>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button v-on:click="cancel">取 消</el-button>
            <el-button type="primary" v-on:click="confirm">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
export default {
    name: "departmentUpdDialog",
    props: {
        oldname: {
            type: String,
            default: () => "",
        },
        visible: {
            type: Boolean,
            default: () => true,
        },
        full_departments: {
            type: Object,
            default: () => {},
        }
    },
    data(){
        return {
            operation : "",
            name: "",
            operations : ["添加子部门", "删除当前部门", "重命名"],
            belongoperations : ["直接删除", "转移至其他部门"],
            belongoperation: "",
            transfer: "",
        }
    },
    methods: {
        confirm: function(){
            if (this.operation === "添加子部门"){
                this.$emit("add", this.name)
            }else if (this.operation === "删除当前部门"){
                if (typeof this.transfer == 'object')this.transfer = this.transfer[this.transfer.length - 1]
                this.$emit("remove", this.transfer)
            }else if (this.operation === "重命名"){
                this.$emit("rename", this.name)
            }
            this.cancel()
        },
        cancel: function(){
            this.$emit("hide")
        },
    },
}
</script>
<style scoped>
.select{
    width: 100%;
}
.cascade {
    width: 100%;
}
</style>