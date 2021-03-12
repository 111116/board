import Mock from 'mockjs'

Mock.mock('/api/user/login/', 'post', (req) => {
    console.log(req)
    return {
        "code": 200,
        "status": 200,
    }
})

Mock.mock('/api/user/create/', 'post', (req) => {
    console.log(req)
    return {
        "code": 200,
    }
})

Mock.mock('/api/user/passwordreset/', 'post', (req) => {
    console.log(req)
    req = eval('(' + req + ')')
    if (req.user == "user")return {
        "code": 200,
    };else return {
        "code": 401,
    }
})
