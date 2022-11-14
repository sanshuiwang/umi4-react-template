# umi4 + ts

## 基于 umi 脚手架

---

### 环境准备

- node v14.18.2
- yarn 1.22.19

---

### 使用 yarn create umi[通过官方工具创建项目](https://umijs.org/docs/tutorials/getting-started#%E5%88%9B%E5%BB%BA%E9%A1%B9%E7%9B%AE)

1. 官方 create，帮助开发者初始化创建 git, 用户选择 yarn,taobao
2. 查看 `package.json` 当前 umi 版本：`"umi": "^4.0.30"`
3. 创建完毕后，我们可自己手动添加.yarnrc 同时指向淘宝源
4. 推荐[Visual Studio Code](https://code.visualstudio.com/)，vscode 看不到.git 文件夹，项目中手动添加.vscode-->settings.json, 就这样 vscode 展示出.git
   ```json
   "files.exclude": {
    "**/.git": false
   }
   ```

---

## 添加 umi 配置项

> [配置](https://umijs.org/docs/api/config)

1. 创建项目后，.umirc.ts 自动生成内容

```
   export default {
   npmClient: 'yarn'
   };
```

2. alias 配置别名，对 import 语句的 source 做映射

   > 代码 import 引入资源路径变化

   ```
   旧：import yayJpg from '../assets/yay.jpg';

   新：import yayJpg from '@/assets/yay.jpg';
   ```

3. clickToComponent 通过 Option+Click/Alt+Click 点击组件跳转至编辑器源码位置。默认为 'vscode'

```
   const path = require("path");
   export default {
      npmClient: "yarn",
      alias: {
         "@": path.resolve(__dirname, "src"),
      },
      clickToComponent: {},
   };
```

---

## 编写 Todo List

### 功能：增删
