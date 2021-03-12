let auth1 = {ITmanager: true, usermanager: false, assetmanager: false, supervisor: false, user: false}
let auth2 = {ITmanager: true, usermanager: true, assetmanager: false, supervisor: false, user: false}
let auth3 = {ITmanager: true, usermanager: true, assetmanager: true, supervisor: true, user: false}
let auth4 = {ITmanager: true, usermanager: true, assetmanager: true, supervisor: true, user: true}
const Consts = {
    auth_options: ["ITmanager", "usermanager", "assetmanager", "supervisor"],
    auth_ch: {"ITmanager" : "IT管理员", 
              "usermanager" : "系统管理员", 
              "assetmanager" : "资产管理员", 
              "supervisor" : "主管",},
    auth_options_all: ["ITmanager", "usermanager", "assetmanager", "supervisor", "user"],
    auth_ch_all: {"ITmanager" : "IT管理员", 
              "usermanager" : "系统管理员", 
              "assetmanager" : "资产管理员", 
              "supervisor" : "主管",
              "user": "用户",},
    emptyform: {
        id: '',
        name: '',
        maintainer: '',
        description: '',
        status: '',
        parentid: '',
        category: '',
        serial: '',
        brand: '',
        model: '',
        location: '',
        currentuser: '',
        department: '',
        value: '',
    },
    fake_categories: {
        name: "资产",
        children: [
            { 
                name: "电子产品" ,
                children: [
                    { 
                        name: "主机",
                        children: [
                            { name: "高贵的主机" },
                            { name: "普通的主机" },
                        ]
                    },
                    { name: "平板电脑" },
                    { name: "显示器" },
                ]
            },
            { 
                name: "办公用品" ,
                children: [
                    { name: "签字笔" },
                    { name: "打印机" },
                    { name: "保险箱" },
                ]
            },
            { 
                name: "生活娱乐用品",
                children: [
                    { name: "游戏机" },
                    { name: "自动售货机" },
                    { name: "饮水机" },
                ]
            },
        ]
    },
    fake_departments: [{
        name: "部门",
        children: [
            { name: "人力资源部"},
            { name: "Wuhu"},
            {
                name: "技术部",
                children: [
                    { name: "开发部" },
                    { name: "测试部" },
                    { name: "架构部" },
                ]
            }
        ],
    }],
    fake_menu: [{
        index: '1',
        title: '资产管理',
        authority: auth4,
        subs: [{
                index: '/assets/list',
                title: '所有资产管理',
                authority: auth3,
            },{
                index: '/assets/mylist',
                title: '我的资产',
                authority: auth4,
            },{
                index: '/assets/category',
                title: '资产分类树',
                authority: auth1,
            },{
                index: '/assets/history',
                title: '操作历史查询',
                authority: auth3,
            },{
                index: '/assets/import',
                title: '批量导入资产',
                authority: auth3,
            },
        ]
    },{
        index: '2',
        title: '用户管理',
        authority: auth2,
        subs: [{
            index: '/user/create',
            title: '创建用户',
            authority: auth2,
        },{
            index: '/user/passwordreset',
            title: '密码重置',
            authority: auth2,
        },{
            index: '/user/list',
            title: '用户列表',
            authority: auth2,
        }]
    },{
        title: '申请管理',
        index: '3',
        authority: auth4,
        subs: [{
            index: '/operation/list',
            title: '申请列表',
            authority: auth3,
        },{
            index: '/operation/mylist',
            title: '我的申请',
            authority: auth4,
        },{
            index: '/operation/new',
            title: '发起申请',
            authority: auth4,
        },]
    },{
        title: '部门管理',
        index: '4',
        authority: auth1,
        subs: [{
            index: '/department/update',
            title: '部门层级树',
            authority: auth1,
        },]
    },{
        title: '系统管理',
        index: 'wuhu',
        authority: auth1,
        subs: [{
            index: '/system/log',
            title: '系统日志',
            authority: auth1,
        },{
            index: '/system/menu',
            title: '菜单项配置',
            authority: auth1,
        },]
    },]
}

export default Consts