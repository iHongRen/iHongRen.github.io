
# CXYWebScript
---
简化 iOS App 与 H5 交互，H5 直接调用 window.App?.onSayHello('Hello')，即可完成对原生 App  `onSayHello:` 方法的调用。如此，与 H5 在 Android 端调用一致。



#####  H5 端的简化

```js
// 以前 需要区分环境
if (isAndroid) {
    window.App.onSayHello('Hello'); 
}
 
if (isiOS) {
    window.webkit.messageHandlers.onSayHello.postMessage('Hello');   
}

// 现在 iOS使用CXYWebScript后, H5无需引入任何库，iOS和Android统一调用：
window.App?.onSayHello('Hello')
```

> Tip1: 以上 window.App 是可以自定义的，如 window.CXY
>
> Tip2: 判断当前环境是客户端还是其他H5端，可直接使用 if (window.App) 就行


##### iOS  端的简化

```objective-c
// 以前
CXYWeakScriptMsgHander *weakSelf = [[CXYWeakScriptMsgHander alloc] initWithHandler:self];
WKUserContentController *contentController = self.webView.configuration.userContentController;
[contentController addScriptMessageHandler:weakSelf name:@"onSayHello"];
[contentController addScriptMessageHandler:weakSelf name:@"onPreviewImages"];
[contentController addScriptMessageHandler:weakSelf name:@"onShareObj"];

#pragma mark - WKScriptMessageHandler
- (void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message {
   
    NSString *selector = message.name;
    id body = message.body;
  
    if ([selector isEqualToString:@"onSayHello"]) {
        
    } else if ([selector isEqualToString:@"onPreviewImages"]) {
        
    } else if ([selector isEqualToString:@"onShareObj"]) {
        
    }
}

// 现在
self.webScript = [[CXYWebScript alloc] initWithWebView:self.webView];
[self.webScript useUIDelegate];

// block 方式
[self.webScript addJsFunc:@"onSayHello" block:^NSString * _Nullable(NSArray *args) {
    return @"支持返回字符串或nil，给JS";
}];

// async-block 方式，支持异步返回值
[self.webScript addJsFunc:@"onPreviewImages" asyncBlock:^(NSArray * _Nonnull args, CXYStrBlock  _Nonnull returnBlock) {  
  
  	cxy_dispatch_after_main_delay_block(2, ^{    
    		returnBlock(@"我是异步返回值，2秒后才返回"); // returnBlock 必须要执行
  	});
}];

// 或者 action-target 方式
[self.webScript addTarget:self
                   jsFunc:@"onPreviewImages"
                    ocSel:@selector(onPreviewImages:currentIndex:)];

[self.webScript addTarget:self
                   jsFunc:@"onShareObj"
                    ocSel:@selector(onShareObject:)];

```



### [CXYWebScript](https://github.com/iHongRen/CXYWebScript) 有以下特点：

- H5 在调用原生 App 方法是时，不需要区分是 Android 还是 iOS 环境

- 支持使用 block，async-block 和 target-action 方式注册 js 方法

- 支持原生 App 传递返回值给 H5 (限字符串类型或 nil )

- 支持 OC 与 Swift， **iOS 10+**

- 整个实现不到 **200** 行代码

  

### 原理解释:

1、让 WKWebView 注入下面的代码到 JS 环境中：

```objective-c
NSString *js = 
  @"window.App = new Proxy({},{      \
    get: function (target, name) {   \
        return function (...args) {  \
            return window.prompt(name,JSON.stringify(args)); \
        }; \
    }      \
	});"

WKUserScript *script = [[WKUserScript alloc] initWithSource:js injectionTime (WKUserScriptInjectionTimeAtDocumentStart) forMainFrameOnly:NO];    
[self.webView.configuration.userContentController addUserScript:script];
```

> 提示: 
>
> 使用` window.webkit.messageHandlers[name].postMessage(args);` 亦可，只是后续实现略有不同。
>
> 问：为什么选用window.prompt方式呢？ 
>
> 答：因为它能直接同步返回值。



**Proxy** 的作用是拦截对 `window.App` 对象属性的访问。重写` window.App` 的 `get` 方法，当访问它的属性(name)时，会返回一个**匿名函数** ；

- 该函数的参数是可变的，类数组

- 该函数返回了` window.prompt(window.App.属性名, args的json字符串数组);` 

  那么当 H5 端  js 调用：

```js
window.App.onSayHello('Hello')  等价于 => window.prompt('onSayHello',\"['Hello']\"); 
```



2、而在 iOS H5 里调用 `window.prompt` 会执行 WKWebView.UIDelegate 的方法：

```objective-c
- (void)webView:(WKWebView *)webView
runJavaScriptTextInputPanelWithPrompt:(NSString *)prompt
    defaultText:(nullable NSString *)defaultText
initiatedByFrame:(WKFrameInfo *)frame
completionHandler:(void (^)(NSString * _Nullable result))completionHandler;

// 调用completionHandler后，能同步返回值给H5端。
completionHandler('返回值') 
```

其中的两个参数分别对应**方法名**和**参数列表JSON数组**：

```
(NSString *)prompt => 'onSayHello'
(nullable NSString *)defaultText => '[\'Hello\']'
```



3、对于 **target-action** 方式，根据方法名得到对应的 `SEL`，使用`NSInvocation`类，可以构造一个表示方法调用的对象，包括方法选择器、目标对象、参数和返回值。可以处理具有多个参数的方法调用。

```objective-c
// self.scriptMap = {@"onSayHello": NSStringFromSelector(onSayHello:)}
NSString *selString = self.scriptMap[prompt];  
SEL sel = NSSelectorFromString(selString);
NSArray *args = [self arrayWithJSON:defaultText];

NSMethodSignature *signature = [self methodSignatureForSelector:aSelector];
NSInvocation *invocation = [NSInvocation invocationWithMethodSignature:signature];
[invocation setTarget:self];
[invocation setSelector:aSelector];
... 详细见源码
```



4、对于 **block**、**async-block** 方式，根据方法名找到对应的 block，直接执行 block 就行：

```objective-c
// self.blockMap = {@"onSayHello": CXYBlock}
CXYBlock block = self.blockMap[prompt];
NSArray *args = [self arrayWithJSON:defaultText];
block(args);
```



### 源码

更多介绍和使用，请看 [Github](https://github.com/iHongRen/CXYWebScript  ) ,  欢迎 **star**

https://github.com/iHongRen/CXYWebScript  
