/* ============================================================
 * AI 解读润色 API
 *
 * 当用户选择 AI 润色时，将命理数据发送到 LLM 进行自然语言优化。
 * 默认使用规则引擎生成的解读，AI 润色为可选增值功能。
 *
 * 接入方式：
 *   1. 设置环境变量 ANTHROPIC_API_KEY
 *   2. 设置 AI_MODEL (可选，默认 claude-sonnet-5)
 *   3. 调用 POST /api/enhance-interpretation
 * ============================================================ */
import { NextResponse } from "next/server";

const AI_MODEL = process.env.AI_MODEL || "claude-sonnet-5";

const SYSTEM_PROMPT = `你是一位精通中国传统命理的资深命理师，用现代人能理解的语言进行解读。

原则：
1. 分析基于用户提供的八字/六爻数据，不要虚构新的命理信息
2. 每个判断必须给出命理依据，不说空话
3. 禁止使用"一定""绝对""必然"等绝对化词汇
4. 用"趋势""概率""条件""如果…则…"等表达方式
5. 保持克制、专业、有理有据的风格
6. 可以润色语言表达，但不能改变原有判断的含义
7. 最后提供可操作的方向性建议`;

/**
 * 将解读文本发送到 AI 进行润色
 */
async function enhanceWithAI(originalText: string, context: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error("未配置 ANTHROPIC_API_KEY");
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: AI_MODEL,
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `以下是一段命理解读，请润色语言使其更自然、更像真人师傅的分析：

【命理背景】
${context}

【原文】
${originalText}

请保持原有判断和推理不变，仅优化语言表达。`
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`AI 服务返回错误: ${response.status}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || originalText;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      originalText,
      context,
      type = "bazi" // "bazi" | "liuyao"
    } = body;

    if (!originalText) {
      return NextResponse.json({ error: "缺少待润色的文本" }, { status: 400 });
    }

    const enhanced = await enhanceWithAI(originalText, context || `类型：${type === "bazi" ? "八字排盘" : "六爻起卦"}`);

    return NextResponse.json({
      original: originalText,
      enhanced,
      model: AI_MODEL,
      enhancedAt: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("AI 润色失败:", error);

    // 如果未配置 API Key，返回友好提示
    if (error.message?.includes("ANTHROPIC_API_KEY")) {
      return NextResponse.json(
        { error: "AI 润色功能需要配置 API Key。请在环境变量中设置 ANTHROPIC_API_KEY。" },
        { status: 501 }
      );
    }

    return NextResponse.json(
      { error: "AI 润色暂时不可用" },
      { status: 500 }
    );
  }
}
