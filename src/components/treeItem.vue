<template>
<li>
    <div
        :class="{bold: isFolder, item: true}"
        @click="toggle"
        @dblclick="showDialog">
        {{ name }}
        <span v-if="isFolder">[{{ isOpen ? '-' : '+' }}]</span>
    </div>
    <ul v-show="isOpen" v-if="isFolder">
        <treeitem
            class="item"
            v-for="(child, index) in children"
            :key="index"
            :name="child.name"
            :children="child.children"
            @removeItem="removeItem"
            @addItem="addItem"
            @renameItem="renameItem"
        ></treeitem>
    </ul>
    <categoryUpdDialog
        v-bind="{visible: categoryUpdDialogVisible, oldname: name}"
        @hide="hideDialog"
        @add="addItem1"
        @remove="removeItem1"
        @rename="renameItem1"
    />
</li>
</template>
<script>
import categoryUpdDialog from "@/components/categoryUpdDialog.vue"
export default {
    name: "treeitem",
    components: {
        categoryUpdDialog,
    },
    props: {
        name: {
            type: String,
            default: () => ""
        },
        children: {
            type: Array,
            default: () => []
        },
        treetype: {
            type: String,
            default: () => "asset"
        }
    },
    data: function(){
        return {
            isOpen: false,
            menuShow: false,
            categoryUpdDialogVisible: false,
        }
    },
    computed: {
        isFolder: function(){
            return this.children && this.children.length
        }
    },
    methods: {
        toggle: function(){
            if (this.isFolder) {
                this.isOpen = !this.isOpen
                console.log(this.children)
            }
        },
        addItem1: function(itemName){
            /*this.children.push({
                name: itemName,
                children: []
            })*/
            this.$emit("addItem", this.name, itemName)
        },
        addItem: function(parentName, itemName){
            this.$emit("addItem", parentName, itemName)
        },
        removeItem1: function(){
            this.$emit("removeItem", this.name)
        },
        removeItem: function(itemName){//父节点删除分类 子节点触发事件先emit
            console.log(itemName)
            /*for (let i in this.children)
                if (this.children[i].name == itemName){
                    this.children.splice(i, 1)
                    break
                }*/
            this.$emit("removeItem", itemName)
        },
        renameItem1: function(itemName){
            //this.name = itemName
            this.$emit("renameItem", this.name, itemName)
        },
        renameItem: function(oldName, newName){
            this.$emit("renameItem", oldName, newName)
        },
        showDialog: function(){
            this.categoryUpdDialogVisible = true
        },
        hideDialog: function(){
            this.categoryUpdDialogVisible = false
        },
    }
}
</script>
<style scoped>
.bold {
    font-weight: bold;
}
ul {
    padding-left: 1.5em;
    line-height: 2em;
    list-style-type: dot;
}
.item {
    cursor: pointer;
    font-size: 18px;
}
</style>
