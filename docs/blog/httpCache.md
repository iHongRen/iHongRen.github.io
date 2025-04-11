# 了解 HTTP 缓存

在计算机科学领域有个理论：**任何问题都可以通过增加一个中间层来解决。**

HTTP 缓存也是一个中间层，保存着源服务器响应的资源副本。缓存往往离客户端较近，可以提高网页的加载速度，减少重复的请求，从而增强用户体验。同时也是一种典型的空间换时间的解决方案。

但是，如果缓存使用不当，会造成用户无法访问到最新的资源，甚至页面无法加载等问题。了解 HTTP 缓存资源的存储、过期判断、更新等策略，有利于我们更好是使用缓存。



#### 下面我们使用 **Express** 搭建一个静态文件服务器来学习 HTTP 的缓存。过程如下：

```sh
> mkdir http-cache-demo
> cd http-cache-demo
> pnpm init
> pnpm add express nodemon
```

##### 1、在 http-cache-demo 项目下建立服务器代码文件：server.js

```js
const express = require('express')
const app = express()

app.use(
    express.static('./web', {
        cacheControl: false,
        etag: false,
        lastModified: false,
    })
)

app.listen(3000, () => {
    console.log('open http://localhost:3000')
})
```

##### 2、修改 package.json 的程序入口为 server.js，并增加启动脚本 start：

```json
"main": "server.js",
"scripts": {
  "start": "nodemon server.js",
},
```

##### 3、新建文件夹 web，作为静态站点目录，建立入口网页 index.html  和 一个子资源 child.js 文件 ：

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <script src="./child.js"></script>
    </head>
    <body>
        <p id="content"></p>
    </body>
    <script>
        document.getElementById('content').innerHTML = getText()
    </script>
</html>
```

```js
// child.js
const getText = () => {
    return 'http-cache-demo'
}
```

此时的项目结构大致如下：

```sh
http-cache-demo/
.
├── node_modules
│   ├── express -> .pnpm/express@4.19.2/node_modules/express
│   └── nodemon -> .pnpm/nodemon@3.1.3/node_modules/nodemon
├── package.json
├── pnpm-lock.yaml
├── server.js
└── web
    ├── child.js
    └── index.html
```



##### 4、启动我们的静态服务器，看看效果：

```sh
> pnpm start
```

##### 5、打开 http://localhost:3000/， 启动开发者工具，查看 child.js 文件的响应头：

<img src="1.png">



HTTP 的缓存是通过请求头和响应头来控制的，涉及很多缓存字段我们接下来慢慢理清。

请求头字段：Cache-Control、If-Modified-Since、If-None-Match、Pragma

响应头字段：Expires、Last-Modified、Cache-Control、ETag、Age



### Expires



### 

