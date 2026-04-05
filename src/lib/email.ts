import { Resend } from 'resend';

// Give a dummy value if missing to prevent constructor crash
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_123');

export async function sendWelcomeEmail(user: { name: string; email: string }) {
  if (!process.env.RESEND_API_KEY) {
    console.log('[EMAIL] RESEND_API_KEY is not configured in .env. Skipping welcome email to:', user.email);
    return;
  }

  const firstName = user.name?.split(' ')[0] || 'usuário';

  try {
    await resend.emails.send({
      from: 'EasyList <onboarding@resend.dev>', // Change to easylist.oficial@gmail.com after domain verification
      to: user.email,
      subject: `Bem-vindo(a) ao EasyList, ${firstName}! 🎉`,
      html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Bem-vindo ao EasyList</title>
</head>
<body style="margin:0;padding:0;background-color:#F8F6F2;font-family:'Inter',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F6F2;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:#1C1A17;padding:32px 40px;text-align:center;">
              <div style="font-size:28px;font-weight:700;color:#E8503A;letter-spacing:-1px;">easy<span style="color:rgba(255,255,255,0.4);font-weight:300;">list</span></div>
              <div style="font-size:13px;color:rgba(255,255,255,0.4);margin-top:6px;">Sua agenda inteligente</div>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h1 style="font-size:28px;font-weight:700;color:#1C1A17;margin:0 0 12px 0;line-height:1.2;">
                Bem-vindo(a), ${firstName}! 👋
              </h1>
              <p style="font-size:16px;color:#6B6560;line-height:1.7;margin:0 0 24px 0;">
                Estamos muito felizes em ter você conosco. O <strong>EasyList</strong> foi criado para quem quer parar de improvisar e começar a executar com foco e consistência.
              </p>
              <p style="font-size:16px;color:#6B6560;line-height:1.7;margin:0 0 32px 0;">
                Com a sua conta gratuita, você já pode:
              </p>

              <!-- Feature List -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #EDEAE3;">
                    <table cellpadding="0" cellspacing="0"><tr>
                      <td style="width:32px;height:32px;border-radius:50%;background:#FEE2DD;text-align:center;vertical-align:middle;">
                        <span style="color:#E8503A;font-size:14px;">✓</span>
                      </td>
                      <td style="padding-left:14px;font-size:14px;color:#4A4540;font-weight:500;">Criar até 50 tarefas ativas</td>
                    </tr></table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #EDEAE3;">
                    <table cellpadding="0" cellspacing="0"><tr>
                      <td style="width:32px;height:32px;border-radius:50%;background:#FEE2DD;text-align:center;vertical-align:middle;">
                        <span style="color:#E8503A;font-size:14px;">✓</span>
                      </td>
                      <td style="padding-left:14px;font-size:14px;color:#4A4540;font-weight:500;">Organizar 2 projetos com cores</td>
                    </tr></table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #EDEAE3;">
                    <table cellpadding="0" cellspacing="0"><tr>
                      <td style="width:32px;height:32px;border-radius:50%;background:#FEE2DD;text-align:center;vertical-align:middle;">
                        <span style="color:#E8503A;font-size:14px;">✓</span>
                      </td>
                      <td style="padding-left:14px;font-size:14px;color:#4A4540;font-weight:500;">Criar 1 rotina automática</td>
                    </tr></table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;">
                    <table cellpadding="0" cellspacing="0"><tr>
                      <td style="width:32px;height:32px;border-radius:50%;background:#FEE2DD;text-align:center;vertical-align:middle;">
                        <span style="color:#E8503A;font-size:14px;">✓</span>
                      </td>
                      <td style="padding-left:14px;font-size:14px;color:#4A4540;font-weight:500;">Acompanhar seu streak de produtividade</td>
                    </tr></table>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td align="center">
                    <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}"
                       style="display:inline-block;background:#E8503A;color:#FFFFFF;text-decoration:none;font-size:15px;font-weight:600;padding:16px 40px;border-radius:100px;letter-spacing:-0.01em;box-shadow:0 4px 14px rgba(232,80,58,0.3);">
                      Acessar minha conta →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size:14px;color:#9E9690;line-height:1.6;margin:0;border-top:1px solid #EDEAE3;padding-top:24px;">
                Se tiver qualquer dúvida, basta responder este email. Estamos aqui para ajudar! 💪<br/><br/>
                Com carinho,<br/>
                <strong style="color:#4A4540;">Time EasyList</strong>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#F8F6F2;padding:20px 40px;text-align:center;border-top:1px solid #EDEAE3;">
              <p style="font-size:12px;color:#B8B4AF;margin:0;">
                © 2026 EasyList. Feito com ❤️ no Brasil.<br/>
                <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/privacidade" style="color:#B8B4AF;">Política de Privacidade</a> &nbsp;·&nbsp;
                <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/termos" style="color:#B8B4AF;">Termos de Uso</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });
  } catch (error) {
    // Email failure should NOT crash registration
    console.error('[EMAIL] Failed to send welcome email:', error);
  }
}
