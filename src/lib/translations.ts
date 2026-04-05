export type Lang = 'pt' | 'en' | 'es';

export const translations = {
  // ---- Navigation / Tabs ----
  myDay: { pt: 'Meu Dia', en: 'My Day', es: 'Mi Día' },
  inbox: { pt: 'Caixa de Entrada', en: 'Inbox', es: 'Bandeja de Entrada' },
  important: { pt: 'Importantes', en: 'Important', es: 'Importantes' },
  thisWeek: { pt: 'Esta Semana', en: 'This Week', es: 'Esta Semana' },
  routines: { pt: 'Rotinas', en: 'Routines', es: 'Rutinas' },
  completed: { pt: 'Concluídas', en: 'Completed', es: 'Completadas' },
  dashboard: { pt: 'Dashboard', en: 'Dashboard', es: 'Panel' },
  myProfile: { pt: 'Meu Perfil', en: 'My Profile', es: 'Mi Perfil' },
  settings: { pt: 'Configurações', en: 'Settings', es: 'Ajustes' },
  plans: { pt: 'Planos', en: 'Plans', es: 'Planes' },
  projects: { pt: 'Projetos', en: 'Projects', es: 'Proyectos' },
  newProject: { pt: '+ Novo projeto', en: '+ New project', es: '+ Nuevo proyecto' },
  menu: { pt: 'Menu', en: 'Menu', es: 'Menú' },

  // ---- Greetings by time ----
  goodMorning: { pt: 'Bom dia', en: 'Good morning', es: 'Buenos días' },
  goodAfternoon: { pt: 'Boa tarde', en: 'Good afternoon', es: 'Buenas tardes' },
  goodEvening: { pt: 'Boa noite', en: 'Good evening', es: 'Buenas noches' },

  // ---- Banner / My Day ----
  todayOverview: { pt: 'O que te espera hoje:', en: "Here's your day:", es: 'Tu día de hoy:' },
  tasksDueToday: { pt: 'tarefas para hoje', en: 'tasks due today', es: 'tareas para hoy' },
  overdueTask: { pt: 'tarefa atrasada', en: 'overdue task', es: 'tarea atrasada' },
  overdueTasks: { pt: 'tarefas atrasadas', en: 'overdue tasks', es: 'tareas atrasadas' },
  importantTask: { pt: 'tarefa importante', en: 'important task', es: 'tarea importante' },
  importantTasks: { pt: 'tarefas importantes', en: 'important tasks', es: 'tareas importantes' },
  noTasksToday: { pt: 'Nenhuma tarefa pendente. Aproveite seu dia! 🎉', en: 'No pending tasks. Enjoy your day! 🎉', es: '¡Sin tareas pendientes. ¡Disfruta tu día! 🎉' },
  allDone: { pt: 'Tudo concluído hoje! Incrível.', en: 'Everything done today! Amazing.', es: '¡Todo listo hoy! Increíble.' },

  // ---- Tasks ----
  todayTasks: { pt: 'Tarefas de Hoje', en: "Today's Tasks", es: 'Tareas de Hoy' },
  add: { pt: '+ Adicionar', en: '+ Add', es: '+ Agregar' },
  addTask: { pt: 'Adicionar tarefa', en: 'Add task', es: 'Agregar tarea' },
  newTask: { pt: 'Nova Tarefa', en: 'New Task', es: 'Nueva Tarea' },
  newImportantTask: { pt: 'Nova Tarefa Importante', en: 'New Important Task', es: 'Nueva Tarea Importante' },
  taskTitle: { pt: 'Título', en: 'Title', es: 'Título' },
  taskTitlePlaceholder: { pt: 'O que precisa ser feito?', en: 'What needs to be done?', es: '¿Qué hay que hacer?' },
  saveTask: { pt: 'Salvar tarefa', en: 'Save task', es: 'Guardar tarea' },
  scheduleTask: { pt: 'Agendar tarefa', en: 'Schedule task', es: 'Programar tarea' },
  date: { pt: 'Data', en: 'Date', es: 'Fecha' },
  estimatedTime: { pt: 'Tempo estimado', en: 'Estimated time', es: 'Tiempo estimado' },
  noEstimate: { pt: 'Sem estimativa', en: 'No estimate', es: 'Sin estimación' },
  priority: { pt: 'Prioridade', en: 'Priority', es: 'Prioridad' },
  high: { pt: '🔴 Alta', en: '🔴 High', es: '🔴 Alta' },
  medium: { pt: '🟡 Média', en: '🟡 Medium', es: '🟡 Media' },
  low: { pt: '🟢 Baixa', en: '🟢 Low', es: '🟢 Baja' },
  project: { pt: 'Projeto', en: 'Project', es: 'Proyecto' },
  noProject: { pt: 'Sem projeto', en: 'No project', es: 'Sin proyecto' },
  routine: { pt: 'Rotina', en: 'Routine', es: 'Rutina' },
  noRoutine: { pt: 'Nenhuma', en: 'None', es: 'Ninguna' },
  cancel: { pt: 'Cancelar', en: 'Cancel', es: 'Cancelar' },
  overdue: { pt: 'Atrasada', en: 'Overdue', es: 'Atrasada' },
  future: { pt: 'Futuro', en: 'Future', es: 'Futuro' },
  locked: { pt: 'Bloqueado', en: 'Locked', es: 'Bloqueado' },
  noPendingToday: { pt: 'Nenhuma tarefa pendente para hoje.', en: 'No pending tasks for today.', es: 'No hay tareas pendientes hoy.' },
  firstTask: { pt: 'Comece criando sua primeira tarefa acima.', en: 'Start by creating your first task above.', es: 'Empieza creando tu primera tarea arriba.' },
  allTasksDone: { pt: 'Todas as tarefas de hoje estão concluídas. Ótimo trabalho!', en: "All today's tasks are done. Great job!", es: 'Todas las tareas de hoy están completas. ¡Excelente trabajo!' },

  // ---- Routines ----
  newRoutine: { pt: '+ Nova rotina', en: '+ New routine', es: '+ Nueva rutina' },
  routineNameLabel: { pt: 'Nome da rotina', en: 'Routine name', es: 'Nombre de la rutina' },
  routineNamePlaceholder: { pt: 'Ex: Foco Profundo, Revisão...', en: 'E.g.: Deep Focus, Review...', es: 'Ej: Enfoque Profundo, Revisión...' },
  schedule: { pt: 'Horário', en: 'Schedule', es: 'Horario' },
  until: { pt: 'até', en: 'to', es: 'hasta' },
  color: { pt: 'Cor', en: 'Color', es: 'Color' },
  createRoutine: { pt: 'Criar rotina', en: 'Create routine', es: 'Crear rutina' },
  noRoutines: { pt: 'Nenhuma rotina criada. Clique em "+ Nova rotina" para começar!', en: 'No routines yet. Click "+ New routine" to start!', es: 'Sin rutinas aún. ¡Haz clic en "+ Nueva rutina" para empezar!' },
  tasks: { pt: 'tarefas', en: 'tasks', es: 'tareas' },
  task: { pt: 'tarefa', en: 'task', es: 'tarea' },
  noTasksRoutine: { pt: 'Nenhuma tarefa nesta rotina ainda. Crie uma tarefa e selecione esta rotina.', en: 'No tasks in this routine yet. Create a task and select this routine.', es: 'Sin tareas en esta rutina aún. Crea una tarea y selecciona esta rutina.' },
  addRoutineTask: { pt: '+ Adicionar tarefa', en: '+ Add task', es: '+ Agregar tarea' },
  fillRoutineName: { pt: 'Preencha o nome da rotina.', en: 'Fill in the routine name.', es: 'Rellena el nombre de la rutina.' },
  routineError: { pt: 'Erro ao criar rotina. Tente novamente.', en: 'Error creating routine. Please try again.', es: 'Error al crear rutina. Inténtalo de nuevo.' },

  // ---- Projects ----
  newProjectLabel: { pt: 'Novo Projeto', en: 'New Project', es: 'Nuevo Proyecto' },
  projectName: { pt: 'Nome do projeto', en: 'Project name', es: 'Nombre del proyecto' },
  projectNamePlaceholder: { pt: 'Ex: Trabalho, Estudos...', en: 'E.g.: Work, Studies...', es: 'Ej: Trabajo, Estudios...' },
  createProject: { pt: 'Criar projeto', en: 'Create project', es: 'Crear proyecto' },
  noProjectTasks: { pt: 'Nenhuma pendência neste projeto.', en: 'No pending tasks in this project.', es: 'Sin tareas pendientes en este proyecto.' },

  // ---- Settings ----
  language: { pt: 'Idioma', en: 'Language', es: 'Idioma' },
  languageDesc: { pt: 'Escolha o idioma da interface.', en: 'Choose the interface language.', es: 'Elige el idioma de la interfaz.' },
  notifications: { pt: 'Notificações', en: 'Notifications', es: 'Notificaciones' },
  security: { pt: 'Segurança', en: 'Security', es: 'Seguridad' },
  dangerZone: { pt: 'Zona de perigo', en: 'Danger Zone', es: 'Zona de peligro' },
  currentPassword: { pt: 'Senha atual', en: 'Current password', es: 'Contraseña actual' },
  newPassword: { pt: 'Nova senha', en: 'New password', es: 'Nueva contraseña' },
  confirmNewPassword: { pt: 'Confirmar nova senha', en: 'Confirm new password', es: 'Confirmar nueva contraseña' },
  savePassword: { pt: 'Atualizar senha', en: 'Update password', es: 'Actualizar contraseña' },
  deleteAccountMsg: { pt: 'Para excluir sua conta, digite EXCLUIR abaixo. Essa ação é irreversível.', en: 'To delete your account, type DELETE below. This action is irreversible.', es: 'Para eliminar tu cuenta, escribe ELIMINAR abajo. Esta acción es irreversible.' },
  deleteConfirm: { pt: 'EXCLUIR', en: 'DELETE', es: 'ELIMINAR' },
  deleteAccount: { pt: 'Excluir minha conta permanentemente', en: 'Permanently delete my account', es: 'Eliminar mi cuenta permanentemente' },

  // ---- Plans ----
  evolveProductivity: { pt: 'Evolua sua produtividade.', en: 'Elevate your productivity.', es: 'Eleva tu productividad.' },
  plansDesc: { pt: 'Faça o upgrade para desbloquear todos os recursos avançados.', en: 'Upgrade to unlock all advanced features.', es: 'Haz upgrade para desbloquear todas las funciones avanzadas.' },
  perMonth: { pt: '/mês', en: '/mo', es: '/mes' },
  subscribe: { pt: 'Assinar Plano Pro', en: 'Subscribe to Pro', es: 'Suscribirse al Pro' },
  subscribePremium: { pt: 'Assinar Premium', en: 'Subscribe Premium', es: 'Suscribirse Premium' },
  mostPopular: { pt: 'Mais Popular', en: 'Most Popular', es: 'Más Popular' },

  // ---- Profile ----
  name: { pt: 'Nome', en: 'Name', es: 'Nombre' },
  email: { pt: 'E-mail', en: 'Email', es: 'Correo' },
  saveChanges: { pt: 'Salvar alterações', en: 'Save changes', es: 'Guardar cambios' },

  // ---- Misc ----
  streak: { pt: 'Streak', en: 'Streak', es: 'Racha' },
  consecutiveDays: { pt: 'dias seguidos', en: 'consecutive days', es: 'días seguidos' },
  thisWeekLabel: { pt: 'Esta semana', en: 'This week', es: 'Esta semana' },
  completionRate: { pt: 'taxa de conclusão', en: 'completion rate', es: 'tasa de finalización' },
  importantTasks2: { pt: 'Tarefas Importantes', en: 'Important Tasks', es: 'Tareas Importantes' },
  noImportant: { pt: 'Nenhuma tarefa de alta prioridade.', en: 'No high priority tasks.', es: 'Sin tareas de alta prioridad.' },
  signOut: { pt: 'Sair', en: 'Sign out', es: 'Cerrar sesión' },
  freePlan: { pt: 'Plano Gratuito', en: 'Free Plan', es: 'Plan Gratuito' },
  proPlan: { pt: 'Plano Pro', en: 'Pro Plan', es: 'Plan Pro' },
  premiumPlan: { pt: 'Plano Premium', en: 'Premium Plan', es: 'Plan Premium' },
} as const;

export type TKey = keyof typeof translations;

export function getLangFromBrowser(): Lang {
  if (typeof window === 'undefined') return 'pt';
  const nav = navigator.language.toLowerCase();
  if (nav.startsWith('es')) return 'es';
  if (nav.startsWith('en')) return 'en';
  return 'pt';
}

export function t(key: TKey, lang: Lang): string {
  return translations[key][lang];
}
