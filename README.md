# ChopCheck — 首页原型 (Next.js + Tailwind)

## 本地部署测试+本地测试需要模拟Upstash的REST API直接兼容@upstash/redis客户端
一、
npm install
cp .env.local.example .env.local   # 按需修改 ALIYUN_SEARCH_URL
npm run dev
二、
安装 npm install @upstash/redis
安装 npm install @paddle/paddle-js @paddle/paddle-node-sdk
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
我使用Vercel 提供的 Upstash Redis库。
参数1：NEXT_PUBLIC_PADDLE_ENV 值production，告诉代码当前运行的环境production 就走真实收款环境
参数2：PADDLE_NOTIFICATION_WEBHOOK_SECRET 值是paddle后台创建Webhook时候Secret key，作用是当 Paddle 给你发通知说“这个人付钱了”时，你的后端不能直接信，必须用这个密钥去验证签名。验签通过，才能给用户写入 Redis 解锁报告，Type 为 Secret
参数3：PADDLE_API_KEY 值你在 Paddle 后台 Developer Tools > Authentication 生成的 API Key（通常以 pdl_live_apikey_ 开头），这是你后端与 Paddle 服务器通信的“身份证”，Type 为 Secret
参数4：NEXT_PUBLIC_PADDLE_CLIENT_TOKEN 值是你在 Paddle 后台生成的 Client-side token（以 live_ 开头），当用户在网页上点击“支付 $9.9”时，前端组件 UnlockModal.tsx 会读取这个 Token 来初始化 Paddle.js，并安全地弹出结账窗口。

## Paddle 支付集成指南 (ChopCheck)
```
本项目使用 Paddle 作为全球支付与订阅管理网关。整体架构分为前端调起结账、后端验证 Webhook 并解锁、Upstash Redis 状态存储三个核心部分。
📂 核心文件结构
chopcheck-web/
├── components/
│   └── UnlockModal.tsx      # [前端] 支付弹窗组件（初始化 Paddle.js，拉起结账）
├── app/
│   ├── page.tsx             # [前端] 主页（管理解锁状态、生成用户 ID）
│   └── api/
│       └── webhook/
│           └── route.ts     # [后端] 接收 Paddle 支付成功通知，验签并写入 Redis
├── lib/
│   └── api.ts               # [前端] 封装请求（注意：已移除假解锁接口）
└── .env.local               # [环境] 本地环境变量（Vercel 部署需同步配置）
🔄 整体支付与解锁逻辑
1 用户发起支付：用户在 UnlockModal 点击支付，前端根据环境变量初始化 Paddle.js。调用 paddle.Checkout.open() 拉起 Paddle 结账弹窗。
2 传递自定义数据：在拉起弹窗时，通过 customData 将当前浏览器生成的 userId 和当前要解锁公司的 companyId 传给 Paddle。
3 Paddle 处理支付：用户在弹窗完成支付。
4 Webhook 异步通知：Paddle 服务器向我们的后端 (/api/webhook) 发送 transaction.completed 事件。请求体包含支付状态以及我们传入的 customData。
5 后端验签与解锁：后端使用 Paddle Node SDK 和 Webhook Secret 验证签名。验证通过后，提取 userId 和 companyId，向 Upstash Redis 写入解锁标记（带过期时间）。
6 前端刷新状态：前端支付完成后给予提示，用户刷新页面或发起查询时，通过读取 Redis 确认已解锁。
⚙️ 本地环境变量设置
在本地开发时配置在 .env.local，线上（Vercel）需在控制台的 Environment Variables 中配置并重新部署（Redeploy）。
1. Paddle 凭证
PADDLE_API_KEY：Paddle 后端 API 密钥（Type: Secret，不要加 NEXT_PUBLIC_ 前缀）。
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN：Paddle 前端 Token（Type: Config，必须加 NEXT_PUBLIC_ 前缀供前端使用）。
PADDLE_NOTIFICATION_WEBHOOK_SECRET：Paddle Webhook 签名密钥（Type: Secret）。
NEXT_PUBLIC_PADDLE_ENV：设置为 production（或 sandbox 用于测试）。
2. Upstash Redis 凭证 (Vercel 自动注入)
本地开发必须使用真实的云 Redis 凭证（不要用 127.0.0.1）：
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
🛠️ Paddle 后台配置清单
1 Catalog > Products：创建产品，获取对应价格的 ID（pri_... 开头），填入前端 UnlockModal.tsx。
2 Developer Tools > Authentication：
  创建 API Key -> 填到 PADDLE_API_KEY。
  创建 Client-side token -> 填到 NEXT_PUBLIC_PADDLE_CLIENT_TOKEN。
3 Developer Tools > Notifications：
  创建 Webhook 目标，URL 填 https://你的域名/api/webhook。
  勾选 transaction.completed 事件。
  复制 Secret Key -> 填到 PADDLE_NOTIFICATION_WEBHOOK_SECRET。
⚠️ 开发避坑指南（极其重要）
1 后端必须使用 req.text()：在 app/api/webhook/route.ts 中，读取请求体绝对不能用 await req.json()，必须用 await req.text()。否则会导致 Paddle 验签失败（Signature mismatch）。
2 不要暴露假解锁接口：曾经的 /api/unlock 接口必须删除或禁用，解锁权限只能由 Webhook 后台静默执行，防止用户白嫖。
3 异步延迟：Paddle Webhook 到达后端通常有 1~3 秒延迟，前端支付成功后最好给出“正在解锁/请稍候刷新”的提示。
4 防重复扣款/处理：Webhook 代码中一定要用 transaction.id 做防重放校验（幂等性），防止 Paddle 重复发送通知导致多次解锁或业务异常。
🛠️ Paddle配置检查
1. 完成 Paddle 账户验证（最关键）
你截图里的 02 Verify your account 还是灰色状态。在 Paddle Live 环境下，必须完成验证才能收款。你需要准备好营业执照（或身份证）、网站域名等信息，在 Paddle 后台 My account > Verification 提交审核。审核通过后，这个错误通常就会消失。
2. 检查域名是否已添加并获批
Paddle 要求你使用的网站域名必须通过审核。去 My account > Settings > Website approval，确认 duediligence.org 是否已经在列表里并且状态是 Approved。如果没加，Paddle 会拒绝在这个域名下创建结账。
3. 核对环境变量（尤其是 Token 类型）
你之前遇到过的 NEXT_PUBLIC_PADDLE_CLIENT_TOKEN 报错问题，再确认一次：
在 Vercel 后台，PADDLE_API_KEY 和 PADDLE_NOTIFICATION_WEBHOOK_SECRET 的类型是 Secret（且不带 NEXT_PUBLIC_ 前缀）。
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN 的类型必须是 Config（因为它要暴露给浏览器）。如果你把它改成了 Secret 且没加前缀，前端 initializePaddle 可能拿不到 token，直接导致弹窗打不开。
确认你填的 live_ 开头的 token，不是 test_ 开头的沙盒 token。
4. 确认价格 ID 对应的产品状态
你填在 UnlockModal.tsx 里的 pri_... 价格 ID，必须是 Live 环境里已经发布（Active）的状态。如果那个价格还在草稿状态，或者被归档了，也会报错。
另外：先别急着测Live扣款：如果你还没完成账户验证，强烈建议你切回 Sandbox 沙盒环境。在沙盒里，你可以用测试卡号（比如 4242 4242 4242 4242）跑通全流程，验证前端弹窗、后端 Webhook、Redis 解锁是否正常。等沙盒彻底跑通了，再回来搞定 Live 验证。
另外：查看 Vercel 日志：如果后端 Webhook 没收到请求，Vercel 的 Logs 里是不会有记录的。先确保支付弹窗能正常拉起来，再去看日志。
5 设置默认支付链接
Checkout -> Checkout configuration -> Default payment link
Checkout -> Checkout configuration -> Payment methods
Business account -> Payouts -> Payout settings
My account -> Settings -> Sales tax / Balance currency
My account -> Settings -> Currencies
```
## VSCODE代码传GitHub失败
1 清除失效代理
git config --global --unset http.proxy
git config --global --unset https.proxy
2 直接强制推送
git push origin master

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
