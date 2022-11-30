# React 基于 umi 脚手架

---

## 目录

- [技术栈: umi4 + antd@4 + dva + mock + proxy](#section1)
- [先简单添加一些 umi 配置项](#section2)
- [编写 Todo List](#section3)
- [编码规范](#section4)
- [部署脚本](#section5)

---

<h2 id="section1">umi4 + antd@4 + dva + mock + proxy</h2>

### 环境准备

- node v14.18.2
- yarn 1.22.19

> 必看：
>
> 1. [umi 环境要求](https://umijs.org/docs/introduce/introduce#%E4%BB%80%E4%B9%88%E6%97%B6%E5%80%99%E4%B8%8D%E7%94%A8-umi)
> 2. [antd@4 兼容环境](https://4x.ant.design/docs/react/introduce-cn#%E5%85%BC%E5%AE%B9%E7%8E%AF%E5%A2%83)

### 使用 yarn create umi[通过官方工具创建项目](https://umijs.org/docs/tutorials/getting-started#%E5%88%9B%E5%BB%BA%E9%A1%B9%E7%9B%AE)

> 执行过程中会让用户做出资源选择，咱们选择如下：

```
✔ Pick Umi App Template › Simple App
✔ Pick Npm Client › yarn
✔ Pick Npm Registry › taobao
```

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

<h2 id="section2">先简单添加一些 umi 配置项</h2>

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
   // src/pages/home/index.tsx
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
   > 找到原因：我们没有安装 husky 钩子，需要在[.husky/commit-msg 配置](https://umijs.org/docs/api/commands#verifycommit)
   > 下边在 GIT HOOKS 会讲解 husky，正确打开 verifyCommit

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

<h2 id="section3">编写 Todo List</h2>

> 包含：1. 登录 2. 列表
> 技术：antd@4 + @umijs/plugins + dva + mock + proxy + loading.tsx + 白屏解决方案

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

3.  `http://localhost:8000/login` 浏览器访问登录页面呈现

4.  我们发现在加载组件时，页面空白，什么也没有，所以我们创建 `src/loading.tsx`，让页面呈现组件加载动画

    > 可以在 Chrome 的调试工具的网络 tab 中将网络设置成低速，然后切换路由查看动态加载中组件的展示。
    > 如下图:
    >
    > 1. 在 network 调为 slow 3G
    > 2. 我们查看到 root 节点下具备当前登录也元素
    > 3. 点击浏览器左上角刷新`http://localhost:8000/login`
    > 4. 我们看到页面刷新时，root 节点下没有了任何元素，导致出现白屏【白屏问题也可以解决，稍后讲解】
    > 5. 当看到与 root 节点同级出现 floating-ui-root 元素, 说明正在进行组件加载，同时看到 loading.tsx 在页面中显现出来

    ![loadingTsxGif](./readme-source/umi-loadingtsx.gif 'loadingTsxGif')

5.  在`src/pages/login/index.tsx`触发 submit 事件, username 和 password 通过验证后，要把数据提交给后端服务器处理。我们就需要 Effect 进行与后端的异步通讯，创建下方文件发送 getUsers 请求：

    > `src/pages/login/model.ts` 作为 login 当前局部 model
    > `src/services/login.ts` 新建 services 文件夹为整个项目的后端 API 服务，`login.ts`为 login 相关 API 服务
    > `src/utils/request/api.ts` 使用 axios 实现项目 request API 与后端服务通讯
    > `src/utils/env.ts` 作为项目 环境常量 声明文件
    > 暂时抛弃：~~`src/utils/dva.ts` 新建 utils 文件夹作为全局的工具，`dva.ts`为所有 model 文件继承一些共用属性, `例：reducers中updateState()` 更新 state 方法; 引用 withMixin 后，无法 dispatch 到 effect 中异步方法。【目前没有找到原因】~~
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

6.  执行`yarn start`，报出下方问题 1
    同时也会发现`src/pages/login/index.tsx`文件中提示错误 1&2

    ```
    // 问题1
    fatal - AssertionError [ERR_ASSERTION]: Invalid config keys: dva
       at Function.validateConfig (/Users/自己电脑账户名/Documents/umi4-project/umi4-react-template/node_modules/@umijs/core/dist/config/config.js:182:31)
       at Config.getConfig (/Users/自己电脑账户名/Documents/umi4-project/umi4-react-template/node_modules/@umijs/core/dist/config/config.js:60:12)
       at Service.resolveConfig (/Users/自己电脑账户名/Documents/umi4-project/umi4-react-template/node_modules/@umijs/core/dist/service/service.js:286:97)
       at Service.run (/Users/自己电脑账户名/Documents/umi4-project/umi4-react-template/node_modules/@umijs/core/dist/service/service.js:235:50)
       at processTicksAndRejections (internal/process/task_queues.js:95:5)
       at async Service.run2 (/Users/自己电脑账户名/Documents/umi4-project/umi4-react-template/node_modules/umi/dist/service/service.js:58:12)
       at async Object.run (/Users/自己电脑账户名/Documents/umi4-project/umi4-react-template/node_modules/umi/dist/cli/cli.js:55:7) {
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

7.  由于我们使用的 umi4 在`node_modules/@umijs`下是没有 plugins 文件夹的，并且也不存在 dva ，这要怎么处理呢？网上翻了一大圈，发现 umi 提供了最佳方法，(DvaJS 配置生成器)[https://umijs.org/docs/guides/generator#dvajs-%E9%85%8D%E7%BD%AE%E7%94%9F%E6%88%90%E5%99%A8] 需要执行`umi g dva` 开启 dva

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

8.  我们还需要[mock](https://umijs.org/docs/guides/mock)数据的支持，参考[Mock 生成器](https://umijs.org/docs/guides/generator#mock-%E7%94%9F%E6%88%90%E5%99%A8)，就这样我们可以在前端开发阶段，先自己进行数据调试。创建 `mock/login.ts` 返回登录数据

    > 登录成功后，mock 返回数据，查看 network:

    ![loginAPI1](./readme-source/login-success-api1.jpg 'loginAPI1')

    ![loginAPI2](./readme-source/login-success-api2.jpg 'loginAPI2')

    > 登录成功后，使用[React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)查看 model 的 state tree 中挂载的 userInfo 数据

    ![loginSuccessState](./readme-source/login-success-state.jpg 'loginSuccessState')

9.  我们也可以使用[代理](https://jsonplaceholder.typicode.com/users/1)访问其他服务器数据;修改`src/utils/env.ts` baseURL 在开发时，指向远端服务器:

    ```
    // 开发时，本地mock
    export const baseURL = !isProduction ? "/" : "";

    // 使用这个 开发时，远端服务
    export const baseURL = !isProduction ? "https://jsonplaceholder.typicode.com/" : "";
    ```

    我们可以看到接口 404
    ![jsonplaceholder1](./readme-source/jsonplaceholder1.jpg 'jsonplaceholder1')

    认真看会不会是因为多了个/api 导致呢！我们在`src/services/login.ts`删掉/api 试试;删除后，可以看到远端 API 通了，没有产生跨域问题(猜想远端服务处理了本地 localhost:8080 访问的跨域问题)。那我们如何能在不删除/api 情况也能正常访问呢？
    ![jsonplaceholder2](./readme-source/jsonplaceholder2.jpg 'jsonplaceholder2')

    ![jsonplaceholder3](./readme-source/jsonplaceholder2.jpg 'jsonplaceholder3')

    尝试使用代理处理问题

    ```
    // 修改`src/utils/env.ts` baseURL 本地开发
    export const baseURL = !isProduction ? "/" : "";

    // `src/services/login.ts`还原 /api 开头
    import API from "@/utils/request";
    export function getUsers(payload: object) {
       return API({
          url: "/api/users/1",
          method: "get",
          params: payload,
       });
    }

    // .umirc.ts 添加proxy
    proxy: {
     '/api': {
       'target': 'http://jsonplaceholder.typicode.com/',
       'changeOrigin': true,
       'pathRewrite': { '^/api' : '' },
     },
    },
    ```

    yarn start 启动项目，点击 submit， 查看 network 信息; 发现触发到了 mock 服务，没有请求`http://jsonplaceholder.typicode.com/`服务
    ![proxy1](./readme-source/proxy1.jpg 'proxy1')

    尝试[关闭 mock](https://umijs.org/docs/guides/mock#%E5%85%B3%E9%97%AD-mock)

    ```
    // package.json
    "scripts": {
       "dev": "umi dev",
    +  "dev:no-mock": "MOCK=none umi dev",
       "build": "umi build --clean",
       "postinstall": "umi setup",
       "setup": "umi setup",
       "start": "npm run dev:no-mock",
       "umi:g:dva": "umi g dva",
       "umi:g:mock": "umi g mock"
    }
    ```

    启动 yarn dev:no-mock 可以看到触发到了远端服务
    ![proxy2](./readme-source/proxy2.jpg 'proxy2')

    > 使用 mock: `yarn dev`
    > 使用远端服务: `yarn dev:no-mock`，但是这样我们要在命令行乔太长，我们修改 start 指令
    > `"start": "npm run dev:no-mock"` 这样直接`yarn start`替代`yarn dev:no-mock`

10. 我们看到登录页左上角有多余的 tab 切换，然而 home&docs 页面需要；造成这个的原因是所有路由都会默认走到`src/layouts/index`

    > 新建`src/layouts/tabLayout`将 tab 切换代码，移动到这个文件夹下
    > `src/layouts/index`只返回 Outlet
    > 更改路由配置，在路由给需要的 home&docs 添加 tabLayout;但是所有路由依然还会被`src/layouts/index`处理

    ```
      // .umirc.ts
      routes: [
         {
            path: "/",
            component: "@/layouts/tabLayout/index",
            routes: [
               { path: "/home", component: "home" },
               { path: "/docs", component: "docs" },
            ],
         },
         { path: "/login", component: "login" },
      ],
    ```

11. 跳转到 Todo 页面，[路由](https://umijs.org/docs/guides/routes)

    ```
    // src/pages/login/model.ts
    import { Effect, history } from "umi";
    history.push("/todo");
    ```

12. 登录页进入 todo 时，由于点击 submit 后接口响应需要 2.02s，login 页面需要静止一会才能跳转到 todo
    ![loadingLogin](./readme-source/loading-login.png 'loadingLogin')

    处理办法：加登录 loading 状态

    ```
    //src/pages/login/index.tsx
    const mapStateToProps = ({ loading }: any) => ({
      isLoading: loading.effects["login/getUsers"] || false,
    });

    <Button loading={isLoading} type="primary" htmlType="submit" block>
      Submit
    </Button>
    ```

### Todo 实现

1. 新建`src/pages/todo`的 tsx、model，新建`src/services/todo.ts`的 API, 具体代码查看这两个文件夹，不做具体写作讲解，会讲解写作时，发现的问题

> 问题 1：
> todo 页面刷新，用户名为 null

![umiRefreshNoStoreGif](./readme-source/umi-refresh-no-store.gif 'umiRefreshNoStoreGif')

> 找到原因：刷掉 userInfo store 数据
> 处理办法：layout 中获取用户信息

```
// src/layouts/index.tsx
// 在 layout 中每次跳转或者页面刷新时，都会执行一次effect来获取用户信息
   useEffect(() => {
      // 获取用户信息
      if (pathname !== "/login") {
         getUsers();
      }
   }, []);
```

![umiRefreshHasStoreGif](./readme-source/umi-refresh-has-store.gif 'umiRefreshHasStoreGif')

---

<h2 id="section4">编码规范</h2>

> eslint + stylelint + husky + lint-stage + verifyCommit/commitlint + prettier + vscode
> 参考：[编码规范](https://umijs.org/docs/guides/lint#%E7%BC%96%E7%A0%81%E8%A7%84%E8%8C%83)
> 为了节省安装体积，目前仅在 Umi Max 中内置了 Lint 模块，使用 max lint 来执行 lint 过程
> 咱们当前使用的是 Umi，需要先安装 @umijs/lint

### 安装支持 @umijs/lint

```
$ yarn add @umijs/lint -D

$ yarn add eslint stylelint -D
```

安装完毕后，我们在 node_modules/@umijs/lint 中，可以看到 @umijs/lint 库已经帮我们集成了很多 react & ts & style 进行 eslint 操作等相关的库。最后呢，我们需要[启用配置](https://umijs.org/docs/guides/lint#%E5%90%AF%E7%94%A8%E9%85%8D%E7%BD%AE)

```
// .eslintrc
{
  // Umi 项目
  extends: require.resolve('umi/eslint'),
}

// .stylelintrc
{
  // Umi 项目
  extends: require.resolve('umi/stylelint'),
}
```

> 现在如果执行 umi lint 就可以把文件检查一遍

### 与 Git 工作流结合使用

> lint-staged 执行 lint 指令时，只检查当前更改的内容
> Husky 用来绑定 Git Hooks，可以指定我们在 git... 某个动作时，执行指令进行代码检查

### 安装&配置 lint-staged

```
$ yarn add lint-staged -D

// 在 package.json 中配置 lint-staged：
"lint-staged": {
   "*.{js,jsx,ts,tsx,css,less}": [
      "umi lint"
   ]
}
```

> 在`git add ...`后，我们就可以执行`npx lint-staged`检查更改的内容

### 安装 Husky

> 参考 Husky install 文档：[https://typicode.github.io/husky/#/?id=automatic-recommended](https://typicode.github.io/husky/#/?id=automatic-recommended)

```
$ npx husky-init

// 执行后命令行打印出来：
npx: 2 安装成功，用时 11.348 秒
husky-init updating package.json
  setting prepare script to command "husky install"
husky - Git hooks installed
husky - created .husky/pre-commit

please review changes in package.json
```

执行命令后，发生两项变化:

1. 自动创建.husky/pre-commit
2. 命令改变了 package.json："scripts" 新增 prepare，"devDependencies" 新增 husky

```
"scripts": {
   "dev": "umi dev",
   "dev:no-mock": "MOCK=none umi dev",
   "build": "umi build --clean",
   "postinstall": "umi setup",
   "setup": "umi setup",
   "start": "npm run dev",
   "umi:g:dva": "umi g dva",
   "umi:g:mock": "umi g mock",
+  "prepare": "husky install"
},

"devDependencies": {
   "@types/react": "^18.0.0",
   "@types/react-dom": "^18.0.0",
   "@umijs/lint": "^4.0.32",
   "@umijs/plugins": "^4.0.30",
   "eslint": "^8.28.0",
   "stylelint": "^14.15.0",
   "typescript": "^4.1.2",
+  "husky": "^8.0.0"
},
```

查看 node_modules 中没有安装 husky，我们需要执行`yarn`指令安装

```
$ yarn
```

就这样 husky 安装成功啦！

查看生成的`.husky/pre-commit`文件

```
// .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm test
```

我们更改为执行`npx lint-staged`；这样会在执行`git commit ...`时先自动进行更改内容的检查

```
// .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

现在我们 commit 一下项目试试，可以看到执行了 lint-staged

```
$ git add -A

$ git commit -am 'GIT HOOKS配置'

// 终端打印：
✔ Preparing lint-staged...
✔ Running tasks for staged files...
✔ Applying modifications from tasks...
✔ Cleaning up temporary files...
[main 3fdbce2] GIT HOOKS配置
 6 files changed, 921 insertions(+), 25 deletions(-)
 create mode 100644 .eslintrc.js
 create mode 100755 .husky/pre-commit
 create mode 100644 .stylelintrc.js
```

### verifycommit/commitlint 提交信息检查

我们可以使用[verifycommit](https://umijs.org/docs/api/commands#verifycommit)验证 commit message 信息;
还要记得使用 [verifyCommit 配置](https://umijs.org/docs/api/config#verifycommit) 进行开启;

> 可以自己尝试使用[commitlint](https://commitlint.js.org/#/guides-local-setup?id=install-commitlint)验证 commit message 信息；我们这里使用 verifycommit

```
// 创建`.husky/commit-msg 并写入要执行verify-commit的指令
// 可以看到.husky 下多了个 commit-msg 文件
$ npx husky add .husky/commit-msg 'npx --no-install umi verify-commit $1'
```

```
$ git add -A
// 现在我们随意输入 commit 提交信息试试
$ git commit -am 'husky hooks verify commit msg'

// 终端打印：
Error: Invalid commit message format.

Proper commit message format is required for automated changelog generation.
Examples:

  chore(release): update changelog
  fix(core): handle events on blur (close #28)

husky - commit-msg hook exited with code 1 (error)

// 按照verifyCommit规范提交：
$ git commit -am 'style: husky hooks verify commit msg'
// 提交成功，终端打印：
[main 3af8c06] style: husky hooks verify commit msg
 2 files changed, 55 insertions(+), 1 deletion(-)
 create mode 100755 .husky/commit-msg
```

可以看到提交代码随意输入提交信息不通过
~~ 提交代码体验 git hooks & verifyCommit 过程动图 ~~
![git-hooks-verifyCommit](./readme-source/git-hooks-verifyCommit.gif 'git-hooks-verifyCommit')

### prettier

> 上边已经配置 linters，为什么还要使用 prettier？
>
> 1. linters 不仅能够检查代码格式问题，还能够插件代码质量问题；那么当 linters 提示格式出现问题时，开发者就需要手动解决红线提示的格式问题，这会让开发者很崩溃；
> 2. 所以我们使用 Prettier 来解决代码格式问题；使用 linters 来解决代码质量问题

1. 统一代码风格[安装 prettier](https://prettier.io/docs/en/install.html)

```
// 安装prettier
$ yarn add --dev --exact prettier

// 创建.prettierrc文件
$ echo {}> .prettierrc
// 写入格式代码
{
  "useTabs": false, // 不使用tab
  "tabWidth": 2, // tab改为2宽度
  "printWidth": 120, // 代码行最大宽120
  "singleQuote": true, // 使用单引号
  "trailingComma": "es5", // 使用尾随逗号
  "semi": true // 使用分号
}

// 创建 .prettierignore，可写入不需要格式的文件
$ touch .prettierignore
```

2. 要做到[兼容 linters](https://prettier.io/docs/en/integrating-with-linters.html)

```
$ yarn add eslint-config-prettier -D

// .eslintrc.js
// 将“prettier”添加到 .eslintrc.* 文件中的“extends”数组。确保把它放在最后，这样它就有机会覆盖其他配置
// 参考来自：https://github.com/prettier/eslint-config-prettier#installation
module.exports = {
  // Umi 项目
  extends: [require.resolve('umi/eslint'), 'prettier'],
}

$ yarn add stylelint-config-prettier -D
// 来自：https://github.com/prettier/stylelint-config-prettier#installation
// .stylelintrc.js
module.exports = {
  // Umi 项目
  extends: [require.resolve('umi/stylelint'), 'stylelint-config-prettier'],
}
```

### vscode

> 为了使协同开发人员，能够在编辑代码时候更加的随性，那么我们的`编译器`就需要在保存代码时进行格式化

我们在`.vscode/settings.json`中添加配置：

```
{
  "files.exclude": {
    "**/.git": false
  },
  "editor.tabSize": 2,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.fixAll.stylelint": true
  },
  "eslint.alwaysShowStatus": true,
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],

  "css.validate": false,
  "less.validate": false,
  "scss.validate": false,
  "stylelint.validate": ["css", "less", "scss"]
}
```

vscode 需要安装第三方库插件

> [eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

> [prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

> [stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)

可以看到在 extensions 中安装了以上三个插件，我们在 `command+s` 保存代码后自动格式化
![vscode-commom-s](./readme-source/vscode-commom-s.gif 'vscode-commom-s')

<h2 id="section5">部署脚本</h2>

1. 使用 express 启动

> 使用 express 对项目 umi build 后 dist 资源进行启动

```
// 安装express
$ yarn add express
```

2. 编写服务脚本

> 查看 `server/index.js` 编写好的服务脚本

3. 使用 nodemon 启动脚本

```
// 安装nodemon
$ yarn add nodemon -D

// 使用nodemon启动脚本
$ nodemon server --title=UMI4_REACT_TEMPLATE

// nodemon配置监控文件
// package.json
"scripts": {
   "build": "umi build --clean",
   "dev": "umi dev",
   "dev:no-mock": "MOCK=none umi dev",
   "postinstall": "umi setup",
   "prepare": "husky install",
+  "server": "nodemon server --title=UMI4_REACT_TEMPLATE",
   "setup": "umi setup",
   "start": "npm run dev",
   "umi:g:dva": "umi g dva",
   "umi:g:mock": "umi g mock"
},
"nodemonConfig": {
   "watch": [
   "server/*",
   "dist/*"
   ]
},

// 启动前先build
$ yarn build

// 启动脚本，为dist提供服务
$ yarn server
yarn run v1.22.19
$ nodemon server --title=UMI4_REACT_TEMPLATE
[nodemon] 2.0.20
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): server/**/* dist/**/*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node server --title=UMI4_REACT_TEMPLATE`
加载静态资源::  /Users/gaoyali-iris/Documents/umi4-project/umi4-react-template/dist
Local: http://localhost:8082
Network: 172.20.10.2:8082

// 访问 http://localhost:8082/login 登录页面呈现在眼前，并且可以submit到todo页面

// 执行bash脚本查看启动服务状态
$ ps aux | grep -i 'node server --title=UMI4_REACT_TEMPLATE'

6987   0.0  0.0 34122844    772 s001  R+   12:02下午   0:00.00 grep --color=auto --exclude-dir=.bzr --exclude-dir=CVS --exclude-dir=.git --exclude-dir=.hg --exclude-dir=.svn --exclude-dir=.idea --exclude-dir=.tox -i node server --title=UMI4_REACT_TEMPLATE
6973   0.0  0.2 34412836  29072 s000  S+   12:01下午   0:00.19 /usr/local/bin/node server --title=UMI4_REACT_TEMPLATE

// 可以看到当前服务进程为6973
$ ps aux | grep -i 'node server --title=UMI4_REACT_TEMPLATE' | grep -v grep | awk {'print $2'}

6973

// 杀掉当前进程
$ kill -9 6973

// 当杀掉进程后nodemon服务控制台打印：
[nodemon] app crashed - waiting for file changes before starting..

// 再次查询服务状态，则不存在啦
$ ps aux | grep -i 'node server --title=UMI4_REACT_TEMPLATE'

7069   0.0  0.0 34122844    808 s001  R+   12:03下午   0:00.00 grep --color=auto --exclude-dir=.bzr --exclude-dir=CVS --exclude-dir=.git --exclude-dir=.hg --exclude-dir=.svn --exclude-dir=.idea --exclude-dir=.tox -i node server --title=UMI4_REACT_TEMPLATE

// 更改一下src下代码后，再次yarn build项目到dist (实现: 开两个终端，一个nodemon服务，一个build)
// nodemon监控到dist目录发生变化，自动重新启动服务
[nodemon] restarting due to changes...
[nodemon] starting `node server --title=UMI4_REACT_TEMPLATE`
[nodemon] restarting due to changes...
[nodemon] restarting due to changes...
[nodemon] restarting due to changes...
[nodemon] restarting due to changes...
[nodemon] restarting due to changes...
[nodemon] restarting due to changes...
[nodemon] restarting due to changes...
[nodemon] starting `node server --title=UMI4_REACT_TEMPLATE`
加载静态资源::  /Users/自己电脑账户名/Documents/umi4-project/umi4-react-template/dist
Local: http://localhost:8082
Network: 172.20.10.2:8082

```

> Tips: 1. 发现 server 启动项目后，network 中访问的 API 一直返回 index.html 的内容；2. 我们可以使用 nginx 进行代理 API 到`http://jsonplaceholder.typicode.com/`

> ![build-api](./readme-source/build-api.jpg 'build-api')

4. 使用 bash 进行 kill 进程

> kill 进程 bash 脚本：`shells/stop.sh`
> 可直接执行`$ bash shells/stop.sh`kill 进程

5. nginx 反向代理

> 使用 node 作为前端服务,端口号 8082
> 使用 nginx 代理 API 请求到 `http://jsonplaceholder.typicode.com/`
> 使用 nginx 监听 8081，代理到前端 node 的 8082 服务

```
server {
   listen       8081;
   server_name  localhost;

   location / {
      proxy_pass  http://localhost:8082;
   }

   location /api/ {
      proxy_pass  http://jsonplaceholder.typicode.com/;
   }
}
```

- 启动 nginx `$ nginx`; 重新加载配置`$ nginx -s reload`;

  > 启动 nginx 有时报错：

  `nginx: [error] open() "/usr/local/var/run/nginx.pid" failed (2: No such file or directory)`

  > `$ cd /usr/local/var/run/` 目录中确实没有 pid 文件
  > 原因：
  >
  > 1. nginx.pid 文件的作用是为了防止启动多个进程副本;
  > 2. 当主进程(master)存在时，nginx.pid 文件就会存在;

- 查看进程信息`$ ps -ef|grep nginx`; 确实没有 mater&worker 进程

- 解决方案：执行`$ sudo nginx -c /usr/local/etc/nginx/nginx.conf`指定 nginx 配置后，会有 pid 和进程信息;

- 执行`$ cat /usr/local/var/run/nginx.pid`可以看到终端输出 3086【每次重启 nginx 都不一样】

- 查看进程信息`$ ps -ef|grep nginx`;

  > 可以看到有一个 master 得 3086 进程，其余为 worker；可以说明主进程存在时，pid 文件就存在，并且文件内容为主进程 id;当进程关掉后 nginx.pid 文件也就自动删除了，所以需要我们去指定配置文件.

  ```
  $ ps -ef|grep nginx
  0  3086     1   0  4:37下午 ??         0:00.00 nginx: master process nginx -c /usr/local/etc/nginx/nginx.conf
  -2  3087  3086   0  4:37下午 ??         0:00.01 nginx: worker process
  -2  3088  3086   0  4:37下午 ??         0:00.01 nginx: worker process
  501  3500  1490   0  5:28下午 ttys001    0:00.00 grep --color=auto --exclude-dir=.bzr --exclude-dir=CVS --exclude-dir=.git --exclude-dir=.hg --exclude-dir=.svn --exclude-dir=.idea --exclude-dir=.tox nginx

  // 执行这个命令，会更清晰
  $ ps ax -o pid,ppid,%cpu,vsz,wchan,command|egrep '(nginx|PID)'
  PID  PPID  %CPU      VSZ WCHAN  COMMAND
  3086     1   0.0 34154148 -      nginx: master process nginx -c /usr/local/etc/nginx/nginx.conf
  3087  3086   0.0 34191716 -      nginx: worker process
  3088  3086   0.0 34174308 -      nginx: worker process
  3827  1490   0.0 34122736 -      egrep --color=auto --exclude-dir=.bzr --exclude-dir=CVS --exclude-dir=.git --exclude-dir=.hg --exclude-dir=.svn --exclude-dir=.idea --exclude-dir=.tox (nginx|PID)
  ```

- 退出 nginx`$ sudo nginx -s quit`后, 进程和 pid 文件都不存在啦！

> 参考：
> [https://zhuanlan.zhihu.com/p/464965616?utm_id=0](https://zhuanlan.zhihu.com/p/464965616?utm_id=0)

> [https://juejin.cn/post/6844903872566132749](https://juejin.cn/post/6844903872566132749)

> [https://my.oschina.net/u/3237413/blog/1528025](https://my.oschina.net/u/3237413/blog/1528025)

> [https://juejin.cn/post/6895296590370570247#heading-25](https://juejin.cn/post/6895296590370570247#heading-25)

6. 现在访问 nginx 监听的端口号: `http://localhost:8081/login`，我们依然可以打开登录页面展现给用户，点击登录以及跳转到 todo 页面后，查看 network 的 API 可以正常访问啦！
   ![nginx-localhost](./readme-source/nginx-localhost.jpg 'nginx-localhost')

   ![nginx-localhost-api](./readme-source/nginx-localhost.jpg 'nginx-localhost-api')
