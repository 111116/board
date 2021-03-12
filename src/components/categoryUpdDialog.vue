<template>
    <el-dialog
        style="text-align: center"
        title="修改分类"
        :show-close=false
        :visible.sync="visible"
        width="30%">
        <el-form label-width="80px">
            <el-form-item label="原类别名">
                <el-input v-model="oldname" class="show-disabled" :disabled="true"/>
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
            <el-form-item label="新类别名">
                <el-input v-model="name" class="auth-select" :disabled="operation=='删除'"/>
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
    name: "categoryUpdDialog",
    props: {
        oldname: {
            type: String,
            default: () => "",
        },
        visible: {
            type: Boolean,
            default: () => true,
        }
    },
    data(){
        return {
            operation : "",
            name: "",
            operations : ["添加", "删除", "重命名"],
        }
    },
    methods: {
        confirm: function(){
            if (this.operation === "添加"){
                this.$emit("add", this.name)
            }else if (this.operation === "删除"){
                this.$emit("remove")
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
.el-input.show-disabled.el-input__inner{
    color: #606266;
}
.el-input.is-disabled{
    color: #606266;
}
</style>