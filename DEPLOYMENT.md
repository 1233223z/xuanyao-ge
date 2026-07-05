# 玄曜阁 · 部署与收款配置清单

## 部署（Railway）

代码已推送到 GitHub，Railway 自动部署。
访问地址：`https://你的项目名.up.railway.app`

## 配置环境变量（Railway）

去 Railway Dashboard → 你的项目 → **Variables** 添加以下变量：

### 必须配置（收款用）

| 变量名 | 值 | 说明 |
|---|---|---|
| `STRIPE_SECRET_KEY` | `sk_test_xxx` 或 `sk_live_xxx` | Stripe 密钥，测试/生产 |
| `STRIPE_PRICE_BAZI_REPORT` | `price_xxx` | 八字报告 ¥9.9 |
| `STRIPE_PRICE_LIUYAO_REPORT` | `price_xxx` | 六爻报告 ¥9.9 |
| `STRIPE_PRICE_FULL_REPORT` | `price_xxx` | 完整套餐 ¥19.9 |
| `NEXT_PUBLIC_SITE_URL` | `https://你的域名` | 用于支付成功跳转 |

### 可选配置

| 变量名 | 值 | 说明 |
|---|---|---|
| `STRIPE_WEBHOOK_SECRET` | `whsec_xxx` | Webhook 验签（高级功能） |
| `ANTHROPIC_API_KEY` | `sk-ant-xxx` | AI 润色解读（可选） |

## 测试支付流程

1. 访问网站 → 八字排盘 → 输入信息 → 点"开始排盘"
2. 在结果页点"解锁完整详批报告 ¥9.9"
3. 跳转到 Stripe 支付页 → 用测试卡 `4242 4242 4242 4242` 支付
4. 支付成功后跳回 → 报告自动解锁

**注意**：`sk_test_` 模式下测试卡不会真实扣款。

## 切换到真实收款

1. Stripe Dashboard → 切换为 **Live mode**
2. 重新创建三个产品（生产环境的 Price ID 与测试环境不同）
3. 复制 `sk_live_xxx` 密钥
4. 复制三个 `price_live_xxx` ID
5. 更新 Railway Variables 中的值
6. 重新部署

## 环境变量管理

- 不要在代码中硬编码密钥
- 本地开发用 `.env`（已加入 `.gitignore`）
- 生产环境在 Railway Dashboard 设置
