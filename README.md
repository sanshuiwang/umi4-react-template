## 使用 yarn 创建项目

---

### 使用 yarn create umi[通过官方工具创建项目](https://umijs.org/docs/tutorials/getting-started#%E5%88%9B%E5%BB%BA%E9%A1%B9%E7%9B%AE)

1. 官方 create，帮助开发者初始化创建 git, 用户选择 yarn,taobao
2. 创建完毕后，我们可自己手动添加.yarnrc 同时指向淘宝源
3. vscode 看不到.git 文件夹，项目中手动添加.vscode-->settings.json, 就这样 vscode 展示出.git
   ```json
   "files.exclude": {
    "**/.git": false
   }
   ```

---
