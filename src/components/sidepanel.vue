<template>
	<div class="sidepanel">
		<el-menu
            class="sidepanel-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#333a40"
            text-color="#bfcbd9"
            active-text-color="#40b0ff"
            unique-opened
            router
        >
            <template v-for="item in filtereditems">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <!-- <i :class="item.icon"></i> -->
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem,i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.index"
                                :key="subItem.index"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
	</div>
</template>

<script>
import httpRequest from "@/utils/communication"
import authorityUtils from "@/utils/authority"
import Consts from "@/utils/const"
export default {
	components: {
	},
    computed: {
        onRoutes() {
            return this.$route.path;
        },
        filtereditems() {
            return this.filter(this.items)
        },
    },
    methods: {
        filter(list) {
            //console.log("FILTER", list)
            let a = []
            for (let i=0; i<list.length; ++i) {
                let ok = authorityUtils.authorized(list[i].authority)
                if (ok) {
                    //console.log("OK", list[i])
                    let t = {
                        authority: list[i].authority,
                        index: list[i].index,
                        title: list[i].title,
                    }
                    if (list[i].subs)
                        t.subs = this.filter(list[i].subs)
                    a.push(t)
                }
            }
            //console.log("RESULT",a)
            return a
        }
    },
	data() {
		return {
			collapse: false,
            items: []
        };
	},
    beforeMount() {
        this.items = Consts.fake_menu
        let xhr = new XMLHttpRequest()
        httpRequest.post(xhr, "/api/system/menu/query/", {})
        xhr.addEventListener("load", () =>{
            this.items = JSON.parse(xhr.responseText)
            //console.log("ITEMS",xhr.responseText)
        })
    }
};
</script>

<style scoped>
.sidepanel {
	text-align: left;
	height: 100%;
}
.sidepanel-el-menu:not(.el-menu--collapse) {
	height: 100%;
    width: 250px;
}
</style>