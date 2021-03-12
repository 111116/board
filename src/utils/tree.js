const treeUtils = {
    gen_label_value : function(node){
        node.label = node.name
        node.value = node.name
        for (let i in node.children){
            this.gen_label_value(node.children[i])
        }
    },
    gen_label_children: function(node){
        node.label = node.title
        if (!node.subs)return;
        node.children = node.subs
        for (let i in node.children)
            this.gen_label_children(node.children[i])
    }
}
export default treeUtils