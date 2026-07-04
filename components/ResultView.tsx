import { PrimaryButton, SecondaryLink } from "@/components/PrimaryButton";
import { buildLineDetails, buildOneLineConclusion, changedNature, positionNames, getDayStem } from "@/lib/yao";
import { buildEnhancedLineDetails, getYaoCi } from "@/lib/yao-enhanced";
import type { DivinationResult, ReadingSection, YaoLine, YaoLineDetail, YaoNature } from "@/types/yao";

type ResultViewProps = {
  result: DivinationResult;
  saved?: boolean;
  fromHistory?: boolean;
  onSave?: () => void;
};

type LegacyReadingSection = Partial<ReadingSection> & {
  title: string;
  content?: string;
};

const tagClass: Record<string, string> = {
  判断: "border-cinnabar-400/40 bg-cinnabar-500/12 text-cinnabar-400",
  依据: "border-brass-300/35 bg-brass-300/10 text-brass-300",
  局势: "border-rice-100/18 bg-rice-50/[0.05] text-rice-100/72",
  趋势: "border-brass-300/35 bg-brass-300/10 text-brass-300",
  风险: "border-cinnabar-400/40 bg-cinnabar-500/12 text-cinnabar-400",
  建议: "border-rice-100/18 bg-rice-50/[0.05] text-rice-100/72",
  核实: "border-brass-300/35 bg-brass-300/10 text-brass-300"
};

function YaoStroke({ nature }: { nature: YaoNature }) {
  if (nature === "yang") {
    return <span className="block h-[7px] w-full rounded-sm bg-rice-50/90 shadow-sm shadow-rice-50/10" />;
  }

  return (
    <span className="flex w-full items-center gap-4">
      <span className="block h-[7px] flex-1 rounded-sm bg-rice-50/90 shadow-sm shadow-rice-50/10" />
      <span className="block h-[7px] flex-1 rounded-sm bg-rice-50/90 shadow-sm shadow-rice-50/10" />
    </span>
  );
}

function PlateLine({ line, detail }: { line: YaoLine; detail: YaoLineDetail }) {
  return (
    <div className="grid grid-cols-[3rem_minmax(7rem,1fr)_auto] items-center gap-3 rounded-md border border-rice-100/10 bg-ink-950/34 px-3 py-3 sm:grid-cols-[3.2rem_minmax(8rem,1fr)_auto]">
      <div className="text-sm text-rice-100/66">{detail.positionName}</div>
      <div className="flex items-center gap-3">
        <div className="w-full max-w-48">
          <YaoStroke nature={line.nature} />
        </div>
        <span
          className={`min-w-9 rounded border px-2 py-1 text-center text-xs ${
            line.isMoving
              ? "border-cinnabar-400/45 bg-cinnabar-500/14 text-cinnabar-400"
              : "border-rice-100/12 text-rice-100/50"
          }`}
        >
          {line.isMoving ? "动" : "静"}
        </span>
      </div>
      <div className="flex flex-wrap justify-end gap-1.5 text-xs">
        <span className="rounded border border-rice-100/12 px-2 py-1 text-rice-100/64">{detail.relation}</span>
        <span className="rounded border border-brass-300/28 px-2 py-1 text-brass-300/88">{detail.spirit}</span>
        {detail.worldResponse ? (
          <span className="rounded border border-cinnabar-400/45 bg-cinnabar-500/12 px-2 py-1 text-cinnabar-400">
            {detail.worldResponse}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function MiniHexagram({
  label,
  name,
  sequence,
  active = false
}: {
  label: string;
  name: string;
  sequence?: number;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        active
          ? "border-cinnabar-400/34 bg-cinnabar-500/10"
          : "border-rice-100/12 bg-rice-50/[0.035]"
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className={active ? "text-xs text-cinnabar-400" : "text-xs text-rice-100/48"}>{label}</span>
        {sequence ? <span className="text-xs text-rice-100/40">第{sequence}卦</span> : null}
      </div>
      <p className="text-xl font-medium text-rice-50">{name}</p>
    </div>
  );
}

function ReadingBlock({ section }: { section: LegacyReadingSection }) {
  const tag = section.tag ?? "判断";
  const className = tagClass[tag] ?? tagClass["判断"];

  return (
    <article className="rounded-lg border border-rice-100/10 bg-gradient-to-br from-rice-50/[0.055] to-rice-50/[0.02] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-lg font-medium text-rice-50">{section.title}</h3>
        <span className={`rounded border px-2 py-1 text-xs ${className}`}>{tag}</span>
      </div>

      {section.evidence ? (
        <p className="text-sm leading-7 text-rice-100/64">
          <span className="text-rice-50">依据：</span>
          {section.evidence}
        </p>
      ) : null}

      <p className="mt-2 text-sm leading-7 text-rice-100/72">
        <span className="text-rice-50">判断：</span>
        {section.judgment ?? section.content ?? "旧版记录未保存此项断语。"}
      </p>

      {section.advice ? (
        <p className="mt-2 text-sm leading-7 text-rice-100/68">
          <span className="text-rice-50">建议：</span>
          {section.advice}
        </p>
      ) : null}

      {section.questions && section.questions.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {section.questions.map((question) => (
            <li key={question} className="rounded border border-rice-100/10 bg-ink-950/24 px-3 py-2 text-sm leading-6 text-rice-100/66">
              {question}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

export function ResultView({ result, saved = false, fromHistory = false, onSave }: ResultViewProps) {
  const lineDetails = result.lineDetails ?? buildLineDetails(result.lines, result.primaryHexagram);
  const lineDetailMap = new Map(lineDetails.map((detail) => [detail.position, detail]));
  const movingText =
    result.changedLines.length > 0
      ? result.changedLines.map((position) => positionNames[position - 1]).join("、")
      : "无动爻";
  const conclusion = result.oneLineConclusion ?? buildOneLineConclusion(result.primaryHexagram, result.changedHexagram, result.lines);
  const changedName = result.changedHexagram?.name ?? "无变卦";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-cinnabar-400">{fromHistory ? "历史占事" : "排盘结果"}</p>
          <h1 className="mt-2 text-2xl font-semibold text-rice-50 sm:text-3xl">六爻排盘</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          {!fromHistory ? (
            <PrimaryButton onClick={onSave} disabled={saved}>
              {saved ? "已保存" : "保存本次占事"}
            </PrimaryButton>
          ) : null}
          <SecondaryLink href="/divination">重新起卦</SecondaryLink>
        </div>
      </div>

      <section className="relative overflow-hidden rounded-xl border border-rice-100/14 bg-[linear-gradient(135deg,rgba(37,35,30,0.96),rgba(18,18,15,0.92)_54%,rgba(127,47,40,0.18))] p-5 shadow-quiet-glow sm:p-7">
        <div className="absolute right-0 top-0 h-28 w-28 border-b border-l border-cinnabar-400/18 bg-cinnabar-500/8" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded border border-cinnabar-400/38 bg-cinnabar-500/12 px-2.5 py-1 text-xs text-cinnabar-400">卦象总览</span>
              <span className="rounded border border-brass-300/28 bg-brass-300/10 px-2.5 py-1 text-xs text-brass-300">动爻：{movingText}</span>
            </div>
            <h2 className="text-3xl font-semibold leading-tight text-rice-50 sm:text-4xl">
              {result.primaryHexagram.name}
              <span className="mx-2 text-rice-100/28">之</span>
              {changedName}
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-rice-50/88">{conclusion}</p>
          </div>

          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-lg border border-rice-100/10 bg-ink-950/28 p-3">
              <dt className="text-rice-100/46">占事类型</dt>
              <dd className="mt-1 text-base font-medium text-rice-50">{result.title}</dd>
            </div>
            <div className="rounded-lg border border-rice-100/10 bg-ink-950/28 p-3">
              <dt className="text-rice-100/46">起卦时间</dt>
              <dd className="mt-1 text-base font-medium text-rice-50">{result.castTime}</dd>
            </div>
            <div className="rounded-lg border border-rice-100/10 bg-ink-950/28 p-3">
              <dt className="text-rice-100/46">本卦</dt>
              <dd className="mt-1 text-base font-medium text-rice-50">{result.primaryHexagram.name}</dd>
            </div>
            <div className="rounded-lg border border-rice-100/10 bg-ink-950/28 p-3">
              <dt className="text-rice-100/46">变卦</dt>
              <dd className="mt-1 text-base font-medium text-rice-50">{changedName}</dd>
            </div>
            <div className="rounded-lg border border-rice-100/10 bg-ink-950/28 p-3 sm:col-span-2">
              <dt className="text-rice-100/46">具体问题</dt>
              <dd className="mt-1 leading-7 text-rice-100/76">{result.question}</dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[0.95fr_1.35fr] lg:items-start">
        <aside className="rounded-xl border border-rice-100/12 bg-[linear-gradient(180deg,rgba(31,30,26,0.9),rgba(18,18,15,0.88))] p-4 sm:p-5">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-cinnabar-400">六爻排盘区域</p>
              <h2 className="mt-1 text-2xl font-medium text-rice-50">自上而下看盘</h2>
            </div>
            <span className="rounded border border-rice-100/12 px-2 py-1 text-xs text-rice-100/48">初爻起卦</span>
          </div>

          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <MiniHexagram label="本卦" name={result.primaryHexagram.name} sequence={result.primaryHexagram.sequence} active />
            <MiniHexagram label="变卦" name={changedName} sequence={result.changedHexagram?.sequence} />
          </div>

          {/* 增强信息：六神、纳甲、用神 */}
          {(() => {
            if (result.lines.length === 0) return null;
            const dayStem = getDayStem().charAt(0);
            const enhanced = buildEnhancedLineDetails(result.lines, result.primaryHexagram, dayStem, result.title);
            return (
              <div className="mb-4 rounded-lg border border-rice-100/8 bg-ink-950/40 p-3 space-y-2">
                <p className="text-xs text-rice-100/50">用神：<span className="text-cinnabar-400">{enhanced.yongShen.yongShen}</span>
                  <span className="ml-1 text-rice-100/40">· {enhanced.yongShen.explanation}</span>
                </p>
                <p className="text-xs text-rice-100/50">
                  六神：{enhanced.sixSpirits.map((s, i) => (
                    <span key={i} className="ml-1">
                      {positionNames[i]}<span className="text-brass-300">{s}</span>
                      {i < 5 ? " · " : ""}
                    </span>
                  ))}
                </p>
                <p className="text-xs text-rice-100/40">
                  纳甲：{enhanced.nayin.stems.map((s, i) => s).join(" ")}
                </p>
              </div>
            );
          })()}

          <div className="space-y-2.5">
            {[...result.lines]
              .sort((a, b) => b.position - a.position)
              .map((line) => {
                const detail = lineDetailMap.get(line.position);

                return detail ? <PlateLine key={line.position} line={line} detail={detail} /> : null;
              })}
          </div>

          {/* 爻辞 */}
          <div className="mt-4 space-y-1.5">
            <p className="text-xs text-rice-100/40">爻辞参考</p>
            {[...result.lines].sort((a, b) => b.position - a.position).map((line) => {
              const yaoCi = getYaoCi(result.primaryHexagram.name, line.position);
              if (!yaoCi) return null;
              return (
                <div key={line.position} className="text-xs leading-6 text-rice-100/50">
                  <span className="text-rice-100/40">{positionNames[line.position - 1]}：</span>
                  <span className={line.isMoving ? "text-cinnabar-400/80" : ""}>{yaoCi}</span>
                </div>
              );
            })}
          </div>

          {result.changedHexagram ? (
            <div className="mt-5 rounded-lg border border-rice-100/10 bg-rice-50/[0.035] p-4">
              <p className="mb-3 text-xs text-rice-100/48">变爻后阴阳</p>
              <div className="space-y-2.5">
                {[...result.lines]
                  .sort((a, b) => b.position - a.position)
                  .map((line) => (
                    <div key={line.position} className="grid grid-cols-[3rem_1fr_2.4rem] items-center gap-3 text-sm text-rice-100/58">
                      <span>{positionNames[line.position - 1]}</span>
                      <YaoStroke nature={changedNature(line)} />
                      <span className="text-right text-xs">{line.isMoving ? "已变" : "不变"}</span>
                    </div>
                  ))}
              </div>
            </div>
          ) : null}

          <p className="mt-4 text-xs leading-6 text-rice-100/40">
            六亲、六神、世应已按基础盘面生成，后续可继续接入纳甲、日辰、旬空等更完整字段。
          </p>
        </aside>

        <section className="space-y-4">
          <div className="rounded-xl border border-rice-100/12 bg-[linear-gradient(180deg,rgba(31,30,26,0.82),rgba(18,18,15,0.72))] p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-cinnabar-400">断语依据</p>
                <h2 className="mt-1 text-2xl font-medium text-rice-50">从卦象到行动</h2>
              </div>
              <div className="flex gap-2">
                <span className="rounded border border-cinnabar-400/38 px-2 py-1 text-xs text-cinnabar-400">风险</span>
                <span className="rounded border border-brass-300/28 px-2 py-1 text-xs text-brass-300">建议</span>
              </div>
            </div>

            <div className="grid gap-3">
              {(result.interpretation as LegacyReadingSection[]).map((section) => (
                <ReadingBlock key={section.title} section={section} />
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-rice-100/10 bg-rice-50/[0.03] px-4 py-3 text-xs leading-6 text-rice-100/42">
            免责声明：本工具仅按六爻排盘规则整理卦象信息；涉及法律、医疗、投资、合同等事务，请以现实证据和专业意见为准。
          </div>
        </section>
      </div>
    </div>
  );
}
