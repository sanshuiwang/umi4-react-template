# umi4 + ts + antd@4 +

---

## React 基于 umi 脚手架

### 环境准备

- node v14.18.2
- yarn 1.22.19

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

## 先简单添加一些 umi 配置项

> [配置](https://umijs.org/docs/api/config)

1. 创建项目后，.umirc.ts 自动生成内容

```
   export default {
      npmClient: 'yarn'
   };
```

2. 配置文件添加提示功能

```
// .umirc.ts
import { defineConfig } from 'umi';
```

3. alias 配置别名，对 import 语句的 source 做映射

   > 代码 import 引入资源路径变化

   ```
   旧：import yayJpg from '../assets/yay.jpg';

   新：import yayJpg from '@/assets/yay.jpg';
   ```

4. `clickToComponent` 浏览器中通过 Option+Click/Alt+Click 点击组件跳转至编辑器源码位置。默认为 'vscode'; 创建`src/components/TestClickToComponent/index.tsx` 全局容器组件

5. umi 默认会把 pages 下的文件自动转为动态路由； `routes: []` 可使用配置路由

```
更改前：动态路由
│   └── pages
│       ├── docs.tsx       // '/'
│       ├── index.tsx      // '/docs'
```

```
更改后：
│   └── pages
│       ├── docs
│       │   └── index.tsx
│       └── home
│           └── index.tsx
```

> 配置路由

```
   routes: [
      { path: "/", component: "home" },
      { path: "/docs", component: "docs" },
   ],
```

6. `hash: true`开启 hash 模式，让 build 之后的产物包含 hash 后缀。通常用于增量发布和避免浏览器加载缓存

```
hash: false

dist
├── index.html
├── layouts__index.async.js
├── layouts__index.chunk.css
├── p__docs__index.async.js
├── p__home__index.async.js
├── static
│   └── yay.7d162f31.jpg
└── umi.js
```

```
hash: true

dist
├── index.html
├── layouts__index.2c61ad52.async.js
├── layouts__index.b6683f1c.chunk.css
├── p__docs__index.f1083b94.async.js
├── p__home__index.525b1b6f.async.js
├── static
│   └── yay.7d162f31.jpg
└── umi.edb0cca7.js
```

7. `mock` 在 umi4 中默认开，所以我们给项目中添加一个 mock 文件夹，与 src 文件夹平级。就这样我们可以在前端开发阶段，先自己进行数据调试。(~~后续会讲：使用 umi 的 proxy，或者 axios 的 baseURL 进行前后端联调以及本地 mock 的切换~~)

8. `theme: { '@primary-color': '#1DA57A' }` 配置 less 变量主题

9. `title: "Todo List"` 配置全局页面 title，暂时只支持静态的 Title，可以看到浏览器 tab 名称为 Todo List; 如果切换页面想要更换当前的 title 则使用[Helmet](https://umijs.org/docs/api/api#helmet)，动态配置 head 中的标签，例如 title

10. [verifyCommit](https://umijs.org/docs/api/config#verifycommit) 对 git commit 提交信息进行验证
    > 发现问题：【刚配置时，我以为开箱即用呢！后续将在提交代码、信息，与 husky,commitlint 进行详细】
    > git commit 时，随意输入提交信息，居然成功 commit
    > 找到原因，需要在[.husky/commit-msg 配置](https://umijs.org/docs/api/commands#verifycommit)

```
// .umirc.ts

   import { defineConfig } from 'umi';
   const path = require("path");
   export default defineConfig({
      npmClient: "yarn",
      alias: {
         "@": path.resolve(__dirname, "src"),
      },
      clickToComponent: {},
      hash: true,
      routes: [],
      theme: {},
      title: "Todo List",
      verifyCommit: {
         scope: [
            "feat",
            "fix",
            "docs",
            "style",
            "refactor",
            "perf",
            "test",
            "workflow",
            "build",
            "ci",
            "chore",
            "types",
            "wip",
            "release",
            "dep",
            "deps",
            "example",
            "examples",
            "merge",
            "revert",
         ],
         allowEmoji: true,
      },
   });
```

> Tips:
> umi4 的 history，默认值：`{ type: 'browser' }`。当然也可以使用 `{ type: 'hash' }`
> 参考：1. [推荐使用 browserHistory](https://zhuanlan.zhihu.com/p/38592452) 2.[browserHistory 服务配置](https://react-guide.github.io/react-router-cn/docs/guides/basics/Histories.html)

---

## 编写 Todo List

> 包含：1. 登录 2.列表增删改
> 技术：antd@4 + loading.tsx + 白屏解决方案

### UI 使用 `"antd": "^4.24.2"`

1. 安装 antd

```
$ yarn add antd
```

2. 创建 app.ts，`src/app.ts`

```
import "antd/dist/antd.less";
```

3. [按需加载 antd 组件](https://ant.design/docs/react/getting-started-cn#%E6%8C%89%E9%9C%80%E5%8A%A0%E8%BD%BD)

   > antd 默认支持基于 ES modules 的 tree shaking，对于 js 部分，直接引入 import { Button } from 'antd' 就会有按需加载的效果。如果你在开发环境的控制台看到下面的提示，那么你可能还在使用 webpack@1.x 或者 tree shaking 失效，请升级或检查相关配置。

   ```
      You are using a whole package of antd, please use https://www.npmjs.com/package/babel-plugin-import to reduce app bundle size.

   ```

4. antd 使用 TypeScript 进行书写并提供了完整的定义文件。（不要引用 @types/antd）

### 登录实现

1. UI 实现，创建`src/pages/login/index.tsx`。代码中引入 antd 组件，实现登录 UI
2. 配置路由添加 login 页面

   > Umi 4 默认根据路由来进行 JavaScript 模块按需加载。
   > 如果需要在路由组件加载的过程中配置自定义加载组件，在项目 src 目录下创建 loading.tsx 或者 loading.jsx 或者 loading.js 文件，默认导出的组件会在组件加载的时候渲染。

```
// .umirc.ts
   routes: [
      { path: "/", component: "home" },
      { path: "/docs", component: "docs" },
      { path: "/login", component: "login" },
   ],
```

3. `http://localhost:8000/login` 浏览器访问登录页面呈现

4. 创建 `src/loading.tsx`

   > 可以在 Chrome 的调试工具的网络 tab 中将网络设置成低速，然后切换路由查看动态加载中组件的展示。
   > 如下图:
   >
   > 1. 在 network 调为 slow 3G
   > 2. 我们查看到 root 节点下具备当前登录也元素
   > 3. 点击浏览器左上角刷新`http://localhost:8000/login`
   > 4. 我们看到页面刷新时，root 节点下没有了任何元素，导致出现白屏【白屏问题也可以解决，稍后讲解】
   > 5. 在加载到组件之前 loading.tsx 在页面中显现出来

～～～补充录屏～～～

5. 触发 submit 事件, `src/pages/login/index.tsx` 通过 Form 检验后执行 onFinish()

```
    "axios": "^1.1.3",
    "safe-reaper": "^2.1.0",
```
