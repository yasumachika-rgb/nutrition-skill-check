// 診断結果を Supabase に保存するサーバー側API
// service_role キーはサーバー内でのみ使用し、ブラウザには公開されません。

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SERVICE_KEY) {
      return Response.json(
        { error: "サーバーの設定（環境変数）が未登録です。" },
        { status: 500 }
      );
    }

    const body = await request.json();

    // 必須項目の簡易チェック
    if (!body || !body.name || !body.email) {
      return Response.json({ error: "必須項目が不足しています。" }, { status: 400 });
    }

    // 保存する列だけを取り出す（想定外の値が混ざらないように整える）
    const row = {
      name: String(body.name).slice(0, 200),
      email: String(body.email).slice(0, 200),
      score_assessment: Number(body.score_assessment) || 0,
      score_communication: Number(body.score_communication) || 0,
      score_behavior: Number(body.score_behavior) || 0,
      score_organization: Number(body.score_organization) || 0,
      score_continuation: Number(body.score_continuation) || 0,
      total: Number(body.total) || 0,
      grade: String(body.grade || "").slice(0, 4),
      answers: Array.isArray(body.answers) ? body.answers : [],
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/skill_check_results`, {
      method: "POST",
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(row),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("Supabase保存エラー:", detail);
      return Response.json({ error: "保存に失敗しました。" }, { status: 500 });
    }

    return Response.json({ ok: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "サーバーエラーが発生しました。" }, { status: 500 });
  }
}
