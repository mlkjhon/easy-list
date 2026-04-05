import fs from "fs";

let page = fs.readFileSync("src/app/page.tsx", "utf-8");

// 1. Inject renderTaskItem and logical date helpers
const helperInjection = `
  const isTaskLocked = (t: any) => t.date && new Date(t.date).toISOString().split('T')[0] > new Date().toISOString().split('T')[0];
  const isTaskOverdue = (t: any) => !t.isDone && t.date && new Date(t.date).toISOString().split('T')[0] < new Date().toISOString().split('T')[0];

  const renderTaskItem = (t: any) => {
    const locked = isTaskLocked(t);
    const overdue = isTaskOverdue(t);
    
    return (
      <div key={t.id} className="task-item" style={{ opacity: locked ? 0.6 : 1 }}>
        <div className="task-checkbox" style={{
            cursor: locked ? 'not-allowed' : 'pointer',
            background: t.isDone ? 'var(--coral)' : 'transparent',
            borderColor: t.isDone ? 'var(--coral)' : 'var(--ink-faint)'
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
            {t.time && <span>· {t.time}</span>}
            {t.routineName && <span>· <Icons.Clock size={12} style={{display:'inline',marginBottom:'-2px'}}/> {t.routineName}</span>}
            {locked && <span style={{color:'var(--ink-light)'}}>· 🔒 Futuro</span>}
            {overdue && <span style={{color:'var(--coral)', fontWeight:'600'}}>· ⚠️ Atrasada</span>}
          </div>
        </div>
        <div className="task-actions" style={{display:'flex', gap:'8px', alignItems:'center'}}>
            {overdue && (
                <button onClick={async () => {
                    const today = new Date().toISOString().split('T')[0];
                    await rescheduleTask(t.id, today);
                    // refresh tasks roughly
                    refreshStats();
                    getTasks().then(setTasks);
                }} style={{background:'var(--cream)', color:'var(--ink)', border:'1px solid var(--cream-dark)', borderRadius:'6px', padding:'4px 8px', fontSize:'11px', cursor:'pointer', display:'flex', alignItems:'center', gap:'4px'}}>
                    <Icons.Calendar size={12} /> Reagendar
                </button>
            )}
            <div className="priority-bar" style={{background: t.priority === 'high' ? 'var(--coral)' : t.priority === 'medium' ? 'var(--amber)' : 'var(--green)'}}></div>
        </div>
      </div>
    );
  };

  return (
`;
page = page.replace("  return (", helperInjection);


// 2. Replace the giant Block starting at {(activeTab === 'Meu Dia' || activeTab === 'Caixa de Entrada' || activeTab.startsWith('proj-'))
// Here we will do this with a reliable string replace between two unique markers.
const blockStartStr = "{/* ---- MEU DIA / CAIXA DE ENTRADA / PROJETOS ---- */}";
const blockEndStr = "{/* ---- ROTINAS ---- */}";

const myDayCaixaProjectsHTML = `
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
                        <div className="section-header">
                            <h2>Tarefas de Hoje</h2>
                            <a style={{cursor:'pointer'}} onClick={() => openTaskModal()}>+ Adicionar</a>
                        </div>
                        <div className="task-list">
                            {tasks.filter(t => !t.isDone && (!t.date || new Date(t.date).toISOString().split('T')[0] <= new Date().toISOString().split('T')[0])).map(renderTaskItem)}
                            {tasks.filter(t => !t.isDone && (!t.date || new Date(t.date).toISOString().split('T')[0] <= new Date().toISOString().split('T')[0])).length === 0 && (
                                <div style={{textAlign:'center',padding:'40px 20px',color:'var(--ink-faint)'}}>
                                    <Icons.CheckCircle2 size={40} strokeWidth={1} style={{margin:'0 auto 12px',display:'block',color:'var(--green)'}} />
                                    Nenhuma tarefa pendente para hoje. Ótimo trabalho!
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
                        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))',gap:'16px'}}>
                            {tasks.filter(t => !t.isDone).map(t => (
                                <div key={t.id} style={{background: 'var(--white)', padding: '20px', borderRadius: '16px', border: '1px solid var(--cream-dark)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)'}}>
                                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'12px'}}>
                                        <div style={{fontSize:'12px',fontWeight:'600',color:t.priority==='high'?'var(--coral)':t.priority==='medium'?'var(--amber)':'var(--green)',background:t.priority==='high'?'rgba(232,80,58,0.1)':t.priority==='medium'?'rgba(212,135,42,0.1)':'rgba(61,122,94,0.1)',padding:'4px 8px',borderRadius:'8px'}}>
                                            {t.priority === 'high' ? 'Alta' : t.priority === 'medium' ? 'Média' : 'Baixa'}
                                        </div>
                                        <div style={{cursor:'pointer'}} onClick={async () => {
                                            const u = await toggleTask(t.id, !t.isDone);
                                            setTasks(tasks.map(tk => tk.id === t.id ? {...tk, isDone: u.isDone} : tk));
                                        }}>
                                            <div style={{width:'20px',height:'20px',borderRadius:'50%',border:'2px solid var(--cream-dark)',background:'transparent'}}></div>
                                        </div>
                                    </div>
                                    <h3 style={{fontSize:'16px',margin:'0 0 8px 0',color:'var(--ink)',lineHeight:'1.4'}}>{t.title}</h3>
                                    <div style={{fontSize:'12px',color:'var(--ink-light)',display:'flex',flexWrap:'wrap',gap:'8px'}}>
                                        {t.projectId && <span><Icons.Folder size={12} style={{display:'inline',marginBottom:'-2px'}}/> {projects.find((p:any)=>p.id===t.projectId)?.name}</span>}
                                        {t.routineName && <span><Icons.Clock size={12} style={{display:'inline',marginBottom:'-2px'}}/> {t.routineName}</span>}
                                        {t.date && <span>📅 {new Date(t.date).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'})}</span>}
                                        {t.time && <span>⏳ {t.time}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {tasks.filter(t => !t.isDone).length === 0 && (
                            <div style={{textAlign:'center',padding:'60px 20px',color:'var(--ink-faint)',background:'var(--cream)',borderRadius:'16px'}}>
                                <Icons.Inbox size={48} strokeWidth={1.5} style={{margin:'0 auto 16px',display:'block',color:'var(--ink-faint)'}} />
                                Caixa de entrada vazia.
                            </div>
                        )}
                    </>
                )}

                {/* ---- PROJETOS ---- */}
                {activeTab.startsWith('proj-') && (
                    <>
                        <div className="section-header">
                            <h2>Projeto: {projects.find((p:any) => p.id === activeTab.replace('proj-',''))?.name || 'Vazio'}</h2>
                            <a style={{cursor:'pointer'}} onClick={() => openTaskModal({ projectId: activeTab.replace('proj-','') })}>+ Adicionar</a>
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

`;

// Do replacement logic using indexOf
const startIndex = page.indexOf(blockStartStr);
const endIndex = page.indexOf(blockEndStr);
if (startIndex !== -1 && endIndex !== -1) {
    page = page.substring(0, startIndex) + myDayCaixaProjectsHTML + page.substring(endIndex);
}

// 3. Add Concluídas to UI
// 3.1 Sidebar Tab
const sidebarTabs = \`
                    <div className={\\\`sidebar-item \\\${activeTab === 'Rotinas' ? 'active' : ''}\\\`\} onClick={() => setActiveTab('Rotinas')}>
                        <Icons.Clock size={18} className="sidebar-item-icon" />
                        Rotinas
                    </div>
                    <div className={\\\`sidebar-item \\\${activeTab === 'Concluídas' ? 'active' : ''}\\\`\} onClick={() => setActiveTab('Concluídas')}>
                        <Icons.CheckCircle size={18} className="sidebar-item-icon" />
                        Concluídas
                    </div>
\`;
page = page.replace(\`
                    <div className={\\\`sidebar-item \\\${activeTab === 'Rotinas' ? 'active' : ''}\\\`\} onClick={() => setActiveTab('Rotinas')}>
                        <Icons.Clock size={18} className="sidebar-item-icon" />
                        Rotinas
                    </div>
\`.trim(), sidebarTabs.trim());

// 3.2 Action Button Header
const actionButtonsReplace = \`                    {activeTab === 'Rotinas' && (
                        <button className="app-add-btn" onClick={() => setIsRoutineModalOpen(true)}><Icons.Plus size={16} /> Nova rotina</button>
                    )}
                    {activeTab === 'Concluídas' && (
                        <></>
                    )}
\`;
page = page.replace(\`                    {activeTab === 'Rotinas' && (
                        <button className="app-add-btn" onClick={() => setIsRoutineModalOpen(true)}>+ Nova rotina</button>
                    )}
\`, actionButtonsReplace);

// Update ALL old + buttons to Icon buttons
page = page.replace('+ Nova tarefa', '<Icons.Plus size={16} /> Nova tarefa');
page = page.replace('+ Nova tarefa', '<Icons.Plus size={16} /> Nova tarefa');
page = page.replace('+ Adicionar tarefa', '<Icons.Plus size={16} /> Adicionar tarefa');
page = page.replace('+ Tarefa importante', '<Icons.Star size={16} /> Tarefa importante');
page = page.replace('+ Agendar tarefa', '<Icons.Calendar size={16} /> Agendar tarefa');


// 4. Implement Concluídas Tab Content
const concluidasStr = \`
                {/* ---- CONCLUÍDAS ---- */}
                {activeTab === 'Concluídas' && (
                    <>
                        <div className="section-header"><h2>Tarefas Concluídas</h2></div>
                        <div className="task-list">
                            {tasks.filter(t => t.isDone).map(t => (
                                <div key={t.id} className="task-item" style={{opacity:0.8}}>
                                    <div className="task-checkbox" onClick={async () => { const u = await toggleTask(t.id, !t.isDone); setTasks(tasks.map(tk => tk.id === t.id ? {...tk, isDone: u.isDone} : tk)); }} style={{background:'var(--coral)',borderColor:'var(--coral)'}}><Icons.Check size={14} color="white"/></div>
                                    <div className="task-content">
                                        <div className="task-title" style={{textDecoration:'line-through'}}>{t.title}</div>
                                        <div className="task-meta"><div className="task-project-dot" style={{background: t.priority === 'high' ? 'var(--coral)' : t.priority === 'medium' ? 'var(--amber)' : 'var(--green)'}}></div><span>{t.priority === 'high' ? 'Alta' : t.priority === 'medium' ? 'Média' : 'Baixa'}</span>
                                        {t.projectId && <span>· {projects.find((p:any)=>p.id===t.projectId)?.name}</span>}
                                        </div>
                                    </div>
                                    <div className="task-actions"><div className="priority-bar" style={{background: t.priority === 'high' ? 'var(--coral)' : t.priority === 'medium' ? 'var(--amber)' : 'var(--green)'}}></div></div>
                                </div>
                            ))}
                            {tasks.filter(t => t.isDone).length === 0 && (
                                <div style={{textAlign:'center',padding:'40px 20px',color:'var(--ink-faint)'}}>Ainda nenhuma tarefa concluída.</div>
                            )}
                        </div>
                    </>
                )}

                {/* ---- DASHBOARD ---- */}
\`;
page = page.replace("{/* ---- DASHBOARD ---- */}", concluidasStr);

// 5. Update ESTA SEMANA, DASHBOARD, IMPORTANTES to use renderTaskItem instead
page = page.replace(\`tasks.filter(t => t.priority === 'high' && !t.isDone).map(t => (
                                <div key={t.id} className="task-item">
                                    <div className="task-checkbox" onClick={async () => { const u = await toggleTask(t.id, !t.isDone); setTasks(tasks.map(tk => tk.id === t.id ? {...tk, isDone: u.isDone} : tk)); }}></div>
                                    <div className="task-content">
                                        <div className="task-title">{t.title}</div>
                                        <div className="task-meta"><div className="task-project-dot" style={{background:'var(--coral)'}}></div><span>Alta prioridade</span></div>
                                    </div>
                                    <div className="task-actions"><div className="priority-bar" style={{background:'var(--coral)'}}></div></div>
                                </div>
                            ))\`, \`tasks.filter(t => t.priority === 'high' && !t.isDone).map(renderTaskItem)\`);

page = page.replace(\`tasks.filter(t => !t.isDone).map(t => (
                                <div key={t.id} className="task-item">
                                    <div className="task-checkbox" onClick={async () => { const u = await toggleTask(t.id, !t.isDone); setTasks(tasks.map(tk => tk.id === t.id ? {...tk, isDone: u.isDone} : tk)); }}></div>
                                    <div className="task-content">
                                        <div className="task-title">{t.title}</div>
                                        <div className="task-meta"><div className="task-project-dot" style={{background: t.priority === 'high' ? 'var(--coral)' : t.priority === 'medium' ? 'var(--amber)' : 'var(--green)'}}></div><span>{t.priority === 'high' ? 'Alta' : t.priority === 'medium' ? 'Média' : 'Baixa'}</span></div>
                                    </div>
                                    <div className="task-actions"><div className="priority-bar" style={{background: t.priority === 'high' ? 'var(--coral)' : t.priority === 'medium' ? 'var(--amber)' : 'var(--green)'}}></div></div>
                                </div>
                            ))\`, \`tasks.filter(t => !t.isDone).map(renderTaskItem)\`);                            

fs.writeFileSync("src/app/page.tsx", page);

console.log("Success");
