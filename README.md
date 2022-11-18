# umi4 + ts + antd@4 +

---

## React 基于 umi 脚手架

### 环境准备

- node v14.18.2
- yarn 1.22.19

### 使用 yarn create umi[通过官方工具创建项目](https://umijs.org/docs/tutorials/getting-started#%E5%88%9B%E5%BB%BA%E9%A1%B9%E7%9B%AE)

> 执行过程中会让用户做出资源选择，咱们选择如下：
> ✔ Pick Umi App Template › Simple App
> ✔ Pick Npm Client › yarn
> ✔ Pick Npm Registry › taobao

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

7. `theme: { '@primary-color': '#1DA57A' }` 配置 less 变量主题

8. `title: "Todo List"` 配置全局页面 title，暂时只支持静态的 Title，可以看到浏览器 tab 名称为 Todo List; 如果切换页面想要更换当前的 title 则使用[Helmet](https://umijs.org/docs/api/api#helmet)，动态配置 head 中的标签，例如 title

9. [verifyCommit](https://umijs.org/docs/api/config#verifycommit) 对 git commit 提交信息进行验证
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

4. 我们发现在加载组件时，页面空白，什么也没有，所以我们创建 `src/loading.tsx`，让页面呈现组件加载动画

   > 可以在 Chrome 的调试工具的网络 tab 中将网络设置成低速，然后切换路由查看动态加载中组件的展示。
   > 如下图:
   >
   > 1. 在 network 调为 slow 3G
   > 2. 我们查看到 root 节点下具备当前登录也元素
   > 3. 点击浏览器左上角刷新`http://localhost:8000/login`
   > 4. 我们看到页面刷新时，root 节点下没有了任何元素，导致出现白屏【白屏问题也可以解决，稍后讲解】
   > 5. 当看到与 root 节点同级出现 floating-ui-root 元素, 说明正在进行组件加载，同时看到 loading.tsx 在页面中显现出来

   ![loadingTsxGif](./readme-source/umi-loadingtsx.gif "loadingTsxGif")

5. 在`src/pages/login/index.tsx`触发 submit 事件, username 和 password 通过验证后，要把数据提交给后端服务器处理。我们就需要 Effect 进行与后端的异步通讯，创建下方文件发送 getUsers 请求：

   > `src/pages/login/model.ts` LoginModel 作为 login 当前局部 model
   > `src/utils/dva.ts` 新建 utils 文件夹作为全局的工具，`dva.ts`为所有 model 文件继承一些共用属性, `例：reducers中updateState()` 更新 state 方法
   > `src/services/login.ts` 新建 services 文件夹为整个项目的后端 API 服务，`login.ts`为 login 相关 API 服务
   > `src/utils/request/api.ts` 使用 axios 实现项目 request API 与后端服务通讯
   > `src/utils/env.ts` 作为项目 环境常量 声明文件
   > 安装使用到的第三方插件：

   ```
      $ yarn add axios
      $ yarn add safe-reaper

      // package.json
      "dependencies": {
         "antd": "^4.24.2",
      +  "axios": "^1.1.3",
      +  "safe-reaper": "^2.1.0",
         "umi": "^4.0.30"
      },
   ```

   > 配置 dva

   ```
   // .umirc.ts
   import { defineConfig } from "umi";
   const path = require("path");
   export default defineConfig({
      ...,
      dva: {},
   });
   ```

6. 执行`yarn start`，报出下方问题 1
   同时也会发现`src/pages/login/index.tsx`文件中提示错误 1&2

   ```
   // 问题1
   fatal - AssertionError [ERR_ASSERTION]: Invalid config keys: dva
      at Function.validateConfig (/Users/gaoyali-iris/Documents/umi4-project/umi4-react-template/node_modules/@umijs/core/dist/config/config.js:182:31)
      at Config.getConfig (/Users/gaoyali-iris/Documents/umi4-project/umi4-react-template/node_modules/@umijs/core/dist/config/config.js:60:12)
      at Service.resolveConfig (/Users/gaoyali-iris/Documents/umi4-project/umi4-react-template/node_modules/@umijs/core/dist/service/service.js:286:97)
      at Service.run (/Users/gaoyali-iris/Documents/umi4-project/umi4-react-template/node_modules/@umijs/core/dist/service/service.js:235:50)
      at processTicksAndRejections (internal/process/task_queues.js:95:5)
      at async Service.run2 (/Users/gaoyali-iris/Documents/umi4-project/umi4-react-template/node_modules/umi/dist/service/service.js:58:12)
      at async Object.run (/Users/gaoyali-iris/Documents/umi4-project/umi4-react-template/node_modules/umi/dist/cli/cli.js:55:7) {
   generatedMessage: false,
   code: 'ERR_ASSERTION',
   actual: false,
   expected: true,
   operator: '=='
   ```

   ```
   // 错误1：
   Can not find 'redux'
   // 错误2：
   Module '"umi"' has no exported member 'connect'.ts(2305)
   ```

7. 由于我们使用的 umi4 在`node_modules/@umijs`下是没有 plugins 文件夹的，并且也不存在 dva ，这要怎么处理呢？网上翻了一大圈，发现 umi 提供了最佳方法，(DvaJS 配置生成器)[https://umijs.org/docs/guides/generator#dvajs-%E9%85%8D%E7%BD%AE%E7%94%9F%E6%88%90%E5%99%A8] 需要执行`umi g dva` 开启 dva

   ```
   // package.json
   {
      ...,
      "scripts": {
         "dev": "umi dev",
         "build": "umi build --clean",
         "postinstall": "umi setup",
         "setup": "umi setup",
         "start": "npm run dev",
      +  "umi:g:dva": "umi g dva"
      },
   }

   $ yarn umi:g:dva

   // 执行命令后
   生成一个新的全局model文件：src/models/count.ts
   // .umirc.ts自动开启配置dva: {}
   import { defineConfig } from "umi";
   const path = require("path");
   export default defineConfig({
      ...,
      dva: {},
      plugins: ["@umijs/plugins/dist/dva"],
   });
   // package.json 自动加入@umijs/plugins
   "devDependencies": {
     "@types/react": "^18.0.0",
     "@types/react-dom": "^18.0.0",
     "typescript": "^4.1.2",
   + "@umijs/plugins": "^4.0.30"
   }

   $ yarn start

   // 项目可以正常启动访问啦！！！http://localhost:8000/login

   // 再查看`src/pages/login/index.tsx`发现还会有错误2
   // 关闭退出vscode, 重新打开后，解决问题
   ```

8. `mock` 在 umi4 中默认开，所以我们给项目中添加一个 mock 文件夹，与 src 文件夹平级。就这样我们可以在前端开发阶段，先自己进行数据调试。(~~后续会讲：使用 umi 的 proxy，或者 axios 的 baseURL 进行前后端联调以及本地 mock 的切换~~)
