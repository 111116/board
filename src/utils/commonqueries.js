import httpRequest from "@/utils/communication"
const commonQueries = {
    getCategories: (obj) => {
        let xhr = new XMLHttpRequest()
        httpRequest.post(xhr, "/api/asset/category/query/", {})
        let categories = {}
        xhr.addEventListener("load", () =>{
            if (xhr.status == 200){
                console.log(xhr.responseText)
                categories = eval("(" + xhr.responseText + ")")
            }else{
                obj.$message.error('服务器错误')
            }
        })
        return categories
    },
    getDepartments: (obj, departments) => {
        let xhr = new XMLHttpRequest()
        console.log(departments)
        httpRequest.post(xhr, "/api/department/query/", {})
        xhr.addEventListener("load", () =>{
            if (xhr.status == 200){
                console.log(xhr.responseText)
                departments = eval("(" + xhr.responseText + ")")
            }else{
                obj.$message.error('服务器错误')
            }
        })
    },
    checkOnline: (obj) => {
        let xhr = new XMLHttpRequest()
        httpRequest.post(xhr, '/api/system/online/', {})
        xhr.addEventListener("load", () =>{
            if (xhr.status != 200){
                obj.$message.error("令牌已失效，请重新登陆")
                obj.$router.push('/login')
            }
        })
    },
    getCookie(cookiename)
    {
        // Get name followed by anything except a semicolon
        var cookiestring=RegExp(cookiename+"=[^;]+").exec(document.cookie);
        // Return everything after the equal sign, or an empty string if the cookie name not found
        return decodeURIComponent(cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
    }
}

export default commonQueries
