# 玄爻阁

基于 Next.js、TypeScript 与 Tailwind CSS 的六爻占卜排盘网站。项目实现三枚铜钱起卦、本卦/变卦计算、动爻标记、结构化解读参考与本地历史记录。

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://localhost:3000` 预览。

## 自检

```bash
npm run typecheck
npm run build
```

## 部署到 Vercel

1. 将 `xuanyao-ge` 目录提交到 Git 仓库。
2. 在 Vercel 新建项目并选择该仓库。
3. 如果仓库根目录不是 `xuanyao-ge`，在 Vercel 的 Root Directory 填写 `xuanyao-ge`。
4. Framework Preset 选择 Next.js。
5. Build Command 使用默认 `npm run build`。
6. Install Command 使用默认 `npm install`。
7. 点击 Deploy。
