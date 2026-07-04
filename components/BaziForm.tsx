"use client";

import { useState } from "react";
import type { Gender } from "@/types/bazi";

type BaziFormData = {
  name: string;
  gender: Gender;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  useTrueSolarTime: boolean;
};

type Props = {
  onCalculate: (data: BaziFormData) => void;
  isLoading?: boolean;
};

const CHINA_CITIES = [
  "北京", "上海", "广州", "深圳", "成都", "杭州", "武汉", "西安",
  "南京", "重庆", "天津", "苏州", "长沙", "郑州", "东莞", "青岛",
  "沈阳", "宁波", "昆明", "大连", "厦门", "合肥", "佛山", "福州",
  "哈尔滨", "济南", "温州", "长春", "石家庄", "常州", "泉州", "南宁",
  "贵阳", "南昌", "太原", "烟台", "嘉兴", "南通", "金华", "珠海",
  "惠州", "徐州", "海口", "乌鲁木齐", "绍兴", "中山", "台州", "兰州",
  "国外（自动取东八区）"
];

const defaultCity = "北京";

export default function BaziForm({ onCalculate, isLoading }: Props) {
  const [form, setForm] = useState<BaziFormData>({
    name: "",
    gender: "男",
    birthDate: "",
    birthTime: "",
    birthPlace: defaultCity,
    useTrueSolarTime: true
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BaziFormData, string>>>({});

  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!form.name.trim()) newErrors.name = "请输入姓名";
    if (!form.birthDate) newErrors.birthDate = "请选择出生日期";
    if (!form.birthTime) newErrors.birthTime = "请选择出生时间";
    if (!form.birthPlace) newErrors.birthPlace = "请选择出生地";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      onCalculate(form);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
      {/* 姓名 */}
      <div>
        <label className="mb-2 block text-sm text-rice-100/70">姓名</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="请输入姓名"
          className="w-full rounded-lg border border-brass-300/20 bg-ink-850 px-4 py-2.5 text-rice-50 placeholder:text-rice-100/30 focus:border-gold-400/50 focus:outline-none"
        />
        {errors.name && <p className="mt-1 text-xs text-cinnabar-400">{errors.name}</p>}
      </div>

      {/* 性别 */}
      <div>
        <label className="mb-2 block text-sm text-rice-100/70">性别</label>
        <div className="flex gap-3">
          {(["男", "女"] as Gender[]).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setForm({ ...form, gender: g })}
              className={`flex-1 rounded-lg border px-4 py-2.5 text-sm transition ${
                form.gender === g
                  ? "border-gold-400/50 bg-gold-400/10 text-gold-300"
                  : "border-brass-300/20 bg-ink-850 text-rice-100/60 hover:border-brass-300/30"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* 出生日期 */}
      <div>
        <label className="mb-2 block text-sm text-rice-100/70">出生日期</label>
        <input
          type="date"
          value={form.birthDate}
          onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
          max={new Date().toISOString().split("T")[0]}
          className="w-full rounded-lg border border-brass-300/20 bg-ink-850 px-4 py-2.5 text-rice-50 focus:border-gold-400/50 focus:outline-none"
        />
        {errors.birthDate && <p className="mt-1 text-xs text-cinnabar-400">{errors.birthDate}</p>}
      </div>

      {/* 出生时间 */}
      <div>
        <label className="mb-2 block text-sm text-rice-100/70">出生时间</label>
        <input
          type="time"
          value={form.birthTime}
          onChange={(e) => setForm({ ...form, birthTime: e.target.value })}
          className="w-full rounded-lg border border-brass-300/20 bg-ink-850 px-4 py-2.5 text-rice-50 focus:border-gold-400/50 focus:outline-none"
        />
        {errors.birthTime && <p className="mt-1 text-xs text-cinnabar-400">{errors.birthTime}</p>}
        <p className="mt-1 text-xs text-rice-100/40">如不确定，默认按午时12:00推算</p>
      </div>

      {/* 出生地 */}
      <div>
        <label className="mb-2 block text-sm text-rice-100/70">出生地（用于真太阳时修正）</label>
        <select
          value={form.birthPlace}
          onChange={(e) => setForm({ ...form, birthPlace: e.target.value })}
          className="w-full rounded-lg border border-brass-300/20 bg-ink-850 px-4 py-2.5 text-rice-50 focus:border-gold-400/50 focus:outline-none"
        >
          {CHINA_CITIES.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        {errors.birthPlace && <p className="mt-1 text-xs text-cinnabar-400">{errors.birthPlace}</p>}
      </div>

      {/* 真太阳时 */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-rice-100/70">使用真太阳时</p>
          <p className="text-xs text-rice-100/40">根据出生地经度修正时间，更精准</p>
        </div>
        <button
          type="button"
          onClick={() => setForm({ ...form, useTrueSolarTime: !form.useTrueSolarTime })}
          className={`h-6 w-11 rounded-full transition ${
            form.useTrueSolarTime ? "bg-gold-400/60" : "bg-ink-700"
          }`}
        >
          <span
            className={`block h-5 w-5 rounded-full bg-rice-50 transition ${
              form.useTrueSolarTime ? "ml-[22px]" : "ml-0.5"
            }`}
          />
        </button>
      </div>

      {/* 提交 */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-gradient-to-r from-gold-400/80 to-brass-300/60 py-3 text-sm font-medium text-ink-950 transition hover:from-gold-400 hover:to-brass-300 disabled:opacity-50"
      >
        {isLoading ? "排盘中…" : "开始排盘"}
      </button>
    </form>
  );
}
