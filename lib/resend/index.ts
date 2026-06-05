import 'server-only'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendInviteEmail({
  to,
  workspaceName,
  inviterName,
  role,
  inviteUrl,
}: {
  to: string
  workspaceName: string
  inviterName: string
  role: string
  inviteUrl: string
}): Promise<{ error?: string }> {
  const roleLabel = role === 'admin' ? 'Administrador' : 'Membro'

  const { error } = await resend.emails.send({
    from: 'PipeFlow CRM <onboarding@resend.dev>',
    to,
    subject: `Você foi convidado para ${workspaceName} no PipeFlow`,
    html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Convite PipeFlow</title>
</head>
<body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#111113;border:1px solid #27272a;border-radius:16px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid #27272a;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#7c3aed;width:36px;height:36px;border-radius:10px;text-align:center;vertical-align:middle;">
                    <span style="color:#fff;font-size:16px;font-weight:700;line-height:36px;">P</span>
                  </td>
                  <td style="padding-left:10px;">
                    <span style="color:#fff;font-size:18px;font-weight:600;letter-spacing:-0.3px;">PipeFlow</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <p style="margin:0 0 8px;color:#a1a1aa;font-size:13px;font-weight:500;text-transform:uppercase;letter-spacing:0.08em;">Convite recebido</p>
              <h1 style="margin:0 0 16px;color:#fafafa;font-size:22px;font-weight:700;line-height:1.3;">
                ${inviterName} convidou você para <span style="color:#a78bfa;">${workspaceName}</span>
              </h1>
              <p style="margin:0 0 24px;color:#71717a;font-size:15px;line-height:1.6;">
                Você foi convidado como <strong style="color:#a1a1aa;">${roleLabel}</strong>.
                Clique no botão abaixo para aceitar o convite e começar a usar o PipeFlow CRM.
              </p>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#7c3aed;border-radius:10px;">
                    <a href="${inviteUrl}" style="display:inline-block;padding:13px 28px;color:#fff;font-size:14px;font-weight:600;text-decoration:none;letter-spacing:-0.2px;">
                      Aceitar convite →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0;color:#52525b;font-size:13px;line-height:1.5;">
                Ou cole este link no navegador:<br />
                <a href="${inviteUrl}" style="color:#a78bfa;word-break:break-all;">${inviteUrl}</a>
              </p>

              <p style="margin:20px 0 0;color:#3f3f46;font-size:12px;">
                Este convite expira em 7 dias. Se você não esperava esse e-mail, pode ignorá-lo com segurança.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  })

  if (error) return { error: error.message }
  return {}
}
