<template>
    <el-dialog
        style="text-align: center"
        title="修改菜单项"
        :show-close=false
        :visible.sync="visible"
        width="30%">
        <el-form label-width="130px">
            <el-form-item label="原菜单项名">
                <el-input v-model="oldname" class="select" :disabled="true"/>
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
            <el-form-item label="新菜单项名">
                <el-input v-model="name" :disabled="operation=='删除'"/>
            </el-form-item>
            <el-form-item label="url">
                <el-input v-model="url" :disabled="operation=='删除'"/>
            </el-form-item>
            <span v-if="operation != '删除'">第三方链接请使用/url/前缀</span>
            <el-form-item label="可访问该项的角色" class="checkbox" :disabled="operation=='删除'">
                <el-checkbox-group v-model="authority">
                    <el-checkbox
                        v-for="auth in auth_options"
                        :key="auth"
                        :label="auth"
                    >{{auth_ch[auth]}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button v-on:click="cancel">取 消</el-button>
            <el-button type="primary" v-on:click="confirm">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import Consts from "@/utils/const.js"
export default {
    name: "menuUpdDialog",
    props: {
        oldname: {
            type: String,
            default: () => "",
        },
        oldurl: {
            type: String,
            default: () => "",
        },
        visible: {
            type: Boolean,
            default: () => true,
        },
        oldauthority: {
            type: Array,
            default: () => [],
        }
    },
    data(){
        return {
            operation : "",
            name: "",
            operations : ["添加", "删除", "编辑"],
            url: "",
            auth_options : Consts.auth_options_all,
            auth_ch : Consts.auth_ch_all,
            authority: {},
        }
    },
    methods: {
        confirm: function(){
            if (this.operation === "添加"){
                this.$emit("add", this.name, this.url, this.authority)
            }else if (this.operation === "删除"){
                this.$emit("remove")
            }else if (this.operation === "编辑"){
                this.$emit("update", this.name, this.url, this.authority)
            }
            this.cancel()
        },
        cancel: function(){
            this.$emit("hide")
        },
    },
    watch: {
        "oldauthority": function(val){
            this.authority = val
        },
        "operation": function(val){
            if (val === "编辑"){
                this.name = this.oldname
                this.url = this.oldurl
            }else{
                this.name = ""
                this.url = ""
            }
        },
        "visible": function(val){
            if (val){
                this.operation = ""
                this.name = ""
                this.url = ""
            }
        }
    }
}
</script>
<style scoped>
.select{
    width: 100%;
}
.checkbox{
    padding-top: 10px;
    width: 0%;
}
</style>