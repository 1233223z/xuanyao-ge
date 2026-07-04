/* ============================================================
 * 存储工具 — 支持六爻 + 八字记录
 * ============================================================ */
import type { DivinationResult, StoredDivinationRecord } from "@/types/yao";

const currentKey = "xuanyao-current-result";
const historyKey = "xuanyao-history";
const baziHistoryKey = "xuanyao-bazi-history";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

// ========== 六爻存储 ==========

export function saveCurrentResult(result: DivinationResult) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(currentKey, JSON.stringify(result));
}

export function readCurrentResult(): DivinationResult | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(currentKey);
  if (!raw) return null;
  try { return JSON.parse(raw) as DivinationResult; }
  catch { return null; }
}

export function readHistory(): StoredDivinationRecord[] {
  if (!canUseStorage()) return [];
  const raw = window.localStorage.getItem(historyKey);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as StoredDivinationRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

export function saveHistory(history: StoredDivinationRecord[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(historyKey, JSON.stringify(history));
}

export function saveRecord(result: DivinationResult) {
  const history = readHistory();
  const record: StoredDivinationRecord = {
    ...result,
    savedAt: new Date().toISOString()
  };
  const nextHistory = [record, ...history.filter((item) => item.id !== result.id)];
  saveHistory(nextHistory);
  return record;
}

export function readRecord(id: string) {
  return readHistory().find((item) => item.id === id) ?? null;
}

export function deleteRecord(id: string) {
  const nextHistory = readHistory().filter((item) => item.id !== id);
  saveHistory(nextHistory);
  return nextHistory;
}

// ========== 八字存储 ==========

export type BaziHistoryRecord = {
  id: string;
  name: string;
  gender: string;
  birthDate: string;
  birthTime: string;
  pillarShort: string;
  dayMaster: string;
  savedAt: string;
};

export function saveBaziRecord(record: BaziHistoryRecord) {
  if (!canUseStorage()) return;
  const raw = window.localStorage.getItem(baziHistoryKey);
  let list: BaziHistoryRecord[] = [];
  try {
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) list = parsed;
    }
  } catch { /* noop */ }
  const next = [record, ...list.filter((r) => r.id !== record.id)];
  window.localStorage.setItem(baziHistoryKey, JSON.stringify(next));
}

export function readBaziHistory(): BaziHistoryRecord[] {
  if (!canUseStorage()) return [];
  const raw = window.localStorage.getItem(baziHistoryKey);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

export function deleteBaziRecord(id: string) {
  const list = readBaziHistory().filter((r) => r.id !== id);
  if (canUseStorage()) {
    window.localStorage.setItem(baziHistoryKey, JSON.stringify(list));
  }
  return list;
}
