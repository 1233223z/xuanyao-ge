/* ============================================================
 * Stripe 产品初始化脚本
 *
 * 自动在 Stripe 创建产品和价格，输出 Price ID。
 *
 * 用法：
 *   npx ts-node -e "require('./scripts/setup-stripe-prices.ts')"
 *   或
 *   node scripts/setup-stripe-prices.js
 *
 * 前置条件：
 *   在 .env 中设置 STRIPE_SECRET_KEY
 * ============================================================ */
const Stripe = require("stripe");
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

async function main() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.error("请在 .env 中设置 STRIPE_SECRET_KEY");
    process.exit(1);
  }

  const stripe = new Stripe(secretKey, { apiVersion: "2026-06-24.dahlia" });

  const products = [
    { name: "玄曜阁 · 八字详批报告", description: "事业、财运、感情、健康完整深度分析", amount: 990 }, // ¥9.90
    { name: "玄曜阁 · 六爻深度解读", description: "用神判断、卦爻辞详解、综合建议", amount: 990 },
    { name: "玄曜阁 · 完整报告套餐", description: "八字详批 + 六爻解读 + 流年运势", amount: 1990 }, // ¥19.90
  ];

  const envKeys = ["STRIPE_PRICE_BAZI_REPORT", "STRIPE_PRICE_LIUYAO_REPORT", "STRIPE_PRICE_FULL_REPORT"];

  console.log("正在 Stripe 创建产品…\n");

  for (let i = 0; i < products.length; i++) {
    const p = products[i];

    // 创建产品
    const product = await stripe.products.create({
      name: p.name,
      description: p.description,
    });

    // 创建价格（CNY 人民币）
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: p.amount,
      currency: "cny",
    });

    console.log(`✅ ${p.name}`);
    console.log(`   Product ID: ${product.id}`);
    console.log(`   Price ID:   ${price.id}`);
    console.log(`   环境变量:   ${envKeys[i]}=${price.id}\n`);
  }

  console.log("=== 把这 3 个 Price ID 复制到 Railway 环境变量中 ===");
  console.log("或者直接用以下命令更新 .env 文件：");
}

main().catch((err) => {
  console.error("失败:", err);
  process.exit(1);
});
