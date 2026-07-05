# 玄爻阁上线赚钱部署清单

这个项目是 Next.js 应用，适合直接部署到 Vercel。当前生产构建已经通过，主要剩下账号、环境变量、支付价格和域名配置。

## 1. 本地自检

```bash
npm install
npm run typecheck
npm run build
```

本地预览：

```bash
npm run dev
```

打开 `http://localhost:3000`。

## 2. 准备 Git 仓库

把 `xuanyao-ge` 提交到 GitHub。如果你的仓库根目录不是 `xuanyao-ge`，部署时要在 Vercel 里设置 Root Directory 为 `xuanyao-ge`。

不要提交真实密钥。真实密钥只放在本机 `.env.local` 或 Vercel Environment Variables。

## 3. 配置 Stripe 收款

在 Stripe Dashboard 创建 3 个一次性付款价格：

- `bazi_report`：八字报告，例如 9.9
- `liuyao_report`：六爻报告，例如 9.9
- `full_report`：完整详批，例如 19.9

创建后复制每个 Price ID，格式类似 `price_xxx`。

本地测试可以新建 `.env.local`：

```bash
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PRICE_BAZI_REPORT=price_xxx
STRIPE_PRICE_LIUYAO_REPORT=price_xxx
STRIPE_PRICE_FULL_REPORT=price_xxx
ANTHROPIC_API_KEY=sk-ant-xxx
AI_MODEL=claude-sonnet-5
```

## 4. 部署到 Vercel

1. 登录 Vercel，新建项目。
2. 导入 GitHub 仓库。
3. Framework Preset 选择 `Next.js`。
4. 如果仓库根目录不是本项目目录，Root Directory 填 `xuanyao-ge`。
5. Build Command 用默认值 `npm run build`。
6. Install Command 用默认值 `npm install`。
7. 在 Environment Variables 添加：
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PRICE_BAZI_REPORT`
   - `STRIPE_PRICE_LIUYAO_REPORT`
   - `STRIPE_PRICE_FULL_REPORT`
   - `ANTHROPIC_API_KEY`
   - `AI_MODEL`
8. 点击 Deploy。

## 5. 绑定域名

部署成功后，先用 Vercel 临时域名测试。确认没问题再绑定正式域名，例如：

- `xuanyaoge.com`
- `bazi.example.com`

在 Vercel 项目的 Domains 页面添加域名，然后按页面提示到域名商配置 DNS。

## 6. 上线赚钱建议

先做低门槛付费，不要一开始做复杂会员系统：

- 免费：排盘、基础解读、部分流年提示。
- 付费 9.9：完整八字报告或六爻报告。
- 付费 19.9：八字 + 流年 + 感情/财运/健康综合详批。

上线前必须测试：

- 首页、八字、六爻、流年页面能打开。
- 没配置 Stripe 时支付接口返回清楚错误。
- 配置 Stripe test key 后能跳转 Checkout。
- Stripe test 支付成功后能回到结果页。
- Vercel 生产环境环境变量和本地 `.env.local` 一致。

## 7. 重要风险

当前项目适合 MVP 收款验证，但还不是完整的账号制 SaaS：

- 目前没有用户登录和订单数据库。
- 支付成功后的报告解锁主要依赖前端状态/跳转参数，不适合卖高价服务。
- 真正做长期收入，后续应补 Stripe webhook、订单表、用户登录和支付后永久解锁。

建议第一版先上线验证有没有人愿意付 9.9/19.9，再决定是否加数据库和会员系统。
