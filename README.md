# 栄養指導スキルチェック

全25問・5カテゴリで栄養指導スキルを診断し、レーダーチャートと総評・改善ポイントを表示。
結果は **PDFでダウンロード** できます。Next.js（App Router）製で、Vercelにそのままデプロイできます。

---

## ローカルで動かす

```bash
npm install
npm run dev
```

ブラウザで http://localhost:3000 を開きます。

---

## Vercelにデプロイする

### 方法A：GitHub経由（おすすめ・自動デプロイ）

1. このフォルダを GitHub のリポジトリにプッシュします。
   ```bash
   git init
   git add .
   git commit -m "init"
   git branch -M main
   git remote add origin <あなたのリポジトリURL>
   git push -u origin main
   ```
2. https://vercel.com にログイン →「Add New… → Project」
3. 該当リポジトリを選択 → 設定はそのまま「Deploy」
   （Framework は自動で Next.js と判定されます）
4. 完了。以降は `git push` するたびに自動で更新されます。

### 方法B：Vercel CLI（手早く試す）

```bash
npm i -g vercel
vercel        # 初回はログイン＆質問にEnterでOK
vercel --prod # 本番公開
```

---

## 主なカスタマイズ箇所（`components/SkillCheck.jsx`）

| 変更したいもの | 場所 |
| --- | --- |
| 設問の文言 | `QUESTIONS` 配列（25問。5問ずつ各カテゴリに対応） |
| カテゴリ名・解説文 | `CATEGORIES` 配列 |
| 判定基準（A/B/C/D） | `gradeOf()` 関数（現状 A:21〜 / B:16〜 / C:11〜 / D:0〜） |
| 総評メッセージ | `GRADES` オブジェクト |
| 配色（ローズ系） | `ACCENT` / `BAR` / `SCORE_BLUE`（点数線）/ `FULL_RED`（満点線） |
| トップのバナー画像 | `public/banner.png` を差し替え（横長推奨：1600×400程度） |

---

## 仕組みメモ

- 入力（LINE表示名・メール）は必須。メール形式も簡易チェックします。
- PDFは `html2canvas` でレポートを画像化し、`jsPDF` でA4縦に出力します（クライアント側で完結。サーバー不要）。
- ファイル名は `栄養指導スキルチェック_<お名前>.pdf` になります。

## 次の拡張（任意）

現状、診断結果は画面表示とPDFのみで、データ保存はしていません。
回答内容を **Supabase に保存** したり、結果を **メールで自動送付** したい場合は、
`app/api/` にサーバールートを追加して実装できます（既存の diet-pfc-quiz と同じ構成）。
