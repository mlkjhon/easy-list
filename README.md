# 📝 EasyList

Um gerenciador de tarefas inteligente, focado em alta produtividade, organização de tempo e gamificação (streaks). Desenvolvido com **Next.js**, **Prisma**, **Neon (PostgreSQL)** e **NextAuth**.

## ✨ Funcionalidades

- 🚀 **Gestão de Tarefas**: Crie tarefas, defina prioridades, tempo estimado e organize por Projetos. Exclua ou edite rapidamente através dos ícones interativos.
- 📅 **Agendamento Inteligente & Prazos**: Tarefas agendadas para o futuro permanecem bloqueadas até a data certa. Saiba sempre quando uma tarefa vai expirar com as tags indicativas de indicando "Expira amanhã", "Expira hoje às 14:00" ou "⚠️ Atrasada". O sistema sugere um botão de "Reagendar" rapidamente se passarem do prazo.
- 🕒 **Rotinas**: Agrupe tarefas em blocos de tempo diários perfeitos para o seu ritmo (ex: Foco Profundo das 08:00 às 12:00).
- 🔥 **Gamificação**: Ganhe dias de "Streak" ao completar tarefas diárias e acompanhe seu rendimento, histórico da semana e total de tarefas abertas/concluídas em tempo real pelo Dashboard detalhado.
- 📱 **Responsivo**: Layout equipado com "Menu Mobile" (Hambúrguer) interativo e retrátil, perfeitamente adaptado para navegação em celulares, tablets ou telas pequenas.

## 🛠️ Tecnologias Utilizadas

- [Next.js (App Router)](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL (Neon DB)](https://neon.tech/)
- [NextAuth](https://next-auth.js.org/)
- [Lucide Icons](https://lucide.dev/)

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js (versão 18 ou superior).
- Um banco de dados PostgresSQL (ex: na Neon.tech).

### Passos

1. Configure suas variáveis de ambiente no arquivo `.env`:
```env
DATABASE_URL="postgres://..."
NEXTAUTH_SECRET="sua-chave-secreta"
NEXTAUTH_URL="http://localhost:3000"
```

2. Instale as dependências com o npm:
```bash
npm install
```

3. Geração das tipagens do Prisma e Sincronização com o Banco (`db push` ou migrations):
```bash
npx prisma generate
npx prisma db push
```

4. Rodar o servidor de desenvolvimento:
```bash
npm run dev
```

Pronto, agora basta acessar [localhost:3000](http://localhost:3000) no seu navegador, logar e começar a dominar sua rotina hoje mesmo!
