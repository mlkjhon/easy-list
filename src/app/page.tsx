"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import * as Icons from "lucide-react";
import { type Lang, getLangFromBrowser, t } from '@/lib/translations';
import {
  getTasks, createTask, updateTask, toggleTask, rescheduleTask, deleteTask, registerUser,
  getProjects, createProject, deleteProject, getTeams, createTeam, getTeamDetails, sendTeamMessage,
  getRoutines, createRoutine, deleteRoutine,
  getStats, updateUserProfile, updateProfileImage, updateUserPassword, deleteAccount, resetRoutineTasks,
  getCurrentUserData, adminGetAllUsers, adminUpdateUserStatus, adminUpdateUserPlan, adminDeleteUser, inviteUserToProject,
  getShoppingLists, createShoppingList, deleteShoppingList, renameShoppingList,
  createShoppingItem, updateShoppingItem, toggleShoppingItem, deleteShoppingItem,
  clearPurchasedItems, duplicateShoppingList
} from "./actions";

export default function Home() {
  const [activeScreen, setActiveScreen] = useState('landing');
  const [obStep, setObStep] = useState(1);
  const [activeTab, setActiveTab] = useState('Meu Dia');
  const [selectedWeekDate, setSelectedWeekDate] = useState<string|null>(null);
  const [obUseMode, setObUseMode] = useState<string|null>(null);
  const [obPrevTools, setObPrevTools] = useState<string[]>([]);
  const [obRoutines, setObRoutines] = useState<string[]>([]);
  const [systemAlert, setSystemAlert] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Tasks
  const [tasks, setTasks] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [newTaskDate, setNewTaskDate] = useState("");
  const [newTaskTime, setNewTaskTime] = useState("");
  const [newTaskStartTime, setNewTaskStartTime] = useState("");
  const [newTaskEndTime, setNewTaskEndTime] = useState("");
  const [newTaskRoutine, setNewTaskRoutine] = useState("");
  const [presetProjectId, setPresetProjectId] = useState<string|null>(null);
  const [presetImportant, setPresetImportant] = useState(false);
  const [editTaskId, setEditTaskId] = useState<string|null>(null);
  
  // AI Chat State
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{role:'user'|'ai', content:string}[]>([
    { role: 'ai', content: 'Olá! Sou seu Assistente Easy List. O que você gostaria de analisar hoje?' }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  // UI Globals
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Projects
  const [projects, setProjects] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectColor, setNewProjectColor] = useState("#E8503A");

  // Routines
  const [routines, setRoutines] = useState<any[]>([]);
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState("");
  const [newRoutineStartTime, setNewRoutineStartTime] = useState("08:00");
  const [newRoutineEndTime, setNewRoutineEndTime] = useState("12:00");
  const [newRoutineColor, setNewRoutineColor] = useState("#E8503A");
  const [selectedRoutineId, setSelectedRoutineId] = useState<string|null>(null);

  // Stats
  const [streak, setStreak] = useState(0);
  const [weeklyRate, setWeeklyRate] = useState(0);

  // Auth
  const [authMode, setAuthMode] = useState<'login'|'register'>('login');
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [successToast, setSuccessToast] = useState("");

  // Profile popup & screens
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Profile screen state
  const [editName, setEditName] = useState("");
  const [profileMsg, setProfileMsg] = useState("");

  // Settings screen state
  const [settCurrentPwd, setSettCurrentPwd] = useState("");
  const [settNewPwd, setSettNewPwd] = useState("");
  const [settConfirmPwd, setSettConfirmPwd] = useState("");
  const [settPwdMsg, setSettPwdMsg] = useState("");
  const [settDeleteConfirm, setSettDeleteConfirm] = useState("");
  const [notifDaily, setNotifDaily] = useState(true);
  const [notifAlerts, setNotifAlerts] = useState(true);

  // Language / i18n
  const [lang, setLang] = useState<Lang>('pt');

  // Theme state
  const [theme, setTheme] = useState<'light'|'dark'|'system'>('system');

  // Admin & Billing
  const [currentUserData, setCurrentUserData] = useState<any>(null);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);

  // Shopping Lists
  const [shoppingLists, setShoppingLists] = useState<any[]>([]);
  const [selectedListId, setSelectedListId] = useState<string|null>(null);
  const [isNewListModalOpen, setIsNewListModalOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState("1");
  const [newItemUnit, setNewItemUnit] = useState("un");
  const [newItemCategory, setNewItemCategory] = useState("Outros");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [editingItemId, setEditingItemId] = useState<string|null>(null);

  // My Tasks filters
  const [taskSearch, setTaskSearch] = useState("");
  const [taskFilterStatus, setTaskFilterStatus] = useState("all");
  const [taskFilterPriority, setTaskFilterPriority] = useState("all");
  const [taskFilterProject, setTaskFilterProject] = useState("all");
  const [taskFilterDate, setTaskFilterDate] = useState("all");
  const [taskSortBy, setTaskSortBy] = useState("date");
  const [taskViewMode, setTaskViewMode] = useState<'list'|'cards'>('list');
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [bulkSelected, setBulkSelected] = useState<string[]>([]);
  const [newItemQuantity, setNewItemQuantity] = useState("1");
  const [shareProjectId, setShareProjectId] = useState<string|null>(null);
  const [shareEmailInput, setShareEmailInput] = useState('');

  // Pricing billing toggle
  const [billingAnnual, setBillingAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number|null>(null);

  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'var(--cream)', color:'var(--ink)'}}>
        <style>{`
          @keyframes spin { 100% { transform: rotate(360deg); } }
          .animate-spin { animation: spin 1s linear infinite; }
        `}</style>
        <Icons.Loader2 size={40} className="animate-spin" style={{marginBottom:'16px'}} />
        <h2 style={{fontSize:'18px', fontWeight:'600'}}>Acessando sua conta...</h2>
      </div>
    );
  }


  useEffect(() => {
    if (status === "authenticated") {
      getCurrentUserData().then(async (data) => {
        if (data?.status === 'SUSPENDED' || data?.status === 'BLOCKED') {
          setSuccessToast(`⚠️ Sua conta foi ${data.status === 'SUSPENDED' ? 'suspensa' : 'bloqueada'}. Entre em contato: easylist.oficial@gmail.com`);
          setTimeout(() => signOut(), 4000);
          return;
        }
        setCurrentUserData(data);

        const [t, p, r, sl, tms] = await Promise.all([getTasks(), getProjects(), getRoutines(), getShoppingLists(), getTeams()]);
        setTeams(tms);
        setTasks(t);
        setProjects(p);
        setRoutines(r);
        setShoppingLists(sl);
        if (sl.length > 0) setSelectedListId(sl[0].id);

        getStats().then(s => { setStreak(s.streak); setWeeklyRate(s.weeklyRate); });
        
        if (t.length === 0 && p.length === 0 && r.length === 0 && !localStorage.getItem('ob_' + data?.email)) {
            setActiveScreen("onboarding");
            setObStep(3);
        } else {
            setActiveScreen("app");
        }

        // Check for checkout success/cancel in URL
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          if (params.get('checkout') === 'success') {
            setSuccessToast('Pagamento confirmado! Seu plano foi ativado.');
            setTimeout(() => setSuccessToast(''), 5000);
            window.history.replaceState({}, '', '/');
          } else if (params.get('checkout') === 'cancel') {
            setSuccessToast('Checkout cancelado. Você pode tentar novamente quando quiser.');
            setTimeout(() => setSuccessToast(''), 4000);
            window.history.replaceState({}, '', '/');
          }
        }
      });
    } else if (status === "unauthenticated" && activeScreen === "app") {
      setActiveScreen("landing");
    }
  }, [status]);

  // Initialize Theme and IP-based Language
  useEffect(() => {
    // --- Theme Init ---
    const savedTheme = localStorage.getItem('user_theme') as 'light'|'dark'|'system' || 'system';
    setTheme(savedTheme);
    const isDark = savedTheme === 'dark' || (savedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');

    // --- Language Init ---
    const initLang = async () => {
      const savedLang = localStorage.getItem('user_lang') as Lang;
      if (savedLang && ['pt', 'en', 'es'].includes(savedLang)) {
        setLang(savedLang);
        return;
      }
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data?.country_code) {
          const code = data.country_code.toLowerCase();
          if (code === 'br' || code === 'pt') {
            setLang('pt');
            localStorage.setItem('user_lang', 'pt');
          } else if (['es', 'mx', 'ar', 'co', 'pe', 've', 'cl', 'ec', 'gt', 'cu', 'bo', 'do', 'hn', 'py', 'sv', 'ni', 'cr', 'pa', 'uy', 'gq', 'pr'].includes(code)) {
            setLang('es');
            localStorage.setItem('user_lang', 'es');
          } else {
            setLang('en');
            localStorage.setItem('user_lang', 'en');
          }
        } else {
          setLang(getLangFromBrowser());
        }
      } catch (e) {
        setLang(getLangFromBrowser());
      }
    };
    initLang();
  }, []);

  // Midnight routine reset: when the calendar date changes, reset routine tasks
  useEffect(() => {
    if (status !== 'authenticated') return;
    const todayStr = new Date().toDateString();
    const checkMidnight = setInterval(async () => {
      if (new Date().toDateString() !== todayStr) {
        // Day changed — reset routine tasks
        try {
          await resetRoutineTasks();
          const freshTasks = await getTasks();
          setTasks(freshTasks);
        } catch (e) { /* silent */ }
        clearInterval(checkMidnight);
      }
    }, 60_000); // check every minute
    return () => clearInterval(checkMidnight);
  }, [status]);

  // Scroll reveal observer
  useEffect(() => {
    if (activeScreen === 'landing') {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      
      const elements = document.querySelectorAll('.reveal-up');
      elements.forEach(el => observer.observe(el));
      
      return () => observer.disconnect();
    }
  }, [activeScreen]);

  // Sync editName when session loads
  useEffect(() => {
    if (session?.user?.name) setEditName(session.user.name);
  }, [session]);

  const openTaskModal = (opts?: { priority?: string; date?: string; projectId?: string; important?: boolean; taskToEdit?: any }) => {
    if (opts?.taskToEdit) {
      setEditTaskId(opts.taskToEdit.id);
      setNewTaskTitle(opts.taskToEdit.title);
      setNewTaskPriority(opts.taskToEdit.priority);
      setNewTaskDate(opts.taskToEdit.date ? new Date(opts.taskToEdit.date).toISOString().split('T')[0] : "");
      setNewTaskStartTime(opts.taskToEdit.startTime || "");
      setNewTaskEndTime(opts.taskToEdit.endTime || "");
      setNewTaskRoutine(opts.taskToEdit.routineName || "");
      setPresetProjectId(opts.taskToEdit.projectId || null);
      setPresetImportant(opts.taskToEdit.priority === 'high');
      setIsModalOpen(true);
      return;
    }
    setEditTaskId(null);
    setNewTaskTitle("");
    setNewTaskPriority(opts?.priority || "medium");
    setNewTaskDate(opts?.date || "");
    setNewTaskStartTime("");
    setNewTaskEndTime("");
    setNewTaskRoutine("");
    setPresetProjectId(opts?.projectId || null);
    setPresetImportant(opts?.important || false);
    setIsModalOpen(true);
  };

  const refreshStats = () =>
    getStats().then(s => { setStreak(s.streak); setWeeklyRate(s.weeklyRate); });

  const handleSendAiMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput("");
    setIsAiTyping(true);

    // Mock AI Reply
    setTimeout(() => {
      setIsAiTyping(false);
      let aiResponse = `Este é um protótipo visual! Em breve me conectarei à API do Gemini para respostas reais. Pude ver que você tem ${tasks.length} tarefas pendentes. Posso te ajudar a organizá-las?`;
      if (userMsg.toLowerCase().includes("hoje")) {
        const todayTasks = tasks.filter(t => !t.isDone && t.date && new Date(t.date).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]);
        aiResponse = `Você tem ${todayTasks.length} tarefas pendentes para hoje. Que tal focarmos nas de prioridade Alta primeiro?`;
      }
      setChatMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    }, 1500);
  };

  const handleSaveTask = async () => {
    if (!newTaskTitle.trim()) return;
    
    if (newTaskDate && newTaskStartTime && newTaskEndTime) {
      const start = newTaskStartTime;
      const end = newTaskEndTime;
      if (start >= end) {
        setAuthError('Horário inválido! O fim deve ser após o início.');
        return;
      }
      const overlappingTask = tasks.find(t => {
        if (t.id === editTaskId) return false;
        if (!t.date || !t.startTime || !t.endTime) return false;
        const tDate = new Date(t.date).toISOString().split('T')[0];
        if (tDate !== newTaskDate) return false;
        return (start < t.endTime && end > t.startTime);
      });
      if (overlappingTask) {
        setAuthError('Horário ocupado! Já existe uma tarefa neste período.');
        return;
      }
    }
    
    const taskData = {
      title: newTaskTitle,
      priority: presetImportant ? 'high' : newTaskPriority,
      startTime: newTaskStartTime || undefined,
      endTime: newTaskEndTime || undefined,
      date: newTaskDate || undefined,
      routineName: newTaskRoutine || undefined,
      projectId: presetProjectId || undefined,
    };

    try {
      if (editTaskId) {
        const uTask = await updateTask(editTaskId, taskData);
        setTasks(prev => prev.map(tk => tk.id === editTaskId ? uTask : tk));
      } else {
        const uTask = await createTask(taskData);
        setTasks(prev => [uTask, ...prev]);
      }
      
      setIsModalOpen(false);
      setNewTaskTitle("");
      setEditTaskId(null);
      refreshStats();
    } catch (err: any) {
      setSuccessToast('⚠️ ' + (err.message || 'Erro ao salvar tarefa. Tente novamente.'));
      setTimeout(() => setSuccessToast(''), 4000);
    }
  };

  const isTaskLocked = (t: any) => activeTab === 'Esta Semana' && t.date && new Date(t.date).toISOString().split('T')[0] > new Date().toISOString().split('T')[0];
  const isTaskOverdue = (t: any) => !t.routineName && !t.isDone && t.date && new Date(t.date).toISOString().split('T')[0] < new Date().toISOString().split('T')[0];

  const getExpirationText = (t: any) => {
    if (t.isDone || !t.date) return null;
    const now = new Date();
    const nowStr = now.toISOString().split('T')[0];
    const taskDate = new Date(t.date);
    const taskDateStr = taskDate.toISOString().split('T')[0];
    if (nowStr === taskDateStr) return <span style={{color:'var(--amber)', fontWeight:'600'}}>• Expira hoje {t.endTime ? `às ${t.endTime}` : ''}</span>;
    const daysDiff = Math.ceil((taskDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
    if (daysDiff === 1) return <span style={{color:'var(--ink-light)'}}>• Expira amanhã {t.endTime ? `às ${t.endTime}` : ''}</span>;
    if (daysDiff > 1) return <span style={{color:'var(--ink-light)'}}>• Expira em {daysDiff} dias</span>;
    return null;
  };

  const renderTaskItem = (t: any) => {
    const locked = isTaskLocked(t);
    const overdue = isTaskOverdue(t);
    const expirationText = getExpirationText(t);
    
    return (
      <div key={t.id} className="task-item" style={{ opacity: locked ? 0.6 : 1 }}>
        <div className="task-checkbox" style={{
            cursor: locked ? 'not-allowed' : 'pointer',
            background: t.isDone ? 'var(--coral)' : 'transparent',
            borderColor: t.isDone ? 'var(--coral)' : 'var(--cream-dark)'
          }}
          onClick={async () => {
             if (locked) return;
             const u = await toggleTask(t.id, !t.isDone);
             setTasks(tasks.map(tk => tk.id === t.id ? {...tk, isDone: u.isDone} : tk));
          }}>
          {t.isDone && <Icons.Check size={14} color="white" />}
        </div>
        <div className="task-content">
          <div className="task-title" style={{ textDecoration: t.isDone ? 'line-through' : 'none' }}>{t.title}</div>
          <div className="task-meta">
            <div className="task-project-dot" style={{background: t.priority === 'high' ? 'var(--coral)' : t.priority === 'medium' ? 'var(--amber)' : 'var(--green)'}}></div>
            <span>{t.priority === 'high' ? 'Alta' : t.priority === 'medium' ? 'Média' : 'Baixa'}</span>
            {t.startTime && <span>• {t.startTime} - {t.endTime}</span>}
            {t.routineName && <span>· <Icons.Clock size={12} style={{display:'inline',marginBottom:'-2px'}}/> {t.routineName}</span>}
            {t.projectId && <span>· <Icons.Folder size={12} style={{display:'inline',marginBottom:'-2px'}}/> {projects.find((p:any)=>p.id===t.projectId)?.name || 'Projeto'}</span>}
            {locked && <span style={{color:'var(--ink-light)'}}>• Futuro</span>}
            {overdue && <span style={{color:'var(--coral)', fontWeight:'600'}}>· ⚠️ Atrasada ({new Date(t.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })})</span>}
            {expirationText}
          </div>
        </div>
        <div className="task-actions" style={{display:'flex', gap:'6px', alignItems:'center'}}>
            {overdue && (
                <button onClick={async () => {
                    const today = new Date().toISOString().split('T')[0];
                    await rescheduleTask(t.id, today);
                    refreshStats();
                    getTasks().then(setTasks);
                }} style={{background:'var(--cream)', color:'var(--ink)', border:'1px solid var(--cream-dark)', borderRadius:'8px', padding:'4px 8px', fontSize:'11px', cursor:'pointer', display:'flex', alignItems:'center', gap:'4px', transition:'all var(--duration) var(--ease)', fontWeight:'500'}} aria-label="Reagendar tarefa">
                    <Icons.Calendar size={12} /><span>Reagendar</span>
                </button>
            )}
            <button onClick={() => openTaskModal({ taskToEdit: t })} style={{background:'transparent', border:'none', cursor:'pointer', color:'var(--ink-light)', padding:'5px', borderRadius:'6px', transition:'all var(--duration) var(--ease)'}} title="Editar" aria-label="Editar tarefa"
                onMouseEnter={e=>(e.currentTarget.style.background='var(--cream)', e.currentTarget.style.color='var(--ink)')}
                onMouseLeave={e=>(e.currentTarget.style.background='transparent', e.currentTarget.style.color='var(--ink-light)')}>
                <Icons.Pencil size={14} strokeWidth={1.5} />
            </button>
            <button onClick={async () => {
                await deleteTask(t.id);
                setTasks(prev => prev.filter(x => x.id !== t.id));
                refreshStats();
            }} style={{background:'transparent', border:'none', cursor:'pointer', color:'var(--ink-faint)', padding:'5px', borderRadius:'6px', transition:'all var(--duration) var(--ease)'}} title="Excluir" aria-label="Excluir tarefa"
                onMouseEnter={e=>(e.currentTarget.style.background='rgba(232,80,58,0.08)', e.currentTarget.style.color='var(--coral)')}
                onMouseLeave={e=>(e.currentTarget.style.background='transparent', e.currentTarget.style.color='var(--ink-faint)')}>
                <Icons.Trash2 size={14} strokeWidth={1.5} />
            </button>
            <div className="priority-bar" style={{background: t.priority === 'high' ? 'var(--coral)' : t.priority === 'medium' ? 'var(--amber)' : 'var(--green)'}}></div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="toast" id="toast">
        <div className="toast-icon">✓</div>
        <span id="toast-msg">Tarefa adicionada!</span>
      </div>

      {/* Checkout success / cancel toast */}
      {successToast && (
        <div style={{
          position:'fixed',top:'24px',left:'50%',transform:'translateX(-50%)',zIndex:9999,
          background: (successToast.toLowerCase().includes('erro') || successToast.toLowerCase().includes('restrito')) ? 'var(--coral)' : '#3D7A5E',
          color:'white',padding:'14px 28px',borderRadius:'100px',fontSize:'14px',
          fontWeight:'600',boxShadow:'0 8px 32px rgba(0,0,0,0.18)',display:'flex',
          alignItems:'center',gap:'10px',whiteSpace:'nowrap'
        }}>
          {successToast}
        </div>
      )}
    <div className="smart-notif" id="smart-notif">
        <div className="sn-header">
            <span className="sn-icon">☀️</span>
            <span className="sn-title">Lembrete Inteligente</span>
            <span className="sn-close">×</span>
        </div>
        <div className="sn-body">Seu bloco <strong>"Manhã Produtiva"</strong> começa em 15 min — 3 tarefas prontas pra você!
        </div>
        <div className="sn-actions">
            <button className="sn-btn-main">Ver tarefas</button>
            <button className="sn-btn-sec">Depois</button>
        </div>
    </div>

    
    <div id="landing" style={{ display: activeScreen === 'landing' ? 'block' : 'none' }}>
        <nav>
            <div className="nav-logo">easy<span>list</span></div>
            <div className="nav-links">
                <a href="#features">Funcionalidades</a>
                <a href="#how">Como funciona</a>
                <a href="#pricing">Preços</a>
            </div>
            <button className="nav-cta" onClick={() => setActiveScreen('onboarding')}>Começar grátis <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{"display":"inline","verticalAlign":"middle","marginLeft":"2px"}}>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg></button>
        </nav>

        
        <section className="hero">
            <div className="hero-bg"></div>
            <div className="hero-grid"></div>
            <div className="hero-content">
                <div className="hero-badge">
                    <div className="hero-badge-dot"></div>
                    Rotinas Automáticas + Lembretes Inteligentes
                </div>
                <h1>Sua agenda que <em>pensa</em> por você.</h1>
                <p>O easy list aprende seus padrões, organiza sua agenda sozinho e notifica na hora certa — você só
                    confirma e executa.</p>
                <div className="hero-actions">
                    <button className="btn-primary" onClick={() => setActiveScreen('onboarding')}>
                        Começar grátis
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </button>
                    <button className="btn-ghost" onClick={() => setActiveScreen('app')}>Ver demonstração</button>
                </div>
                <div className="hero-stats">
                    <div>
                        <div className="hero-stat-num">47<span>k</span></div>
                        <div className="hero-stat-label">usuários ativos</div>
                    </div>
                    <div>
                        <div className="hero-stat-num">2.1<span>M</span></div>
                        <div className="hero-stat-label">tarefas concluídas</div>
                    </div>
                    <div>
                        <div className="hero-stat-num">4.9<span>★</span></div>
                        <div className="hero-stat-label">avaliação média</div>
                    </div>
                </div>
            </div>

            
            <div className="hero-visual">
                <div className="app-preview-card">
                    <div className="apc-header">
                        <div className="apc-dot" style={{"background":"#E05B5B"}}></div>
                        <div className="apc-dot" style={{"background":"#E0B05B"}}></div>
                        <div className="apc-dot" style={{"background":"#5BE07A"}}></div>
                        <div className="apc-title">easy list — Meu Dia</div>
                    </div>
                    <div className="apc-body">
                        <div className="apc-date">{new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}</div>
                        <div className="apc-subtitle">3 de 7 tarefas concluídas · boa tarde!</div>

                        <div className="apc-block" style={{"background":"rgba(232,80,58,0.07)"}}>
                            <div className="apc-block-label" style={{"color":"var(--coral)","display":"flex","alignItems":"center","gap":"6px"}}><svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2c0 6-6 8-6 14a6 6 0 0 0 12 0c0-6-6-8-6-14z"></path>
                                    <path d="M12 2c0 4 4 6 4 12"></path>
                                </svg> FOCO PROFUNDO · 08h–12h</div>
                            <div className="apc-task">
                                <div className="apc-check done"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg></div>
                                <span className="apc-task-text done">Revisar proposta do cliente</span>
                                <span className="apc-tag" style={{"background":"#FEE2DD","color":"var(--coral)"}}>Alta</span>
                            </div>
                            <div className="apc-task">
                                <div className="apc-check done"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg></div>
                                <span className="apc-task-text done">Reunião de alinhamento</span>
                            </div>
                            <div className="apc-task">
                                <div className="apc-check"></div>
                                <span className="apc-task-text">Atualizar dashboard</span>
                                <span className="apc-tag" style={{"background":"#DFF0E8","color":"var(--green)"}}>Hoje</span>
                            </div>
                        </div>

                        <div className="apc-block" style={{"background":"rgba(61,122,94,0.07)"}}>
                            <div className="apc-block-label" style={{"color":"var(--green)","display":"flex","alignItems":"center","gap":"6px"}}><svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"></path>
                                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
                                </svg> TAREFAS RÁPIDAS · 13h–14h</div>
                            <div className="apc-task">
                                <div className="apc-check"></div>
                                <span className="apc-task-text">Responder emails pendentes</span>
                            </div>
                            <div className="apc-task">
                                <div className="apc-check"></div>
                                <span className="apc-task-text">Organizar arquivos</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        
        <section className="section" id="features" style={{"background":"var(--cream-dark)"}}>
            <div className="section-label">Funcionalidades</div>
            <div className="section-title">Feito para quem<br/>realmente usa.</div>
            <div className="section-sub">Do gerenciamento simples de tarefas às rotinas mais avançadas — tudo em um lugar
                só.</div>

            <div className="features-grid">
                <div className="feature-card featured reveal-up">
                    <div>
                        <div className="feature-icon" style={{"background":"rgba(232,80,58,0.15)"}}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E8503A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                                <circle cx="12" cy="5" r="2"></circle>
                                <path d="M12 7v4"></path>
                                <line x1="8" y1="16" x2="8" y2="16"></line>
                                <line x1="16" y1="16" x2="16" y2="16"></line>
                            </svg></div>
                        <div className="feature-title">Rotinas Automáticas</div>
                        <div className="feature-desc">Defina blocos de tempo e deixe o app organizar suas tarefas dentro
                            deles. O easy list aprende suas prioridades e preenche sua agenda — você só confirma.</div>
                    </div>
                    <div className="routine-demo" style={{"flexShrink":"0"}}>
                        <div className="routine-timeline">
                            <div className="routine-block">
                                <div className="routine-block-time">08:00 — 12:00</div>
                                <div className="routine-block-name" style={{"display":"flex","alignItems":"center","gap":"6px"}}><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--coral)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 2c0 6-6 8-6 14a6 6 0 0 0 12 0c0-6-6-8-6-14z"></path>
                                    </svg> Foco Profundo</div>
                                <div className="routine-block-tasks">3 tarefas sugeridas</div>
                            </div>
                            <div className="routine-block">
                                <div className="routine-block-time">13:00 — 14:00</div>
                                <div className="routine-block-name" style={{"display":"flex","alignItems":"center","gap":"6px"}}><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--coral-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polyline>
                                    </svg> Tarefas Rápidas</div>
                                <div className="routine-block-tasks">2 tarefas sugeridas</div>
                            </div>
                            <div className="routine-block">
                                <div className="routine-block-time">17:00 — 18:00</div>
                                <div className="routine-block-name" style={{"display":"flex","alignItems":"center","gap":"6px"}}><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--coral-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                    </svg> Revisão do Dia</div>
                                <div className="routine-block-tasks">1 tarefa sugerida</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="feature-card reveal-up">
                    <div className="feature-icon" style={{"background":"#FEF3DE"}}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4872A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg></div>
                    <div className="feature-title">Lembretes Inteligentes</div>
                    <div className="feature-desc">Notificações no momento e contexto certos. Alertas de atraso, resumo
                        matinal e lembretes de rotina.</div>
                </div>

                <div className="feature-card reveal-up">
                    <div className="feature-icon" style={{"background":"#DFF0E8"}}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3D7A5E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="20" x2="18" y2="10"></line>
                            <line x1="12" y1="20" x2="12" y2="4"></line>
                            <line x1="6" y1="20" x2="6" y2="14"></line>
                        </svg></div>
                    <div className="feature-title">Dashboard &amp; Streaks</div>
                    <div className="feature-desc">Acompanhe produtividade, sequências de dias e estatísticas detalhadas do
                        seu desempenho.</div>
                </div>

                <div className="feature-card reveal-up">
                    <div className="feature-icon" style={{"background":"#E8E4F0"}}>
                        <Icons.FolderOpen size={24} strokeWidth={1.5} color="#7A5AA8" />
                    </div>
                    <div className="feature-title">Projetos &amp; Subprojetos</div>
                    <div className="feature-desc">Organize tudo em projetos com cores, tags e filtros avançados. Compartilhe
                        com equipes.</div>
                </div>

                <div className="feature-card reveal-up">
                    <div className="feature-icon" style={{"background":"#FEE2DD"}}>
                        <Icons.RefreshCcw size={24} strokeWidth={1.5} color="#E8503A" />
                    </div>
                    <div className="feature-title">Recorrência Completa</div>
                    <div className="feature-desc">Tarefas diárias, semanais, mensais ou com padrão personalizado. O que se
                        repete, não esquece.</div>
                </div>

                <div className="feature-card reveal-up">
                    <div className="feature-icon" style={{"background":"#E4EEF8"}}>
                        <Icons.Globe size={24} strokeWidth={1.5} color="#3A6EA8" />
                    </div>
                    <div className="feature-title">Multiplataforma &amp; Offline</div>
                    <div className="feature-desc">Web, PWA instalável, sincronização automática. Funciona mesmo sem conexão
                        — sincroniza depois.</div>
                </div>
            </div>
        </section>

        
        <section className="section" id="how">
            <div className="section-label">Como funciona</div>
            <div className="section-title">Em 4 passos,<br/>sua vida organizada.</div>
            <div className="steps-grid">
                <div className="step reveal-up">
                    <div className="step-num">01<span>→</span></div>
                    <div className="step-title">Crie sua conta</div>
                    <div className="step-desc">Login social com Google. Leva menos de 30 segundos.</div>
                </div>
                <div className="step reveal-up">
                    <div className="step-num">02<span>→</span></div>
                    <div className="step-title">Monte suas rotinas</div>
                    <div className="step-desc">Arraste blocos de tempo e dê nomes para seus momentos de foco. O app aprende
                        seu ritmo.</div>
                </div>
                <div className="step reveal-up">
                    <div className="step-num">03<span>→</span></div>
                    <div className="step-title">Adicione tarefas</div>
                    <div className="step-desc">Qualquer tarefa, de qualquer jeito. Com prioridade, data, projeto, tempo
                        estimado.</div>
                </div>
                <div className="step reveal-up">
                    <div className="step-num">04<span>✓</span></div>
                    <div className="step-title">Execute com foco</div>
                    <div className="step-desc">O app organiza tudo automaticamente no seu dia. Você só confirma e executa.
                    </div>
                </div>
            </div>
        </section>

        
        <section className="testimonials-section">
            <div className="section-label">Depoimentos</div>
            <div className="section-title">Quem usa, não larga.</div>
            <div className="testimonials-grid">
                <div className="testimonial">
                    <div className="stars">★★★★★</div>
                    <div className="testimonial-text">"As Rotinas Automáticas mudaram completamente minha relação com o
                        trabalho. Não preciso mais ficar planejando — o app já deixa tudo pronto pra mim."</div>
                    <div className="testimonial-author">
                        <div className="testimonial-avatar" style={{"background":"var(--coral)"}}>M</div>
                        <div>
                            <div className="testimonial-name">Marina Fonseca</div>
                            <div className="testimonial-role">Freelancer de Design</div>
                        </div>
                    </div>
                </div>
                <div className="testimonial">
                    <div className="stars">★★★★★</div>
                    <div className="testimonial-text">"Eu tentei Todoist, Things, Notion... Nada chegou perto. Os lembretes
                        do easy list aparecem exatamente quando eu preciso. É quase assustador."</div>
                    <div className="testimonial-author">
                        <div className="testimonial-avatar" style={{"background":"var(--blue)"}}>R</div>
                        <div>
                            <div className="testimonial-name">Rafael Andrade</div>
                            <div className="testimonial-role">Empreendedor</div>
                        </div>
                    </div>
                </div>
                <div className="testimonial">
                    <div className="stars">★★★★★</div>
                    <div className="testimonial-text">"Uso pra estudar pra concurso. O bloco de 'Revisão do Dia' me ajudou a
                        manter uma sequência de 47 dias sem falhar. Nunca tinha conseguido isso."</div>
                    <div className="testimonial-author">
                        <div className="testimonial-avatar" style={{"background":"var(--green)"}}>C</div>
                        <div>
                            <div className="testimonial-name">Camila Ribeiro</div>
                            <div className="testimonial-role">Estudante</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        
        <section className="section" id="pricing" style={{"background":"var(--cream-dark)"}}>
            <div style={{"textAlign":"center"}}>
                <div className="section-label">Planos</div>
                <div className="section-title">Simples assim.</div>
            </div>
            <div className="pricing-grid">
                <div className="pricing-card">
                    <div className="pricing-name">Gratuito</div>
                    <div className="pricing-price">R$0</div>
                    <div className="pricing-period">para sempre</div>
                    <ul className="pricing-features">
                        <li>✅ Tarefas ilimitadas</li>
                        <li>✅ Projetos ilimitados</li>
                        <li>✅ Rotinas ilimitadas</li>
                        <li>✅ Lista de compras ilimitada</li>
                        <li>✅ Horários nas tarefas</li>
                        <li>✅ Web + mobile</li>
                    </ul>
                    <button className="pricing-btn" onClick={() => setActiveScreen('onboarding')}>Começar grátis</button>
                </div>
                <div className="pricing-card featured">
                    <div className="pricing-badge">MAIS POPULAR</div>
                    <div className="pricing-name" style={{"color":"var(--white)"}}>Pro</div>
                    <div className="pricing-price">R$29<span style={{fontSize:'24px',fontWeight:500}}>,90</span></div>
                    <div className="pricing-period" style={{"color":"rgba(255,255,255,0.5)"}}>por mês</div>
                    <ul className="pricing-features">
                        <li>✅ Tudo do plano Gratuito</li>
                        <li>Dashboard avançado</li>
                        <li>Relatórios de produtividade</li>
                        <li>Compartilhar projetos (até 3)</li>
                        <li>Suporte prioritário</li>
                        <li>🤖 IA Assistente (em breve)</li>
                    </ul>
                    <button className="pricing-btn" onClick={() => setActiveScreen('onboarding')}>Assinar Pro</button>
                </div>
                <div className="pricing-card">
                    <div className="pricing-name">Premium</div>
                    <div className="pricing-price">R$59<span style={{fontSize:'24px',fontWeight:500}}>,90</span></div>
                    <div className="pricing-period">/mês (até 5 pessoas)</div>
                    <ul className="pricing-features">
                        <li>✅ Tudo do plano Pro</li>
                        <li>🏢 Até 5 usuários inclusos</li>
                        <li>🏢 Projetos compartilhados em equipe</li>
                        <li>🏢 Dashboard executivo</li>
                        <li>🤖 IA Assistente (acesso antecipado)</li>
                        <li>📞 Suporte dedicado</li>
                    </ul>
                    <button className="pricing-btn" onClick={() => setActiveScreen('onboarding')}>Começar com o time</button>
                </div>
            </div>
        </section>

        
        <div className="cta-banner">
            <h2>Pronto para parar de improvisar?</h2>
            <p>Comece agora, de graça. Sem cartão de crédito.</p>
            <button className="cta-btn-white" onClick={() => setActiveScreen('onboarding')}>Criar minha conta grátis →</button>
        </div>

        
        <footer>
            <div>
                <div className="footer-logo">easy<span>list</span></div>
                <div className="footer-tagline">A agenda inteligente para<br/>freelancers, estudantes e empreendedores.</div>
            </div>
            <div>
                <div className="footer-col-title">Produto</div>
                <ul className="footer-links">
                    <li><a href="#features">Funcionalidades</a></li>
                    <li><a href="#pricing">Preços</a></li>
                    <li><a href="#">Novidades</a></li>
                    <li><a href="#">Roadmap</a></li>
                </ul>
            </div>
            <div>
                <div className="footer-col-title">Empresa</div>
                <ul className="footer-links">
                    <li><a href="mailto:easylist.oficial@gmail.com">Sobre nós</a></li>
                    <li><a href="mailto:easylist.oficial@gmail.com">Blog</a></li>
                    <li><a href="mailto:easylist.oficial@gmail.com?subject=Vagas">Carreiras</a></li>
                    <li><a href="mailto:easylist.oficial@gmail.com">Contato</a></li>
                </ul>
            </div>
            <div>
                <div className="footer-col-title">Legal</div>
                <ul className="footer-links">
                    <li><a href="/privacidade">Política de Privacidade</a></li>
                    <li><a href="/termos">Termos de Uso</a></li>
                    <li><a href="mailto:easylist.oficial@gmail.com?subject=Cookies">Cookies</a></li>
                </ul>
            </div>
        </footer>
        <div className="footer-bottom">
            <p>© 2026 easy list. Feito com ❤️ no Brasil.</p>
            <p>Disponível para Web, iOS e Android</p>
        </div>
    </div>

    
    <div id="onboarding" style={{ display: activeScreen === 'onboarding' ? 'block' : 'none' }}>
        <div className="onboarding-layout">
            <div className="onboarding-left">
                <div>
                    <div className="ob-logo">easy<span>list</span></div>
                </div>

                
                <div className="ob-screen active" id="ob-1" style={{ display: obStep === 1 ? 'flex' : 'none' }}>
                    <div className="ob-step">Passo 1 de 5</div>
                    <div className="ob-title">Bem-vindo(a) ao easy list. 👋</div>
                    <div className="ob-sub">Sua agenda inteligente que organiza o dia por você.</div>
                    <ul className="ob-checklist">
                        <li>
                            <div className="ob-check-icon"><Icons.Bot size={20} strokeWidth={1.5} /></div> <span><strong>Rotinas Automáticas</strong> — blocos de
                                tempo que se preenchem sozinhos</span>
                        </li>
                        <li>
                            <div className="ob-check-icon"><Icons.Bell size={20} strokeWidth={1.5} /></div> <span><strong>Lembretes Inteligentes</strong> —
                                notificações no momento certo</span>
                        </li>
                        <li>
                            <div className="ob-check-icon"><Icons.BarChart2 size={20} strokeWidth={1.5} /></div> <span><strong>Dashboard com streaks</strong> — acompanhe
                                sua evolução</span>
                        </li>
                        <li>
                            <div className="ob-check-icon"><Icons.Cloud size={20} strokeWidth={1.5} /></div> <span><strong>Multiplataforma</strong> — web, mobile e
                                offline</span>
                        </li>
                    </ul>
                    <button className="ob-btn" onClick={() => setObStep(2)}>Vamos lá! <span>→</span></button>
                </div>

                
                <div className="ob-screen" id="ob-2" style={{ display: obStep === 2 ? 'flex' : 'none' }}>
                    <div className="ob-step">Passo 2 de 5</div>
                    <div className="ob-title">{authMode === 'login' ? 'Bem-vindo de volta! 👋' : 'Crie sua conta'}</div>
                    <div className="ob-sub">{authMode === 'login' ? 'Entre com sua conta.' : 'Comece agora, é grátis.'}</div>
                    
                    {/* OAuth Buttons */}
                    <div style={{display: 'flex', flexDirection: 'column', gap: '8px', width: '100%'}}>
                        <button onClick={() => signIn('google')} style={{width:"100%",padding:"12px",borderRadius:"12px",border:"1.5px solid var(--cream-dark)",background:"var(--cream)",cursor:"pointer",fontSize:"14px",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:"10px",color:"var(--ink)",fontWeight:"500"}}>
                            <Icons.Chrome size={18} /> Continuar com Google
                        </button>
                    </div>

                    {/* Divider */}
                    <div style={{display:'flex',alignItems:'center',gap:'10px',width:'100%',margin:'16px 0'}}>
                        <div style={{flex:1,height:'1px',background:'var(--cream-dark)'}}></div>
                        <span style={{fontSize:'12px',color:'var(--ink-faint)'}}>ou</span>
                        <div style={{flex:1,height:'1px',background:'var(--cream-dark)'}}></div>
                    </div>

                    {/* Email/Password Form */}
                    <div style={{display:'flex',flexDirection:'column',gap:'10px',width:'100%'}}>
                        {authMode === 'register' && (
                            <input className="ob-input" type="text" placeholder="Seu nome completo" value={authName} onChange={e => setAuthName(e.target.value)} style={{margin:0}} />
                        )}
                        <input className="ob-input" type="email" placeholder="seu@email.com" value={authEmail} onChange={e => setAuthEmail(e.target.value)} style={{margin:0}} />
                        <input className="ob-input" type="password" placeholder="Senha" value={authPassword} onChange={e => setAuthPassword(e.target.value)} style={{margin:0}} />
                        {authMode === 'register' && (
                          <label style={{display:'flex',alignItems:'flex-start',gap:'10px',fontSize:'13px',color:'var(--ink-mid)',cursor:'pointer',lineHeight:'1.5',marginTop:'4px'}}>
                            <input
                              type="checkbox"
                              checked={termsAccepted}
                              onChange={e => setTermsAccepted(e.target.checked)}
                              style={{marginTop:'2px',accentColor:'var(--coral)',flexShrink:0,width:'16px',height:'16px',cursor:'pointer'}}
                            />
                            <span>Li e aceito os <a href="/termos" target="_blank" style={{color:'var(--coral)',textDecoration:'underline'}}>Termos de Uso</a> e a <a href="/privacidade" target="_blank" style={{color:'var(--coral)',textDecoration:'underline'}}>Política de Privacidade</a>.</span>
                          </label>
                        )}
                        {authError && <div style={{fontSize:'13px',color:'var(--coral)',padding:'8px 12px',background:'rgba(232,80,58,0.08)',borderRadius:'8px'}}>{authError}</div>}
                        <button className="ob-btn" style={{marginTop:'4px'}} onClick={async () => {
                            setAuthError('');
                            if (authMode === 'login') {
                                const res = await signIn('credentials', { email: authEmail, password: authPassword, redirect: false });
                                if (res?.error) setAuthError('Email ou senha incorretos.');
                            } else {
                                if (!authName || !authEmail || !authPassword) { setAuthError('Preencha todos os campos.'); return; }
                                if (!termsAccepted) { setAuthError('Você precisa aceitar os Termos de Uso para continuar.'); return; }
                                const res = await registerUser({ name: authName, email: authEmail, password: authPassword, termsAccepted });
                                if ('error' in res && res.error) { setAuthError(res.error); return; }
                                await signIn('credentials', { email: authEmail, password: authPassword, redirect: false });
                            }
                        }}>{authMode === 'login' ? 'Entrar' : 'Criar conta'} <span>→</span></button>
                        <div style={{textAlign:'center',fontSize:'13px',color:'var(--ink-light)',cursor:'pointer'}} onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(''); setTermsAccepted(false); }}>
                            {authMode === 'login' ? 'Não tem conta? Criar conta' : 'Já tem conta? Entrar'}
                        </div>
                    </div>
                </div>

                
                <div className="ob-screen" id="ob-3" style={{ display: obStep === 3 ? 'flex' : 'none' }}>
                    <div className="ob-step">Passo 3 de 5</div>
                    <div className="ob-title">Como você vai usar? 🤔</div>
                    <div className="ob-sub">Conta pra gente — vamos personalizar tudo pra você.</div>
                    <div className="ob-cards">
                        <div className={`ob-card ${obUseMode === 'solo' ? 'selected' : ''}`} onClick={() => setObUseMode('solo')} style={{cursor:'pointer'}}>
                            <div className="ob-card-check" style={{position:'absolute',top:'12px',right:'12px',width:'22px',height:'22px',borderRadius:'50%',background: obUseMode === 'solo' ? 'var(--coral)' : 'var(--cream-dark)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',color: obUseMode === 'solo' ? 'white' : 'transparent',transition:'all 0.2s'}}>✓</div>
                            <div className="ob-card-icon"><Icons.User size={24} strokeWidth={1.5} /></div>
                            <div className="ob-card-title">Só eu mesmo</div>
                            <div className="ob-card-desc">Uso pessoal, freelance ou estudos</div>
                        </div>
                        <div className={`ob-card ${obUseMode === 'team' ? 'selected' : ''}`} onClick={() => setObUseMode('team')} style={{cursor:'pointer'}}>
                            <div className="ob-card-check" style={{position:'absolute',top:'12px',right:'12px',width:'22px',height:'22px',borderRadius:'50%',background: obUseMode === 'team' ? 'var(--coral)' : 'var(--cream-dark)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',color: obUseMode === 'team' ? 'white' : 'transparent',transition:'all 0.2s'}}>✓</div>
                            <div className="ob-card-icon"><Icons.Users size={24} strokeWidth={1.5} /></div>
                            <div className="ob-card-title">Com minha equipe</div>
                            <div className="ob-card-desc">Colaboração com outras pessoas</div>
                        </div>
                    </div>
                    <button className="ob-btn" onClick={() => { if(obUseMode) setObStep(4); }} style={{opacity: obUseMode ? 1 : 0.5, cursor: obUseMode ? 'pointer' : 'not-allowed'}}>Continuar <span>→</span></button>
                </div>

                
                <div className="ob-screen" id="ob-4" style={{ display: obStep === 4 ? 'flex' : 'none' }}>
                    <div className="ob-step">Passo 4 de 5</div>
                    <div className="ob-title">Hoje você organiza como? 📋</div>
                    <div className="ob-sub">Pode marcar mais de um — sem julgamento! 😄</div>
                    <div className="ob-options">
                        {(['notas','outro-app','agenda','memoria','planilha'] as const).map((key, i) => {
                          const labels = ['Bloco de notas físico', 'Outro app de tarefas', 'Agenda/calendário', 'Tudo na memória (corajoso!)', 'Planilha ou Notion'];
                          const icons = [<Icons.BookOpen key={key} size={18} strokeWidth={2} />, <Icons.Smartphone key={key} size={18} strokeWidth={2} />, <Icons.Calendar key={key} size={18} strokeWidth={2} />, <Icons.Brain key={key} size={18} strokeWidth={2} />, <Icons.BarChart2 key={key} size={18} strokeWidth={2} />];
                          const sel = obPrevTools.includes(key);
                          return (
                            <div key={key} className={`ob-option ${sel ? 'selected' : ''}`} style={{cursor:'pointer',justifyContent:'space-between'}} onClick={() => setObPrevTools(prev => sel ? prev.filter(k=>k!==key) : [...prev, key])}>
                              <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                                <span className="ob-option-emoji">{icons[i]}</span>
                                <span>{labels[i]}</span>
                              </div>
                              <div style={{width:'20px',height:'20px',borderRadius:'50%',border:`2px solid ${sel ? 'var(--coral)' : 'var(--cream-dark)'}`,background: sel ? 'var(--coral)' : 'transparent',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',color:'white',flexShrink:0,transition:'all 0.2s'}}>✓</div>
                            </div>
                          );
                        })}
                    </div>
                    {obPrevTools.includes('memoria') && <div style={{fontSize:'13px',color:'var(--coral)',background:'rgba(232,80,58,0.06)',borderRadius:'12px',padding:'12px 16px',marginBottom:'16px',fontWeight:'500'}}>💪 <strong>Corajoso!</strong> Vamos te dar uma estrutura incrível para organizar tudo.</div>}
                    <button className="ob-btn" onClick={() => { if(obPrevTools.length > 0) setObStep(5); }} style={{opacity: obPrevTools.length > 0 ? 1 : 0.5, cursor: obPrevTools.length > 0 ? 'pointer' : 'not-allowed'}}>Continuar <span>→</span></button>
                </div>

                
                <div className="ob-screen" id="ob-5" style={{ display: obStep === 5 ? 'flex' : 'none' }}>
                    <div className="ob-step">Passo 5 de 5</div>
                    <div className="ob-title">Sua rotina dos sonhos 🌟</div>
                    <div className="ob-sub">Clique nos blocos que fazem parte do seu dia. Você pode mudar depois!</div>
                    <div className="timeline-suggestions">
                        {(['Foco profundo','Tarefas rápidas','Revisão do dia','Leitura','Exercício','Pausa/Refeição'] as const).map(name => {
                          const sel = obRoutines.includes(name);
                          return (
                            <div key={name} className={`timeline-chip ${sel ? 'selected' : ''}`} onClick={() => setObRoutines(prev => sel ? prev.filter(r=>r!==name) : [...prev, name])} style={{cursor:'pointer'}}>
                              {sel ? `✓ ${name}` : `+ ${name}`}
                            </div>
                          );
                        })}
                    </div>
                    {obRoutines.length > 0 && <div style={{fontSize:'13px',color:'var(--coral)',fontWeight:'600',marginBottom:'12px'}}>{obRoutines.length} bloco{obRoutines.length > 1 ? 's' : ''} selecionado{obRoutines.length > 1 ? 's' : ''} ✓</div>}
                    <div style={{fontSize:'13px',color:'var(--ink-faint)',marginBottom:'16px'}}>Clique nos chips acima para selecionar seus blocos de rotina.</div>
                    <button className="ob-btn" onClick={() => { if(obRoutines.length > 0) { localStorage.setItem('ob_' + session?.user?.email, 'true'); setActiveScreen('app'); } }} style={{opacity: obRoutines.length > 0 ? 1 : 0.5, cursor: obRoutines.length > 0 ? 'pointer' : 'not-allowed'}}>Começar a usar! 🚀</button>
                </div>

                <div>
                    <div className="ob-progress">
                        <div className={`ob-dot ${obStep >= 1 ? 'active' : ''}`} id="p1"></div>
                        <div className={`ob-dot ${obStep >= 2 ? 'active' : ''}`} id="p2"></div>
                        <div className={`ob-dot ${obStep >= 3 ? 'active' : ''}`} id="p3"></div>
                        <div className={`ob-dot ${obStep >= 4 ? 'active' : ''}`} id="p4"></div>
                        <div className={`ob-dot ${obStep >= 5 ? 'active' : ''}`} id="p5"></div>
                    </div>
                </div>
            </div>

            <div className="onboarding-right">
                
                <div className="ob-visual" id="obr-1" style={{ display: obStep === 1 ? 'block' : 'none' }}>
                    <div className="ob-impact">
                        <div className="ob-impact-num">47<span>k</span></div>
                        <div className="ob-impact-label">pessoas mais produtivas</div>
                        <div className="ob-impact-num" style={{"fontSize":"40px"}}>2.1<span>M</span></div>
                        <div className="ob-impact-label">tarefas concluídas</div>
                        <div className="ob-impact-num" style={{"fontSize":"40px"}}>4.9<span>★</span></div>
                        <div className="ob-impact-label">avaliação na App Store</div>
                    </div>
                </div>
                <div className="ob-visual" id="obr-2" style={{ display: obStep === 2 ? 'block' : 'none' }}>
                    <div className="ob-preview-card">
                        <div className="ob-preview-title">📊 Seu Dashboard</div>
                        <div className="ob-preview-row">
                            <div className="ob-preview-dot" style={{"background":"var(--coral)"}}></div><span className="ob-preview-text">Tarefas hoje</span><span className="ob-preview-tag">7
                                pendentes</span>
                        </div>
                        <div className="ob-preview-row">
                            <div className="ob-preview-dot" style={{"background":"var(--green)"}}></div><span className="ob-preview-text">Streak atual</span><span className="ob-preview-tag">🔥 12
                                dias</span>
                        </div>
                        <div className="ob-preview-row">
                            <div className="ob-preview-dot" style={{"background":"var(--amber)"}}></div><span className="ob-preview-text">Produtividade</span><span className="ob-preview-tag">↑ 23%</span>
                        </div>
                        <div className="ob-preview-row">
                            <div className="ob-preview-dot" style={{"background":"var(--blue)"}}></div><span className="ob-preview-text">Próxima rotina</span><span className="ob-preview-tag">em 15
                                min</span>
                        </div>
                    </div>
                </div>
                <div className="ob-visual" id="obr-3" style={{ display: obStep === 3 ? 'block' : 'none' }}>
                    <div className="ob-preview-card">
                        <div className="ob-preview-title">🗂️ Projetos</div>
                        <div className="ob-preview-row">
                            <div className="ob-preview-dot" style={{"background":"var(--coral)"}}></div><span className="ob-preview-text">Trabalho</span><span className="ob-preview-tag">12 tarefas</span>
                        </div>
                        <div className="ob-preview-row">
                            <div className="ob-preview-dot" style={{"background":"var(--blue)"}}></div><span className="ob-preview-text">Estudos</span><span className="ob-preview-tag">8 tarefas</span>
                        </div>
                        <div className="ob-preview-row">
                            <div className="ob-preview-dot" style={{"background":"var(--green)"}}></div><span className="ob-preview-text">Pessoal</span><span className="ob-preview-tag">5 tarefas</span>
                        </div>
                        <div className="ob-preview-row">
                            <div className="ob-preview-dot" style={{"background":"var(--purple)"}}></div><span className="ob-preview-text">Freelance</span><span className="ob-preview-tag">3 tarefas</span>
                        </div>
                    </div>
                </div>
                <div className="ob-visual" id="obr-4" style={{ display: obStep === 4 ? 'block' : 'none' }}>
                    <div className="ob-preview-card">
                        <div className="ob-preview-title">💡 easy list vai te ajudar a...</div>
                        <div className="ob-preview-row"><span className="ob-preview-text">✓ Nunca mais esquecer prazos</span>
                        </div>
                        <div className="ob-preview-row"><span className="ob-preview-text">✓ Organizar o dia
                                automaticamente</span></div>
                        <div className="ob-preview-row"><span className="ob-preview-text">✓ Construir hábitos
                                consistentes</span></div>
                        <div className="ob-preview-row"><span className="ob-preview-text">✓ Ser notificado na hora certa</span>
                        </div>
                    </div>
                </div>
                <div className="ob-visual" id="obr-5" style={{ display: obStep === 5 ? 'block' : 'none' }}>
                    <div className="ob-preview-card">
                        <div className="ob-preview-title"><Icons.Zap size={14} style={{display:'inline', marginBottom:'-2px'}} /> Rotinas = superpoder</div>
                        <div className="ob-preview-row"><span className="ob-preview-text"><Icons.Flame size={14} style={{display:'inline', marginBottom:'-2px', color:'var(--coral)'}} /> 08h-12h · Foco Profundo</span>
                        </div>
                        <div className="ob-preview-row"><span className="ob-preview-text"><Icons.Leaf size={14} style={{display:'inline', marginBottom:'-2px', color:'var(--green)'}} /> 13h-14h · Tarefas Rápidas</span>
                        </div>
                        <div className="ob-preview-row"><span className="ob-preview-text"><Icons.ClipboardCheck size={14} style={{display:'inline', marginBottom:'-2px', color:'var(--purple)'}} /> 17h-18h · Revisão do Dia</span>
                        </div>
                        <div style={{"marginTop":"16px","fontSize":"12px","color":"rgba(255,255,255,0.4)"}}>O app preenche seus
                            blocos automaticamente baseado em prioridade e tempo estimado.</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    
    <div id="app" style={{ display: activeScreen === 'app' ? 'block' : 'none' }}>
        <div className="app-layout">
            
            {/* MOBILE OVERLAY */}
            <div className={`sidebar-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>

            <div className={`app-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
                <div className="sidebar-logo" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div>easy<span>list</span></div>
                <button className="mobile-close-btn" onClick={() => setIsMobileMenuOpen(false)} style={{background:'transparent',border:'none',color:'var(--ink-mid)'}}
                    aria-label="Fechar menu">
                    <Icons.X size={20} strokeWidth={1.5} />
                </button>
                </div>

                <div className="sidebar-section">
                    <div className="sidebar-section-title">{t('menu', lang)}</div>
                    <div className={`sidebar-item ${activeTab === 'Meu Dia' ? 'active' : ''}`} onClick={() => setActiveTab('Meu Dia')}>
                        <Icons.Sun size={18} className="sidebar-item-icon" />
                        {t('myDay', lang)}
                        <span className="sidebar-item-count" id="my-day-count">{tasks.filter(t => !t.isDone).length}</span>
                    </div>
                    <div className={`sidebar-item ${activeTab === 'Caixa de Entrada' ? 'active' : ''}`} onClick={() => setActiveTab('Caixa de Entrada')}>
                        <Icons.Inbox size={18} className="sidebar-item-icon" />
                        {t('inbox', lang)}
                    </div>
                    <div className={`sidebar-item ${activeTab === 'Importantes' ? 'active' : ''}`} onClick={() => setActiveTab('Importantes')}>
                        <Icons.Star size={18} className="sidebar-item-icon" />
                        {t('important', lang)}
                    </div>
                    <div className={`sidebar-item ${activeTab === 'Esta Semana' ? 'active' : ''}`} onClick={() => setActiveTab('Esta Semana')}>
                        <Icons.Calendar size={18} className="sidebar-item-icon" />
                        {t('thisWeek', lang)}
                    </div>
                    <div className={`sidebar-item ${activeTab === 'Minhas Tarefas' ? 'active' : ''}`} onClick={() => setActiveTab('Minhas Tarefas')}>
                        <Icons.ListTodo size={18} className="sidebar-item-icon" />
                        Minhas Tarefas
                        <span className="sidebar-item-count" style={{background:'var(--ink)'}}>{tasks.length}</span>
                    </div>
                    <div className={`sidebar-item ${activeTab === 'Lista de Compras' ? 'active' : ''}`} onClick={() => setActiveTab('Lista de Compras')}>
                        <Icons.ShoppingCart size={18} className="sidebar-item-icon" />
                        Lista de Compras
                        {shoppingLists.length > 0 && <span className="sidebar-item-count" style={{background:'var(--green)'}}>{shoppingLists.reduce((acc: number, l: any) => acc + (l.items?.filter((i: any) => !i.purchased).length ?? 0), 0)}</span>}
                    </div>
                    <div className={`sidebar-item ${activeTab === 'Rotinas' ? 'active' : ''}`} onClick={() => setActiveTab('Rotinas')}>
                        <Icons.Clock size={18} className="sidebar-item-icon" />
                        {t('routines', lang)}
                    </div>
                    <div className={`sidebar-item ${activeTab === 'Equipes' ? 'active' : ''}`} onClick={() => {
                        if (currentUserData?.plan === 'FREE') {
                            setSuccessToast('Acesso restrito. Equipes exigem o Plano Pro ou Premium.');
                            setTimeout(() => setSuccessToast(''), 4000);
                            return;
                        }
                        setActiveTab('Equipes');
                    }}>
                        <Icons.Users size={18} className="sidebar-item-icon" />
                        Equipes
                        {currentUserData?.plan === 'FREE' && <Icons.Lock size={12} color="var(--ink-light)" style={{marginLeft:'auto'}} />}
                    </div>
                    <div className={`sidebar-item ${activeTab === 'Concluídas' ? 'active' : ''}`} onClick={() => setActiveTab('Concluídas')}>
                        <Icons.CheckCircle size={18} className="sidebar-item-icon" />
                        {t('completed', lang)}
                    </div>
                    <div className={`sidebar-item ${activeTab === 'Dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('Dashboard')}>
                        <Icons.BarChart2 size={18} className="sidebar-item-icon" />
                        {t('dashboard', lang)}
                    </div>
                    <div className={`sidebar-item ${activeTab === 'Planos' ? 'active' : ''}`} onClick={() => setActiveTab('Planos')}>
                        <Icons.CreditCard size={18} className="sidebar-item-icon" />
                        {t('plans', lang)}
                    </div>
                    {currentUserData?.role === 'ADMIN' && (
                        <div className={`sidebar-item ${activeTab === 'Admin' ? 'active' : ''}`} onClick={() => {
                            setActiveTab('Admin');
                            adminGetAllUsers().then(setAdminUsers);
                        }}>
                            <Icons.Shield size={18} className="sidebar-item-icon" />
                            Admin
                        </div>
                    )}
                </div>

                <div className="sidebar-section" style={{"marginTop":"20px"}}>
                    <div className="sidebar-section-title">{t('projects', lang)}</div>
                    {projects.map((p: any) => (
                        <div key={p.id} className={`sidebar-project ${activeTab === `proj-${p.id}` ? 'active' : ''}`} onClick={() => setActiveTab(`proj-${p.id}`)}>
                            <div className="sidebar-project-dot" style={{background: p.color}}></div>
                            {p.name}
                            <span style={{marginLeft:'auto',fontSize:'11px',color:'var(--ink-faint)'}}>{p._count?.tasks ?? 0}</span>
                        </div>
                    ))}
                    <div style={{padding:'8px 12px',fontSize:'13px',color:'var(--coral)',cursor:'pointer'}} onClick={() => setIsNewProjectOpen(true)}>{t('newProject', lang)}</div>
                </div>

                {/* BOTTOM PROFILE - clickable */}
                <div style={{"padding":"16px 24px","marginTop":"auto","position":"relative"}}>
                    <div style={{"background":"rgba(232,80,58,0.08)","borderRadius":"12px","padding":"14px","marginBottom":"12px"}}>
                        <div style={{"fontSize":"12px","fontWeight":"600","color":"var(--coral)","marginBottom":"4px"}}><Icons.Flame size={12} style={{display:'inline',marginBottom:'-1px'}} /> Streak: {streak} {streak === 1 ? 'dia' : 'dias'}!</div>
                        <div style={{"fontSize":"12px","color":"var(--ink-light)"}}>{streak > 0 ? 'Continue assim. Você está indo bem.' : 'Complete uma tarefa hoje para começar!'}</div>
                    </div>

                    {/* Profile Popup */}
                    {isProfileOpen && (
                        <div style={{position:'absolute',bottom:'90px',left:'24px',right:'24px',background:'var(--white)',border:'1px solid var(--cream-dark)',borderRadius:'16px',padding:'16px',boxShadow:'0 8px 32px rgba(0,0,0,0.12)',zIndex:100}}>
                            <div style={{display:'flex',alignItems:'center',gap:'12px',paddingBottom:'12px',borderBottom:'1px solid var(--cream-dark)'}}>
                                <div style={{width:'44px',height:'44px',borderRadius:'50%',background:'var(--coral)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:'700',overflow:'hidden',flexShrink:0}}>
                                    {session?.user?.image ? <img src={session.user.image} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} /> : (session?.user?.name?.[0] || 'U')}
                                </div>
                                <div>
                                    <div style={{fontSize:'14px',fontWeight:'600',color:'var(--ink)',overflow:'hidden',textOverflow:'ellipsis',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',wordBreak:'break-word'}}>{session?.user?.name || 'Usuário'}</div>
                                    <div style={{fontSize:'12px',color:'var(--ink-light)',overflow:'hidden',textOverflow:'ellipsis'}}>{session?.user?.email}</div>
                                    <div style={{fontSize:'11px',color:'var(--coral)',marginTop:'2px',fontWeight:'500'}}>
                                        {currentUserData?.plan === 'PRO' ? 'Plano Pro ✨' : currentUserData?.plan === 'PREMIUM' ? 'Plano Premium 👑' : 'Plano Gratuito'}
                                    </div>
                                </div>
                            </div>
                            <div style={{paddingTop:'8px',display:'flex',flexDirection:'column',gap:'4px'}}>
                                <div style={{padding:'8px 4px',fontSize:'13px',color:'var(--ink-mid)',cursor:'pointer',display:'flex',alignItems:'center',gap:'8px',borderRadius:'8px'}} onClick={() => { setActiveTab('Meu Perfil'); setIsProfileOpen(false); }} onMouseEnter={e=>(e.currentTarget.style.background='var(--cream)')} onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                                    <Icons.User size={15}/> Meu perfil
                                </div>
                                <div style={{padding:'8px 4px',fontSize:'13px',color:'var(--ink-mid)',cursor:'pointer',display:'flex',alignItems:'center',gap:'8px',borderRadius:'8px'}} onClick={() => { setActiveTab('Configurações'); setIsProfileOpen(false); }} onMouseEnter={e=>(e.currentTarget.style.background='var(--cream)')} onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                                    <Icons.Settings size={15}/> Configurações
                                </div>
                                <div style={{padding:'8px 4px',fontSize:'13px',color:'var(--coral)',cursor:'pointer',display:'flex',alignItems:'center',gap:'8px',borderRadius:'8px',fontWeight:'500'}} onClick={() => signOut()} onMouseEnter={e=>(e.currentTarget.style.background='rgba(232,80,58,0.08)')} onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                                    <Icons.LogOut size={15}/> Sair da conta
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Profile row */}
                    <div style={{display:'flex',alignItems:'center',gap:'10px',cursor:'pointer',padding:'6px',borderRadius:'12px',transition:'background 0.2s'}} onClick={() => setIsProfileOpen(!isProfileOpen)} onMouseEnter={e=>(e.currentTarget.style.background='var(--cream)')} onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                        <div style={{width:'36px',height:'36px',borderRadius:'10px',background:'var(--cream)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--coral)',fontWeight:'bold',fontSize:'16px',flexShrink:0,overflow:'hidden'}}>
                            {currentUserData?.image ? (
                                <img src={currentUserData.image} alt="Avatar" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                            ) : (
                                session?.user?.name?.[0] || 'U'
                            )}
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                            <div style={{fontSize:'13px',fontWeight:'500',color:'var(--ink)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{session?.user?.name?.split(' ')[0] || 'Usuário'}</div>
                            <div style={{fontSize:'10px', fontWeight:'700', color: currentUserData?.plan === 'PREMIUM' ? 'var(--coral)' : currentUserData?.plan === 'PRO' ? 'var(--amber)' : 'var(--ink-light)', background: currentUserData?.plan === 'PREMIUM' ? 'rgba(232,80,58,0.08)' : currentUserData?.plan === 'PRO' ? 'rgba(245,158,11,0.08)' : 'transparent', padding:'2px 6px', borderRadius:'6px', display:'inline-block', marginTop:'2px', textTransform:'uppercase', letterSpacing:'0.3px', border: currentUserData?.plan === 'FREE' ? 'none' : `1px solid ${currentUserData?.plan === 'PREMIUM' ? 'rgba(232,80,58,0.2)' : 'rgba(245,158,11,0.2)'}`}}>
                                {currentUserData?.plan === 'PREMIUM' ? 'Premium ✨' : currentUserData?.plan === 'PRO' ? 'Pro ⭐' : 'Gratuito'}
                            </div>
                        </div>
                        <Icons.ChevronUp size={14} style={{color:'var(--ink-faint)',transform: isProfileOpen ? 'rotate(180deg)' : 'none',transition:'transform 0.2s'}} />
                    </div>
                </div>
            </div>

            
            {/* ======== MAIN CONTENT ======== */}
            <div className="app-main">
                <div className="app-top">
                    <div style={{display:'flex', alignItems:'center', gap:'16px'}}>
                        <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)} style={{background:'transparent',border:'none',color:'var(--ink)',cursor:'pointer',padding:'6px',borderRadius:'8px',transition:'background var(--duration) var(--ease)'}} aria-label="Abrir menu"
                            onMouseEnter={e=>(e.currentTarget.style.background='var(--cream)')}
                            onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                            <Icons.Menu size={22} strokeWidth={1.5} />
                        </button>
                        <div>
                            <div className="app-greeting">
                            {(!mounted || activeTab === 'Meu Dia')
                                ? <>{(() => { if (!mounted) return 'Carregando...'; const h = new Date().getHours(); return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'; })()}, <span style={{color:'var(--coral)'}}>{session?.user?.name?.split(' ')[0] || 'Usuário'}</span>! 👋</>
                                : activeTab === 'Meu Perfil'
                                ? <span style={{fontWeight:700,color:'var(--ink)'}}>Meu Perfil</span>
                                : activeTab === 'Configurações'
                                ? <span style={{fontWeight:700,color:'var(--ink)'}}>Configurações</span>
                                : <span style={{fontWeight:700,color:'var(--ink)'}}>{activeTab.startsWith('proj-') ? projects.find((p:any)=>p.id===activeTab.replace('proj-',''))?.name || 'Projeto' : activeTab}</span>}
                            </div>
                            <div className="app-date">{mounted ? new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ''}</div>
                        </div>
                    </div>
                    {/* Per-tab action button */}
                    {activeTab === 'Meu Dia' && (
                        <button className="app-add-btn" onClick={() => openTaskModal()}><Icons.Plus size={16} style={{display:'inline',marginBottom:'-3px'}}/> Nova tarefa</button>
                    )}
                    {activeTab === 'Caixa de Entrada' && (
                        <button className="app-add-btn" onClick={() => openTaskModal()}><Icons.Plus size={16} style={{display:'inline',marginBottom:'-3px'}}/> Adicionar tarefa</button>
                    )}
                    {activeTab === 'Importantes' && (
                        <button className="app-add-btn" onClick={() => openTaskModal({ priority: 'high', important: true })}><Icons.Star size={16} style={{display:'inline',marginBottom:'-3px'}}/> Tarefa importante</button>
                    )}
                    {activeTab === 'Esta Semana' && (
                        <button className="app-add-btn" onClick={() => openTaskModal({ date: selectedWeekDate || new Date().toISOString().split('T')[0] })}><Icons.Calendar size={16} style={{display:'inline',marginBottom:'-3px'}}/> Dia selecionado</button>
                    )}
                    {activeTab === 'Rotinas' && (
                        <button className="app-add-btn" onClick={() => setIsRoutineModalOpen(true)}>
                            <Icons.Plus size={16} style={{display:'inline',marginBottom:'-3px'}}/> Nova rotina
                        </button>
                    )}
                    {activeTab === 'Concluídas' && (
                        <></>
                    )}
                    {activeTab.startsWith('proj-') && (
                        <button className="app-add-btn" onClick={() => openTaskModal({ projectId: activeTab.replace('proj-','') })}><Icons.Plus size={16} style={{display:'inline',marginBottom:'-3px'}}/> Nova tarefa</button>
                    )}
                </div>

                {/* ---- MEU DIA ---- */}
                {activeTab === 'Meu Dia' && (
                    <>
                        <div className="stats-row">
                            <div className="stat-card">
                                <div className="stat-card-label">Tarefas Hoje</div>
                                <div className="stat-card-num">{tasks.filter(t => !t.isDone && (!t.date || new Date(t.date).toISOString().split('T')[0] <= new Date().toISOString().split('T')[0])).length}</div>
                                <div className="stat-card-trend">pendentes</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-card-label">Concluídas</div>
                                <div className="stat-card-num" style={{color:'var(--green)'}}>{tasks.filter(t => t.isDone).length}</div>
                                <div className="stat-card-trend">↑ hoje</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-card-label">Streak</div>
                                <div className="stat-card-num" style={{color:'var(--coral)'}}><Icons.Flame size={16} fill="var(--coral)" style={{display:'inline',marginBottom:'-2px'}} /> {streak}</div>
                                <div className="stat-card-trend">dias seguidos</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-card-label">Esta semana</div>
                                <div className="stat-card-num">{weeklyRate}<span style={{fontSize:'18px',color:'var(--ink-light)'}}>%</span></div>
                                <div className="stat-card-trend">taxa de conclusão</div>
                            </div>
                        </div>

                        {/* Daily Briefing Banner — Matte Ceramic */}
                        {(() => {
                            const hour = new Date().getHours();
                            const todayStr = new Date().toISOString().split('T')[0];
                            const name = (session?.user?.name?.split(' ')[0]) || '';
                            const greetKey = hour < 12 ? 'goodMorning' : hour < 18 ? 'goodAfternoon' : 'goodEvening';
                            const greeting = `${t(greetKey, lang)}${name ? `, ${name}` : ''}!`;

                            const overdueTasks = tasks.filter(t => !t.routineName && !t.isDone && t.date && new Date(t.date).toISOString().split('T')[0] < todayStr);
                            const todayTasks = tasks.filter(t => !t.isDone && (!t.date || new Date(t.date).toISOString().split('T')[0] === todayStr));
                            const importantPending = tasks.filter(t => !t.isDone && t.priority === 'high' && (!t.date || new Date(t.date).toISOString().split('T')[0] <= todayStr));
                            const allPending = tasks.filter(t => !t.isDone && (!t.date || new Date(t.date).toISOString().split('T')[0] <= todayStr));
                            const totalToday = allPending.length + tasks.filter(t => t.isDone).length;
                            const completedToday = tasks.filter(t => t.isDone).length;
                            const pct = totalToday > 0 ? Math.round(completedToday / totalToday * 100) : 0;

                            return (
                                <div style={{
                                    background: 'var(--white)',
                                    border: '1px solid var(--cream-dark)',
                                    borderRadius: '16px',
                                    padding: '24px 28px',
                                    marginBottom: '28px',
                                    display: 'grid',
                                    gridTemplateColumns: '1fr auto',
                                    gap: '24px',
                                    alignItems: 'center',
                                    boxShadow: 'var(--shadow-xs)',
                                }}>
                                    {/* Left: greeting + subtitle + chips */}
                                    <div>
                                        <div style={{fontSize:'20px', fontWeight:'700', color:'var(--ink)', letterSpacing:'-0.02em', fontFamily:"'Fraunces',serif", textWrap:'balance', marginBottom:'4px'}}>{greeting}</div>
                                        <div style={{fontSize:'13px', color:'var(--ink-light)', marginBottom: allPending.length > 0 ? '16px' : '0'}}>
                                            {allPending.length === 0 
                                                ? t('noTasksToday', lang)
                                                : (lang === 'en' ? `${allPending.length} task${allPending.length > 1 ? 's' : ''} waiting for you.` : lang === 'es' ? `${allPending.length} tarea${allPending.length > 1 ? 's' : ''} pendiente${allPending.length > 1 ? 's' : ''}.` : `${allPending.length} tarefa${allPending.length > 1 ? 's' : ''} esperando por você.`)
                                            }
                                        </div>
                                        {allPending.length > 0 && (
                                            <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
                                                {overdueTasks.length > 0 && (
                                                    <div style={{display:'flex', alignItems:'center', gap:'5px', background:'rgba(232,80,58,0.08)', color:'var(--coral)', borderRadius:'8px', padding:'5px 10px', fontSize:'12px', fontWeight:'600'}}>
                                                        <Icons.AlertCircle size={13} strokeWidth={2}/>
                                                        {overdueTasks.length} {overdueTasks.length === 1 ? t('overdueTask', lang) : t('overdueTasks', lang)}
                                                    </div>
                                                )}
                                                {todayTasks.length > 0 && (
                                                    <div style={{display:'flex', alignItems:'center', gap:'5px', background:'rgba(58,110,168,0.08)', color:'var(--blue)', borderRadius:'8px', padding:'5px 10px', fontSize:'12px', fontWeight:'600'}}>
                                                        <Icons.CalendarCheck size={13} strokeWidth={2}/>
                                                        {todayTasks.length} {t('tasksDueToday', lang)}
                                                    </div>
                                                )}
                                                {importantPending.length > 0 && (
                                                    <div style={{display:'flex', alignItems:'center', gap:'5px', background:'rgba(212,135,42,0.08)', color:'var(--amber)', borderRadius:'8px', padding:'5px 10px', fontSize:'12px', fontWeight:'600'}}>
                                                        <Icons.Star size={13} strokeWidth={2}/>
                                                        {importantPending.length} {importantPending.length === 1 ? t('importantTask', lang) : t('importantTasks', lang)}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Right: progress ring area */}
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'8px', minWidth:'80px'}}>
                                        <div style={{fontSize:'24px', fontWeight:'700', color: pct === 100 ? 'var(--green)' : 'var(--ink)', fontFamily:"'Fraunces',serif", letterSpacing:'-0.02em', lineHeight:1}}>{pct}<span style={{fontSize:'14px', fontWeight:'500', color:'var(--ink-light)'}}>&nbsp;%</span></div>
                                        <div style={{width:'80px', height:'4px', borderRadius:'100px', background:'var(--cream-dark)', overflow:'hidden'}}>
                                            <div style={{width:`${pct}%`, height:'100%', background: pct === 100 ? 'var(--green)' : 'var(--coral)', borderRadius:'100px', transition:'width 0.4s var(--ease)'}} />
                                        </div>
                                        <div style={{fontSize:'11px', color:'var(--ink-faint)', fontWeight:'500', letterSpacing:'0.02em'}}>{completedToday}/{totalToday > 0 ? totalToday : '–'}</div>
                                    </div>
                                </div>
                            );
                        })()}

                        <div className="section-header">
                            <h2>Tarefas de Hoje</h2>
                            <a style={{cursor:'pointer'}} onClick={() => openTaskModal()}>+ Adicionar</a>
                        </div>
                        <div className="task-list">
                            {tasks.filter(t => !t.isDone && (!t.date || new Date(t.date).toISOString().split('T')[0] <= new Date().toISOString().split('T')[0])).map(renderTaskItem)}
                            {tasks.filter(t => !t.isDone && (!t.date || new Date(t.date).toISOString().split('T')[0] <= new Date().toISOString().split('T')[0])).length === 0 && tasks.length === 0 && (
                                <div style={{textAlign:'center',padding:'40px 20px',color:'var(--ink-faint)'}}>
                                    <Icons.PlusCircle size={40} strokeWidth={1} style={{margin:'0 auto 12px',display:'block',color:'var(--coral)'}} />
                                    Comece criando sua primeira tarefa acima.
                                </div>
                            )}
                            {tasks.filter(t => !t.isDone && (!t.date || new Date(t.date).toISOString().split('T')[0] <= new Date().toISOString().split('T')[0])).length === 0 && tasks.length > 0 && (
                                <div style={{textAlign:'center',padding:'40px 20px',color:'var(--ink-faint)'}}>
                                    <Icons.CheckCircle2 size={40} strokeWidth={1} style={{margin:'0 auto 12px',display:'block',color:'var(--green)'}} />
                                    Todas as tarefas de hoje estão concluídas. Ótimo trabalho!
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* ---- CAIXA DE ENTRADA ---- */}
                {activeTab === 'Caixa de Entrada' && (
                    <>
                        <div className="section-header">
                            <h2>Caixa de Entrada (Inbox)</h2>
                            <a style={{cursor:'pointer'}} onClick={() => openTaskModal()}>+ Adicionar Rápido</a>
                        </div>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))',gap:'16px'}}>
                            {tasks.filter(t => !t.isDone && !t.projectId).map(t => {
                                const isOverdue = !t.routineName && !t.isDone && t.date && new Date(t.date).toISOString().split('T')[0] < new Date().toISOString().split('T')[0];
                                return (
                                <div key={t.id} style={{background: 'var(--white)', padding: '20px', borderRadius: '16px', border: '1px solid var(--cream-dark)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden'}}>
                                    <div style={{position:'absolute',top:0,left:0,bottom:0,width:'4px',background: t.priority==='high'?'var(--coral)':t.priority==='medium'?'var(--amber)':'var(--green)'}}></div>
                                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'12px'}}>
                                        <div style={{fontSize:'11px',fontWeight:'600',color:t.priority==='high'?'var(--coral)':t.priority==='medium'?'var(--amber)':'var(--green)',background:t.priority==='high'?'rgba(232,80,58,0.1)':t.priority==='medium'?'rgba(212,135,42,0.1)':'rgba(61,122,94,0.1)',padding:'4px 8px',borderRadius:'8px', textTransform:'uppercase'}}>
                                            {t.priority === 'high' ? 'Alta' : t.priority === 'medium' ? 'Média' : 'Baixa'} prioridade
                                        </div>
                                        <div style={{cursor:'pointer'}} onClick={async () => {
                                            const u = await toggleTask(t.id, !t.isDone);
                                            setTasks(tasks.map(tk => tk.id === t.id ? {...tk, isDone: u.isDone} : tk));
                                        }}>
                                            <div style={{width:'22px',height:'22px',borderRadius:'50%',border:'2px solid var(--cream-dark)',background:'transparent',transition:'all 0.2s',display:'flex',alignItems:'center',justifyContent:'center'}} onMouseEnter={e=>(e.currentTarget.style.borderColor='var(--coral)')} onMouseLeave={e=>(e.currentTarget.style.borderColor='var(--cream-dark)')}></div>
                                        </div>
                                    </div>
                                    <h3 style={{fontSize:'16px',margin:'0 0 12px 0',color:'var(--ink)',lineHeight:'1.4',fontWeight:'600'}}>{t.title}</h3>
                                    <div style={{fontSize:'12px',color:'var(--ink-light)',display:'flex',flexWrap:'wrap',gap:'12px',alignItems:'center'}}>
                                        {isOverdue && <span style={{display:'flex',alignItems:'center',gap:'4px',color:'var(--coral)',fontWeight:'600'}}><Icons.AlertCircle size={12} strokeWidth={2} /> Atrasada</span>}
                                        {t.routineName && <span style={{display:'flex',alignItems:'center',gap:'4px'}}><Icons.Clock size={12} color="var(--ink-mid)" /> {t.routineName}</span>}
                                        {t.date && !t.routineName && <span style={{display:'flex',alignItems:'center',gap:'4px'}}><Icons.Calendar size={12} color="var(--ink-mid)" /> {new Date(t.date).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'})}</span>}
                                        {t.routineName && <span style={{display:'flex',alignItems:'center',gap:'4px'}}><Icons.Calendar size={12} color="var(--ink-mid)" /> Hoje</span>}
                                        {t.startTime && <span style={{display:'flex',alignItems:'center',gap:'4px'}}><Icons.Clock size={12} color="var(--ink-mid)" /> {t.startTime} - {t.endTime}</span>}
                                    </div>
                                </div>
                            )})}
                        </div>
                        {tasks.filter(t => !t.isDone && !t.projectId).length === 0 && (
                            <div style={{textAlign:'center',padding:'60px 20px',color:'var(--ink-faint)',background:'var(--cream)',borderRadius:'16px'}}>
                                <Icons.Inbox size={48} strokeWidth={1.5} style={{margin:'0 auto 16px',display:'block',color:'var(--ink-faint)'}} />
                                Caixa de entrada vazia. Sem pendências soltas!
                            </div>
                        )}
                    </>
                )}

                {/* ---- PROJETOS ---- */}
                {activeTab.startsWith('proj-') && (
                    <>
                        <div className="section-header">
                            <h2>Projeto: {projects.find((p:any) => p.id === activeTab.replace('proj-',''))?.name || 'Vazio'}</h2>
                            <div style={{display:'flex', gap:'16px', alignItems:'center'}}>
                                {(() => {
                                    const proj = projects.find((p:any) => p.id === activeTab.replace('proj-',''));
                                    const collabs = proj?.collaborators || [];
                                    if(collabs.length === 0) return null;
                                    return (
                                        <div style={{display:'flex', marginRight:'8px'}}>
                                            {collabs.map((c:any) => (
                                                <div key={c.id} title={c.email} style={{width:'32px',height:'32px',borderRadius:'16px',background:'var(--coral)',color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',marginLeft:'-10px',border:'2px solid var(--cream)',fontWeight:'700'}}>{c.name?.charAt(0)?.toUpperCase() || '?'}</div>
                                            ))}
                                        </div>
                                    )
                                })()}
                                <button onClick={async () => {
                                    if (currentUserData?.plan === 'FREE') {
                                        setSuccessToast('Plano FREE no possui compartilhamento avanado. Faa upgrade!');
                                        return;
                                    }
                                    setShareProjectId(activeTab.replace('proj-',''));
                                    }
                                }} style={{background:'white', color:'var(--ink)', border:'1.5px solid var(--cream-dark)', borderRadius:'10px', padding:'6px 14px', fontSize:'13px', cursor:'pointer', fontWeight:'600'}}>+ Compartilhar</button>
                                <button style={{cursor:'pointer', background:'var(--coral)', color:'white', border:'none', borderRadius:'10px', padding:'7px 14px', fontSize:'13px', fontWeight:'600'}} onClick={() => openTaskModal({ projectId: activeTab.replace('proj-','') })}>Criar Tarefa</button>
                            </div>
                        </div>
                        <div className="task-list">
                            {tasks.filter(t => !t.isDone && t.projectId === activeTab.replace('proj-','')).map(renderTaskItem)}
                            {tasks.filter(t => !t.isDone && t.projectId === activeTab.replace('proj-','')).length === 0 && (
                                <div style={{textAlign:'center',padding:'40px 20px',color:'var(--ink-faint)'}}>
                                    Nenhuma pendência neste projeto.
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* ---- ROTINAS ---- */}
                {activeTab === 'Rotinas' && (
                    <>
                        <div className="routines-row">
                            {routines.length === 0 && (
                                <div style={{textAlign:'center',padding:'40px 20px',color:'var(--ink-faint)',width:'100%'}}>
                                    <Icons.Clock size={40} strokeWidth={1} style={{margin:'0 auto 12px',display:'block',color:'var(--coral)'}} />
                                    Nenhuma rotina criada. Clique em "+ Nova rotina" para começar!
                                </div>
                            )}
                            {routines.map((r: any) => {
                                const routineTasks = tasks.filter(t => t.routineName === r.name);
                                const doneTasks = routineTasks.filter(t => t.isDone);
                                const pct = routineTasks.length > 0 ? Math.round(doneTasks.length / routineTasks.length * 100) : 0;
                                return (
                                    <div key={r.id} className="routine-card" style={{background:`linear-gradient(135deg,${r.color},${r.color}99)`, cursor:'pointer'}} onClick={() => setSelectedRoutineId(selectedRoutineId === r.id ? null : r.id)}>
                                        <button onClick={async (e) => { e.stopPropagation(); await deleteRoutine(r.id); setRoutines(prev => prev.filter(x=>x.id!==r.id)); setSelectedRoutineId(null); }} style={{position:'absolute',top:'10px',right:'10px',background:'rgba(255,255,255,0.2)',border:'none',borderRadius:'50%',width:'22px',height:'22px',cursor:'pointer',color:'white',fontSize:'14px',display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>
                                        <div className="routine-card-time">{r.timeSlot}</div>
                                        <div className="routine-card-name"><Icons.Clock size={16} style={{display:'inline',marginBottom:'-2px',marginRight:'6px'}} stroke="white" /> {r.name}</div>
                                        <div className="routine-card-count">{routineTasks.length} tarefa{routineTasks.length !== 1 ? 's' : ''}</div>
                                        <div className="routine-card-progress"><div className="routine-card-bar" style={{width:`${pct}%`}}></div></div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Routine detail: when a routine is selected, show its tasks */}
                        {selectedRoutineId && (() => {
                            const r = routines.find(x => x.id === selectedRoutineId);
                            if (!r) return null;
                            const routineTasks = tasks.filter(t => t.routineName === r.name);
                            return (
                                <div style={{marginTop:'24px'}}>
                                    <div className="section-header">
                                        <h2 style={{display:'flex',alignItems:'center',gap:'8px'}}>
                                            <span style={{width:'12px',height:'12px',borderRadius:'50%',background:r.color,display:'inline-block'}}></span>
                                            {r.name}
                                        </h2>
                                        <a style={{cursor:'pointer'}} onClick={() => openTaskModal()}>+ Adicionar tarefa</a>
                                    </div>
                                    <div className="task-list">
                                        {routineTasks.map(renderTaskItem)}
                                        {routineTasks.length === 0 && (
                                            <div style={{textAlign:'center',padding:'32px 20px',color:'var(--ink-faint)'}}>
                                                <Icons.Clock size={32} strokeWidth={1} style={{margin:'0 auto 10px',display:'block',color:'var(--ink-faint)'}} />
                                                Nenhuma tarefa nesta rotina ainda. Crie uma tarefa e selecione esta rotina.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })()}
                    </>
                )}

                {/* ---- IMPORTANTES ---- */}
                {activeTab === 'Importantes' && (
                    <>
                        <div className="section-header"><h2>Tarefas Importantes</h2></div>
                        <div className="task-list">
                            {tasks.filter(t => t.priority === 'high' && !t.isDone).map(renderTaskItem)}
                            {tasks.filter(t => t.priority === 'high' && !t.isDone).length === 0 && (
                                <div style={{textAlign:'center',padding:'40px 20px',color:'var(--ink-faint)'}}><Icons.Star size={40} strokeWidth={1} style={{margin:'0 auto 12px',display:'block',color:'var(--amber)'}} /> Nenhuma tarefa de alta prioridade.</div>
                            )}
                        </div>
                    </>
                )}

                {/* ---- ESTA SEMANA ---- */}
                {activeTab === 'Esta Semana' && (
                    <>
                        <div className="section-header"><h2>Tarefas desta semana</h2></div>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:'8px',marginBottom:'24px'}}>
                            {['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'].map((d,i) => {
                                const dateObj = new Date();
                                dateObj.setDate(dateObj.getDate() - ((dateObj.getDay()||7)-1) + i);
                                const ds = dateObj.toISOString().split('T')[0];
                                const isSelected = selectedWeekDate ? ds === selectedWeekDate : i === (new Date().getDay()||7)-1;
                                
                                return (
                                    <div key={d} onClick={() => setSelectedWeekDate(ds)} style={{
                                        background: isSelected ? 'var(--coral)' : 'var(--cream)',
                                        borderRadius:'12px',padding:'12px 0',textAlign:'center',fontSize:'12px',
                                        color: isSelected ? 'white' : 'var(--ink-mid)',
                                        fontWeight: isSelected ? 600 : 500, cursor: 'pointer',
                                        border: isSelected ? 'none' : '1px solid var(--cream-dark)',
                                    }}>
                                        <div style={{textTransform:'uppercase',fontSize:'10px',letterSpacing:'0.5px'}}>{d}</div>
                                        <div style={{fontWeight:'700',fontSize:'20px',marginTop:'4px'}}>{dateObj.getDate()}</div>
                                        {tasks.some(t => t.date && new Date(t.date).toISOString().split('T')[0] === ds && !t.isDone) && (
                                            <div style={{width:'4px',height:'4px',background:isSelected?'white':'var(--coral)',borderRadius:'50%',margin:'4px auto 0'}} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="task-list">
                            {tasks.filter(t=> {
                                const filterDate = selectedWeekDate || new Date().toISOString().split('T')[0];
                                if(!t.date) return false;
                                return new Date(t.date).toISOString().split('T')[0] === filterDate;
                            }).map(renderTaskItem)}
                            
                            {tasks.filter(t=> {
                                const filterDate = selectedWeekDate || new Date().toISOString().split('T')[0];
                                if(!t.date) return false;
                                return new Date(t.date).toISOString().split('T')[0] === filterDate;
                            }).length === 0 && (
                                <div style={{textAlign:'center',padding:'40px 20px',color:'var(--ink-faint)'}}>
                                    <Icons.Calendar size={40} strokeWidth={1} style={{margin:'0 auto 12px',display:'block',color:'var(--cream-dark)'}} />
                                    Nenhuma tarefa para este dia.
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* ---- CONCLUÍDAS ---- */}
                {activeTab === 'Concluídas' && (
                    <>
                        <div className="section-header"><h2>Tarefas Concluídas</h2></div>
                        <div className="task-list">
                            {tasks.filter(t => t.isDone).map(renderTaskItem)}
                            {tasks.filter(t => t.isDone).length === 0 && (
                                <div style={{textAlign:'center',padding:'40px 20px',color:'var(--ink-faint)'}}>Nenhuma tarefa concluída no momento.</div>
                            )}
                        </div>
                    </>
                )}

                {/* ---- DASHBOARD ---- */}
                {/* ---- EQUIPES ---- */}
                {activeTab === 'Equipes' && (
                    <div style={{display:'flex', gap:'24px', height:'calc(100vh - 120px)'}}>
                        <div style={{flex:1, background:'var(--white)', borderRadius:'24px', border:'1px solid var(--cream-dark)', display:'flex', flexDirection:'column', overflow:'hidden', boxShadow:'0 12px 32px rgba(0,0,0,0.02)'}}>
                            <div style={{padding:'20px', borderBottom:'1px solid var(--cream-dark)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                <div>
                                    <h2 style={{fontSize:'18px', fontWeight:'700', color:'var(--ink)', margin:0}}>Painel da Equipe</h2>
                                    <p style={{fontSize:'13px', color:'var(--ink-light)', margin:'4px 0 0 0'}}>Selecione uma equipe para interagir.</p>
                                </div>
                                <button onClick={() => setSuccessToast('Criao de equipe em breve!')} style={{background:'var(--ink)', color:'white', border:'none', borderRadius:'12px', padding:'10px 16px', fontSize:'13px', fontWeight:'600', cursor:'pointer'}}><Icons.Plus size={16} style={{display:'inline', marginBottom:'-3px', marginRight:'6px'}}/>Nova Equipe</button>
                            </div>
                            <div style={{flex:1, padding:'20px', overflowY:'auto'}}>
                                {teams.length === 0 ? (
                                    <div style={{textAlign:'center', padding:'60px 20px', color:'var(--ink-faint)'}}>
                                        <Icons.Users size={48} strokeWidth={1} style={{marginBottom:'16px', color:'var(--ink-light)'}} />
                                        <p style={{fontSize:'15px', color:'var(--ink-mid)'}}>Voc ainda no faz parte de nenhuma equipe.</p>
                                    </div>
                                ) : (
                                    <div style={{display:'grid', gap:'16px'}}>
                                        {teams.map(team => (
                                            <div key={team.id} style={{padding:'20px', borderRadius:'16px', border:'1px solid var(--cream-dark)', cursor:'pointer', transition:'border-color 0.2s'}} onMouseEnter={e=>e.currentTarget.style.borderColor='var(--coral)'} onMouseLeave={e=>e.currentTarget.style.borderColor='var(--cream-dark)'}>
                                                <div style={{fontSize:'16px', fontWeight:'600', color:'var(--ink)', marginBottom:'8px'}}>{team.name}</div>
                                                <div style={{fontSize:'13px', color:'var(--ink-light)', marginBottom:'16px'}}>{team.description || 'Sem descrio'}</div>
                                                <div style={{display:'flex'}}>
                                                    {team.members.map((m:any) => (
                                                        <div key={m.id} title={m.user.name} style={{width:'32px', height:'32px', borderRadius:'16px', background:'var(--coral)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', marginLeft:'-10px', border:'2px solid white', fontWeight:'700'}}>{m.user.name?.charAt(0)?.toUpperCase() || '?'}</div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div style={{width:'380px', background:'var(--white)', borderRadius:'24px', border:'1px solid var(--cream-dark)', display:'flex', flexDirection:'column', boxShadow:'0 12px 32px rgba(0,0,0,0.02)'}}>
                            <div style={{padding:'20px', borderBottom:'1px solid var(--cream-dark)'}}>
                                <h3 style={{fontSize:'16px', fontWeight:'700', color:'var(--ink)', margin:0}}>Mural de Avisos</h3>
                            </div>
                            <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--ink-faint)', fontSize:'13px', padding:'20px', textAlign:'center'}}>
                                Selecione uma equipe para ver o chat e as tarefas do time.
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'Dashboard' && (
                    <>
                        {currentUserData?.plan === 'FREE' ? (
                            <div style={{textAlign:'center', padding:'80px 20px', background:'var(--white)', borderRadius:'24px', border:'1px solid var(--cream-dark)'}}>
                                <div style={{fontSize:'48px', marginBottom:'16px'}}>🔒</div>
                                <h2 style={{fontSize:'24px', fontWeight:'800', marginBottom:'16px', color:'var(--ink)',fontFamily:"'Fraunces', serif"}}>Dashboard Bloqueado</h2>
                                <p style={{color:'var(--ink-mid)', marginBottom:'32px', maxWidth:'400px', margin:'0 auto 32px', fontSize:'15px', lineHeight:'1.5'}}>
                                    O Dashboard de inteligência e performance da equipe é exclusivo dos planos Pro e Premium. Desbloqueie todo o seu potencial produtivo!
                                </p>
                                <button onClick={() => setActiveTab('Planos')} style={{background:'var(--coral)', color:'white', padding:'14px 28px', borderRadius:'12px', fontWeight:'600', cursor:'pointer', border:'none', fontSize:'15px'}}>Fazer Upgrade Agora</button>
                            </div>
                        ) : (
                            <>
                                {currentUserData?.plan === 'PREMIUM' && (
                                    <div style={{background:'var(--coral)',color:'var(--white)',borderRadius:'20px',padding:'24px',marginBottom:'32px',display:'flex',gap:'20px',alignItems:'center',boxShadow:'0 12px 32px rgba(232,80,58,0.15)'}}>
                                        <div style={{fontSize:'40px'}}>✨</div>
                                        <div>
                                            <h3 style={{fontSize:'20px',marginBottom:'4px',fontWeight:'800',fontFamily:"'Fraunces',serif"}}>Dashboard Premium & Equipe</h3>
                                            <p style={{fontSize:'14px',opacity:0.9,margin:0,lineHeight:'1.4'}}>Sua taxa de produtividade desta semana está <b>15% superior</b> à média dos seus colaboradores de projetos. A inteligência preditiva sugere focar em "Tarefas de Alta Prioridade" nas próximas 4 horas.</p>
                                        </div>
                                    </div>
                                )}
                                <div className="stats-row">
                            <div className="stat-card">
                                <div className="stat-card-label">Total de tarefas</div>
                                <div className="stat-card-num">{tasks.length}</div>
                                <div className="stat-card-trend">criadas</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-card-label">Concluídas</div>
                                <div className="stat-card-num" style={{color:'var(--green)'}}>{tasks.filter(t => t.isDone).length}</div>
                                <div className="stat-card-trend">{tasks.length > 0 ? Math.round(tasks.filter(t=>t.isDone).length/tasks.length*100) : 0}% do total</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-card-label">Streak atual</div>
                                <div className="stat-card-num" style={{color:'var(--coral)'}}><Icons.Flame size={16} fill="var(--coral)" style={{display:'inline',marginBottom:'-2px'}} /> {streak}</div>
                                <div className="stat-card-trend">dias seguidos</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-card-label">Esta semana</div>
                                <div className="stat-card-num">{weeklyRate}<span style={{fontSize:'18px',color:'var(--ink-light)'}}>%</span></div>
                                <div className="stat-card-trend">taxa de conclusão</div>
                            </div>
                        </div>
                        <div className="section-header" style={{marginTop:'8px'}}><h2>Distribuição por prioridade</h2></div>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',marginBottom:'24px'}}>
                        {teams.length > 0 && (
                            <div style={{marginTop:'32px'}}>
                                <div className="section-header"><h2>Performance da Equipe</h2></div>
                                <div style={{background:'var(--white)', borderRadius:'16px', border:'1px solid var(--cream-dark)', overflow:'hidden'}}>
                                    {teams.map(team => (
                                        <div key={team.id} style={{padding:'20px', borderBottom:'1px solid var(--cream-dark)'}}>
                                            <h4 style={{fontSize:'15px', fontWeight:'700', color:'var(--ink)', margin:'0 0 16px 0', display:'flex', alignItems:'center', gap:'8px'}}><Icons.Users size={16} color="var(--coral)"/> {team.name}</h4>
                                            <div style={{display:'grid', gap:'12px'}}>
                                                {team.members.map((m:any) => {
                                                    const memberTasks = tasks.filter(t => t.userId === m.userId && (t.projectId || t.teamId === team.id));
                                                    const doneMember = memberTasks.filter(t => t.isDone).length;
                                                    const pctMember = memberTasks.length > 0 ? Math.round((doneMember / memberTasks.length) * 100) : 0;
                                                    return (
                                                        <div key={m.id} style={{display:'flex', alignItems:'center', gap:'16px', padding:'12px', background:'var(--cream)', borderRadius:'12px'}}>
                                                            {m.user.image ? <img src={m.user.image} style={{width:'40px', height:'40px', borderRadius:'20px'}} /> : <div style={{width:'40px', height:'40px', borderRadius:'20px', background:'var(--coral)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'700', fontSize:'14px'}}>{m.user.name?.charAt(0)?.toUpperCase() || '?'}</div>}
                                                            <div style={{flex:1}}>
                                                                <div style={{fontSize:'14px', fontWeight:'600', color:'var(--ink)'}}>{m.user.name} <span style={{fontSize:'11px', fontWeight:'500', background:'var(--white)', padding:'2px 6px', borderRadius:'8px', color:'var(--ink-light)', marginLeft:'8px'}}>{m.role === 'ADMIN' ? 'Lder' : 'Membro'}</span></div>
                                                                <div style={{fontSize:'12px', color:'var(--ink-mid)', marginTop:'4px'}}>{doneMember} de {memberTasks.length} tarefas concludas</div>
                                                                <div style={{height:'6px', background:'var(--white)', borderRadius:'3px', marginTop:'6px', overflow:'hidden'}}>
                                                                    <div style={{height:'100%', width:${pctMember}%, background: pctMember === 100 ? 'var(--green)' : 'var(--blue)', transition:'width 0.3s'}}></div>
                                                                </div>
                                                            </div>
                                                            <div style={{fontSize:'20px', fontWeight:'700', color: pctMember === 100 ? 'var(--green)' : 'var(--ink)'}}>{pctMember}%</div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                            {([{label:'Alta',color:'var(--coral)',key:'high'},{label:'Média',color:'var(--amber)',key:'medium'},{label:'Baixa',color:'var(--green)',key:'low'}] as {label:string,color:string,key:string}[]).map(({label,color,key}) => (
                                <div key={label} style={{background:'var(--cream)',borderRadius:'16px',padding:'20px',textAlign:'center'}}>
                                    <div style={{fontSize:'28px',fontWeight:'700',color,fontFamily:"'Fraunces',serif"}}>{tasks.filter(t=>t.priority===key).length}</div>
                                    <div style={{fontSize:'12px',color:'var(--ink-light)',marginTop:'4px'}}>{label} prioridade</div>
                                    <div style={{height:'4px',background:'var(--cream-dark)',borderRadius:'2px',marginTop:'12px'}}>
                                        <div style={{height:'100%',width: tasks.length>0?`${tasks.filter(t=>t.priority===key).length/tasks.length*100}%`:'0%',background:color,borderRadius:'2px',transition:'width 0.3s'}}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="section-header"><h2>Histórico de streaks (Semana Atual)</h2></div>
                        <div style={{background:'var(--cream)',borderRadius:'16px',padding:'20px 24px',marginBottom:'24px'}}>
                            <div style={{display:'flex',gap:'6px',alignItems:'flex-end',height:'60px'}}>
                                {(() => {
                                    const history = [0,0,0,0,0,0,0];
                                    const today = new Date();
                                    const todayIndex = (today.getDay() || 7) - 1;
                                    const startOfWeek = new Date(today);
                                    startOfWeek.setDate(today.getDate() - todayIndex);
                                    startOfWeek.setHours(0,0,0,0);
                                    
                                    tasks.filter(t => t.isDone && t.updatedAt).forEach(t => {
                                        const d = new Date(t.updatedAt);
                                        if (d >= startOfWeek) {
                                            const dIndex = (d.getDay() || 7) - 1;
                                            if (dIndex >= 0 && dIndex <= 6) history[dIndex]++;
                                        }
                                    });
                                    
                                    const maxVal = Math.max(...history, 1);
                                    return history.map((v,i) => (
                                        <div key={i} title={`${v} tarefas`} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'4px'}}>
                                            <div style={{width:'100%',height:`${(v/maxVal)*100}%`,background: i===todayIndex ? 'var(--coral)' : 'var(--cream-dark)',borderRadius:'4px 4px 0 0',minHeight:'4px'}}></div>
                                            <div style={{fontSize:'10px',color:'var(--ink-faint)',fontWeight: i===todayIndex?'700':'400'}}>{['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'][i]}</div>
                                        </div>
                                    ));
                                })()}
                            </div>
                        </div>

                        {currentUserData?.plan === 'PREMIUM' && projects.some(p => p.collaborators?.length > 0) && (
                            <div style={{marginTop:'32px'}}>
                                <div className="section-header"><h2>Equipes Ativas em Projetos</h2></div>
                                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'16px', marginBottom:'32px'}}>
                                    {projects.filter(p => p.collaborators?.length > 0).map(p => (
                                        <div key={p.id} style={{background:'var(--cream)', borderRadius:'16px', padding:'20px', border:'1.5px solid var(--cream-dark)'}}>
                                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px'}}>
                                                <div style={{fontWeight:'700', color:p.color}}>{p.name}</div>
                                                <div style={{fontSize:'11px', background:'white', padding:'4px 8px', borderRadius:'10px', color:'var(--ink-mid)', border:'1px solid var(--cream-dark)'}}>{p.collaborators.length + 1} membros</div>
                                            </div>
                                            <div style={{display:'flex', gap:'6px', marginBottom:'16px'}}>
                                                <div title="Dono" style={{width:'28px', height:'28px', borderRadius:'14px', background:'var(--white)', border:'1.5px solid var(--coral)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', fontWeight:'700'}}>D</div>
                                                {p.collaborators.map((c: any) => (
                                                    <div key={c.id} title={c.name} style={{width:'28px', height:'28px', borderRadius:'14px', background:'white', color:'var(--ink)', border:'1.5px solid var(--cream-dark)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', fontWeight:'700'}}>{c.name?.charAt(0).toUpperCase()}</div>
                                                ))}
                                            </div>
                                            <div style={{fontSize:'12px', color:'var(--ink-mid)', display:'flex', justifyContent:'space-between'}}>
                                                <span>Progresso do Time:</span>
                                                <span style={{fontWeight:'600'}}>{tasks.filter(t => t.projectId === p.id && t.isDone).length} / {tasks.filter(t => t.projectId === p.id).length}</span>
                                            </div>
                                            <div style={{height:'4px', background:'rgba(0,0,0,0.05)', borderRadius:'2px', marginTop:'8px', overflow:'hidden'}}>
                                                <div style={{height:'100%', width: tasks.filter(t => t.projectId === p.id).length > 0 ? `${(tasks.filter(t => t.projectId === p.id && t.isDone).length / tasks.filter(t => t.projectId === p.id).length) * 100}%` : '0%', background:'var(--coral)', borderRadius:'2px'}}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="section-header"><h2>Todas as Tarefas</h2></div>
                        <div className="task-list">
                            {tasks.map(renderTaskItem)}
                            {tasks.length === 0 && (
                                <div style={{textAlign:'center',padding:'40px 20px',color:'var(--ink-faint)'}}>Nenhuma tarefa pendente ou concluída.</div>
                            )}
                        </div>
                            </>
                        )}
                    </>
                )}

                {/* ---- MEU PERFIL ---- */}
                {activeTab === 'Meu Perfil' && (
                    <div style={{maxWidth:'600px'}}>
                        {/* Profile Info */}
                        <div style={{background:'var(--cream)',borderRadius:'20px',padding:'24px',marginBottom:'16px'}}>
                            <div style={{fontSize:'14px',fontWeight:'600',color:'var(--ink)',marginBottom:'20px',display:'flex',alignItems:'center',gap:'8px'}}><Icons.User size={16} /> Perfil</div>
                            
                            <div style={{display:'flex',alignItems:'center',gap:'20px',marginBottom:'24px'}}>
                                <div style={{width:'80px',height:'80px',borderRadius:'24px',background:'var(--cream-dark)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--coral)',fontSize:'32px',fontWeight:'bold',overflow:'hidden',border:'2px solid var(--white)'}}>
                                    {currentUserData?.image ? (
                                        <img src={currentUserData.image} alt="Profile" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                                    ) : (
                                        session?.user?.name?.[0] || 'U'
                                    )}
                                </div>
                                <div style={{flex:1}}>
                                    <div style={{fontSize:'12px',color:'var(--ink-light)',marginBottom:'8px'}}>Foto do Perfil</div>
                                    <input type="file" id="avatar-input" accept="image/*" style={{display:'none'}} onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const reader = new FileReader();
                                        reader.onloadend = async () => {
                                            const base64String = reader.result as string;
                                            try {
                                                // Assuming updateProfileImage is imported from '@/app/actions'
                                                const { updateProfileImage } = await import('@/app/actions');
                                                await updateProfileImage({ base64: base64String });
                                                setProfileMsg('Foto atualizada com sucesso!');
                                                // Trigger data refresh
                                                getCurrentUserData().then(setCurrentUserData);
                                            } catch (err: any) {
                                                setProfileMsg(err.message || 'Erro ao enviar imagem.');
                                            }
                                        };
                                        reader.readAsDataURL(file);
                                    }} />
                                    <button onClick={() => document.getElementById('avatar-input')?.click()} style={{background:'var(--white)',border:'1.5px solid var(--cream-dark)',padding:'8px 16px',borderRadius:'10px',fontSize:'13px',fontWeight:'600',cursor:'pointer'}}>Alterar Foto</button>
                                </div>
                            </div>

                            <input className="modal-input" type="text" placeholder="Seu nome" value={editName} onChange={e => setEditName(e.target.value)} style={{marginBottom:'12px'}} />
                            {profileMsg && <div style={{fontSize:'13px',color:'var(--green)',marginBottom:'8px'}}>{profileMsg}</div>}
                            <button className="modal-save" style={{width:'auto',padding:'10px 24px'}} onClick={async () => {
                                setProfileMsg('');
                                await updateUserProfile({ name: editName });
                                setProfileMsg('Perfil atualizado com sucesso!');
                            }}>Salvar alterações</button>
                        </div>

                        {/* Stats */}
                        <div style={{background:'var(--cream)',borderRadius:'20px',padding:'24px',marginBottom:'16px'}}>
                            <div style={{fontSize:'14px',fontWeight:'600',color:'var(--ink)',marginBottom:'16px',display:'flex',alignItems:'center',gap:'8px'}}><Icons.BarChart2 size={16} /> Suas estatísticas</div>
                            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px'}}>
                                <div style={{background:'var(--white)',borderRadius:'12px',padding:'16px',textAlign:'center'}}>
                                    <div style={{fontSize:'24px',fontWeight:'700',color:'var(--coral)',fontFamily:"'Fraunces',serif"}}>{tasks.length}</div>
                                    <div style={{fontSize:'11px',color:'var(--ink-light)',marginTop:'4px'}}>Total de tarefas</div>
                                </div>
                                <div style={{background:'var(--white)',borderRadius:'12px',padding:'16px',textAlign:'center'}}>
                                    <div style={{fontSize:'24px',fontWeight:'700',color:'var(--green)',fontFamily:"'Fraunces',serif"}}>{tasks.filter(t=>t.isDone).length}</div>
                                    <div style={{fontSize:'11px',color:'var(--ink-light)',marginTop:'4px'}}>Concluídas</div>
                                </div>
                                <div style={{background:'var(--white)',borderRadius:'12px',padding:'16px',textAlign:'center'}}>
                                    <div style={{fontSize:'24px',fontWeight:'700',color:'var(--amber)',fontFamily:"'Fraunces',serif",display:'flex',alignItems:'center',justifyContent:'center',gap:'4px'}}><Icons.Flame size={18} fill="var(--coral)" stroke="var(--coral)" />{streak}</div>
                                    <div style={{fontSize:'11px',color:'var(--ink-light)',marginTop:'4px'}}>Streak atual</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ---- CONFIGURAÇÕES ---- */}
                {activeTab === 'Configurações' && (
                    <div style={{maxWidth:'600px'}}>
                        {/* Notifications */}
                        <div style={{background:'var(--cream)',borderRadius:'20px',padding:'24px',marginBottom:'16px'}}>
                            <div style={{fontSize:'14px',fontWeight:'600',color:'var(--ink)',marginBottom:'16px',display:'flex',alignItems:'center',gap:'8px'}}><Icons.Bell size={16} /> Notificações</div>
                            {[
                                {label:'Lembrete diário matinal', desc:'Resumo das suas tarefas do dia', val:notifDaily, set:setNotifDaily},
                                {label:'Alertas de tarefas', desc:'Notificações de prazos e prioridades', val:notifAlerts, set:setNotifAlerts},
                            ].map(({label, desc, val, set}) => (
                                <div key={label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingBottom:'16px',marginBottom:'16px',borderBottom:'1px solid var(--cream-dark)'}}>
                                    <div>
                                        <div style={{fontSize:'13px',fontWeight:'500',color:'var(--ink)'}}>{label}</div>
                                        <div style={{fontSize:'12px',color:'var(--ink-light)',marginTop:'2px'}}>{desc}</div>
                                    </div>
                                    <div onClick={() => set(!val)} style={{width:'44px',height:'24px',borderRadius:'12px',background: val ? 'var(--coral)' : 'var(--cream-dark)',cursor:'pointer',position:'relative',transition:'background 0.2s',flexShrink:0}}>
                                        <div style={{position:'absolute',top:'2px',left: val ? '22px' : '2px',width:'20px',height:'20px',borderRadius:'50%',background:'white',transition:'left 0.2s',boxShadow:'0 1px 3px rgba(0,0,0,0.2)'}}></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Change Password */}
                        <div style={{background:'var(--cream)',borderRadius:'20px',padding:'24px',marginBottom:'16px'}}>
                            <div style={{fontSize:'14px',fontWeight:'600',color:'var(--ink)',marginBottom:'16px',display:'flex',alignItems:'center',gap:'8px'}}><Icons.Lock size={16} /> Alterar senha</div>
                            <input className="modal-input" type="password" placeholder="Senha atual" value={settCurrentPwd} onChange={e => setSettCurrentPwd(e.target.value)} style={{marginBottom:'10px'}} />
                            <input className="modal-input" type="password" placeholder="Nova senha" value={settNewPwd} onChange={e => setSettNewPwd(e.target.value)} style={{marginBottom:'10px'}} />
                            <input className="modal-input" type="password" placeholder="Confirmar nova senha" value={settConfirmPwd} onChange={e => setSettConfirmPwd(e.target.value)} style={{marginBottom:'12px'}} />
                            {settPwdMsg && <div style={{fontSize:'13px',color: settPwdMsg.includes('sucesso') ? 'var(--green)' : 'var(--coral)',marginBottom:'8px'}}>{settPwdMsg}</div>}
                            <button className="modal-save" style={{width:'auto',padding:'10px 24px'}} onClick={async () => {
                                setSettPwdMsg('');
                                if (!settCurrentPwd || !settNewPwd || !settConfirmPwd) { setSettPwdMsg('Preencha todos os campos.'); return; }
                                if (settNewPwd !== settConfirmPwd) { setSettPwdMsg('As senhas não coincidem.'); return; }
                                if (settNewPwd.length < 6) { setSettPwdMsg('A nova senha deve ter ao menos 6 caracteres.'); return; }
                                const r = await updateUserPassword({ currentPassword: settCurrentPwd, newPassword: settNewPwd });
                                if ('error' in r) setSettPwdMsg(r.error || 'Erro.');
                                else { setSettPwdMsg('Senha alterada com sucesso!'); setSettCurrentPwd(''); setSettNewPwd(''); setSettConfirmPwd(''); }
                            }}>Alterar senha</button>
                        </div>

                        {/* Language Selector */}
                        <div style={{background:'var(--cream)', borderRadius:'20px', padding:'24px', marginBottom:'16px'}}>
                            <div style={{fontSize:'14px', fontWeight:'600', color:'var(--ink)', marginBottom:'4px', display:'flex', alignItems:'center', gap:'8px'}}>
                                <Icons.Globe size={16} /> {t('language', lang)}
                            </div>
                            <div style={{fontSize:'13px', color:'var(--ink-mid)', marginBottom:'16px'}}>{t('languageDesc', lang)}</div>
                            <div style={{display:'flex', gap:'8px'}}>
                                {([['pt', '🇧🇷', 'Português'], ['en', '🇺🇸', 'English'], ['es', '🇪🇸', 'Español']] as [Lang, string, string][]).map(([l, flag, label]) => (
                                    <button key={l} onClick={() => {
                                        setLang(l);
                                        localStorage.setItem('user_lang', l);
                                    }} style={{
                                        display:'flex', alignItems:'center', gap:'8px', padding:'10px 16px',
                                        borderRadius:'12px', border: lang === l ? '2px solid var(--coral)' : '1.5px solid var(--cream-dark)',
                                        background: lang === l ? 'rgba(232,80,58,0.06)' : 'var(--white)',
                                        cursor:'pointer', fontSize:'14px', fontWeight: lang === l ? 700 : 400,
                                        color: lang === l ? 'var(--coral)' : 'var(--ink-mid)',
                                        transition:'all 0.15s'
                                    }}>
                                        <span>{flag}</span> {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Theme Selector */}
                        <div style={{background:'var(--cream)', borderRadius:'20px', padding:'24px', marginBottom:'16px'}}>
                            <div style={{fontSize:'14px', fontWeight:'600', color:'var(--ink)', marginBottom:'4px', display:'flex', alignItems:'center', gap:'8px'}}>
                                <Icons.Moon size={16} /> {lang === 'en' ? 'Visual Theme' : lang === 'es' ? 'Tema Visual' : 'Tema Visual'}
                            </div>
                            <div style={{fontSize:'13px', color:'var(--ink-mid)', marginBottom:'16px'}}>{lang === 'en' ? 'Choose application appearance.' : lang === 'es' ? 'Elige la apariencia de la aplicación.' : 'Escolha a aparência do aplicativo.'}</div>
                            <div style={{display:'flex', gap:'8px'}}>
                                {([['light', '☀️', lang === 'en' ? 'Light' : lang === 'es' ? 'Claro' : 'Claro'], ['dark', '🌙', lang === 'en' ? 'Dark' : lang === 'es' ? 'Oscuro' : 'Escuro'], ['system', '💻', lang === 'en' ? 'System' : lang === 'es' ? 'Sistema' : 'Sistema']] as const).map(([t, icon, label]) => (
                                    <button key={t} onClick={() => {
                                        setTheme(t);
                                        localStorage.setItem('user_theme', t);
                                        const isDark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                                        if (isDark) document.documentElement.classList.add('dark');
                                        else document.documentElement.classList.remove('dark');
                                    }} style={{
                                        display:'flex', alignItems:'center', gap:'8px', padding:'10px 16px',
                                        borderRadius:'12px', border: theme === t ? '2px solid var(--coral)' : '1.5px solid var(--cream-dark)',
                                        background: theme === t ? 'rgba(232,80,58,0.06)' : 'var(--white)',
                                        cursor:'pointer', fontSize:'14px', fontWeight: theme === t ? 700 : 400,
                                        color: theme === t ? 'var(--coral)' : 'var(--ink-mid)',
                                        transition:'all 0.15s'
                                    }}>
                                        <span>{icon}</span> {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Subscription Management */}
                        <div style={{background:'var(--cream)', borderRadius:'20px', padding:'24px', marginBottom:'16px'}}>
                            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px'}}>
                                <div style={{fontSize:'14px',fontWeight:'600',color:'var(--ink)',display:'flex',alignItems:'center',gap:'8px'}}>
                                    <Icons.CreditCard size={16} /> Assinatura Atual
                                </div>
                                <div style={{fontSize:'12px',fontWeight:'500',color:'var(--ink)',background:'var(--cream)',padding:'4px 12px',borderRadius:'100px',marginBottom:'16px',display:'inline-block'}}>
                                        {currentUserData?.plan === 'PREMIUM' ? 'Plano Premium 👑' : currentUserData?.plan === 'PRO' ? 'Plano Pro ✨' : 'Plano Gratuito'}
                                    </div>
                            </div>
                            
                            {currentUserData?.plan !== 'FREE' ? (
                                <div>
                                    <div style={{fontSize:'13px',color:'var(--ink-mid)',marginBottom:'16px'}}>Você já possui acesso a todos os recursos premium desta assinatura.</div>
                                    <button onClick={async () => {
                                        const { createStripePortalSession } = await import('@/app/actions');
                                        const res = await createStripePortalSession();
                                        if (res?.url) window.location.href = res.url;
                                        else {
                                            setSuccessToast('⚠️ Erro ao gerar link do portal: ' + (res?.error || 'Desconhecido'));
                                            setTimeout(() => setSuccessToast(''), 4000);
                                        }
                                    }} style={{background:'var(--white)', color:'var(--ink)', border:'1.5px solid var(--cream-dark)', borderRadius:'12px', padding:'10px 20px', fontSize:'13px', fontWeight:'600', cursor:'pointer', transition:'all 0.2s'}} onMouseEnter={e=>(e.currentTarget.style.borderColor='var(--coral)',e.currentTarget.style.color='var(--coral)')} onMouseLeave={e=>(e.currentTarget.style.borderColor='var(--cream-dark)',e.currentTarget.style.color='var(--ink)')}>Gerenciar no Stripe</button>
                                </div>
                            ) : (
                                <div>
                                    <div style={{fontSize:'13px',color:'var(--ink-mid)',marginBottom:'16px'}}>Faça upgrade para acessar estatísticas avançadas e rotinas ilimitadas.</div>
                                    <button onClick={() => setActiveTab('Planos')} style={{background:'var(--white)', color:'var(--ink)', border:'1.5px solid var(--cream-dark)', borderRadius:'12px', padding:'10px 20px', fontSize:'13px', fontWeight:'600', cursor:'pointer', transition:'all 0.2s'}} onMouseEnter={e=>(e.currentTarget.style.borderColor='var(--coral)',e.currentTarget.style.color='var(--coral)')} onMouseLeave={e=>(e.currentTarget.style.borderColor='var(--cream-dark)',e.currentTarget.style.color='var(--ink)')}>Ver Planos Disponíveis</button>
                                </div>
                            )}
                        </div>

                        {/* Danger Zone */}
                        <div style={{background:'rgba(232,80,58,0.06)',borderRadius:'20px',padding:'24px',border:'1.5px solid rgba(232,80,58,0.2)'}}>
                            <div style={{fontSize:'14px',fontWeight:'600',color:'var(--coral)',marginBottom:'12px',display:'flex',alignItems:'center',gap:'8px'}}><Icons.AlertTriangle size={16} /> Zona de perigo</div>
                            <div style={{fontSize:'13px',color:'var(--ink-mid)',marginBottom:'16px'}}>Para excluir sua conta, digite <strong>EXCLUIR</strong> abaixo. Essa ação é irreversível e apagará todos os seus dados.</div>
                            <input className="modal-input" type="text" placeholder="Digite EXCLUIR para confirmar" value={settDeleteConfirm} onChange={e => setSettDeleteConfirm(e.target.value)} style={{marginBottom:'12px',borderColor:'rgba(232,80,58,0.3)'}} />
                            <button style={{background:'var(--coral)',color:'white',border:'none',borderRadius:'12px',padding:'10px 20px',fontSize:'13px',fontWeight:'600',cursor: settDeleteConfirm === 'EXCLUIR' ? 'pointer' : 'not-allowed',opacity: settDeleteConfirm === 'EXCLUIR' ? 1 : 0.4,transition:'opacity 0.2s'}} onClick={async () => {
                                if (settDeleteConfirm !== 'EXCLUIR') return;
                                await deleteAccount();
                                await signOut();
                            }}>Excluir minha conta permanentemente</button>
                        </div>
                    </div>
                )}

                {/* ---- ADMIN DASHBOARD ---- */}
                {activeTab === 'Admin' && currentUserData?.role === 'ADMIN' && (
                    <div style={{maxWidth:'1000px'}}>
                        <div className="section-header">
                            <h2>Painel de Administração</h2>
                        </div>
                        <div style={{background:'var(--white)', border:'1px solid var(--cream-dark)', borderRadius:'20px', overflow:'hidden'}}>
                            <table style={{width:'100%', borderCollapse:'collapse', fontSize:'14px'}}>
                                <thead style={{background:'var(--cream)', color:'var(--ink-light)', textAlign:'left', fontSize:'13px', borderBottom:'1px solid var(--cream-dark)'}}>
                                    <tr>
                                        <th style={{padding:'16px'}}>Usuário</th>
                                        <th style={{padding:'16px'}}>Contato</th>
                                        <th style={{padding:'16px'}}>Plano</th>
                                        <th style={{padding:'16px'}}>Status</th>
                                        <th style={{padding:'16px', textAlign:'right'}}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adminUsers.map(u => (
                                        <tr key={u.id} style={{borderBottom:'1px solid var(--cream-dark)'}}>
                                            <td style={{padding:'16px', fontWeight:'500'}}>
                                                {u.name || 'Sem nome'}
                                                {u.role === 'ADMIN' && <span style={{fontSize:'11px', background:'var(--coral)', color:'white', padding:'2px 6px', borderRadius:'10px', marginLeft:'8px'}}>ADMIN</span>}
                                            </td>
                                            <td style={{padding:'16px', color:'var(--ink-mid)'}}>{u.email}</td>
                                            <td style={{padding:'16px'}}>
                                                <select value={u.plan} onChange={async (e) => {
                                                    await adminUpdateUserPlan(u.id, e.target.value);
                                                    adminGetAllUsers().then(setAdminUsers);
                                                }} style={{padding:'8px', borderRadius:'8px', border:'1px solid var(--cream-dark)', fontSize:'13px', cursor:'pointer', outline:'none'}}>
                                                    <option value="FREE">Free</option>
                                                    <option value="PRO">Pro</option>
                                                    <option value="PREMIUM">Premium</option>
                                                </select>
                                            </td>
                                            <td style={{padding:'16px'}}>
                                                <select value={u.status} onChange={async (e) => {
                                                    await adminUpdateUserStatus(u.id, e.target.value);
                                                    adminGetAllUsers().then(setAdminUsers);
                                                }} style={{padding:'8px', borderRadius:'8px', border:'1px solid var(--cream-dark)', fontSize:'13px', fontWeight:'600', cursor:'pointer', outline:'none', background: u.status === 'ACTIVE' ? 'rgba(91,139,212,0.1)' : 'rgba(232,80,58,0.1)', color: u.status === 'ACTIVE' ? 'var(--blue)' : 'var(--coral)'}}>
                                                    <option value="ACTIVE">Ativo</option>
                                                    <option value="SUSPENDED">Suspenso</option>
                                                    <option value="BLOCKED">Bloqueado</option>
                                                </select>
                                            </td>
                                            <td style={{padding:'16px', textAlign:'right'}}>
                                                <button onClick={async () => {
                                                    if (confirm(`Deseja EXCLUIR o usuário ${u.email}?`)) {
                                                        await adminDeleteUser(u.id);
                                                        setAdminUsers(prev => prev.filter(x => x.id !== u.id));
                                                    }
                                                }} style={{background:'rgba(232,80,58,0.1)', border:'none', cursor:'pointer', color:'var(--coral)', padding:'8px', borderRadius:'8px', transition:'all 0.2s'}}>
                                                    <Icons.Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {adminUsers.length === 0 && (
                                        <tr><td colSpan={5} style={{padding:'32px', textAlign:'center', color:'var(--ink-light)'}}>Nenhum usuário encontrado.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ---- PLANOS ---- */}
                {activeTab === 'Planos' && (
                    <div style={{maxWidth:'800px'}}>
                        <div className="section-header">
                            <h2>Evolua sua produtividade.</h2>
                        </div>
                        <p style={{color:'var(--ink-mid)', marginBottom:'32px', fontSize:'15px', lineHeight:'1.5'}}>
                            Faça o upgrade para desbloquear todos os recursos avançados, projetos ilimitados e integração com outras ferramentas.
                        </p>

                        <div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:'12px', marginBottom:'40px'}}>
                            <span style={{fontSize:'14px', fontWeight:'600', color: !billingAnnual ? 'var(--ink)' : 'var(--ink-light)'}}>Mensal</span>
                            <div className="toggle-switch" onClick={() => setBillingAnnual(!billingAnnual)} style={{width:'50px', height:'28px', background: billingAnnual ? 'var(--coral)' : 'var(--ink-light)', borderRadius:'20px', position:'relative', cursor:'pointer'}}>
                                <div style={{width:'22px', height:'22px', background:'var(--white)', borderRadius:'50%', position:'absolute', top:'3px', left: billingAnnual ? '25px' : '3px', transition:'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)', boxShadow:'0 2px 4px rgba(0,0,0,0.1)'}}></div>
                            </div>
                            <span style={{fontSize:'14px', fontWeight:'600', color: billingAnnual ? 'var(--ink)' : 'var(--ink-light)'}}>Anual <span style={{fontSize:'11px', background:'rgba(61,122,94,0.1)', color:'var(--green)', padding:'2px 6px', borderRadius:'10px', marginLeft:'4px'}}>-20%</span></span>
                        </div>

                        <div style={{background:'rgba(232,80,58,0.05)', borderRadius:'16px', padding:'20px', marginBottom:'40px', border:'1px solid rgba(232,80,58,0.15)'}}>
                            <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px'}}>
                                <Icons.CheckCircle size={20} color="var(--coral)" />
                                <span style={{fontWeight:'700', color:'var(--ink)'}}>Nós valorizamos a sua liberdade.</span>
                            </div>
                            <p style={{fontSize:'14px', color:'var(--ink-mid)', margin:0, lineHeight:'1.5'}}>
                                Nosso plano <strong>Free</strong> já oferece tudo o que você precisa para o dia a dia: <strong style={{color:'var(--ink)'}}>Tarefas ilimitadas, Projetos ilimitados, Rotinas e Listas de Compras pra sempre.</strong> Faça upgrade apenas se precisar de mais inteligência (Dashboard), time ou integrações empresariais.
                            </p>
                        </div>

                        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'24px', marginBottom:'40px'}}>
                            {/* Pro Plan */}
                            <div style={{background:'var(--white)', border:'1px solid var(--cream-dark)', borderRadius:'20px', padding:'32px', display:'flex', flexDirection:'column'}}>
                                <div style={{fontSize:'18px', fontWeight:'700', color:'var(--ink)', marginBottom:'4px'}}>Pro</div>
                                <div style={{fontSize:'14px', color:'var(--ink-light)', marginBottom:'20px'}}>Para acelerar seus resultados.</div>
                                <div style={{fontSize:'36px', fontWeight:'800', fontFamily:"'Fraunces',serif", color:'var(--ink)', marginBottom: billingAnnual ? '4px' : '24px'}}>R${billingAnnual ? '23' : '29'}<span style={{fontSize:'18px',fontWeight:500,color:'var(--ink-mid)'}}>,90</span><span style={{fontSize:'14px', fontWeight:'500', color:'var(--ink-light)', fontFamily:"'DM Sans',sans-serif"}}>/mês</span></div>
                                {billingAnnual && <div style={{fontSize:'12px', color:'var(--ink-light)', fontWeight:'500', marginBottom:'20px'}}>Cobrado R$ 286,80 por ano</div>}
                                
                                <ul style={{listStyle:'none', padding:0, margin:'0 0 32px 0', flex:1, display:'flex', flexDirection:'column', gap:'12px'}}>
                                    <li style={{display:'flex', alignItems:'flex-start', gap:'10px', fontSize:'14px', color:'var(--ink-mid)'}}><Icons.Check size={18} color="var(--coral)" style={{flexShrink:0}}/> Tudo do plano Free</li>
                                    <li style={{display:'flex', alignItems:'flex-start', gap:'10px', fontSize:'14px', color:'var(--ink-mid)'}}><Icons.Check size={18} color="var(--coral)" style={{flexShrink:0}}/> Dashboard preditivo de performance</li>
                                    <li style={{display:'flex', alignItems:'flex-start', gap:'10px', fontSize:'14px', color:'var(--ink-mid)'}}><Icons.Check size={18} color="var(--coral)" style={{flexShrink:0}}/> Compartilhar projetos (até 3 pessoas)</li>
                                    <li style={{display:'flex', alignItems:'flex-start', gap:'10px', fontSize:'14px', color:'var(--ink-mid)'}}><Icons.Check size={18} color="var(--coral)" style={{flexShrink:0}}/> Relatórios semanais por e-mail</li>
                                </ul>
                                <button onClick={async () => {
                                    const res = await fetch('/api/checkout', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ plan: 'PRO', billingAnnual })
                                    });
                                    if(res.ok) {
                                        const { url } = await res.json();
                                        window.location.href = url;
                                    } else {
                                        const errText = await res.text();
                                        setSuccessToast('Erro Stripe: ' + errText);
                                        setTimeout(() => setSuccessToast(''), 4000);
                                    }
                                }} style={{background:'var(--cream)', color:'var(--ink)', border:'1px solid var(--cream-dark)', borderRadius:'12px', padding:'14px', fontSize:'14px', fontWeight:'600', cursor:'pointer', width:'100%', transition:'background 0.2s', textAlign:'center'}} onMouseEnter={e=>(e.currentTarget.style.background='var(--cream-dark)')} onMouseLeave={e=>(e.currentTarget.style.background='var(--cream)')}>Assinar Plano Pro</button>
                            </div>

                            {/* Premium Plan */}
                            <div style={{background:'var(--coral)', color:'white', borderRadius:'20px', padding:'32px', display:'flex', flexDirection:'column', position:'relative', boxShadow:'0 12px 32px rgba(232,80,58,0.2)'}}>
                                <div style={{position:'absolute', top:'-12px', right:'32px', background:'var(--white)', color:'var(--coral)', fontSize:'11px', fontWeight:'700', padding:'6px 12px', borderRadius:'20px', textTransform:'uppercase', letterSpacing:'0.5px'}}>Mais Popular</div>
                                <div style={{fontSize:'18px', fontWeight:'700', marginBottom:'4px'}}>Premium</div>
                                <div style={{fontSize:'14px', opacity:0.8, marginBottom:'20px'}}>Inteligência Artificial & Times.</div>
                                <div style={{fontSize:'36px', fontWeight:'800', fontFamily:"'Fraunces',serif", marginBottom: billingAnnual ? '4px' : '24px'}}>R${billingAnnual ? '47' : '59'}<span style={{fontSize:'18px',fontWeight:500,opacity:0.8}}>,90</span><span style={{fontSize:'14px', fontWeight:'500', opacity:0.8, fontFamily:"'DM Sans',sans-serif"}}>/mês</span></div>
                                {billingAnnual && <div style={{fontSize:'12px', color:'rgba(255,255,255,0.7)', fontWeight:'500', marginBottom:'20px'}}>Cobrado R$ 574,80 por ano</div>}
                                
                                <ul style={{listStyle:'none', padding:0, margin:'0 0 32px 0', flex:1, display:'flex', flexDirection:'column', gap:'12px'}}>
                                    <li style={{display:'flex', alignItems:'flex-start', gap:'10px', fontSize:'14px'}}><Icons.Check size={18} style={{flexShrink:0}}/> Tudo do plano Pro</li>
                                    <li style={{display:'flex', alignItems:'flex-start', gap:'10px', fontSize:'14px'}}><Icons.Check size={18} style={{flexShrink:0}}/> Compartilhamento ilimitado (Times)</li>
                                    <li style={{display:'flex', alignItems:'flex-start', gap:'10px', fontSize:'14px'}}><Icons.Check size={18} style={{flexShrink:0}}/> Inteligência Artificial em breve (Prototipo)</li>
                                    <li style={{display:'flex', alignItems:'flex-start', gap:'10px', fontSize:'14px'}}><Icons.Check size={18} style={{flexShrink:0}}/> Projetos compartilhados em equipe</li>
                                    <li style={{display:'flex', alignItems:'flex-start', gap:'10px', fontSize:'14px'}}><Icons.Check size={18} style={{flexShrink:0}}/> Dashboard mais avançado que o Pro</li>
                                </ul>
                                <button onClick={async () => {
                                    const res = await fetch('/api/checkout', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ plan: 'PREMIUM', billingAnnual })
                                    });
                                    if(res.ok) {
                                        const { url } = await res.json();
                                        window.location.href = url;
                                    } else {
                                        const errText = await res.text();
                                        setSuccessToast('⚠️ Erro Stripe: ' + errText);
                                        setTimeout(() => setSuccessToast(''), 4000);
                                    }
                                }} style={{background:'var(--white)', color:'var(--coral)', border:'none', borderRadius:'12px', padding:'14px', fontSize:'14px', fontWeight:'600', cursor:'pointer', width:'100%', transition:'transform 0.2s', textAlign:'center'}} onMouseEnter={e=>(e.currentTarget.style.transform='scale(1.02)')} onMouseLeave={e=>(e.currentTarget.style.transform='scale(1)')}>Assinar Premium</button>
                            </div>
                        </div>

                    </div>
                )}
                
                {/* ---- MINHAS TAREFAS ---- */}
                {activeTab === 'Minhas Tarefas' && (
                    <div style={{maxWidth:'900px'}}>
                        <div className="section-header">
                            <h2>Minhas Tarefas</h2>
                        </div>

                        {/* Filters Bar */}
                        <div style={{display:'flex', gap:'10px', flexWrap:'wrap', marginBottom:'24px', alignItems:'center'}}>
                            <div style={{flex:'1 1 220px', position:'relative'}}>
                                <Icons.Search size={15} style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',color:'var(--ink-faint)',pointerEvents:'none'}} />
                                <input
                                    style={{width:'100%',padding:'9px 12px 9px 34px',border:'1.5px solid var(--cream-dark)',borderRadius:'10px',fontSize:'13px',background:'var(--white)',color:'var(--ink)',outline:'none',boxSizing:'border-box'}}
                                    placeholder="Buscar tarefas..."
                                    value={taskSearch}
                                    onChange={e => setTaskSearch(e.target.value)}
                                />
                            </div>
                            <select style={{padding:'9px 14px',border:'1.5px solid var(--cream-dark)',borderRadius:'10px',fontSize:'13px',background:'var(--white)',color:'var(--ink)',cursor:'pointer'}} value={taskFilterStatus} onChange={e => setTaskFilterStatus(e.target.value as any)}>
                                <option value="all">Todas</option>
                                <option value="pending">Pendentes</option>
                                <option value="done">Concluídas</option>
                            </select>
                            <select style={{padding:'9px 14px',border:'1.5px solid var(--cream-dark)',borderRadius:'10px',fontSize:'13px',background:'var(--white)',color:'var(--ink)',cursor:'pointer'}} value={taskFilterPriority} onChange={e => setTaskFilterPriority(e.target.value as any)}>
                                <option value="all">Todas prioridades</option>
                                <option value="high">Alta</option>
                                <option value="medium">Média</option>
                                <option value="low">Baixa</option>
                            </select>
                            <select style={{padding:'9px 14px',border:'1.5px solid var(--cream-dark)',borderRadius:'10px',fontSize:'13px',background:'var(--white)',color:'var(--ink)',cursor:'pointer'}} value={taskFilterProject} onChange={e => setTaskFilterProject(e.target.value)}>
                                <option value="all">Todos projetos</option>
                                <option value="none">Sem projeto</option>
                                {projects.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                            {bulkSelected.length > 0 && (
                                <button
                                    onClick={async () => {
                                        for (const id of bulkSelected) { await deleteTask(id); }
                                        const fresh = await getTasks();
                                        setTasks(fresh);
                                        setBulkSelected([]);
                                        setSuccessToast(`🗑️ ${bulkSelected.length} tarefa(s) excluída(s).`);
                                        setTimeout(() => setSuccessToast(''), 3000);
                                    }}
                                    style={{padding:'9px 16px',background:'rgba(232,80,58,0.1)',border:'1.5px solid rgba(232,80,58,0.2)',borderRadius:'10px',fontSize:'13px',fontWeight:'600',color:'var(--coral)',cursor:'pointer'}}
                                >
                                    <Icons.Trash2 size={14} style={{display:'inline',marginBottom:'-2px',marginRight:'5px'}} />
                                    Excluir {bulkSelected.length}
                                </button>
                            )}
                        </div>

                        {/* Task list */}
                        {(() => {
                            const filtered = tasks.filter((tk: any) => {
                                const matchSearch = !taskSearch || tk.title.toLowerCase().includes(taskSearch.toLowerCase());
                                const matchStatus = taskFilterStatus === 'all' || (taskFilterStatus === 'done' ? tk.isDone : !tk.isDone);
                                const matchPriority = taskFilterPriority === 'all' || tk.priority === taskFilterPriority;
                                const matchProject = taskFilterProject === 'all' || (taskFilterProject === 'none' ? !tk.projectId : tk.projectId === taskFilterProject);
                                return matchSearch && matchStatus && matchPriority && matchProject;
                            });
                            if (filtered.length === 0) return (
                                <div style={{textAlign:'center',padding:'60px 20px',color:'var(--ink-faint)'}}>
                                    <Icons.ListTodo size={40} style={{marginBottom:'12px',opacity:0.3}} />
                                    <div style={{fontSize:'15px'}}>Nenhuma tarefa encontrada.</div>
                                </div>
                            );
                            const pending = filtered.filter((tk: any) => !tk.isDone);
                            const done = filtered.filter((tk: any) => tk.isDone);
                            const priorityColors: Record<string,string> = {high:'var(--coral)',medium:'var(--amber)',low:'var(--green)'};
                            const priorityLabels: Record<string,string> = {high:'Alta',medium:'Média',low:'Baixa'};
                            const renderTask = (tk: any) => (
                                <div key={tk.id} style={{display:'flex',alignItems:'center',gap:'12px',padding:'14px 16px',background:'var(--white)',border:'1.5px solid var(--cream-dark)',borderRadius:'12px',marginBottom:'8px',transition:'border-color 0.2s'}}>
                                    <input type="checkbox" style={{accentColor:'var(--coral)',width:'16px',height:'16px',flexShrink:0,cursor:'pointer'}}
                                        checked={bulkSelected.includes(tk.id)}
                                        onChange={e => { e.stopPropagation(); setBulkSelected((prev: string[]) => prev.includes(tk.id) ? prev.filter((x: string) => x !== tk.id) : [...prev, tk.id]); }}
                                    />
                                    <div style={{width:'8px',height:'8px',borderRadius:'50%',background:priorityColors[tk.priority]||'var(--ink-faint)',flexShrink:0}} />
                                    <div style={{flex:1,minWidth:0}}>
                                        <div style={{fontSize:'14px',fontWeight:'500',color:'var(--ink)',textDecoration:tk.isDone?'line-through':'none',opacity:tk.isDone?0.5:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{tk.title}</div>
                                        <div style={{display:'flex',gap:'8px',marginTop:'4px',flexWrap:'wrap'}}>
                                            {tk.date && <span style={{fontSize:'11px',color:'var(--ink-faint)'}}><Icons.Calendar size={10} style={{display:'inline',marginBottom:'-1px'}} /> {new Date(tk.date).toLocaleDateString('pt-BR')}</span>}
                                            {tk.startTime && <span style={{fontSize:'11px',color:'var(--ink-faint)'}}><Icons.Clock size={10} style={{display:'inline',marginBottom:'-1px'}} /> {tk.startTime}{tk.endTime?` - ${tk.endTime}`:''}</span>}
                                            {tk.project && <span style={{fontSize:'11px',background:'rgba(0,0,0,0.05)',borderRadius:'4px',padding:'1px 6px',color:'var(--ink-light)'}}>{tk.project.name}</span>}
                                        </div>
                                    </div>
                                    <span style={{fontSize:'11px',fontWeight:'600',color:priorityColors[tk.priority]||'var(--ink-faint)',borderRadius:'6px',padding:'2px 8px',flexShrink:0}}>{priorityLabels[tk.priority]||''}</span>
                                    <button onClick={async (e) => { e.stopPropagation(); await toggleTask(tk.id, !tk.isDone); const fresh = await getTasks(); setTasks(fresh); }} style={{background:'transparent',border:'none',cursor:'pointer',color:tk.isDone?'var(--green)':'var(--ink-faint)',padding:'4px',borderRadius:'6px',transition:'color 0.2s'}}>
                                        <Icons.CheckCircle size={18} />
                                    </button>
                                </div>
                            );
                            return (
                                <div>
                                    {pending.length > 0 && (
                                        <div style={{marginBottom:'24px'}}>
                                            <div style={{fontSize:'12px',fontWeight:'700',color:'var(--ink-light)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'10px'}}>Pendentes ({pending.length})</div>
                                            {pending.map(renderTask)}
                                        </div>
                                    )}
                                    {done.length > 0 && (
                                        <div>
                                            <div style={{fontSize:'12px',fontWeight:'700',color:'var(--ink-light)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'10px'}}>Concluídas ({done.length})</div>
                                            {done.map(renderTask)}
                                        </div>
                                    )}
                                </div>
                            );
                        })()}
                    </div>
                )}

                {/* ---- LISTA DE COMPRAS ---- */}
                {activeTab === 'Lista de Compras' && (
                    <div style={{maxWidth:'860px'}}>
                        <div className="section-header">
                            <h2>Lista de Compras</h2>
                        </div>

                        <div style={{display:'flex',gap:'10px',flexWrap:'wrap',marginBottom:'24px',alignItems:'center'}}>
                            <select
                                style={{flex:'1 1 200px',padding:'10px 14px',border:'1.5px solid var(--cream-dark)',borderRadius:'10px',fontSize:'14px',background:'var(--white)',color:'var(--ink)',cursor:'pointer'}}
                                value={selectedListId || ""}
                                onChange={e => setSelectedListId(e.target.value)}
                            >
                                {shoppingLists.length === 0 && <option value="">Nenhuma lista</option>}
                                {shoppingLists.map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}
                            </select>
                            <button
                                style={{padding:'10px 18px',background:'var(--coral)',color:'white',border:'none',borderRadius:'10px',fontSize:'13px',fontWeight:'600',cursor:'pointer',whiteSpace:'nowrap',flexShrink:0}}
                                onClick={async () => {
                                    const name = prompt('Nome da nova lista de compras:');
                                    if (!name?.trim()) return;
                                    const res = await createShoppingList({ name: name.trim() });
                                    if ('id' in res) {
                                        const fresh = await getShoppingLists();
                                        setShoppingLists(fresh);
                                        setSelectedListId((res as any).id);
                                    }
                                }}
                            >
                                <Icons.Plus size={14} style={{display:'inline',marginBottom:'-2px',marginRight:'5px'}} /> Nova lista
                            </button>
                            {selectedListId && (
                                <button
                                    style={{padding:'10px 14px',background:'rgba(232,80,58,0.08)',border:'1.5px solid rgba(232,80,58,0.2)',borderRadius:'10px',fontSize:'13px',fontWeight:'600',cursor:'pointer',color:'var(--coral)',flexShrink:0}}
                                    onClick={async () => {
                                        if (!confirm('Excluir lista e todos os itens?')) return;
                                        await deleteShoppingList(selectedListId);
                                        const fresh = await getShoppingLists();
                                        setShoppingLists(fresh);
                                        setSelectedListId((fresh as any[])[0]?.id ?? '');
                                    }}
                                >
                                    <Icons.Trash2 size={14} style={{display:'inline',marginBottom:'-2px'}} />
                                </button>
                            )}
                        </div>

                        {selectedListId ? (() => {
                            const list = (shoppingLists as any[]).find((l: any) => l.id === selectedListId);
                            if (!list) return null;
                            const items: any[] = list.items ?? [];
                            const pendingItems = items.filter((i: any) => !i.purchased);
                            const purchasedItems = items.filter((i: any) => i.purchased);
                            const total = items.reduce((acc: number, i: any) => acc + (i.purchased ? 0 : (i.estimatedPrice ?? 0) * (i.quantity ?? 1)), 0);
                            const catIcons: Record<string,string> = {'Hortifruti':'🥦','Mercearia':'🛒','Limpeza':'🧹','Higiene':'Higiene','Bebidas':'🥤','Outros':'Outros'};
                            const cats = ['Hortifruti','Mercearia','Limpeza','Higiene','Bebidas','Outros'];
                            return (
                                <div>
                                    <div style={{background:'var(--white)',border:'1.5px solid var(--cream-dark)',borderRadius:'16px',padding:'20px',marginBottom:'24px'}}>
                                        <div style={{fontSize:'13px',fontWeight:'700',color:'var(--ink)',marginBottom:'14px'}}>Adicionar item</div>
                                        <div style={{display:'grid',gridTemplateColumns:'2fr 80px 100px 160px auto',gap:'10px',alignItems:'end'}}>
                                            <div>
                                                <div style={{fontSize:'11px',fontWeight:'600',color:'var(--ink-light)',marginBottom:'4px'}}>Produto</div>
                                                <input className="modal-input" style={{margin:0}} placeholder="Ex: Leite" value={newItemName} onChange={e => setNewItemName(e.target.value)} onKeyDown={e => { if(e.key==='Enter'){document.getElementById('addItemBtn')?.click();}}} />
                                            </div>
                                            <div>
                                                <div style={{fontSize:'11px',fontWeight:'600',color:'var(--ink-light)',marginBottom:'4px'}}>Qtd</div>
                                                <input className="modal-input" style={{margin:0}} type="number" min="0.1" step="0.1" placeholder="1" value={newItemQuantity} onChange={e => setNewItemQuantity(e.target.value)} />
                                            </div>
                                            <div>
                                                <div style={{fontSize:'11px',fontWeight:'600',color:'var(--ink-light)',marginBottom:'4px'}}>Unidade</div>
                                                <select className="modal-select modal-input" style={{margin:0}} value={newItemUnit} onChange={e => setNewItemUnit(e.target.value)}>
                                                    <option>un</option><option>kg</option><option>g</option><option>L</option><option>ml</option><option>cx</option><option>pct</option>
                                                </select>
                                            </div>
                                            <div>
                                                <div style={{fontSize:'11px',fontWeight:'600',color:'var(--ink-light)',marginBottom:'4px'}}>Categoria</div>
                                                <select className="modal-select modal-input" style={{margin:0}} value={newItemCategory} onChange={e => setNewItemCategory(e.target.value)}>
                                                    {cats.map(c => <option key={c}>{c}</option>)}
                                                </select>
                                            </div>
                                            <button id="addItemBtn"
                                                style={{padding:'10px 16px',background:'var(--coral)',color:'white',border:'none',borderRadius:'10px',fontSize:'13px',fontWeight:'700',cursor:'pointer',alignSelf:'end',whiteSpace:'nowrap'}}
                                                onClick={async () => {
                                                    if (!newItemName.trim() || !selectedListId) return;
                                                    await createShoppingItem({
                                                        listId: selectedListId,
                                                        name: newItemName.trim(),
                                                        quantity: parseFloat(newItemQuantity) || 1,
                                                        unit: newItemUnit,
                                                        category: newItemCategory,
                                                        estimatedPrice: newItemPrice ? parseFloat(newItemPrice) : undefined,
                                                    });
                                                    const fresh = await getShoppingLists();
                                                    setShoppingLists(fresh);
                                                    setNewItemName(''); setNewItemQuantity('1'); setNewItemUnit('un'); setNewItemCategory('Hortifruti'); setNewItemPrice('');
                                                }}
                                            >
                                                <Icons.Plus size={16} style={{display:'inline',marginBottom:'-2px'}} /> Adicionar
                                            </button>
                                        </div>
                                    </div>

                                    {total > 0 && (
                                        <div style={{display:'flex',alignItems:'center',justifyContent:'flex-end',gap:'8px',marginBottom:'16px',fontSize:'14px',color:'var(--ink-mid)'}}>
                                            <Icons.DollarSign size={15} style={{color:'var(--green)'}} />
                                            <span>Total estimado (pendentes): <strong style={{color:'var(--ink)'}}>R$ {total.toFixed(2).replace('.',',')}</strong></span>
                                        </div>
                                    )}

                                    {pendingItems.length > 0 && (
                                        <div style={{marginBottom:'24px'}}>
                                            {cats.map(cat => {
                                                const catItems = pendingItems.filter((i: any) => i.category === cat);
                                                if (catItems.length === 0) return null;
                                                return (
                                                    <div key={cat} style={{marginBottom:'16px'}}>
                                                        <div style={{fontSize:'12px',fontWeight:'700',color:'var(--ink-light)',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:'8px'}}>{catIcons[cat]} {cat}</div>
                                                        {catItems.map((item: any) => (
                                                            <div key={item.id} style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px 16px',background:'var(--white)',border:'1.5px solid var(--cream-dark)',borderRadius:'10px',marginBottom:'6px'}}>
                                                                <button
                                                                    onClick={async () => { await toggleShoppingItem(item.id, true); const f = await getShoppingLists(); setShoppingLists(f); }}
                                                                    style={{width:'22px',height:'22px',borderRadius:'50%',border:'2px solid var(--cream-dark)',background:'transparent',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'all 0.2s'}}
                                                                    onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--green)';e.currentTarget.style.background='rgba(61,122,94,0.08)';}}
                                                                    onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--cream-dark)';e.currentTarget.style.background='transparent';}}
                                                                ></button>
                                                                <div style={{flex:1}}>
                                                                    <div style={{fontSize:'14px',fontWeight:'500',color:'var(--ink)'}}>{item.name}</div>
                                                                    <div style={{fontSize:'12px',color:'var(--ink-faint)'}}>{item.quantity} {item.unit}{item.estimatedPrice ? ` · R$ ${(item.estimatedPrice * item.quantity).toFixed(2).replace('.',',')}` : ''}</div>
                                                                </div>
                                                                <button onClick={async () => { await deleteShoppingItem(item.id); const f = await getShoppingLists(); setShoppingLists(f); }} style={{background:'transparent',border:'none',cursor:'pointer',color:'var(--ink-faint)',padding:'4px',borderRadius:'6px'}}>
                                                                    <Icons.X size={14} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {pendingItems.length === 0 && purchasedItems.length === 0 && (
                                        <div style={{textAlign:'center',padding:'48px 20px',color:'var(--ink-faint)'}}>
                                            <Icons.ShoppingCart size={40} style={{marginBottom:'12px',opacity:0.25}} />
                                            <div>Nenhum item ainda. Adicione acima!</div>
                                        </div>
                                    )}

                                    {purchasedItems.length > 0 && (
                                        <div style={{opacity:0.6}}>
                                            <div style={{fontSize:'12px',fontWeight:'700',color:'var(--green)',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:'10px'}}>Comprados ({purchasedItems.length})</div>
                                            {purchasedItems.map((item: any) => (
                                                <div key={item.id} style={{display:'flex',alignItems:'center',gap:'12px',padding:'10px 16px',background:'var(--cream)',border:'1.5px solid var(--cream-dark)',borderRadius:'10px',marginBottom:'6px'}}>
                                                    <div style={{width:'22px',height:'22px',borderRadius:'50%',background:'var(--green)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                                                        <Icons.Check size={12} color="white" strokeWidth={3} />
                                                    </div>
                                                    <div style={{flex:1,textDecoration:'line-through',fontSize:'14px',color:'var(--ink-light)'}}>{item.name} · {item.quantity} {item.unit}</div>
                                                    <button onClick={async () => { await toggleShoppingItem(item.id, false); const f = await getShoppingLists(); setShoppingLists(f); }} style={{background:'transparent',border:'none',cursor:'pointer',color:'var(--ink-faint)',fontSize:'12px'}}>
                                                        Desfazer
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })() : (
                            <div style={{textAlign:'center',padding:'60px 20px',color:'var(--ink-faint)'}}>
                                <Icons.ShoppingCart size={40} style={{marginBottom:'12px',opacity:0.3}} />
                                <div style={{fontSize:'15px',marginBottom:'16px'}}>Nenhuma lista criada ainda.</div>
                                <button onClick={async () => { const name = prompt('Nome da lista:'); if(!name?.trim()) return; const res = await createShoppingList({name:name.trim()}); if('id' in res){const fresh = await getShoppingLists(); setShoppingLists(fresh); setSelectedListId((res as any).id);} }} style={{padding:'12px 24px',background:'var(--coral)',color:'white',border:'none',borderRadius:'12px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}}>
                                    <Icons.Plus size={14} style={{display:'inline',marginBottom:'-2px',marginRight:'5px'}} /> Criar primeira lista
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    </div>

    
    <div className={`modal-overlay ${isModalOpen ? 'open' : ''}`} id="modal">
        <div className="modal">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px'}}>
                <div className="modal-title" style={{marginBottom:0}}>{presetImportant ? 'Nova Tarefa Importante' : 'Nova Tarefa'}</div>
                <button onClick={() => {
                    setNewTaskTitle("Revisar estratégia de Q" + Math.ceil((new Date().getMonth() + 1) / 3));
                    setNewTaskDate(new Date().toISOString().split('T')[0]);
                    setNewTaskStartTime("14:00");
                    setNewTaskEndTime("15:30");
                    setNewTaskPriority("high");
                    setAuthError('');
                }} style={{background:'linear-gradient(135deg, var(--coral), var(--purple))', color:'white', border:'none', padding:'6px 12px', borderRadius:'10px', fontSize:'12px', fontWeight:'600', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px'}}>
                    IA Sugerir
                </button>
            </div>
            <div className="modal-field">
                <div className="modal-label">Título</div>
                <input className="modal-input" type="text" placeholder="O que precisa ser feito?" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSaveTask()} autoFocus />
            </div>
            <div className="modal-row">
                <div className="modal-field">
                    <div className="modal-label">Data</div>
                    <input className="modal-input" type="date" value={newTaskDate} onChange={e => setNewTaskDate(e.target.value)} />
                </div>
                <div className="modal-field">
                    <div className="modal-label">Horário (Das / Até)</div>
                    <div style={{display:'flex', gap:'8px'}}>
                        <input className="modal-input" type="time" value={newTaskStartTime} onChange={e => setNewTaskStartTime(e.target.value)} style={{padding:'10px 8px'}} title="Início" />
                        <span style={{alignSelf:'center', color:'var(--ink-faint)', fontSize:'12px'}}>-</span>
                        <input className="modal-input" type="time" value={newTaskEndTime} onChange={e => setNewTaskEndTime(e.target.value)} style={{padding:'10px 8px'}} title="Fim" />
                    </div>
                </div>
            </div>
            <div className="modal-row">
                <div className="modal-field">
                    <div className="modal-label">Projeto</div>
                    <select className="modal-select modal-input" value={presetProjectId || ''} onChange={e => setPresetProjectId(e.target.value || null)}>
                        <option value="">Sem projeto</option>
                        {projects.map((p: any) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
                <div className="modal-field">
                    <div className="modal-label">Rotina</div>
                    <select className="modal-select modal-input" value={newTaskRoutine} onChange={e => setNewTaskRoutine(e.target.value)}>
                        <option value="">Nenhuma</option>
                        {routines.map((r: any) => (
                            <option key={r.id} value={r.name}>{r.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="modal-field">
                <div className="modal-label">Prioridade</div>
                <div className="modal-priority-row">
                    <button className={`priority-btn high ${newTaskPriority === 'high' ? 'active' : ''}`} onClick={() => setNewTaskPriority('high')} aria-label="Alta prioridade">
                        <Icons.AlertCircle size={13} strokeWidth={2} style={{display:'inline',marginBottom:'-2px',marginRight:'4px'}} />Alta
                    </button>
                    <button className={`priority-btn medium ${newTaskPriority === 'medium' ? 'active' : ''}`} onClick={() => setNewTaskPriority('medium')} aria-label="Média prioridade">
                        <Icons.Minus size={13} strokeWidth={2} style={{display:'inline',marginBottom:'-2px',marginRight:'4px'}} />Média
                    </button>
                    <button className={`priority-btn low ${newTaskPriority === 'low' ? 'active' : ''}`} onClick={() => setNewTaskPriority('low')} aria-label="Baixa prioridade">
                        <Icons.ChevronDown size={13} strokeWidth={2} style={{display:'inline',marginBottom:'-2px',marginRight:'4px'}} />Baixa
                    </button>
                </div>
            </div>
            <div className="modal-actions">
                <button className="modal-cancel" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button className="modal-save" onClick={handleSaveTask}>Salvar tarefa</button>
            </div>
        </div>
    </div>

    
    {/* ======== NEW PROJECT MODAL ======== */}
    {isNewProjectOpen && (
        <div className="modal-overlay open" onClick={() => setIsNewProjectOpen(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-title">Novo Projeto</div>
                <div className="modal-field">
                    <div className="modal-label">Nome do projeto</div>
                    <input className="modal-input" type="text" placeholder="Ex: Trabalho, Estudos..." value={newProjectName} onChange={e => setNewProjectName(e.target.value)} />
                </div>
                <div className="modal-field">
                    <div className="modal-label">Cor</div>
                    <div style={{display:'flex',gap:'10px',flexWrap:'wrap',marginTop:'4px'}}>
                        {['#E8503A','#5B8BD4','#3D7A5E','#7A5AA8','#D4872A','#E87070','#56A47E'].map(c => (
                            <div key={c} onClick={() => setNewProjectColor(c)} style={{width:'28px',height:'28px',borderRadius:'50%',background:c,cursor:'pointer',border: newProjectColor === c ? '3px solid var(--ink)' : '3px solid transparent',transition:'border 0.15s'}}></div>
                        ))}
                    </div>
                </div>
                <div className="modal-actions">
                    <button className="modal-cancel" onClick={() => setIsNewProjectOpen(false)}>Cancelar</button>
                    <button className="modal-save" onClick={async () => {
                        if (!newProjectName.trim()) return;
                        try {
                            const proj = await createProject({ name: newProjectName.trim(), color: newProjectColor });
                            setProjects(prev => [...prev, proj]);
                            setNewProjectName('');
                            setIsNewProjectOpen(false);
                        } catch (err: any) {
                            setSuccessToast('⚠️ ' + (err.message || 'Erro ao criar projeto.'));
                            setTimeout(() => setSuccessToast(''), 4000);
                        }
                    }}>Criar projeto</button>
                </div>
            </div>
        </div>
    )}

    {/* ======== NEW ROUTINE MODAL ======== */}
    {/* ======== SHARE PROJECT MODAL ======== */}
    {shareProjectId && (
        <div className="modal-overlay open" onClick={() => setShareProjectId(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-title">Compartilhar Projeto</div>
                <div className="modal-field">
                    <div className="modal-label">Convidar por E-mail</div>
                    <div style={{display:'flex', gap:'8px'}}>
                        <input className="modal-input" type="email" placeholder="Ex: colega@empresa.com" value={shareEmailInput} onChange={e => setShareEmailInput(e.target.value)} style={{flex:1}} />
                        <button onClick={async () => {
                            if (!shareEmailInput.trim()) return;
                            if (currentUserData?.plan === 'FREE') {
                                setSuccessToast('Acesso restrito. Compartilhamento avanado exige upgrade.');
                                setTimeout(() => setSuccessToast(''), 4000);
                                return;
                            }
                            try {
                                const res = await inviteUserToProject(shareProjectId, shareEmailInput);
                                if (res.success) {
                                    setSuccessToast('Usurio adicionado com sucesso!');
                                    setShareEmailInput('');
                                    const p = await getProjects();
                                    setProjects(p);
                                }
                            } catch (e: any) {
                                setSuccessToast("Erro: ${e.message}");
                                setTimeout(() => setSuccessToast(''), 4000);
                            }
                        }} style={{background:'var(--ink)', color:'white', border:'none', borderRadius:'8px', padding:'0 16px', fontWeight:'600', cursor:'pointer'}}>Enviar</button>
                    </div>
                </div>
                <div className="modal-field" style={{marginTop:'24px'}}>
                    <div className="modal-label">Membros Atuais</div>
                    <div style={{display:'flex', flexDirection:'column', gap:'12px', marginTop:'12px'}}>
                        {projects.find((p:any)=>p.id===shareProjectId)?.collaborators?.length > 0 ? projects.find((p:any)=>p.id===shareProjectId)?.collaborators?.map((c:any) => (
                            <div key={c.id} style={{display:'flex', alignItems:'center', gap:'12px'}}>
                                {c.image ? <img src={c.image} alt={c.name} style={{width:'32px', height:'32px', borderRadius:'16px', objectFit:'cover'}} /> : <div style={{width:'32px', height:'32px', borderRadius:'16px', background:'var(--coral)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:'700'}}>{c.name?.charAt(0)?.toUpperCase() || '?'}</div>}
                                <div style={{display:'flex', flexDirection:'column'}}>
                                    <span style={{fontSize:'14px', fontWeight:'600', color:'var(--ink)'}}>{c.name || 'Usurio'}</span>
                                    <span style={{fontSize:'12px', color:'var(--ink-light)'}}>{c.email}</span>
                                </div>
                            </div>
                        )) : <div style={{fontSize:'14px', color:'var(--ink-light)'}}>Apenas voc tem acesso a este projeto.</div>}
                    </div>
                </div>
                <div className="modal-actions" style={{marginTop:'32px'}}>
                    <button className="modal-cancel" onClick={() => { setShareProjectId(null); setShareEmailInput(''); }} style={{width:'100%'}}>Fechar</button>
                </div>
            </div>
        </div>
    )}
    {isRoutineModalOpen && (
        <div className="modal-overlay open" onClick={() => setIsRoutineModalOpen(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-title">Nova Rotina</div>
                {authError && <div style={{fontSize:'13px',color:'var(--coral)',padding:'8px 12px',background:'rgba(232,80,58,0.08)',borderRadius:'8px',marginBottom:'12px'}}>{authError}</div>}
                <div className="modal-field">
                    <div className="modal-label">Nome da rotina</div>
                    <input className="modal-input" type="text" placeholder="Ex: Foco Profundo, Revisão..." value={newRoutineName} onChange={e => setNewRoutineName(e.target.value)} />
                </div>
                <div className="modal-field">
                    <div className="modal-label">Horário</div>
                    <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                        <select className="modal-select modal-input" style={{flex:1}} value={newRoutineStartTime} onChange={e => setNewRoutineStartTime(e.target.value)}>
                            {Array.from({length:24},(_,i)=>i).map(h => (
                                <option key={h} value={`${String(h).padStart(2,'0')}:00`}>{String(h).padStart(2,'0')}:00</option>
                            ))}
                        </select>
                        <span style={{color:'var(--ink-mid)', flexShrink:0}}>até</span>
                        <select className="modal-select modal-input" style={{flex:1}} value={newRoutineEndTime} onChange={e => setNewRoutineEndTime(e.target.value)}>
                            {Array.from({length:24},(_,i)=>i).map(h => (
                                <option key={h} value={`${String(h).padStart(2,'0')}:00`}>{String(h).padStart(2,'0')}:00</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="modal-field">
                    <div className="modal-label">Cor</div>
                    <div style={{display:'flex',gap:'10px',flexWrap:'wrap',marginTop:'4px'}}>
                        {['#E8503A','#5B8BD4','#3D7A5E','#7A5AA8','#D4872A','#E87070','#56A47E'].map(c => (
                            <div key={c} onClick={() => setNewRoutineColor(c)} style={{width:'28px',height:'28px',borderRadius:'50%',background:c,cursor:'pointer',border: newRoutineColor === c ? '3px solid var(--ink)' : '3px solid transparent',transition:'border 0.15s'}}></div>
                        ))}
                    </div>
                </div>
                <div className="modal-actions">
                    <button className="modal-cancel" onClick={() => setIsRoutineModalOpen(false)}>Cancelar</button>
                    <button className="modal-save" onClick={async () => {
                        setAuthError('');
                        if (!newRoutineName.trim()) { setAuthError('Preencha o nome da rotina.'); return; }
                        const timeSlot = `${newRoutineStartTime} — ${newRoutineEndTime}`;
                        try {
                            const r = await createRoutine({ name: newRoutineName.trim(), timeSlot, color: newRoutineColor });
                            setRoutines(prev => [...prev, r]);
                            setNewRoutineName('');
                            setNewRoutineStartTime('08:00');
                            setNewRoutineEndTime('12:00');
                            setIsRoutineModalOpen(false);
                        } catch (err: any) {
                            setAuthError(err.message || 'Erro ao criar rotina. Tente novamente.');
                        }
                    }}>Criar rotina</button>
                </div>
            </div>
        </div>
    )}

    {/* ======== AI ASSISTANT FAB & PANEL ======== */}
    {['Meu Dia', 'Caixa de Entrada', 'Esta Semana', 'Lista de Compras', 'Rotinas'].includes(activeTab) && (
        <button className="ai-fab" onClick={() => {
            if (currentUserData?.plan !== 'PREMIUM') {
                setSuccessToast('Acesso restrito. O Assistente IA é exclusivo do Plano Premium.');
                setTimeout(() => setSuccessToast(''), 4000);
                return;
            }
            setIsAiChatOpen(true);
        }} title="Assistente IA">
            <Icons.Sparkles size={24} />
        </button>
    )}

    <div className={`ai-panel-overlay ${isAiChatOpen ? 'open' : ''}`} onClick={() => setIsAiChatOpen(false)}>
        <div className="ai-panel" onClick={e => e.stopPropagation()}>
            <div className="ai-header">
                <div className="ai-title"><Icons.Sparkles size={20} color="var(--coral)" /> IA Assistente</div>
                <button onClick={() => setIsAiChatOpen(false)} style={{background:'transparent', border:'none', color:'var(--ink-light)', cursor:'pointer', padding:'4px', borderRadius:'8px'}}><Icons.X size={20} /></button>
            </div>
            <div className="ai-chat-area">
                {chatMessages.map((msg, i) => (
                    <div key={i} className={`ai-bubble ${msg.role}`}>
                        {msg.content}
                    </div>
                ))}
                {isAiTyping && (
                    <div className="ai-bubble ai">
                        <div className="typing-indicator">
                            <div className="typing-dot"></div><div className="typing-dot"></div><div className="typing-dot"></div>
                        </div>
                    </div>
                )}
            </div>
            <form className="ai-input-area" onSubmit={handleSendAiMessage}>
                <div className="ai-input-wrapper">
                    <input type="text" className="ai-input" placeholder="Pergunte sobre suas tarefas..." value={chatInput} onChange={e => setChatInput(e.target.value)} />
                    <button type="submit" className="ai-send-btn" disabled={!chatInput.trim() || isAiTyping}>
                        <Icons.Send size={14} style={{marginLeft:'2px'}} />
                    </button>
                </div>
            </form>
        </div>
    </div>

    </>
  );
}





