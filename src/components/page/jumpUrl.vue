<!--login page-->
<template>
<div class="jump">
    <iframe width="100%" height="100%" frameborder="0" :src="url"></iframe>
</div>
</template>
<script>
export default {
    name: 'jump_url',
    components: {
    },
    mounted(){
        console.log(this.url)
        //window.location.href = this.$router.history.current.params.pathMatch
        // window.location.href = "https://" + this.$router.history.current.params.pathMatch
    },
    computed: {
        url() {
            return "https://" + this.$router.history.current.params.pathMatch
        }
    },
    methods: {
    },
}
</script>

<style scoped>
.jump {
    height: 100%;
}
</style>
