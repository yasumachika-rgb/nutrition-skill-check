"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from "recharts";

/* ---------- データ ---------- */

const CATEGORIES = [
  {
    name: "アセスメントスキル",
    short: "1. アセスメント\nスキル",
    desc:
      "対象者の生活習慣・健康状態・食事内容を的確に把握し、課題や強みを明確化する力です。根拠に基づいた判断で、適切な栄養指導の基盤を作ります。",
  },
  {
    name: "コミュニケーションスキル",
    short: "2. コミュニケーション\nスキル",
    desc:
      "対象者が安心して本音を話せる関係を築き、傾聴と承認を通じて信頼を得る力です。相手のペースに合わせた対話が、指導効果を大きく高めます。",
  },
  {
    name: "行動変容支援スキル",
    short: "3. 行動変容\n支援スキル",
    desc:
      "対象者が無理なく行動を変えられるように動機づけ、習慣化をサポートする力です。小さな成功体験を積ませることで、継続的な変化を導きます。",
  },
  {
    name: "情報整理・伝達スキル",
    short: "4. 情報整理・\n伝達スキル",
    desc:
      "多くの情報の中から要点を整理し、優先順位をつけて分かりやすく伝える力です。相手の理解度に合わせた伝え方が、納得と行動につながります。",
  },
  {
    name: "継続支援スキル",
    short: "5. 継続支援スキル",
    desc:
      "対象者の生活背景に配慮しながら、つまずいても前向きに続けられるよう支える力です。柔軟な軌道修正が、長期的な成果を生み出します。",
  },
];

const QUESTIONS = [
  // 1〜5 アセスメント
  "面談の目的を理解し、事前情報をもとに、面談で何を話すか・何をゴールにするかを考えて準備している",
  "検査値や食事記録を見たときに、「なぜこの結果になっているか」の原因を仮説として立てることができる",
  "対象者が話していることと、実際の数値や行動との間にギャップがあるとき、違和感を持つことができる",
  "初回面談で体重目標以外に、対象者が『どんな状態を目指したいか』を具体的に聞き取りができている",
  "対象者の悩みや課題に対して、適切なアプローチと対策を発見することができ、効果的な行動目標を設定できる",
  // 6〜10 コミュニケーション
  "対象者と管理栄養士の話す割合が7：3で、対象者の話を遮らずに最後まで聴くようにしている",
  "達成できた行動や挑戦してみた行動に対して、小さなものでも対象者の努力として承認している",
  "相手が安心して話せるよう、表情・姿勢・アイコンタクトを意識して表現している",
  "難しい専門用語を避けて、対象者が理解しやすい言葉や世間一般的な言葉で説明している",
  "話すスピード、声のトーン、言葉選び、相槌を含め、対象者のペースに合わせた会話ができている",
  // 11〜15 行動変容支援
  "面談開始直後に、安心感を作るアイスブレイクの時間を設けるようにしている",
  "対象者の行動変容ステージ（関心期・準備期など）を見極めてサポートを進めている",
  "対象者自身が「できそう」と思える行動目標を一緒に設定している、またその意思を確認している",
  "対象者が自分では気づいていない良さや変化を言語化して、新しい気づきになるような声かけをしている",
  "対象者の不安や罪悪感など、食事・食習慣にまつわる気持ちにも目を向けて話を聞いている",
  // 16〜20 情報整理・伝達
  "面談の途中で、これは改善すると効果的だなと思うポイントをすぐにピックアップできる",
  "対象者が話した内容をテーマごとに整理し、要点をまとめて確認し同意を得ることができている",
  "伝えるべき内容を「今一番大事なこと」に絞って優先順位をつけ、順番にわかりやすく伝えられる",
  "伝えたい内容を、例え話を使ったり図解をもとにわかりやすく伝える努力をしている",
  "相手の表情や反応を見ながら、その場で言い方や説明の仕方を変えるようにしている",
  // 21〜25 継続支援
  "対象者の生活リズムや価値観に配慮して指導内容を柔軟に変えている（例：外食が多い、夜勤があるなど）",
  "対象者ができないと感じている理由を一緒に探して、それを乗り越えるための方法を提案している",
  "前回の目標やアドバイスについて、その後どうだったかを次回面談で必ず確認している",
  "結果が出ていなくても、責めずに前向きに継続したくなるような声かけや目標の見直しを促している",
  "指導の途中でうまくいかないときに、1つのことに固執せず別のやり方や改善方法を一緒に考えている",
];

const GRADES = {
  A: {
    label: "A",
    color: "#2E7D32",
    summary:
      "栄養指導に必要なスキルが高いレベルで身についています。対象者一人ひとりに寄り添った、質の高い指導ができています。この強みをさらに磨き、専門性を深めていきましょう。",
  },
  B: {
    label: "B",
    color: "#1565C0",
    summary:
      "栄養指導に必要なスキルがバランスよく身についています。実務で安定した成果を出せる土台があります。弱点を意識的に強化することで、さらに上のレベルを目指せます。",
  },
  C: {
    label: "C",
    color: "#E0473D",
    summary:
      "基礎的なスキルは習得済みで実務に活かせますが、まだ改善の余地があります。弱点を意識して経験を積むことで、着実に成長できます。",
  },
  D: {
    label: "D",
    color: "#9E9E9E",
    summary:
      "これから伸びしろが大きい段階です。まずは基礎スキルを一つずつ確実に身につけていきましょう。弱点を知ることが、成長への第一歩です。",
  },
};

const gradeOf = (t) => (t >= 21 ? "A" : t >= 16 ? "B" : t >= 11 ? "C" : "D");

/* ---------- 色 ---------- */
const ACCENT = "#C25E7C";      // ローズ（イントロ・操作系）
const BAR = "#D27D92";         // レポートのセクション帯（くすみピンク）
const SCORE_BLUE = "#C04B82";  // 点数ライン（ローズ）
const FULL_RED = "#A8A0A4";    // 満点ライン（ウォームグレー）

/* ---------- レーダーの軸ラベル（多行対応） ---------- */
function AngleTick({ payload, x, y, cx, cy }) {
  const lines = String(payload.value).split("\n");
  const anchor = x > cx + 8 ? "start" : x < cx - 8 ? "end" : "middle";
  const startDy = y < cy - 8 ? -(lines.length - 1) * 15 - 2 : y > cy + 8 ? 6 : 4;
  return (
    <text x={x} y={y} textAnchor={anchor} fill="#3a3a44" fontSize={12} fontWeight={600}>
      {lines.map((ln, i) => (
        <tspan key={i} x={x} dy={i === 0 ? startDy : 15}>{ln}</tspan>
      ))}
    </text>
  );
}

export default function SkillCheck() {
  const [step, setStep] = useState("intro"); // intro | quiz | report
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [answers, setAnswers] = useState(Array(25).fill(null));
  const [page, setPage] = useState(0); // カテゴリページ 0-4
  const [pdfBusy, setPdfBusy] = useState(false);
  const reportRef = useRef(null);

  const scores = useMemo(
    () =>
      CATEGORIES.map((_, c) =>
        answers.slice(c * 5, c * 5 + 5).reduce((s, v) => s + (v || 0), 0)
      ),
    [answers]
  );
  const total = scores.reduce((a, b) => a + b, 0);
  const grade = gradeOf(total);

  const radarData = CATEGORIES.map((c, i) => ({
    subject: c.short,
    点数: scores[i],
    満点: 5,
  }));

  const weakest = useMemo(
    () =>
      CATEGORIES.map((c, i) => ({ i, name: c.name, desc: c.desc, score: scores[i] }))
        .sort((a, b) => a.score - b.score || a.i - b.i)
        .slice(0, 2),
    [scores]
  );

  const today = new Date();
  const dateStr = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, "0")}/${String(today.getDate()).padStart(2, "0")}`;

  const validateIntro = () => {
    const e = {};
    if (!name.trim()) e.name = "LINEの表示名（お名前）を入力してください";
    if (!email.trim()) e.email = "メールアドレスを入力してください";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "メールアドレスの形式を確認してください";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const pageAnswered = answers.slice(page * 5, page * 5 + 5).every((v) => v !== null);
  const answeredCount = answers.filter((v) => v !== null).length;

  const savedRef = useRef(false);
  const saveResult = async () => {
    if (savedRef.current) return; // 二重送信を防ぐ
    savedRef.current = true;
    try {
      await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          score_assessment: scores[0],
          score_communication: scores[1],
          score_behavior: scores[2],
          score_organization: scores[3],
          score_continuation: scores[4],
          total,
          grade,
          answers,
        }),
      });
    } catch (e) {
      console.error("保存に失敗しました", e);
      // 保存に失敗しても診断結果の表示は続行する
    }
  };

  const setAnswer = (qi, v) =>
    setAnswers((prev) => {
      const next = [...prev];
      next[qi] = v;
      return next;
    });

  const downloadPDF = async () => {
    if (!reportRef.current || pdfBusy) return;
    setPdfBusy(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF("p", "mm", "a4");
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 8;
      const maxW = pageW - margin * 2;
      const maxH = pageH - margin * 2;
      // 幅・高さの両方に収まるよう、全体を縮小して1ページに配置
      const ratio = Math.min(maxW / canvas.width, maxH / canvas.height);
      const imgW = canvas.width * ratio;
      const imgH = canvas.height * ratio;
      const x = (pageW - imgW) / 2;
      pdf.addImage(imgData, "JPEG", x, margin, imgW, imgH);
      const safe = (name || "result").replace(/[\\/:*?"<>|\s]/g, "_");
      pdf.save(`栄養指導スキルチェック_${safe}.pdf`);
    } catch (e) {
      console.error(e);
      alert("PDFの作成に失敗しました。お手数ですが、もう一度お試しください。");
    } finally {
      setPdfBusy(false);
    }
  };

  const isA = grade === "A";
  const pointHeader = isA ? "さらに磨きをかけたいポイント" : "改善ポイント";

  return (
    <div style={{ fontFamily: '"Noto Sans JP","Hiragino Kaku Gothic ProN","Yu Gothic",sans-serif', background: "#fbf3f5", minHeight: "100%", padding: "24px 12px", color: "#2b2b33" }}>

      {/* ================= INTRO ================= */}
      {step === "intro" && (
        <div style={{ maxWidth: 560, margin: "0 auto", background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
          <img src="/banner.png" alt="栄養指導スキルチェック" style={{ display: "block", width: "100%", height: "auto" }} />
          <div style={{ padding: "28px 32px 40px" }}>
            <div style={{ fontSize: 13, letterSpacing: 2, color: ACCENT, fontWeight: 700, marginBottom: 10 }}>FREE SKILL CHECK</div>
            <p style={{ fontSize: 14.5, lineHeight: 1.9, color: "#55555f", margin: "0 0 24px" }}>
              全25問・約5分で、あなたの「栄養指導スキル」を5つの観点から診断します。<br />
              強みと弱点が見える化され、次に何を磨けばいいかが分かります。
            </p>

            <div style={{ borderTop: "1px solid #eee", paddingTop: 24 }}>
              <Field label="LINEの表示名（お名前）" required error={errors.name}>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="例）安間智華"
                  style={inputStyle(errors.name)} />
              </Field>
              <Field label="メールアドレス" required error={errors.email}>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@mail.com" inputMode="email"
                  style={inputStyle(errors.email)} />
              </Field>
              <p style={{ fontSize: 12, color: "#999", margin: "4px 0 20px" }}>※ 診断結果の確認・お届けに使用します。</p>
              <button
                onClick={() => { if (validateIntro()) { setStep("quiz"); window.scrollTo(0, 0); } }}
                style={primaryBtn}>
                診断をはじめる
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= QUIZ ================= */}
      {step === "quiz" && (
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "28px 24px 24px", boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
            {/* progress */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#777", marginBottom: 6 }}>
                <span>カテゴリ {page + 1} / 5</span>
                <span>{answeredCount} / 25 問</span>
              </div>
              <div style={{ height: 6, background: "#F5E3E8", borderRadius: 99 }}>
                <div style={{ height: "100%", width: `${(answeredCount / 25) * 100}%`, background: ACCENT, borderRadius: 99, transition: "width .25s" }} />
              </div>
            </div>

            <h2 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 4px", color: ACCENT }}>
              {CATEGORIES[page].name}
            </h2>
            <p style={{ fontSize: 13, color: "#888", margin: "0 0 18px" }}>あてはまるものを選んでください</p>

            {QUESTIONS.slice(page * 5, page * 5 + 5).map((q, idx) => {
              const qi = page * 5 + idx;
              return (
                <div key={qi} style={{ padding: "16px 0", borderTop: idx === 0 ? "none" : "1px solid #f0eef4" }}>
                  <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                    <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: 99, background: "#FBEEF1", color: ACCENT, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{qi + 1}</span>
                    <span style={{ fontSize: 14, lineHeight: 1.7 }}>{q}</span>
                  </div>
                  <div style={{ display: "flex", gap: 10, paddingLeft: 34 }}>
                    {[{ v: 1, t: "はい" }, { v: 0, t: "いいえ" }].map((o) => {
                      const on = answers[qi] === o.v;
                      return (
                        <button key={o.v} onClick={() => setAnswer(qi, o.v)} style={choiceBtn(on)}>
                          {o.t}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              {page > 0 && (
                <button onClick={() => { setPage(page - 1); window.scrollTo(0, 0); }} style={ghostBtn}>戻る</button>
              )}
              <button
                disabled={!pageAnswered}
                onClick={() => {
                  if (page < 4) { setPage(page + 1); window.scrollTo(0, 0); }
                  else { saveResult(); setStep("report"); window.scrollTo(0, 0); }
                }}
                style={{ ...primaryBtn, opacity: pageAnswered ? 1 : 0.4, cursor: pageAnswered ? "pointer" : "not-allowed", flex: 1 }}>
                {page < 4 ? "次へ" : "結果を見る"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= REPORT ================= */}
      {step === "report" && (
        <>
        <div ref={reportRef} style={{ maxWidth: 860, margin: "0 auto", background: "#fff", borderRadius: 12, padding: "32px 36px 40px", boxShadow: "0 1px 3px rgba(0,0,0,.08)" }}>
          {/* header row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
            <div style={{ flex: "1 1 360px" }}>
              <div style={{ display: "inline-block", background: BAR, color: "#fff", fontWeight: 700, fontSize: 18, padding: "8px 18px", borderRadius: 4, marginBottom: 16, fontFamily: '"Noto Serif JP",serif' }}>
                【栄養指導スキルチェックレポート】
              </div>
              <table style={{ borderCollapse: "collapse", width: "100%", maxWidth: 420, fontSize: 13.5 }}>
                <tbody>
                  {[["お名前", name], ["メールアドレス", email], ["チェック日", dateStr]].map(([k, v]) => (
                    <tr key={k}>
                      <th style={{ ...cell, background: "#FAEEF1", width: 120, textAlign: "left", fontWeight: 700 }}>{k}</th>
                      <td style={{ ...cell, textAlign: "center" }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* score box */}
            <table style={{ borderCollapse: "collapse", fontSize: 14 }}>
              <tbody>
                <tr>
                  <th style={{ ...cell, background: "#FAEEF1", fontWeight: 700, padding: "8px 24px" }}>点数</th>
                  <th style={{ ...cell, background: "#EFB6C5", fontWeight: 700, padding: "8px 24px" }}>判定結果</th>
                </tr>
                <tr>
                  <td style={{ ...cell, fontSize: 28, fontWeight: 700, padding: "14px 24px", textAlign: "center" }}>{total}</td>
                  <td style={{ ...cell, fontSize: 28, fontWeight: 700, color: GRADES[grade].color, padding: "14px 24px", textAlign: "center" }}>{GRADES[grade].label}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* radar */}
          <SectionBar>栄養指導スキル結果</SectionBar>
          <div style={{ border: "1px solid #e2e2e2", borderTop: "none", padding: "16px 8px 8px" }}>
            <div style={{ display: "flex", gap: 22, paddingLeft: 16, fontSize: 13 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 11, height: 11, borderRadius: 99, background: SCORE_BLUE, display: "inline-block" }} />点数
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 16, height: 3, background: FULL_RED, display: "inline-block" }} />満点
              </span>
            </div>
            <div style={{ width: "100%", height: 420 }}>
              <ResponsiveContainer>
                <RadarChart data={radarData} outerRadius="68%" margin={{ top: 24, right: 70, bottom: 24, left: 70 }}>
                  <PolarGrid stroke="#cfcfcf" />
                  <PolarAngleAxis dataKey="subject" tick={<AngleTick />} />
                  <PolarRadiusAxis angle={90} domain={[0, 5]} tickCount={6} tick={{ fontSize: 11, fill: "#888" }} stroke="#cfcfcf" />
                  <Radar name="満点" dataKey="満点" stroke={FULL_RED} fill="none" strokeWidth={2} dot={false} />
                  <Radar name="点数" dataKey="点数" stroke={SCORE_BLUE} fill={SCORE_BLUE} fillOpacity={0.12} strokeWidth={2}
                    dot={{ r: 4, fill: SCORE_BLUE, strokeWidth: 0 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* category table */}
          <table style={{ borderCollapse: "collapse", width: "100%", marginTop: 22, fontSize: 13.5 }}>
            <thead>
              <tr>
                <th style={{ ...cell, background: BAR, color: "#fff", textAlign: "left" }}>カテゴリ</th>
                <th style={{ ...cell, background: BAR, color: "#fff", width: 110 }}>点数</th>
                <th style={{ ...cell, background: BAR, color: "#fff", width: 110 }}>満点</th>
              </tr>
            </thead>
            <tbody>
              {CATEGORIES.map((c, i) => (
                <tr key={c.name}>
                  <td style={{ ...cell, textAlign: "left" }}>{i + 1}. {c.name}</td>
                  <td style={{ ...cell, textAlign: "center" }}>{scores[i]}</td>
                  <td style={{ ...cell, textAlign: "center", background: "#FAF1F4" }}>5</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* comments */}
          <div style={{ marginTop: 26 }}>
            <SectionBar>結果・改善ポイント</SectionBar>
          </div>
          <div style={{ border: "1px solid #e2e2e2", borderTop: "none", padding: "18px 20px 22px" }}>
            <Comment title="総評" body={GRADES[grade].summary} />
            {weakest.map((w, idx) => (
              <Comment key={w.i}
                title={`${pointHeader}${idx + 1}　${w.name}`}
                body={w.desc} />
            ))}
          </div>

        </div>

          <div style={{ maxWidth: 860, margin: "18px auto 0", display: "flex", gap: 12 }}>
            <button onClick={downloadPDF} disabled={pdfBusy}
              style={{ ...primaryBtn, flex: 1, opacity: pdfBusy ? 0.6 : 1, cursor: pdfBusy ? "wait" : "pointer" }}>
              {pdfBusy ? "PDFを作成中…" : "結果をPDFでダウンロード"}
            </button>
            <button onClick={() => { setStep("intro"); setAnswers(Array(25).fill(null)); setPage(0); window.scrollTo(0, 0); }}
              style={{ ...ghostBtn, flex: 1 }}>もう一度診断する</button>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- 小コンポーネント / スタイル ---------- */
function Field({ label, required, error, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 13.5, fontWeight: 600, marginBottom: 7 }}>
        {label} {required && <span style={{ color: "#E0473D" }}>*</span>}
      </label>
      {children}
      {error && <p style={{ color: "#E0473D", fontSize: 12.5, margin: "6px 0 0" }}>{error}</p>}
    </div>
  );
}
function SectionBar({ children }) {
  return (
    <div style={{ background: BAR, color: "#fff", fontWeight: 700, fontSize: 14, padding: "8px 14px" }}>{children}</div>
  );
}
function Comment({ title, body }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontWeight: 700, fontSize: 14, color: "#33333b", marginBottom: 4 }}>▶ {title}</div>
      <p style={{ fontSize: 13.5, lineHeight: 1.9, margin: 0, color: "#4a4a52" }}>{body}</p>
    </div>
  );
}
const cell = { border: "1px solid #cfcfcf", padding: "7px 12px" };
const inputStyle = (err) => ({
  width: "100%", boxSizing: "border-box", padding: "11px 13px", fontSize: 14,
  border: `1px solid ${err ? "#E0473D" : "#E6D2D8"}`, borderRadius: 8, outline: "none",
});
const primaryBtn = {
  width: "100%", padding: "13px 16px", fontSize: 15, fontWeight: 700, color: "#fff",
  background: ACCENT, border: "none", borderRadius: 8, cursor: "pointer",
};
const ghostBtn = {
  padding: "13px 20px", fontSize: 14.5, fontWeight: 700, color: ACCENT,
  background: "#fff", border: `1.5px solid ${ACCENT}`, borderRadius: 8, cursor: "pointer",
};
const choiceBtn = (on) => ({
  flex: 1, padding: "10px 8px", fontSize: 14, fontWeight: 700, borderRadius: 8, cursor: "pointer",
  color: on ? "#fff" : "#666", background: on ? ACCENT : "#fff",
  border: `1.5px solid ${on ? ACCENT : "#ECD9DF"}`, transition: "all .12s",
});
