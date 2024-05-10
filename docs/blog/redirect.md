# 了解 HTTP 重定向

HTTP 重定向用于将用户的请求从一个 URL 重定向到另一个 URL。客户端（通常是浏览器）发送一个 HTTP 请求到服务器，然后服务器返回一个特定的重定向状态码（3xx）和新的目标 URL，客户端会自动向新的目标 URL 发起新的请求。这样可以实现在不更改用户请求的情况下，将用户引导到不同的页面或资源。

<img src="https://raw.githubusercontent.com/iHongRen/iHongRen.github.io/master/screenshots/blog/redirect/redirect.png">



下面使用 Express 简单开启一个服务器来验证上图的过程：

1、新建目录 `http-redirect` , 打开终端切换到该目录，初始化工程

```shell
cd http-redirct
pnpm init
pnpm add express nodemon
```

2、在该目录，新增 `index.js` 程序入口文件

```js
const express = require('express')
const app = express()

app.get('/old-url', (req, res) => {
    res.redirect(301, '/new-url')
})

app.get('/new-url', (req, res) => {
    res.send('This is the new URL')
})

app.listen(3000, () => {
    console.log('服务器地址为：http://localhost:3000')
})
```

3、修改 package.json 配置启动脚本

```json
"scripts": {
    "start": "nodemon index.js"
},
```

4、启动服务器

```shell
pnpm start
```

5、在浏览器访问 http://localhost:3000/old-url

6、打开开发者工具，勾选 `停用缓存`，选中 `文档`，再重新访问  http://localhost:3000/old-url

<img src="https://raw.githubusercontent.com/iHongRen/iHongRen.github.io/master/screenshots/blog/redirect/1.png">

眼睛够尖的同学能够看到 `/old-url` 迅速就变成了`/new-url`。这就是重定向了。

7、查看 old-url 的响应头

<img src="https://raw.githubusercontent.com/iHongRen/iHongRen.github.io/master/screenshots/blog/redirect/2.png">

8、重定向后得到 /new-url 的资源

<img src="https://raw.githubusercontent.com/iHongRen/iHongRen.github.io/master/screenshots/blog/redirect/3.png">

整个过程如下：

1、浏览器请求 http://localhost:3000/old-url

2、服务器检查请求的 /old-url，并确定要重定向新的URL

3、服务器返回重定向状态码 301 Moved Permanently 和 新的目标地址 location: /new-url

4、浏览器收到响应后，解析请求头，发现是一个重定向状态码

5、浏览器根据重定向状态码的要求，向新的目标地址 /new-url 发起新的请求

6、服务器收到新的请求，返回 /new-url 的响应内容

7、浏览器显示 /new-url 的内容给用户

可以看出重定向过程经过了两次往返，这中间是有所消耗的，但对于用户来说几乎可以忽略。



不同类型的重定向映射可以分为三类：**永久重定向、临时重定向、特殊重定向**

#### 永久重定向

这类重定向表明，旧的 URL 不应再被使用，以后都使用新的 URL 替换它。浏览器会缓存 `/old-url` 到 `/new-url` 的关联，下次请求 `/old-url` 时，浏览器就会直接请求`/new-url `。

| 状态码 | 状态文本             | 处理方法                                                     | 典型应用场景                       |
| :----- | :------------------- | :----------------------------------------------------------- | :--------------------------------- |
| `301`  | `Moved Permanently`  | [`GET`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/GET) 方法不会发生变更。其他方法有可能会变更为 [`GET`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/GET) 方法。[1] | 网站重构。                         |
| `308`  | `Permanent Redirect` | 方法和消息主体都不发生变化。                                 | 使用用于非 GET 链接/操作重组网站。 |

> [1] 该规范无意使方法发生改变，但在实际应用中用户代理会更改其方法。[`308`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/308) 状态码被创建用来消除在使用非 `GET` 方法时行为的歧义。

#### 临时重定向

临时重定向表明，这是个临时的，以后还会用以前的 URL 来请求。常用于网站临时维护、临时性访问限制等。

| 状态码 | 状态文本             | 处理方法                                                     | 典型应用场景                                                 |
| :----- | :------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| `302`  | `Found`              | [`GET`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/GET) 方法不会发生变更。其他方法有可能会变更为 [`GET`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/GET) 方法。[2] | 由于不可预见的原因该页面暂不可用。                           |
| `303`  | `See Other`          | [`GET`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/GET) 方法不会发生变更，其他方法会*变更*为 `GET` 方法（消息主体丢失）。 | 用于 [`PUT`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/PUT) 或 [`POST`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/POST) 请求完成之后重定向，来防止由于页面刷新导致的操作的重复触发。 |
| `307`  | `Temporary Redirect` | 方法和消息主体都不发生变化。                                 | 由于不可预见的原因该页面暂不可用。当站点支持非 `GET` 方法的链接或操作的时候，该状态码优于 302 状态码。 |

> [2] 该规范无意使方法发生改变，但在实际应用中用户代理会改变其方法。[`307`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/307) 状态码被创建用来消除在使用非 `GET` 方法时行为的歧义。

对于 POST API 接口的重定向，应该使用 307 ，避免参数丢失。

#### 特殊重定向

日常开发中最常见的 `304`，相当于重定向到本地缓存。加载缓存内容给用户。

| 状态码 | 状态文本          | 典型应用场景                                                 |
| :----- | :---------------- | :----------------------------------------------------------- |
| `300`  | `Multiple Choice` | 不常用：所有的选项在消息主体的 HTML 页面中列出。鼓励在 [`Link`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Link) 标头中加入机器可读的 `rel=alternate` |
| `304`  | `Not Modified`    | 资源未修改，表示本地缓存仍然可用。没有 `Location` 响应头     |
| 305    | `Use Proxy`       | 用来表示必须通过一个代理来访问资源，代理的位置有 `Location` 头字段给出 |
| 306    | `Switch Proxy`    | 在最新版的规范中，306 状态码已经不再被使用。最初是指“后续请求应使用指定的代理”。 |



### 其他重定向方式

除了 HTTP 重定向，还有两种重定向：

**1、基于 HTML 的 `<meta>` 元素的重定向**

给  `<meta>` 添加一个 `http-equiv` 属性，设置值为 `Refresh`。`content` 属性设置值为重定向 URL，以 0 开头，表示等待 0 秒后跳转。

```html
<head>
  <meta http-equiv="Refresh" content="0; URL=http://example.com/" />
</head>
```

显然，该方法仅适用于 HTML 页面（或类似的页面），并不能应用于图片或者其他类型的内容。



**2、基于 DOM 的 JavaScript 重定向**

设置 [`window.location`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/location) 的属性值，与 HTML 重定向类似，不适用于所有类型的资源，只有在执行 JavaScript 的客户端上才能使用。

```js
window.location = "https://example.com/";
```



### 优先级

在多种重定向方式同时存在的情况下：

HTTP 方式最先触发，其次是 HTML `<meta>`  ，最后才是 JavaScript `window.location` 。

这个很容易想到，我们在浏览器访问一个 url 时，最先发起 HTTP 请求，然后才是响应返回的数据 HTML，最后 js 在 HTML 里执行。



### 服务器内部转发 Forword

修改上面 `index.js` 文件，保存运行。

```js
//app.get('/old-url', (req, res) => {
//    res.redirect(301, '/new-url')
//})

app.get('/old-url', (req, res, next) => {
    req.url = '/new-url'
    next()
})
```

当我们 访问 `/old-url` 时，同样能得到 `/new-url` 的资源。

区别于重定向，转发是在Web服务器内部完成，客户端只请求了一次，浏览器 url 还是 ` old-url` 。

如果需要更改 URL 或将请求发送到其他网址，使用重定向。

如果仅在服务器内部进行请求处理和转发，使用转发。



### 参考链接

https://juejin.cn/post/6901246149802328078#heading-3

https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Redirections