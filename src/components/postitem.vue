<template>
<div>
    <h2>{{author}}</h2>
    <div>{{content}}</div>
</div>
</template>

<script>
export default {
    name: 'postitem',
    props: {
        author: {
            type: String,
            default: () => "Name"
        },
        content: {
            type: String,
            default: () => "ID123"
        },
    },
    components: {
    },
    data(){
        return {
        }
    },
    computed: {
    },
    beforeMount(){
    },
    methods:{
    }
}
</script>

<style scoped>
.red {
    color: #ff0000;
}
hr {
    height: 1px;
    border: none;
    color: #EBEEF5;
    background-color: #EBEEF5;
}
.cascade {
    width: 100%;
}
.el-pagination{
    text-align: center; 
    padding-top: 1em;
}
</style>