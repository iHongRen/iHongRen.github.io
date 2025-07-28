# HarmonyOS UDID 获取工具


<img src="https://raw.githubusercontent.com/iHongRen/iHongRen.github.io/master/screenshots/blog/udid/icon.png" width="200" data-fancybox="gallery">

**一个简单易用的 HarmonyOS 设备 UDID 获取工具，帮助测试、产品等非开发者轻松获取鸿蒙设备的 UDID。**

[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue.svg)]()



<img src="https://raw.githubusercontent.com/iHongRen/iHongRen.github.io/master/screenshots/blog/udid/app.png"  data-fancybox="gallery">

## 📖 简介

HarmonyOS UDID 获取工具是一个跨平台的图形界面应用程序，专门用于获取 HarmonyOS 设备的 UDID。该工具基于华为官方的 HDC命令行工具，提供了友好的图形界面。

## ✨ 功能特性

-  **跨平台支持** - 支持 Windows、macOS 和 Linux 系统
-  **自动设备检测** - 自动扫描并列出连接的 HarmonyOS 设备
-  **一键复制** - 支持一键复制 UDID 到剪贴板
-  **实时刷新** - 支持实时刷新设备列表
-  **多设备支持** - 同时管理多个连接的设备
-  **安全可靠** - 基于华为官方 HDC 工具，安全可信

## 🚀 安装使用

### 下载预编译版本

1. 前往 [Releases](https://github.com/iHongRen/harmony-udid-tool/releases) 页面，下载适合你系统的版本。

2. 解压并运行应用程序

  

💡 macOS 安装，在拖放到**应用程序**后，终端再执行：

```
sudo xattr -dr com.apple.quarantine /Applications/HarmonyOS-UDID-Tool.app
```

  

## ℹ️ 使用说明

### 基本操作

1. **连接设备**
   - 使用 USB 数据线连接 HarmonyOS 设备到电脑
   - 确保设备已开启开发者模式和 USB 调试

2. **获取 UDID**
   - 启动应用程序
   - 点击"刷新设备"按钮扫描连接的设备
   - 从下拉列表中选择目标设备
   - UDID 将自动显示在文本框中

3. **复制 UDID**
   - 点击"复制 UDID"按钮
   - 或者右键点击 UDID 文本框选择复制

### 设备连接要求

- ✅ HarmonyOS 设备已连接到电脑
- ✅ 设备已开启开发者模式
- ✅ 设备已开启 USB 调试

## ❓ 常见问题

### Q: 为什么检测不到设备？

**A:** 请检查以下几点：
- 确保设备已正确连接到电脑
- 确认设备已开启开发者模式和 USB 调试
- 检查是否已授权电脑的连接请求
- 尝试重新连接设备或更换 USB 数据线

### Q: 如何开启 HarmonyOS 开发者模式？

**A:** 请按以下步骤开启：
1. 进入"设置" > "关于本机"
2. 连续点击"软件版本" 7 次
3. 返回"设置" > "系统" > "开发者选项"
4. 开启"USB 调试"


---
如果本项目对你有帮助，希望能给个 🌟[Star](https://github.com/iHongRen/harmony-udid-tool)， 给开发者一点反馈。
