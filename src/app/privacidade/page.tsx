import React from 'react';

export const metadata = {
  title: 'Política de Privacidade — EasyList',
  description: 'Política de Privacidade do EasyList — como coletamos e usamos seus dados.',
};

export default function PrivacidadePage() {
  return (
    <div className="legal-page">
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 40px', background: 'rgba(248,246,242,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #EDEAE3' }}>
        <a href="/" style={{ fontFamily: "'Fraunces', serif", fontSize: '22px', fontWeight: 700, color: '#E8503A', textDecoration: 'none' }}>
          easy<span style={{ color: '#1C1A17', fontWeight: 300 }}>list</span>
        </a>
        <a href="/" style={{ fontSize: '14px', color: '#6B6560', textDecoration: 'none' }}>← Voltar</a>
      </nav>

      <div className="legal-content">
        <div className="legal-badge">Legal</div>
        <h1 className="legal-title">Política de Privacidade</h1>
        <p className="legal-updated">Última atualização: 17 de março de 2026</p>

        <section className="legal-section">
          <p>O <strong>EasyList</strong> respeita sua privacidade e está comprometido em proteger seus dados pessoais de acordo com a <strong>Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)</strong> e demais regulamentações aplicáveis.</p>
        </section>

        <section className="legal-section">
          <h2>1. Dados que Coletamos</h2>
          <p>Coletamos os seguintes dados ao utilizar o EasyList:</p>
          <ul>
            <li><strong>Dados de cadastro:</strong> nome, endereço de e-mail, foto de perfil (quando via Google).</li>
            <li><strong>Dados de uso:</strong> tarefas criadas, projetos, rotinas, preferências de configuração.</li>
            <li><strong>Dados de pagamento:</strong> processados exclusivamente pelo Stripe. Não armazenamos dados de cartão de crédito.</li>
            <li><strong>Dados técnicos:</strong> endereço IP, tipo de dispositivo, navegador, idioma, logs de erro.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>2. Como Utilizamos seus Dados</h2>
          <p>Seus dados são utilizados para:</p>
          <ul>
            <li>Fornecer, manter e melhorar os serviços do EasyList</li>
            <li>Autenticar sua identidade e proteger sua conta</li>
            <li>Processar pagamentos e gerenciar assinaturas</li>
            <li>Enviar comunicações relevantes sobre o serviço (emails transacionais)</li>
            <li>Analisar padrões de uso para melhorias do produto</li>
            <li>Cumprir obrigações legais</li>
          </ul>
          <p><strong>Não vendemos seus dados pessoais a terceiros.</strong></p>
        </section>

        <section className="legal-section">
          <h2>3. Compartilhamento de Dados</h2>
          <p>Compartilhamos seus dados somente com:</p>
          <ul>
            <li><strong>Stripe:</strong> processamento seguro de pagamentos.</li>
            <li><strong>Neon (PostgreSQL):</strong> armazenamento seguro do banco de dados.</li>
            <li><strong>Resend:</strong> envio de emails transacionais.</li>
            <li><strong>Autoridades legais:</strong> quando exigido por lei ou ordem judicial.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>4. Armazenamento e Segurança</h2>
          <p>Seus dados são armazenados em servidores seguros na nuvem com criptografia em trânsito (HTTPS/TLS) e em repouso. Aplicamos senhas com hash (bcrypt), autenticação segura e controles de acesso rigorosos.</p>
          <p>Mantemos seus dados pelo período em que sua conta estiver ativa. Após a exclusão da conta, os dados são removidos em até 30 dias úteis.</p>
        </section>

        <section className="legal-section">
          <h2>5. Seus Direitos (LGPD)</h2>
          <p>Como titular dos dados, você tem direito a:</p>
          <ul>
            <li>Confirmar a existência de tratamento de dados pessoais</li>
            <li>Acessar seus dados pessoais</li>
            <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
            <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários</li>
            <li>Portabilidade dos dados a outro fornecedor</li>
            <li>Revogar o consentimento para tratamento dos dados</li>
            <li>Solicitar a exclusão completa da sua conta e dados</li>
          </ul>
          <p>Para exercer seus direitos, acesse Configurações → Excluir conta ou entre em contato via email.</p>
        </section>

        <section className="legal-section">
          <h2>6. Cookies</h2>
          <p>Utilizamos cookies essenciais para autenticação e funcionamento do serviço. Não utilizamos cookies de rastreamento de terceiros para fins publicitários. Você pode desativar cookies no seu navegador, mas isso pode afetar o funcionamento do EasyList.</p>
        </section>

        <section className="legal-section">
          <h2>7. Menores de Idade</h2>
          <p>O EasyList não coleta conscientemente dados de crianças menores de 13 anos. Se você acredita que um menor forneceu dados sem autorização, entre em contato para que possamos remover as informações.</p>
        </section>

        <section className="legal-section">
          <h2>8. Alterações nesta Política</h2>
          <p>Podemos atualizar esta Política periodicamente. Notificaremos você por email sobre mudanças significativas. O uso continuado do EasyList após as alterações constitui aceitação da nova política.</p>
        </section>

        <section className="legal-section">
          <h2>9. Contato e DPO</h2>
          <p>Para questões relacionadas à privacidade e proteção de dados:</p>
          <p><strong>Email:</strong> <a href="mailto:easylist.oficial@gmail.com">easylist.oficial@gmail.com</a></p>
          <p><strong>Assunto:</strong> [LGPD] + sua solicitação</p>
          <p>Responderemos em até 15 dias úteis.</p>
        </section>
      </div>

      <footer style={{ background: '#1C1A17', padding: '32px 40px', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: '20px', fontWeight: 700, color: '#E8503A', marginBottom: '8px' }}>easy<span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 300 }}>list</span></div>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>© 2026 EasyList. Feito com ❤️ no Brasil.</p>
      </footer>
    </div>
  );
}
