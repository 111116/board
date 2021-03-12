## 通讯接口文档

向后端发送的请求均为POST，返回状态码：

- 200 表示请求成功
- 400 请求格式错误
- 401 密码/token错误/已锁定
- 403 权限不足以访问当前页面
- 500 服务端响应错误

## 用户

#### `/user/login` 用户登录

- 请求体：username(String) password(String)
- 返回：无
- 备注：password经过前端的一次hash加密;token表示用户的登入凭证
- token(String)写入cookie，authority(String)写入cookie，staffname(String)写入cookie
- 注意：后端判断用户权限必须用token判断

authority：`"{usermanager":false, ...}"`

`assetmanager`, `usermanager`, `supervisor`, `staff`, `ITmanager`

#### `/user/logout` 用户登出

- 请求体：无
- 返回：无

#### `/user/query` 用户查询

- 请求体：department(String, optional，表示查询某部门下的用户)
- 返回：[list of users]

#### user格式 JSON

| 属性名         | 类型   | 备注                    |
| ------------- | ------ | -------------------------- |
| `username`    | string |   用户名                    |
| `staffname`   | string |   姓名                       |
| `authority`   | string |   权限                    |
| `department`  | string |   部门	|
| `locked`      | boolean |    已锁定                    |

#### `/user/create` 用户创建

- 请求体：username(String) staffname(String) password(String) authority(String) department(String)
- 返回：无

#### `/user/lock` 用户锁定

- 请求体：username(String)
- 返回：无

#### `/user/unlock` 用户解锁

- 请求体：username(String)
- 返回：无

#### `/user/resetpwd` 重置密码

- 请求体：username(String) password(String)
- 返回：无

#### `/user/update` 用户信息设置

- 请求体：username(String) authority(String) department(String)
- 返回：无

#### `/user/remove` 删除用户

- 请求体：username(String)
- 返回：无

## 资产

#### `/assets/query` 资产查询

- 请求体：id(String, Optional) description(String, Optional) currentuser(String, Optional)
- 返回：[assets]（符合查询条件的资产列表（id相等/描述中含有description/当前用户为currentuser））

#### `/assets/mylist` 我的资产查询

- 请求体：资产查询
- 返回：[assets]（符合查询条件，且maintainer=查询者的资产列表）

#### `/assets/add` 添加资产

- 请求体：assets(list of asset object)，其中不需要`id`

#### `/assets/getvalue` 资产净值统计

- 请求体：无
- 返回：[list of integer]，表示30天内每一天本部门资产的总价值

#### `/assets/upload` 以xlsx格式批量添加资产

- 请求体：xlsx格式的数据

#### `/assets/update` 资产信息变更

- 请求体：assets(list of asset object)，其中`id`必填
- 备注：修改描述和状态

#### `/assets/history` 资产操作历史查询

- 请求体：id(string)
- 返回：[list of operations]

#### `/assets/category/query` 资产分类树查询
- 请求体：无
- 返回： JSON

| 属性名         | 类型      | 备注                    |
| ------------- | ------    | -------------------------- |
| `name`        | string    | 类别名称 |
| `children`    | JSON list | 子类别，嵌套 |

#### `/assets/category/add` 添加资产分类
- 请求体：parent(String) name(String)，分别为父类别的名称和要添加的子类别的名称
- 返回：无
- 备注：若parent不存在或name重复则报错

#### `/assets/category/remove` 删除资产分类
- 请求体：name(String)，要删除的类别名
- 返回：无
- 备注：若name不存在则报错

#### `/assets/category/rename` 资产分类重命名
- 请求体：oldname(String) newname(String) 旧类别名称和修改后的类别名
- 返回：无
- 备注：若oldname不存在或newname重复则报错


#### 资产信息格式 JSON

| 属性名         | 类型   | 备注                    |
| ------------- | ------ | -------------------------- |
| `id`          | string | 由后端生成 |
| `name`        | string | 瞎jb填 |
| `description` | string | 瞎jb填 |
| `status`      | string | `IDLE`/`IN_USE`/`IN_MAINTAIN`/`RETIRED`/`DELETED`     |
| `maintainer`  | string | 挂账人，对应用户名 |
| `parentid`    | string | 所从属的资产的id           |
| `category`    | string | 分类 |
| `serial`      | string | 瞎jb填                 |
| `brand`       | string | 瞎jb填 |
| `model`       | string | 瞎jb填 |
| `location`    | string | 瞎jb填 |
| `currentuser` | string | 当前使用人，对应用户名 |
| `department`  | string | 挂账部门，对应业务实体 |
| `value`       | integer| 当前价值 |
| `date`        | date   | 入库时间 |
| `lifespan`    | integer| 使用期限，以秒为单位 |

## 部门

层级树结构，与资产分类类似

| 属性名         | 类型      | 备注                    |
| ------------- | ------    | -------------------------- |
| `name`        | string    | 类别名称 |
| `children`    | JSON list | 子类别，嵌套 |

#### `/department/query` 部门查询

- 请求体：无
- 返回：JSON, 部门层级树

#### `/department/add` 添加部门
- 请求体：parent(String) name(String)，分别为父部门的名称和要添加的子部门的名称
- 返回：无
- 备注：若parent不存在或name重复则报错

#### `/department/remove` 删除部门
- 请求体：name(String)，transfer(Optional, String)，要删除的部门名和原部门下的员工、资产将要转移到的部门，若transfer对应的部门不存在，则直接删除
- 返回：无
- 备注：若name不存在则报错

#### `/department/rename` 部门重命名
- 请求体：oldname(String) newname(String) 旧部门名称和修改后的部门名
- 返回：无
- 备注：若oldname不存在或newname重复则报错


## 申请与审批

申请请求：

| 属性名         | 类型   | 备注                    |
| ------------- | ------ | -------------------------- |
| `id`    | string |   申请请求的id，由后端生成，唯一                    |
| `assetsid`    | list of string |   资产的id，REQUIRE为空                    |
| `description`| string |  申请描述  |
| `starttime`| string | 申请发起时间，形如（2020-11-14 16:30:27），由后端填入 |
| `step1time` | string | 主管同意/拒绝申请的时刻，由后端填入 |
| `step2time`| string | 资产管理员同意申请/拒绝申请/分配资产的时刻，由后端填入 |
| `supervisorname`| string | 同意/拒绝申请的主管用户名，由后端填入 |
| `assetmanagername` | string | 同意/拒绝申请的资产管理员用户名，由后端填入 |
| `category` | string, optional | 申请类型为REQURIE时含有该属性，为申请资产的类型  |
| `number` | string, optional | 申请类型为REQURIE时含有该属性，为申请资产的数量 |
| `applier`   | string |   申请人的用户名                       |
| `operation`   | string |   `REQUIRE`/`MAINTAIN`/`RETURN`/`TRANSFER`                    |
| `target` | string, optional |   当type为TRANSFER时，表示转移的对象	|
| `status` | string |  `等待主管审核`/`审核未通过`/`等待资产管理员确认`/`确认未通过`/`完成`	|

#### `/operation/apply` 资产领用/维护/退库/转移申请

- 请求体：assetsid(List) category(String,optional) number(Integer, optional) operation(String) applier(String) target(String, optional）
- 返回：success(Boolean，表示申请是否成功)

#### `/operation/query` 申请列表

- 请求体：无
- 返回：[list of 申请请求]
备注：权限要求：资产管理员/主管，只返回该部门的请求

#### `/operation/mylist` 我的申请

- 请求体：无
- 返回：[list of 申请请求]
备注：只返回applier为当前用户的请求

#### `/operation/assign` 分配资产

- 请求体：id(string) assetsid(list of string) 将资产分配给请求
- 返回：success

#### `/operation/approval` 申请审批

- 请求体：id(string，申请请求的id) response(String, `approve`/`reject`) 
- 返回值：success，表示操作成功

#### 审批流程

第一步：用户提交申请，向后端发送`/operation/apply`请求，后端将该请求状态设为”等待主管审核“，存入数据库

第二步：主管通过`/operation/query`获取本部门的请求，在前端操作后向后端发送`/operation/approval`请求，后端判断申请的状态是否为”等待主管审核“，假如是，则判断response是否为approve，若是，则该申请状态变为”等待资产管理员确认“，否则为”审核未通过“

第三步：资产管理员通过`/operation/query`获取本部门的请求，在前端操作后向后端发送`/operation/approval`请求或`/operation/assign`，后端判断申请的状态是否为”等待资产管理员确认“，假如是，则判断response是否为approve，则该申请状态变为”完成“，并根据申请的类型改变资产的状态（如闲置->使用中，以及挂账人的修改），否则为”确认未通过“。（备注：REQUIRE的操作用approval来拒绝，用assign来同意并分配，使用该接口时需要判断资产是否为对应的类别、是否空闲）

| operation | maintainer | currentuser | status |
| --------- | ---------- | ----------- | ------ |
| `REQUIRE` | 申请者 | 申请者 | `IN_USE` |
| `MAINTAIN` | 不变 | 不变 | `IN_MAINTAIN` |
| `RETURN` | 资产管理员 | 无 | `IDLE` |
| `TRANSFER` | target | target | 不变 |

## 系统
#### `system/online` 查询token是否失效

请求体：无
返回：无
若token失效，返回401

#### `/system/log` 系统日志

| 属性名 | 类型 | 备注 |
| --------- | ---------- | ----------- |
| `timestamp` | string | 时间 |
| `content` | string | 内容 |

- 请求体：startdate(Date, 开始日期) enddate(Date, 终止日期) type(`login`/`dataupdate`，登陆日志或关键数据修改日志)
- 返回：[list of SystemLog]，系统日志
- 备注：需要usermanager权限，查询最近的 `[satrtdate, enddate])` 之间的系统日志

#### `/system/menu/query` 菜单查询

请求体：无
返回：list of JSON

菜单为多级结构，格式如下：

| 属性名 | 类型 | 备注 |
| ----- | ---- | ----- |
| `title` | string | 名称 |
| `index` | string | url，可以形如`/asset/list`表示本地路径，也可以是第三方路径 |
| `authority`| JSON {`ITmanager`: true/false, `usermanager`:true/false, ..., `user`:true/false}| 访问该菜单项的用户角色（为true表示该角色能访问），`user`表示一般用户 |
| `subs`  | list of JSON | 子目录 |


#### `/system/menu/add` 添加菜单项

请求体：title(String) index(String) parent(String) authority(JSON) 为子功能项的名称、子功能项的url、父菜单功能项的名称、访问该项的用户角色
返回：无

#### `/system/menu/remove` 删除菜单项

请求体：title(String) 删除的功能项名称
返回：无

#### `/system/menu/update` 菜单项更改

请求体：title(String) newTitle(String) newIndex(String) authority(JSON) 功能项原名称、功能项新名称、功能项新url、访问该项的用户角色
返回：无

备注：菜单项的增删改操作需要IT管理员权限
