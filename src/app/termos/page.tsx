import React from 'react';

export const metadata = {
  title: 'Termos de Uso — EasyList',
  description: 'Termos de Uso do EasyList — leia nossas condições de uso.',
};

export default function TermosPage() {
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
        <h1 className="legal-title">Termos de Uso</h1>
        <p className="legal-updated">Última atualização: 17 de março de 2026</p>

        <section className="legal-section">
          <p>Bem-vindo ao <strong>EasyList</strong>. Ao criar uma conta e utilizar nossos serviços, você concorda com os termos e condições descritos abaixo. Leia com atenção antes de utilizar a plataforma.</p>
        </section>

        <section className="legal-section">
          <h2>1. Aceitação dos Termos</h2>
          <p>Ao acessar ou utilizar o EasyList, você confirma que leu, compreendeu e concorda em ficar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deve utilizar nossos serviços.</p>
        </section>

        <section className="legal-section">
          <h2>2. Descrição do Serviço</h2>
          <p>O EasyList é uma plataforma SaaS (Software como Serviço) de gestão de tarefas, rotinas e produtividade pessoal. Os serviços incluem:</p>
          <ul>
            <li>Criação e gerenciamento de tarefas e projetos</li>
            <li>Configuração de rotinas automáticas</li>
            <li>Dashboard de produtividade e estatísticas</li>
            <li>Sincronização em tempo real entre dispositivos</li>
            <li>Recursos premium mediante assinatura paga</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. Criação de Conta</h2>
          <p>Para utilizar o EasyList você deve:</p>
          <ul>
            <li>Ter pelo menos 13 anos de idade</li>
            <li>Fornecer informações verdadeiras, precisas e completas no cadastro</li>
            <li>Manter a confidencialidade de suas credenciais de acesso</li>
            <li>Notificar-nos imediatamente em caso de uso não autorizado da sua conta</li>
          </ul>
          <p>Você é responsável por todas as atividades realizadas em sua conta.</p>
        </section>

        <section className="legal-section">
          <h2>4. Planos e Cobranças</h2>
          <p>O EasyList oferece planos gratuito e pagos:</p>
          <ul>
            <li><strong>Plano Gratuito:</strong> acesso limitado a recursos básicos, sem custo.</li>
            <li><strong>Plano Pro (R$ 29,90/mês):</strong> tarefas, projetos e rotinas ilimitados, dashboard avançado.</li>
            <li><strong>Plano Premium (R$ 59,90/mês):</strong> todos os recursos do Pro + colaboração em equipe e suporte VIP.</li>
          </ul>
          <p>Os pagamentos são processados de forma segura via <strong>Stripe</strong>. Ao assinar um plano pago, você autoriza a cobrança recorrente mensal no cartão ou método de pagamento informado.</p>
        </section>

        <section className="legal-section">
          <h2>5. Cancelamento e Reembolso</h2>
          <p>Você pode cancelar sua assinatura a qualquer momento pelo portal do cliente acessado em Configurações → Gerenciar no Stripe. O cancelamento terá efeito ao final do período de faturamento vigente. Não realizamos reembolsos proporcionais por períodos não utilizados, salvo casos previstos em lei (ex: direito de arrependimento de 7 dias após a primeira contratação).</p>
        </section>

        <section className="legal-section">
          <h2>6. Uso Aceitável</h2>
          <p>Você concorda em não utilizar o EasyList para:</p>
          <ul>
            <li>Violar qualquer lei ou regulamentação aplicável</li>
            <li>Enviar conteúdo ilegal, ofensivo, difamatório ou prejudicial</li>
            <li>Tentar acessar sistemas ou contas de outros usuários sem autorização</li>
            <li>Praticar engenharia reversa ou copiar o software</li>
            <li>Sobrecarregar intencionalmente nossa infraestrutura</li>
          </ul>
          <p>Violações podem resultar em suspensão ou encerramento imediato da conta.</p>
        </section>

        <section className="legal-section">
          <h2>7. Propriedade Intelectual</h2>
          <p>O EasyList e todos os seus componentes (interface, código, marca, logotipo) são de propriedade exclusiva da EasyList. Você recebe uma licença limitada, não exclusiva e intransferível para usar o serviço conforme estes termos. Seus dados e conteúdos permanecem de sua propriedade.</p>
        </section>

        <section className="legal-section">
          <h2>8. Limitação de Responsabilidade</h2>
          <p>O EasyList não se responsabiliza por perdas de dados, lucros cessantes ou danos indiretos decorrentes do uso ou impossibilidade de uso do serviço. Nossa responsabilidade total não ultrapassará o valor pago pelo usuário nos últimos 3 meses.</p>
        </section>

        <section className="legal-section">
          <h2>9. Alterações nos Termos</h2>
          <p>Reservamos o direito de modificar estes Termos a qualquer momento. Alterações significativas serão comunicadas por email com pelo menos 15 dias de antecedência. O uso continuado do serviço após as alterações constitui aceitação dos novos termos.</p>
        </section>

        <section className="legal-section">
          <h2>10. Lei Aplicável e Foro</h2>
          <p>Estes Termos são regidos pelas leis da República Federativa do Brasil. Quaisquer disputas serão resolvidas no foro da Comarca de São Paulo – SP, com renúncia a qualquer outro.</p>
        </section>

        <section className="legal-section">
          <h2>11. Contato</h2>
          <p>Para dúvidas sobre estes Termos, entre em contato: <a href="mailto:easylist.oficial@gmail.com">easylist.oficial@gmail.com</a></p>
        </section>
      </div>

      <footer style={{ background: '#1C1A17', padding: '32px 40px', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: '20px', fontWeight: 700, color: '#E8503A', marginBottom: '8px' }}>easy<span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 300 }}>list</span></div>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>© 2026 EasyList. Feito com ❤️ no Brasil.</p>
      </footer>
    </div>
  );
}
