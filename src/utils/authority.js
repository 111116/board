import commonQueries from "@/utils/commonqueries.js"
const authorityUtils = {
    checkAuthority: (wrapper, auth) => {
        let token = escape(commonQueries.getCookie("token"))
        //console.log(token)
        if (token == ""){
            return
        }
        let flag = false
        for (let i in auth){
            let val = escape(commonQueries.getCookie(auth[i]))
            if (val === "True"){
                flag = true
                break
            }
        }
        if (!flag){
            //wrapper.$router.push('/')
            wrapper.$message.error('权限不足！')
        }
    },
    existAuthority: (authkey) => {
        //console.log(document.cookie)
        let val = escape(commonQueries.getCookie(authkey))
        //console.log(val)
        if (val === "True")return true
            else return false
    },
    authorized: (authtype) => {
        if (!authtype) return true;
        if (authtype.user) return true;
        if (authtype.ITmanager && commonQueries.getCookie("ITmanager")=="True") return true;
        if (authtype.usermanager && commonQueries.getCookie("usermanager")=="True") return true;
        if (authtype.assetmanager && commonQueries.getCookie("assetmanager")=="True") return true;
        if (authtype.supervisor && commonQueries.getCookie("supervisor")=="True") return true;
        return false;
    }
}

export default authorityUtils