/* ============================================================
 * 支付核心模块
 *
 * 产品配置、订单类型、Stripe 辅助函数
 * 订单默认存储在 Stripe 端（Checkout Session 元数据），
 * 前端通过 sessionStorage 跟踪本地的解锁状态。
 * 如需数据库持久化，替换 IOrderStore 接口的实现即可。
 * ============================================================ */

// ---------- 产品配置 ----------

export type ProductId = "bazi_report" | "liuyao_report" | "full_report";

export type ProductConfig = {
  id: ProductId;
  name: string;
  description: string;
  /** 人民币金额（元） */
  priceCNY: number;
  /** 美元金额（美分） — 可选，备选 */
  priceUSDCents: number;
  /** 环境变量名：存放该产品的 Stripe Price ID */
  envKey: string;
};

/** 所有可售产品 */
export const PRODUCTS: ProductConfig[] = [
  {
    id: "bazi_report",
    name: "玄曜阁 · 八字详批报告",
    description: "事业、财运、感情、健康完整深度分析",
    priceCNY: 9.9,
    priceUSDCents: 199,
    envKey: "STRIPE_PRICE_BAZI_REPORT",
  },
  {
    id: "liuyao_report",
    name: "玄曜阁 · 六爻深度解读",
    description: "用神判断、卦爻辞详解、综合建议",
    priceCNY: 9.9,
    priceUSDCents: 199,
    envKey: "STRIPE_PRICE_LIUYAO_REPORT",
  },
  {
    id: "full_report",
    name: "玄曜阁 · 完整报告套餐",
    description: "八字详批 + 六爻解读 + 流年运势",
    priceCNY: 19.9,
    priceUSDCents: 399,
    envKey: "STRIPE_PRICE_FULL_REPORT",
  },
];

export function getProduct(id: ProductId): ProductConfig {
  const p = PRODUCTS.find((p) => p.id === id);
  if (!p) throw new Error(`未知产品: ${id}`);
  return p;
}

/** 从环境变量读取 Stripe Price ID */
export function getStripePriceId(id: ProductId): string {
  const p = getProduct(id);
  const priceId = process.env[p.envKey];
  if (!priceId) {
    throw new Error(
      `缺少 Price ID 配置：请在环境变量 ${p.envKey} 中设置 Stripe Price ID。` +
        `创建方式：Stripe Dashboard → Products → Create Product → 记下 price_xxx 格式的 ID。`
    );
  }
  if (!priceId.startsWith("price_")) {
    throw new Error(`${p.envKey} 的值 "${priceId}" 格式不正确，应以 price_ 开头。`);
  }
  return priceId;
}

// ---------- 订单类型 ----------

export type OrderStatus = "pending" | "paid" | "failed" | "refunded";

export type Order = {
  /** Stripe Checkout Session ID */
  sessionId: string;
  productId: ProductId;
  status: OrderStatus;
  /** 人民币金额 */
  amountCNY: number;
  createdAt: string;
  paidAt?: string;
  /** Stripe Payment Intent ID（支付成功后回填） */
  paymentIntentId?: string;
};

/**
 * 创建本地订单记录（localStorage 兜底）
 * 搭配 webhook 使用：webhook 收到 payment_intent.succeeded 后，
 * 更新 localStorage 中对应 sessionId 的状态。
 */
export function saveLocalOrder(order: Order): void {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem("xuanyao-orders");
  const orders: Order[] = raw ? JSON.parse(raw) : [];
  const idx = orders.findIndex((o) => o.sessionId === order.sessionId);
  if (idx >= 0) orders[idx] = order;
  else orders.push(order);
  localStorage.setItem("xuanyao-orders", JSON.stringify(orders));
}

export function getLocalOrder(sessionId: string): Order | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("xuanyao-orders");
  if (!raw) return null;
  const orders: Order[] = JSON.parse(raw);
  return orders.find((o) => o.sessionId === sessionId) ?? null;
}

export function updateLocalOrderStatus(
  sessionId: string,
  status: OrderStatus,
  extra?: Partial<Order>
): void {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem("xuanyao-orders");
  if (!raw) return;
  const orders: Order[] = JSON.parse(raw);
  const idx = orders.findIndex((o) => o.sessionId === sessionId);
  if (idx < 0) return;
  orders[idx] = { ...orders[idx], status, ...extra };
  localStorage.setItem("xuanyao-orders", JSON.stringify(orders));
}

// ---------- 解锁状态 ----------

const UNLOCK_KEY = "xuanyao-unlocked-products";

/** 检查某个产品是否已解锁 */
export function isProductUnlocked(productId: ProductId): boolean {
  if (typeof window === "undefined") return false;
  const raw = localStorage.getItem(UNLOCK_KEY);
  if (!raw) return false;
  const unlocked: string[] = JSON.parse(raw);
  return unlocked.includes(productId);
}

/** 标记某个产品为已解锁 */
export function markProductUnlocked(productId: ProductId): void {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(UNLOCK_KEY);
  const unlocked: string[] = raw ? JSON.parse(raw) : [];
  if (!unlocked.includes(productId)) {
    unlocked.push(productId);
    localStorage.setItem(UNLOCK_KEY, JSON.stringify(unlocked));
  }
}

// ---------- 工具 ----------

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

// ---------- 报告持久化（localStorage 兜底） ----------

const REPORT_DATA_PREFIX = "xuanyao-report-data-";
const PAID_REPORTS_KEY = "xuanyao-paid-reports";

/** 支付前保存报告数据，供支付成功页找回 */
export function saveReportData(reportId: string, data: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(REPORT_DATA_PREFIX + reportId, JSON.stringify(data));
  } catch (e) {
    console.error("保存报告数据失败:", e);
  }
}

/** 根据 reportId 取回报告数据 */
export function getReportData(reportId: string): unknown | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(REPORT_DATA_PREFIX + reportId);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** 标记某个 reportId 已支付 */
export function markReportPaid(reportId: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(PAID_REPORTS_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(reportId)) {
      list.push(reportId);
      localStorage.setItem(PAID_REPORTS_KEY, JSON.stringify(list));
    }
  } catch (e) {
    console.error("标记已支付报告失败:", e);
  }
}

/** 检查某个 reportId 是否已支付 */
export function isReportPaid(reportId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(PAID_REPORTS_KEY);
    if (!raw) return false;
    const list: string[] = JSON.parse(raw);
    return list.includes(reportId);
  } catch {
    return false;
  }
}

/** 获取所有已支付的 reportId 列表 */
export function getPaidReportIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PAID_REPORTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
