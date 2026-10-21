# ChopCheck — 首页原型 (Next.js + Tailwind)

## 本地部署测试+本地测试需要模拟Upstash的REST API直接兼容@upstash/redis客户端
一、
npm install
cp .env.local.example .env.local   # 按需修改 ALIYUN_SEARCH_URL
npm run dev
二、
安装 npm install @upstash/redis
步骤1：启动模拟器 npx @sdk-e/redisk
步骤2：修改 .env.local：
UPSTASH_REDIS_REST_URL="http://127.0.0.1:18000"
UPSTASH_REDIS_REST_TOKEN="upstash"
步骤3：重启服务 npm run dev  注意数据只在内存里面
三、打开 http://localhost:3000

## 限制用户每周只能免费查看三次，需要开通VERCEL VK的upstash redias免费数据库
1 用户第一次打开网站，page.tsx 生成一个匿名的 userId 存在浏览器里。
2 用户搜索并点击某个公司，ReportPanel 带着 userId 去请求 /api/check-limit。
3 前 3 次：Upstash Redis 记录次数 +1，接口返回 canView: true。前端继续请求阿里云 FC，展示“有遮罩”的数据。
4 第 4 次：Redis 判断次数已满，返回 needPay: true。前端不再请求阿里云 FC（省了 FC 的费用），直接展示 needPay 的付款提示。
5 用户点击付款，UnlockModal 弹窗弹出。点击支付后，调用 /api/unlock，在 Redis 里写入解锁标记。
6 onConfirm 触发父页面将 unlockedIndex 设为当前公司，ReportPanel 侦测到 unlocked 发生变化，重新发起请求。
7 /api/check-limit 读取到用户这次命中了 unlockKey，返回 canView: true。
8 前端再次请求 FC，但这次因为组件里的 unlocked 为 true，所以敏感字段的 blur-[5px] 自动解除，用户看到了完整数据！

## 部署到github
第一步：在 GitHub 上创建仓库
  登录 GitHub，点击右上角 + → New repository。
  填写仓库名（比如 chopcheck-web），选择 Public 或 Private。
  不要勾选 "Add a README file"、"Add .gitignore"、"Choose a license"，保持空仓库，避免和本地文件冲突。
  点击 Create repository，记下页面显示的仓库地址（HTTPS 格式）。
第二步：在本地初始化 Git 仓库
  在 VS Code 终端里，进入你的项目目录：
  bash
  cd D:\Project\Next.js\chopcheck-web
  git init
  这会创建一个隐藏的 .git 文件夹，Git 开始管理这个项目。
第三步：创建 .gitignore 文件（重要！）
  在项目根目录创建 .gitignore，至少包含：
  text
  node_modules/
  .next/
  .env.local
  .env*.local
  为什么要做这一步：node_modules 体积巨大且没必要上传；.env.local 包含密钥，绝不能传到 GitHub。
第四步：暂存并提交到本地仓库
  bash
  git add .
  git commit -m "初始化项目"
  git add . 把所有文件加入暂存区。
  git commit -m "..." 把暂存区的内容提交到本地仓库，-m 后面是提交说明。
第五步：关联远程仓库
  bash
  git remote add origin https://github.com/你的用户名/chopcheck-web.git
  origin 是给远程仓库起的别名，方便后续引用。

  如果之前已经添加过 origin，会报错 remote origin already exists，这时先执行 git remote remove origin 再重新添加。
第六步：推送到 GitHub
  bash
  git push -u origin main
  -u 建立追踪关系，之后直接 git push 即可。

  注意分支名：如果你的本地分支叫 master（旧版 Git 默认），就改成 git push -u origin master；如果 GitHub 仓库默认分支是 main 而本地是 master，可以先把本地分支改名：git branch -M main，再推送。
第七步：授权登录
  首次推送时，VS Code 会弹出浏览器授权页面（Git Credential Manager），点击 Authorize 即可。之后 Git 会记住凭证，不用重复登录。
第八步：验证
  推送成功后，刷新 GitHub 仓库页面，能看到你的所有文件，并且分支显示为 main 或 master，就说明上传完成了。

## 在Vercel发布
Vercel 就是 Next.js 官方公司做的托管平台,你把代码推到 GitHub,连接 Vercel 后它自动帮你 npm run build,然后全部搞定——不需要你自己配 Nginx、不需要自己管服务器、自带全球 CDN 和 HTTPS。这是目前做 Next.js 项目最简单的部署方式,而且你的目标用户是海外采购商,Vercel 在国外访问速度很好。

## 项目结构
```
APP/
  api/ (后端接口路由)
    check-limit/route.ts：[新增] 限流接口。判断当前 userId 本周是否还有 3 次免费查看额度。
    due-diligence/route.ts：核心业务接口。接收企业代码，去调用你的阿里云 FC（函数计算），返回企业的详细尽调数据。
    search-company/route.ts：搜索接口。接收关键词，返回匹配的企业列表。
    unlock/route.ts：[新增] 解锁接口。用户付款成功后调用此接口，在 Redis 写入标记，允许用户查看完整数据。
  blog/ (博客系统)
    page.tsx：博客列表页。
    [slug]/page.tsx：博客详情页（动态路由）。用于展示具体的文章内容（你截图里正在编辑的那个文件）。
  globals.css：全局样式文件。定义了 Tailwind 的基础指令，以及你自定义的颜色变量（如 bg-ink, text-paper 等）。
  layout.tsx：全局根布局。所有页面都会包裹在这个文件里，通常包含全局导航栏（Navbar）和页脚（Footer）。
  page.tsx：项目首页。串联搜索框、公司列表、定价模块的核心页面（你还需要在这里传入 userId）。
  robots.ts：SEO 配置，告诉搜索引擎哪些页面可以抓取。
  sitemap.ts：自动生成网站的站点地图，方便搜索引擎收录。
components/ (前端 UI 组件库) 这里存放着可以复用的 React 组件（全部是客户端组件 'use client'）
  BundleModal.tsx：购买 10 次报告套餐的弹窗组件。
  CompanyList.tsx：公司列表组件。负责渲染搜索结果，并控制哪一行被展开。[已修改：接收 userId 并传给子组件]
  PricingSection.tsx：首页底部的“定价方案”展示区（单次 $19.9 / 套餐 $99）。
  ReportPanel.tsx：核心展示组件。在列表中展开后，展示企业的详细尽调报告。[已修改：实现了“先查限流 → 超限提示付款 → 付费后拉取完整数据”的逻辑，并对敏感字段进行 blur 模糊遮罩处理]
  SearchBar.tsx：顶部的搜索输入框和按钮。
  Toast.tsx：全局轻量级提示弹窗（例如操作成功/失败的提示）。
  UnlockModal.tsx：单次报告解锁支付弹窗。[已修改：确认付款后调用 /api/unlock 接口激活权限]
lib/ (工具库与数据定义) 存放核心逻辑代码，与 UI 无关，方便复用。
  api.ts：前端请求库。封装了所有向后端发起的 fetch 请求。包含原有的 fetchDueDiligenceReport (调 FC)。
  [新增]checkViewLimit：请求 /api/check-limit 查额度。
  [新增]unlockReport：请求 /api/unlock 写解锁标记。
  posts.ts：博客系统的工具函数。比如读取本地 Markdown 文件、解析文章内容等。
  types.ts：TypeScript 类型定义中心。定义了 Company（公司结构）、DueDiligenceReport（报告结构）等核心数据类型。
根目录配置文件:
.env.local：极其重要。本地环境变量。存放了 Upstash Redis 的 Token、阿里云 FC 的调用地址等机密信息，绝对不要提交到 GitHub。
.env.local.example：环境变量模板。告诉其他开发者（或者你自己以后部署时）需要配置哪些环境变量。
.gitignore：Git 忽略文件配置，防止把 node_modules 或 .env.local 传上代码库。
next-env.d.ts：Next.js 自动生成的 TS 类型声明，不用管。
next.config.js：Next.js 的全局配置文件。比如配置图片域名白名单、跨域头等。
package.json：项目依赖清单。记录了你安装的包（如 next, react, @upstash/redis 等）和运行脚本。
postcss.config.js：PostCSS 配置，用于处理 Tailwind CSS。
README.md：项目说明文档。
tailwind.config.ts：Tailwind CSS 的配置文件。你的自定义颜色（如 chop, ink, paper）应该就是在这里定义的。
```
## 调用付费汇总
一、Deepseek Token 
https://platform.deepseek.com/usage
二、阿里云函数FC
https://fcnext.console.aliyun.com/cn-hangzhou/functions
三、阿里云云市场服务+百度智能云
https://market.aliyun.com/products/56928005?scene=market
https://console.bce.baidu.com/ai-engine/ocr/overview/index
四、域名是在wordpress注册的 duediligences.org
