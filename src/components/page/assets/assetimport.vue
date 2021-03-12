<template>
<div>
    <h2>批量导入资产</h2>
    <el-upload
        accept=".xlsx"
        drag
        action="/api/assets/upload/"
        :on-error="onerror"
        :on-success="onsuccess"
        :file-list="fileList"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖至此处，或者 <em>单击以上传文件</em></div>
        <div class="el-upload__tip" slot="tip">只支持xlsx文件</div>
    </el-upload>
</div>
</template>

<script>
import commonQueries from "@/utils/commonqueries"
export default {
    name: 'assetimport',
    components: {
    },
    beforeMount(){
        commonQueries.checkOnline(this)
    },
    data(){
        return {
            fileList: [],
        }
    },
    methods: {
        onerror() {
            this.$message.error("上传失败，请检查表格格式是否正确，以及是否含有名称、分类、使用期限、初始价值字段")
        },
        onsuccess() {
            this.$message.success("上传成功")
        },
    },
    watch: {
    },
}
</script>

<style scoped>
</style>
