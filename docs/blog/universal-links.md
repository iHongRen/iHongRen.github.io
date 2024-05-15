# 通用链接( Universal Links )

### 什么是通用链接

通用链接其实就是一个 HTTPS URL，在 iOS9 后引入，旨在提供一种无缝的用户体验，将 URL 与 App 关联起来。  

通用链接的优势在于提供了更流畅、一致的用户体验。例如，当用户从社交媒体或电子邮件中点击一个链接时，可以直接打开相关的 App，而不需要经过多个步骤，如在浏览器中打开链接，再登录等。这有助于提高用户转化率和增强应用的使用体验。（如果用户没有安装 App，则可以直接打开对应的 web 页面）。



### 如何配置通用链接  
<br>

#### 1、启用 Associated Domains 功能：
- 登录苹果开发者网站，在"Certificates, Identifiers & Profiles"中，点击"Identifiers"，选择"App IDs"。
- 找到对应的 App ID，进入"Edit your App ID Configuration"页面，勾选“Associated Domains”，点击“Save”按钮。

#### 2、在项目中配置关联域名：
- 打开应用项目，在 Xcode 中选择应用的目标（Target）。
- 在"Signing & Capabilities"选项卡中，点击"+Capabilities" ，添加 "Associated Domains" 功能。
- 添加关联域名，格式为 "applinks:yourdomain.com"，其中"yourdomain.com"是你的域名。
  
#### 3、创建关联文件：
- 创建一个名为"apple-app-site-association"的 JSON 文件（注意不需要 .json 扩展名），文件内容如下：
```json
// apple-app-site-association
{
    "applinks": {
        "apps": [],
        "details": [
            {
                "appIDs": [
                    "TeamID.BundleID"
                ],
                "components": [
                    {
                        "/": "*"
                    }
                ]
            }
        ]
    }
}
```
**说明：**
- **TeamID** 和 **BundleID** 你都可以在苹果开发者网站上获得。
- "**components**" 部分也可以换成老版本的配置： `"paths": [ "*" ]`
- "*" 是通配符，表示所有路径都可以用于打开 App。
- 你也可以配置多个路径，甚至排除一些路径，具体配置可以自行查阅。

#### 4、上传关联文件：

- 将 apple-app-site-association 文件上传到您的 HTTPS 网络服务器。
- 放在服务器的根目录或 .well-known 子目录中。但是苹果更推荐使用 .well-known 子目录。
- 在浏览器中打开查看 <https://yourdomain.com/.well-known/apple-app-site-association> 



### 通用链接是否生效
> Tip: 为了方便我们简写 apple-app-site-association 为 AASA。

##### 1、可以将通用链接粘贴到“备忘录”应用中并长按。在弹出的选项中如果有你的应用，则说明通用链接配置成功。


##### 2、在 iOS 上，您还可以通过以下步骤在开发者设置中使用关联的域诊断测试来检测通用链接：

- 在“设置”中打开开发人员模式
- 在“开发人员设置>”中，滚动到“通用链接”的部分，然后打开“关联域开发”。
- 打开“诊断”并键入完整的 URL

> 注意：  
> 直接在 Safari 的地址栏中输入 URL 是不会打开 App 的。Safari 会将此操作视为直接导航，显示域名对应的网站，上方会显示一个横幅以打开您的应用。


> 在iOS 14及更高版本上，Apple 的 CDN 检索并缓存 AASA 文件。安装应用后，设备会立即从 CDN 下载文件。设备在安装应用后大约每周检查一次更新。要下载较新版本的 AASA 文件，请重新安装该应用程序。没有直接的 CDN 失效选项。

在开发测试阶段，如果你不想从苹果的 CDN 下获取 AASA 文件，那么可以使用 developer 模式。这允许你绕过 Apple 的 CDN 并直接从您的站点获取 AASA 。  
比如添加新的关联域名: "applinks:test.yourdomain.com?mode=developer" 。



