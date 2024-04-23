# iOS UITextView 加载 HTML 时的问题与优化

#### 在 iOS 中如果想加载显示 HTML 文本，一般有以下的几种方案：

1. 使用 WKWebView ，偏重、性能较差

2. 将 HTML 字符串转换为 `NSAttributedString` 对象，使用 UITextView，UILabel...

3. 使用一些三方库，如 DTCoreText、SwiftSoup

4. 自己去解析标签实现，较复杂。  

对于一些详情原生页面，加载一段功能简单的 html 标签文本，使用  `NSAttributedString + UITextView` 是一种相对轻量的选择，本文也只讨论这种方式。

### 然而在实际开发的过程中，我们很容易发现一些问题：

##### 1、html 字符串转 NSAttributedString 是同步的，文本稍大一点，就会阻塞主线程，页面卡死。

这个问题好解决，直接将转换操作放到子线程去做就好

```objective-c
dispatch_async(dispatch_get_global_queue(0, 0), ^{
    NSAttributedString *att = [htmlString htmlToAttr];
    dispatch_async(dispatch_get_main_queue(), ^{
        self.textView.attributedText = att;
    });
});
```

##### 2、如果只是一些片段 html 标签，转换后的样式可能不太美观，可以加一些 CSS 来美化。

比如字体默认太小，图片显示太宽等。这时我们可以自己拼接一些 CSS 进去，下面代码我们增加默认字体大小 16px，图片宽度为 textView 宽度，高度自适应。

```objective-c
CGFloat contentWidth = self.textView.bounds.size.width;
NSString *newHtml = [NSString stringWithFormat:@"<head><style>body%@img{width:%f !important;height:auto}</head></style>%@",@"{font-size:16px;}",contentWidth,html];
```

你也可以去遍历 `NSParagraphStyleAttributeName` 属性，来设置一些 style。

```objective-c
// 设置行高
- (NSAttributedString*)addLineHeight:(CGFloat)lineHeight attr:(NSAttributedString*)attr {
    [attr enumerateAttribute:NSParagraphStyleAttributeName inRange:NSMakeRange(0, attr.length) options:(NSAttributedStringEnumerationLongestEffectiveRangeNotRequired) usingBlock:^(NSMutableParagraphStyle *style, NSRange range, BOOL * _Nonnull stop) {
        NSAttributedString *att = [attr attributedSubstringFromRange:range];
        // 忽略 table 标签
        if (![[att description] containsString:@"NSTextTableBlock"]) {
            style.lineSpacing = 8;
        }
    }];
    return attr;
}
```



##### 3、加载图片过大、多图时，首次显示很慢，拼网络了。

这种时候，我们可以先使用正则找出所有的 `<img>` ，然后有两个种方案选择：

1、将所有 `<img>` 删除， 先显示删除图片后的文本内容，再去加载原始的 html。

```objective-c
NSString *pattern = @"<img[^>]*>";
NSRegularExpression *regex = [NSRegularExpression regularExpressionWithPattern:pattern options:0 error:nil];
NSString *resultString = [regex stringByReplacingMatchesInString:html options:0 range:NSMakeRange(0, html.length) withTemplate:@""];
```

2、将所有 `<img>` 替换为本地的默认图片，先显示，再去加载原始的 html。

```objective-c
 // 使用占位图
NSString *fileUrl = [[NSBundle mainBundle] URLForResource:@"default_cover" withExtension:@"png"].absoluteString;
NSString *replacement =[NSString stringWithFormat:@"<img src=\"%@\">", fileUrl];

NSString *pattern = @"<\\s*img\\s+[^>]*?src\\s*=\\s*[\'\"](.*?)[\'\"]\\s*(alt=[\'\"](.*?)[\'\"])?[^>]*?\\/?\\s*>";
    NSRegularExpression *regexImg = [NSRegularExpression regularExpressionWithPattern:pattern options:NSRegularExpressionCaseInsensitive error:nil];
NSString *resultString = [regexImg stringByReplacingMatchesInString:html options:0 range:NSMakeRange(0, html.length) withTemplate:replacement];
```

这样，我们能减少首次显示的时间。

##### 4、实现图片点击，能查看大图

在设置 UITextViewDelegate 代理后，通过代理方法去拦截。

```objective-c
self.textView.delegate = self;

- (BOOL)textView:(UITextView *)textView shouldInteractWithTextAttachment:(NSTextAttachment *)textAttachment inRange:(NSRange)characterRange interaction:(UITextItemInteraction)interaction {
    // 拦截到了点击，但是获取不到点击的图片
}
```

虽然能拦截到图片点击了，但是拿不到图片的 url，以及点击的是第几张图片。不过，如果加载的图片来自 fileURL，那就能拿到文件名 `NSString *fileName = textAttachment.fileWrapper.filename;`

我们完全可以实现一套 HTML 里的图片缓存，使用正则匹配出所有 `<img src=>` 获取到图片 url , 借助 SDWebImage 去下载图片保存到本地，再用这个图片 fileURL 去替换掉原 src的内容。即达到了使用自己缓存的目的，这样加载出来的图片，点击时，可以知道点击的图片名 `filename`。

```objective-c
// 仅部分代码，完整的请看 demo: https://github.com/iHongRen/UITextView-html-demo

// 找到所有图片url，imgs 
NSMutableArray *imgs = [NSMutableArray array];
for (NSTextCheckingResult *match in matches) {
    NSRange matchRange = [match rangeAtIndex:1];
    NSString *imageUrl = [html substringWithRange:matchRange];
    [imgs addObject:imageUrl];
}

// 下载完成后进行 url 替换
__block NSString *newHtml = html;
for (NSInteger i=0; i<imgs.count; i++) {
    NSString *imageUrl = imgs[i];

    [imageUrl downloadImageIfNeeded:^(NSURL *URL) {
        if (URL) {
            NSArray *matches = [regexImg matchesInString:newHtml options:0 range:NSMakeRange(0, newHtml.length)];
            NSRange matchRange = [matches[i] rangeAtIndex:1];
            newHtml = [newHtml stringByReplacingOccurrencesOfString:imageUrl withString:URL.absoluteString options:NSCaseInsensitiveSearch range:matchRange];
        }
    }];
}

// 下载图片，保存本地
- (void)downloadImageIfNeeded:(void(^)(NSURL *fileURL))block {
  	NSString *key = [self storeKeyForUrl];
    [[SDWebImageDownloader sharedDownloader] downloadImageWithURL:[NSURL URLWithString:self] completed:^(UIImage * _Nullable image, NSData * _Nullable data, NSError * _Nullable error, BOOL finished) {
        if (data) {
            [[SDImageCache sharedImageCache] storeImageDataToDisk:data forKey:key];
        }
        NSURL *URL = [key fileURLForImageKey];
        if (block) {
            block(URL);
        }
    }];
  } 
}
```

拿到 filename 之后，我们就可以匹配出点击的图片 url 以及 索引位置

```objective-c
NSString *fileName = textAttachment.fileWrapper.filename;
if (!fileName) {
    return YES;
}

// self.imgUrls 是我们匹配出的所有图片url 
for (NSInteger i=0; i<self.imgUrls.count; i++) {
    NSString *imgUrl = self.imgUrls[i];
    NSString *key = [imgUrl storeKeyForUrl];
    NSString *path = [[SDImageCache sharedImageCache] cachePathForKey:key];
    if ([path containsString:fileName]) {
        [self showToast:[NSString stringWithFormat:@"你点击了第%@张图片\n%@",@(i),imgUrl]];
        break;
    }
}
```

##### 5、上面的方法还需要注意，如果图片的 src 是 base64 url，需要特殊处理

将 base64 字符串直接转为图片，再存储到本地

```objective-c
// NSString+Html.m 类别

- (BOOL)isBase64Url {
    return [self hasPrefix:@"data:image/"];
}

NSString *base64 = [self componentsSeparatedByString:@"base64,"].lastObject;
NSData *data = [[NSData alloc] initWithBase64EncodedString:base64 options:NSDataBase64DecodingIgnoreUnknownCharacters];
if (data) {
    [[SDImageCache sharedImageCache] storeImageDataToDisk:data forKey:key];
}
NSURL *URL = [key fileURLForImageKey];

```

##### 6、如果你的 html 比较复杂，在一些机型上可能会遇到加载卡死、崩溃。

你可以关闭一些属性，这些属性会增加布局复杂性和计算成本，导致渲染卡死

```objective-c
// NSLayoutManager 不会考虑字体领先间距，行高将仅包括字体的实际高度，而不会有额外的垂直间距
self.textView.layoutManager.usesFontLeading = NO;

// 用于指定文本容器（text container）是否允许非连续布局。
self.textView.layoutManager.allowsNonContiguousLayout = NO;
```

##### 7、如果使用 textView 的宽度去计算富文本高度，把这个高度赋予 textView 时，内容显示不完整。

这是因为 textView 有自带的边距导致的

```objective-c
self.textView.textContainer.lineFragmentPadding = 0;
self.textView.textContainerInset = UIEdgeInsetsZero;

- (CGFloat)heightForAttr:(NSAttributedString *)attr width:(CGFloat)width {
    CGSize contextSize = [attr boundingRectWithSize:(CGSize){width, CGFLOAT_MAX} options:NSStringDrawingUsesLineFragmentOrigin context:nil].size;
    return contextSize.height;
}
```

##### 8、如果你想保留 textView 可交互，又要禁止它的长按弹出菜单(拷贝，选择，...)

```objective-c
self.textView.editable = YES;

#pragma mark - UITextViewDelegate
- (BOOL)textViewShouldBeginEditing:(UITextView *)textView {
    return NO;
}
```



如果本文对你有帮助，请给个小赞👍🏻。

**demo** 地址：https://github.com/iHongRen/UITextView-html-demo 

demo 中有耗时显示，但不同机型测试结果不一。