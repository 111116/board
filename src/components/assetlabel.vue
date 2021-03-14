<!--user list-->
<template>
    <div>
        {{this[0]}}
    </div>
    <!-- <div>
        <div class="label-outer-wrapper" :id="elementid">
            <div class="label-wrapper">
                <div class="title">资产标签</div>
                <div class="attrs">
                    <div class="attr">资产名称：{{name}}</div>
                    <div class="attr">挂账部门：{{department}}</div>
                    <div class="attr">资产编号：{{id}}</div>
                </div>
                <svg id="barcode"></svg>
            </div>
        </div>
        <el-button @click="download">下载标签</el-button>
    </div> -->
</template>

<script>
import JsBarcode from "jsbarcode"
import * as htmlToImage from "html-to-image"
export default {
    name: "assetlabel",
    components: {
    },
    props: {
        name: {
            type: String,
            default: () => "Name"
        },
        id: {
            type: String,
            default: () => "ID123"
        },
        department: {
            type: String,
            default: () => "unknown department"
        },
    },
    data(){
        return {
        }
    },
    computed: {
        elementid() {
            return "my-node" + this.id
        }
    },
    methods: {
        download() {
            let that = this
            console.log("downloading...")
            htmlToImage.toPng(document.getElementById("my-node" + this.id), {pixelRatio:1})
            .then(function (dataUrl) {
                var link = document.createElement('a');
                link.download = 'label'+that.id+'.png';
                link.href = dataUrl;
                link.click();
            });
        }
    },
    mounted(){
        JsBarcode("#barcode", this.id, {
            height: 40,
            displayValue: false,
        });
        // this.download()
    }
}
</script>

<style scoped>
.label-outer-wrapper {
    padding: 1px;
    width: 184px;
    height: 158px;
}
.label-wrapper {
    margin: 2px;
    box-sizing: border-box;
    outline: 1px black solid;
    width: 180px;
    height: 154px;
    overflow: hidden;
    background-color: #fff;
}
.label-wrapper .title {
    padding-top: 4px;
    padding-bottom: 4px;
    padding-left: 8px;
    font-weight: bold;
    border-bottom: 1px #000 solid;
    text-align: center;
}
.label-wrapper .attr {
    padding-left: 8px;
}
.label-wrapper .attrs {
    padding-top: 4px;
}
</style>
