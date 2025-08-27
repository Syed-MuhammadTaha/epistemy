import { NextResponse } from "next/server";
import { getSession, getStudentBySessionId, getQuizQuestionsBySessionId } from "@/lib/data";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string; sessionId: string }> }) {
  const { sessionId } = await params;
  const session = await getSession(sessionId);
  if (!session) {
    return new NextResponse("Session not found", { status: 404 });
    }
  const student = await getStudentBySessionId(sessionId);
  const questions = await getQuizQuestionsBySessionId(sessionId);

  const styles = `
    * { box-sizing: border-box; }
    body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"; color: #0f172a; margin: 0; }
    .container { max-width: 800px; margin: 0 auto; padding: 32px; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e5e7eb; padding-bottom: 16px; margin-bottom: 24px; }
    .brand { display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 20px; color: #0ea5e9; }
    .title { font-size: 28px; font-weight: 700; margin: 8px 0 0; color: #111827; }
    .meta { display: flex; gap: 12px; color: #6b7280; font-size: 12px; margin-top: 8px; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; border: 1px solid #e5e7eb; font-size: 12px; }
    h2 { font-size: 18px; font-weight: 700; margin: 24px 0 8px; }
    .section { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin-top: 16px; }
    .list { margin: 0; padding-left: 18px; }
    .quiz { margin-top: 12px; }
    .question { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; margin-top: 12px; }
    .subtle { color: #6b7280; font-size: 12px; }
    .subtopic { display: inline-block; padding: 2px 8px; border-radius: 9999px; background: #f1f5f9; color: #334155; font-size: 12px; margin-left: 8px; }
    .opts { margin-top: 8px; padding-left: 18px; }
    .opt { font-size: 14px; margin: 2px 0; list-style: disc; }
    @media print { .no-print { display: none; } }
  `;

  const html = `<!doctype html>
  <html>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Session Export - ${escapeHtml(session.title)}</title>
      <style>${styles}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div>
            <div class="brand">Epistemy</div>
            <div class="title">${escapeHtml(session.title)}</div>
            <div class="meta">
              <span><strong>Student:</strong> ${escapeHtml(student?.display_name || 'Unassigned')}</span>
              <span><strong>Subject:</strong> ${escapeHtml(session.subject)}</span>
              <span><strong>Date:</strong> ${new Date(session.date).toLocaleDateString()}</span>
              <span class="badge">${escapeHtml(session.status)}</span>
            </div>
          </div>
          <div class="no-print">
            <button onclick="window.print()" style="padding:8px 12px;border:1px solid #e5e7eb;border-radius:8px;background:#fff;cursor:pointer;">Print / Save PDF</button>
          </div>
        </div>

        <h2>Overview</h2>
        <div class="section">
          <div><strong>Main topic:</strong> ${escapeHtml(session.main_topic)}</div>
          ${session.topics?.length ? `<div style=\"margin-top:6px;\"><strong>Subtopics:</strong> ${session.topics.map(escapeHtml).join(', ')}</div>` : ''}
          ${session.progress_feedback ? `<div style=\"margin-top:10px;\"><strong>Progress evaluation:</strong><div class=\"subtle\" style=\"margin-top:4px;white-space:pre-wrap;\">${escapeHtml(session.progress_feedback)}</div></div>` : ''}
        </div>

        <h2>Practice Quiz</h2>
        <div class="section quiz">
          ${questions.map((q, i) => `
            <div class="question">
              <div><strong>Q${i + 1}.</strong> ${escapeHtml(q.question)} <span class="subtopic">${escapeHtml(q.subtopic)}</span></div>
              <ul class="opts">
                ${q.options.map((opt) => `<li class="opt">${escapeHtml(opt)}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      </div>
      <script>if (typeof window !== 'undefined') { setTimeout(() => window.print(), 150); }</script>
    </body>
  </html>`;

  return new NextResponse(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
    },
  });
}

function escapeHtml(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
