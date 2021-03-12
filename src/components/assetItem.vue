<!--a single asset item-->
<template>
    <div class="asset-item">
        <span class="asset-name">{{ name }}</span>
        <span class="asset-status">{{ status }}</span>
    </div>
</template>
<script>
export default {
    name: "assetItem",
    props:{
        name: {
            type: String,
            default: () => "macbook pro"
        },
        status: {
            type: String,
            default: () => "IDLE"
        },
    }
}
</script>
