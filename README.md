# ChopCheck — 首页原型 (Next.js + Tailwind)

## 本地运行

```bash
npm install
cp .env.local.example .env.local   # 按需修改 ALIYUN_SEARCH_URL
npm run dev
```
部署到 Vercel(推荐,尤其你这种情况):
Vercel 就是 Next.js 官方公司做的托管平台,你把代码推到 GitHub,连接 Vercel 后它自动帮你 npm run build,然后全部搞定——不需要你自己配 Nginx、不需要自己管服务器、自带全球 CDN 和 HTTPS。这是目前做 Next.js 项目最简单的部署方式,而且你的目标用户是海外采购商,Vercel 在国外访问速度很好。

打开 http://localhost:3000

## 项目结构

```
app/
  layout.tsx              根布局,加载 Fraunces / IBM Plex Sans / JetBrains Mono 三款字体
  page.tsx                首页,管理搜索/选中公司/解锁状态/额度等所有状态
  globals.css             Tailwind 入口
  api/search-company/
    route.ts              服务端代理,转发到阿里云FC的 DueDiligenceSearch,规避浏览器CORS问题

components/
  SearchBar.tsx            搜索输入框
  CompanyList.tsx           搜索结果列表(可选公司列表的界面)
  ReportPanel.tsx           选中公司后的报告面板(免费字段 + 锁定字段 + 付费墙)
  PricingSection.tsx        单次$19.9 / 10次$99 两档定价
  BundleModal.tsx            购买10次额度的确认弹窗
  Toast.tsx                  底部提示条

lib/types.ts                共享类型定义
  api.tx                    存放与阿里云 FC 交互的请求函数
```

## 已实现

- 首页搜索框 → 调用 `/api/search-company` → 转发到你阿里云FC上的 `DueDiligenceSearch`,展示真实的公司列表(名称/状态/成立日期/统一社会信用代码)。
- 选中某家公司后展开报告面板,免费字段(统一社会信用代码)直接展示,深度字段(法人关联、处罚记录、AI风险结论)以模糊态锁定,点击"Unlock full report"解锁。
- 底部两档定价:单次 $19.9(会解锁当前打开的公司报告,若还没搜索会引导回到搜索框)、10次 $99(打开确认弹窗,确认后额度加到右上角徽章,之后解锁报告优先消耗额度)。
- 移动端做了响应式处理:公司列表在小屏上从4列表格变成纵向堆叠,报告面板的标签/数值也从左右排列变成上下排列。

## 待办(下一步)

- `ReportPanel.tsx` 里的 `LOCKED_FIELDS` 目前是占位数据。接入 `DueDiligence` 接口后,应该在 `onUnlock` 里先按 `credit_code` 请求该接口拿到真实数据,再展示,而不是直接切换本地锁定状态。
- 每日3次免费查询的限流(cookie + IP 计数)还没接入,需要在 `route.ts` 里加一层 Redis/Tablestore 计数逻辑。
- Lemon Squeezy 结账目前是模拟的(`BundleModal` 里点击"Pay $99"直接加余额),接入时替换成真实的 Lemon.js overlay 或跳转到 Lemon Squeezy 的 checkout link,并用 webhook 回写额度。
