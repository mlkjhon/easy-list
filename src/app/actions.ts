"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { sendWelcomeEmail } from "@/lib/email";

export async function getUserSession() {
  return await getServerSession(authOptions);
}

async function getUser() {
  const session = await getUserSession();
  if (!session?.user?.email) return null;
  return prisma.user.findUnique({ where: { email: session.user.email } });
}

export async function getCurrentUserData() {
  const user = await getUser();
  if (!user) return null;

  if (user.email === 'jhonatan.m.araujo@aluno.senai.br' && ((user as any).role !== 'ADMIN' || (user as any).plan !== 'PREMIUM')) {
    await prisma.user.update({ where: { email: user.email }, data: { role: 'ADMIN', plan: 'PREMIUM' } as any });
    (user as any).role = 'ADMIN';
    (user as any).plan = 'PREMIUM';
  }

  return { id: user.id, name: user.name, email: user.email, role: (user as any).role, plan: (user as any).plan, status: (user as any).status, image: (user as any).image };
}

// ========================
// TASKS
// ========================
export async function getTasks() {
  try {
    const user = await getUser();
    if (!user) return [];

    // Reset routine tasks that were completed before today started
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    
    await prisma.task.updateMany({
      where: {
        userId: user.id,
        isDone: true,
        routineName: { not: null },
        updatedAt: { lt: startOfToday }
      },
      data: { isDone: false },
    });

    return prisma.task.findMany({
      where: {
        OR: [
          { userId: user.id },
          { project: { collaborators: { some: { id: user.id } } } }
        ]
      },
      include: { project: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Erro ao buscar tarefas (possível migração pendente):", error);
    const user = await getUser();
    if (!user) return [];
    return prisma.task.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
  }
}

export async function createTask(data: {
  title: string;
  priority: string;
  time?: string;
  startTime?: string;
  endTime?: string;
  projectId?: string;
  date?: string;
  routineName?: string;
  isImportant?: boolean;
}) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  // FREE plan: unlimited tasks (no limit enforced)

  const task = await prisma.task.create({
    data: {
      title: data.title,
      priority: data.priority,
      time: data.time || null,
      startTime: data.startTime || null,
      endTime: data.endTime || null,
      userId: user.id,
      projectId: data.projectId || null,
      date: data.date ? new Date(data.date) : null,
      routineName: data.routineName || null,
    },
  });

  revalidatePath("/");
  return task;
}

export async function updateTask(id: string, data: {
  title?: string;
  priority?: string;
  time?: string;
  startTime?: string;
  endTime?: string;
  projectId?: string;
  date?: string;
  routineName?: string;
}) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.priority !== undefined) updateData.priority = data.priority;
  if (data.time !== undefined) updateData.time = data.time || null;
  if (data.startTime !== undefined) updateData.startTime = data.startTime || null;
  if (data.endTime !== undefined) updateData.endTime = data.endTime || null;
  if (data.projectId !== undefined) updateData.projectId = data.projectId || null;
  if (data.date !== undefined) updateData.date = data.date ? new Date(data.date) : null;
  if (data.routineName !== undefined) updateData.routineName = data.routineName || null;

  const task = await prisma.task.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/");
  return task;
}

export async function toggleTask(id: string, isDone: boolean) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const task = await prisma.task.update({
    where: { id },
    data: { isDone },
  });

  revalidatePath("/");
  return task;
}

export async function rescheduleTask(id: string, date: string) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const task = await prisma.task.update({
    where: { id },
    data: { date: new Date(date) },
  });

  revalidatePath("/");
  return task;
}

export async function deleteTask(id: string) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  await prisma.task.delete({ where: { id, userId: user.id } });
  revalidatePath("/");
}

// ========================
// PROJECTS
// ========================
export async function getProjects() {
  try {
    const user = await getUser();
    if (!user) return [];
    return prisma.project.findMany({
      where: {
        OR: [
          { userId: user.id },
          { collaborators: { some: { id: user.id } } }
        ]
      },
      include: { _count: { select: { tasks: true } }, collaborators: { select: { id: true, name: true, image: true, email: true } } },
      orderBy: { createdAt: "asc" },
    });
  } catch (error) {
    console.error("Erro ao buscar projetos (possível migração pendente):", error);
    const user = await getUser();
    if (!user) return [];
    return prisma.project.findMany({
      where: { userId: user.id },
      include: { _count: { select: { tasks: true } } },
      orderBy: { createdAt: "asc" },
    });
  }
}

export async function createProject(data: { name: string; color: string }) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  // FREE plan: unlimited projects (no limit enforced)

  const project = await prisma.project.create({
    data: { name: data.name, color: data.color, userId: user.id },
    include: { _count: { select: { tasks: true } } },
  });

  revalidatePath("/");
  return project;
}

export async function deleteProject(id: string) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  await prisma.project.delete({ where: { id, userId: user.id } });
  revalidatePath("/");
}

export async function inviteUserToProject(projectId: string, email: string) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const project = await prisma.project.findUnique({
    where: { id: projectId, userId: user.id },
    include: { collaborators: true }
  });
  if (!project) throw new Error("Projeto não encontrado ou você não é o dono.");

  // Only PRO and PREMIUM can share projects
  if ((user as any).plan === 'FREE') {
    throw new Error("Compartilhamento de projetos está disponível nos planos Pro e Premium. Faça upgrade!");
  }

  const limit = (user as any).plan === 'PREMIUM' ? 5 : 3;
  if (project.collaborators.length >= limit) {
    throw new Error(`Seu plano permite até ${limit} colaboradores por projeto.`);
  }

  const targetUser = await prisma.user.findUnique({ where: { email } });
  if (!targetUser) throw new Error("Usuário não cadastrado na plataforma.");
  if (targetUser.id === user.id) throw new Error("Você não pode convidar a si mesmo.");
  if (project.collaborators.find((c: any) => c.id === targetUser.id)) throw new Error("Usuário já está colaborando no projeto.");

  await prisma.project.update({
    where: { id: projectId },
    data: { collaborators: { connect: { id: targetUser.id } } }
  });

  revalidatePath("/");
  return { success: true };
}

// ========================
// ROUTINES
// ========================
export async function getRoutines() {
  const user = await getUser();
  if (!user) return [];
  return prisma.routine.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });
}

export async function createRoutine(data: {
  name: string;
  timeSlot: string;
  color: string;
}) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  // FREE plan: unlimited routines (no limit enforced)

  const routine = await prisma.routine.create({
    data: { name: data.name, timeSlot: data.timeSlot, color: data.color, userId: user.id },
  });

  revalidatePath("/");
  return routine;
}

export async function deleteRoutine(id: string) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  await prisma.routine.delete({ where: { id, userId: user.id } });
  revalidatePath("/");
}

// ========================
// STATS (streak + weekly completion)
// ========================
export async function getStats() {
  const user = await getUser();
  if (!user) return { streak: 0, weeklyRate: 0, totalDone: 0, limited: false };

  const allDone = await prisma.task.findMany({
    where: { userId: user.id, isDone: true },
    select: { updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  // Streak: count consecutive days (from today backwards) that have at least 1 completed task
  const doneDates = new Set(
    allDone.map((t: { updatedAt: Date }) => t.updatedAt.toISOString().split("T")[0])
  );

  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split("T")[0];
    if (doneDates.has(key)) {
      streak++;
    } else {
      break;
    }
  }

  // Weekly completion rate
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);

  const weekTasks = await prisma.task.findMany({
    where: { userId: user.id, createdAt: { gte: weekStart } },
    select: { isDone: true },
  });

  const weeklyRate =
    weekTasks.length > 0
      ? Math.round(weekTasks.filter((t: { isDone: boolean }) => t.isDone).length / weekTasks.length * 100)
      : 0;

  return { streak, weeklyRate, totalDone: allDone.length, limited: false };
}

// ========================
// SHOPPING LISTS
// ========================
export async function getShoppingLists() {
  const user = await getUser();
  if (!user) return [];
  return prisma.shoppingList.findMany({
    where: { userId: user.id },
    include: {
      items: {
        orderBy: [{ isPurchased: 'asc' }, { category: 'asc' }, { createdAt: 'asc' }]
      },
      _count: { select: { items: true } }
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createShoppingList(data: { name: string }) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  // FREE plan: unlimited shopping lists (no limit enforced)

  const list = await prisma.shoppingList.create({
    data: { name: data.name, userId: user.id },
    include: { items: true, _count: { select: { items: true } } },
  });

  revalidatePath("/");
  return list;
}

export async function deleteShoppingList(id: string) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  await prisma.shoppingList.delete({ where: { id, userId: user.id } });
  revalidatePath("/");
}

export async function renameShoppingList(id: string, name: string) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const list = await prisma.shoppingList.update({
    where: { id, userId: user.id },
    data: { name },
    include: { items: true, _count: { select: { items: true } } },
  });

  revalidatePath("/");
  return list;
}

export async function createShoppingItem(data: {
  listId: string;
  name: string;
  quantity?: number;
  unit?: string;
  category?: string;
  estimatedPrice?: number;
}) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  // Verify list belongs to user
  const list = await prisma.shoppingList.findUnique({ where: { id: data.listId, userId: user.id } });
  if (!list) throw new Error("Lista não encontrada.");

  const item = await prisma.shoppingItem.create({
    data: {
      name: data.name,
      quantity: data.quantity || 1,
      unit: data.unit || 'un',
      category: data.category || 'Outros',
      estimatedPrice: data.estimatedPrice || null,
      isPurchased: false,
      listId: data.listId,
    },
  });

  revalidatePath("/");
  return item;
}

export async function updateShoppingItem(id: string, data: {
  name?: string;
  quantity?: number;
  unit?: string;
  category?: string;
  estimatedPrice?: number;
}) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const item = await prisma.shoppingItem.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.quantity !== undefined && { quantity: data.quantity }),
      ...(data.unit !== undefined && { unit: data.unit }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.estimatedPrice !== undefined && { estimatedPrice: data.estimatedPrice || null }),
    },
  });

  revalidatePath("/");
  return item;
}

export async function toggleShoppingItem(id: string, isPurchased: boolean) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const item = await prisma.shoppingItem.update({
    where: { id },
    data: { isPurchased },
  });

  revalidatePath("/");
  return item;
}

export async function deleteShoppingItem(id: string) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  await prisma.shoppingItem.delete({ where: { id } });
  revalidatePath("/");
}

export async function clearPurchasedItems(listId: string) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  // Verify list belongs to user
  const list = await prisma.shoppingList.findUnique({ where: { id: listId, userId: user.id } });
  if (!list) throw new Error("Lista não encontrada.");

  await prisma.shoppingItem.deleteMany({
    where: { listId, isPurchased: true },
  });

  revalidatePath("/");
  return { success: true };
}

export async function duplicateShoppingList(listId: string) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const original = await prisma.shoppingList.findUnique({
    where: { id: listId, userId: user.id },
    include: { items: true },
  });
  if (!original) throw new Error("Lista não encontrada.");

  const newList = await prisma.shoppingList.create({
    data: {
      name: `${original.name} (cópia)`,
      userId: user.id,
      items: {
        create: original.items.map((item: any) => ({
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          category: item.category,
          estimatedPrice: item.estimatedPrice,
          isPurchased: false, // Reset all items to not purchased
        })),
      },
    },
    include: { items: true, _count: { select: { items: true } } },
  });

  revalidatePath("/");
  return newList;
}

// ========================
// USER PROFILE
// ========================
export async function updateUserProfile(data: { name: string }) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { name: data.name },
  });

  revalidatePath("/");
  return { success: true, name: updated.name };
}

export async function updateProfileImage(data: { base64: string }) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  // Limit base64 length to ~1MB to prevent DB bloat
  if (data.base64.length > 1500000) {
    throw new Error("Imagem muito grande. Limite de 1MB.");
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { image: data.base64 },
  });

  revalidatePath("/");
  return { success: true, image: updated.image };
}

export async function updateUserPassword(data: {
  currentPassword: string;
  newPassword: string;
}) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser?.password) return { error: "Conta sem senha local." };

  const valid = await bcrypt.compare(data.currentPassword, dbUser.password);
  if (!valid) return { error: "Senha atual incorreta." };

  const hashed = await bcrypt.hash(data.newPassword, 12);
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed } as any });

  return { success: true };
}

export async function deleteAccount() {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  await prisma.user.delete({ where: { id: user.id } });
  return { success: true };
}

// ========================
// REGISTER
// ========================
export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  termsAccepted?: boolean;
}) {
  if (!data.termsAccepted) return { error: "Você precisa aceitar os Termos de Uso para continuar." };

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) return { error: "Este email já está cadastrado." };

  const hashedPassword = await bcrypt.hash(data.password, 12);
  const user = await prisma.user.create({
    data: { name: data.name, email: data.email, password: hashedPassword } as any,
  });

  // Send welcome email — failure is silent
  await sendWelcomeEmail({ name: data.name, email: data.email });

  return { success: true, userId: user.id };
}

// ========================
// ROUTINE DAILY RESET
// ========================
export async function resetRoutineTasks() {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  // Reset (uncheck) all done tasks that belong to a routine
  await prisma.task.updateMany({
    where: {
      userId: user.id,
      routineName: { not: null },
      isDone: true,
    },
    data: { isDone: false },
  });

  revalidatePath("/");
  return { success: true };
}

// ========================
// ADMIN SYSTEM
// ========================
export async function adminGetAllUsers() {
  const user = await getUser();
  if (!user || (user as any).role !== "ADMIN") throw new Error("Unauthorized");
  return (prisma.user.findMany as any)({
    select: { id: true, name: true, email: true, role: true, status: true, plan: true },
  });
}

export async function adminUpdateUserStatus(userId: string, status: string) {
  const admin = await getUser();
  if (!admin || (admin as any).role !== "ADMIN") throw new Error("Unauthorized");
  await prisma.user.update({ where: { id: userId }, data: { status } as any });
  revalidatePath("/");
  return { success: true };
}

export async function adminUpdateUserPlan(userId: string, plan: string) {
  const admin = await getUser();
  if (!admin || (admin as any).role !== "ADMIN") throw new Error("Unauthorized");
  await prisma.user.update({ where: { id: userId }, data: { plan } as any });
  revalidatePath("/");
  return { success: true };
}

export async function adminDeleteUser(userId: string) {
  const admin = await getUser();
  if (!admin || (admin as any).role !== "ADMIN") throw new Error("Unauthorized");
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/");
  return { success: true };
}

// ========================
// PAYMENTS
// ========================
import { stripe } from "@/lib/stripe";

export async function createStripePortalSession() {
  const user = await getUser();
  if (!user || !(user as any).stripeCustomerId) return { error: "No active subscription found." };

  const returnUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000/';

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: (user as any).stripeCustomerId,
      return_url: returnUrl,
    });
    return { url: portalSession.url };
  } catch (error) {
    console.error(error);
    return { error: "Failed to generate portal session." };
  }
}


// ========================
// TEAMS
// ========================

export async function getTeams() {
  const user = await getUser();
  if (!user) return [];
  try {
    const teams = await (prisma.team as any).findMany({
      where: { members: { some: { userId: user.id } } },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, email: true, image: true } } },
          orderBy: { joinedAt: 'asc' }
        },
        _count: { select: { messages: true, tasks: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return teams;
  } catch {
    return [];
  }
}

export async function getMyInvitations() {
  const user = await getUser();
  if (!user || !(user as any).email) return [];
  try {
    const invitations = await (prisma.teamInvitation as any).findMany({
      where: {
        email: (user as any).email,
        status: 'PENDING'
      },
      include: {
        team: {
          include: {
            members: {
              where: { role: 'OWNER' },
              include: { user: { select: { name: true, image: true } } }
            }
          }
        }
      }
    });
    return invitations;
  } catch {
    return [];
  }
}

export async function createTeam(name: string, description: string) {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');

  const userPlan = (user as any).plan;
  if (userPlan === 'FREE') throw new Error('Equipes são exclusivas dos planos Pro e Premium.');

  const team = await (prisma.team as any).create({
    data: {
      name,
      description,
      color: '#E8503A',
      ownerId: user.id,
      members: {
        create: {
          userId: user.id,
          role: 'OWNER'
        }
      }
    }
  });
  revalidatePath('/');
  return { success: true, teamId: team.id };
}

export async function deleteTeam(teamId: string) {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');

  const team = await (prisma.team as any).findFirst({
    where: { id: teamId, ownerId: user.id }
  });
  if (!team) throw new Error('Apenas o Anfitrião pode excluir a equipe.');

  await (prisma.team as any).delete({ where: { id: teamId } });
  revalidatePath('/');
  return { success: true };
}

export async function inviteToTeam(teamId: string, email: string, role: string) {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');

  // Check permission
  const myMembership = await (prisma.teamMember as any).findUnique({
    where: { teamId_userId: { teamId, userId: user.id } }
  });
  if (!myMembership || !['OWNER', 'VICE_OWNER'].includes(myMembership.role)) {
    throw new Error('Apenas Anfitrião ou Vice-Anfitrião podem convidar membros.');
  }

  // Only OWNER can invite VICE_OWNER
  if (role === 'VICE_OWNER' && myMembership.role !== 'OWNER') {
    throw new Error('Apenas o Anfitrião pode promover Vice-Anfitrião.');
  }

  // Find the invited user by email
  const invitedUser = await prisma.user.findUnique({ where: { email } });

  // Check not already a member
  if (invitedUser) {
    const existing = await (prisma.teamMember as any).findUnique({
      where: { teamId_userId: { teamId, userId: invitedUser.id } }
    });
    if (existing) return { error: 'Este usuário já é membro da equipe.' };
  }

  // Upsert invitation (avoid duplicates)
  await (prisma.teamInvitation as any).upsert({
    where: { teamId_email: { teamId, email } },
    update: { role, status: 'PENDING', invitedUserId: invitedUser?.id ?? null },
    create: {
      teamId,
      email,
      role,
      status: 'PENDING',
      invitedUserId: invitedUser?.id ?? null
    }
  });

  revalidatePath('/');
  return { success: true };
}

export async function respondToInvitation(invitationId: string, accept: boolean) {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');

  const invitation = await (prisma.teamInvitation as any).findUnique({
    where: { id: invitationId },
    include: { team: true }
  });
  if (!invitation || invitation.status !== 'PENDING') throw new Error('Convite não encontrado.');
  if (invitation.email !== (user as any).email) throw new Error('Este convite não é para você.');

  if (accept) {
    // Add as member
    await (prisma.teamMember as any).upsert({
      where: { teamId_userId: { teamId: invitation.teamId, userId: user.id } },
      update: { role: invitation.role },
      create: { teamId: invitation.teamId, userId: user.id, role: invitation.role }
    });
    await (prisma.teamInvitation as any).update({
      where: { id: invitationId },
      data: { status: 'ACCEPTED' }
    });
  } else {
    await (prisma.teamInvitation as any).update({
      where: { id: invitationId },
      data: { status: 'DECLINED' }
    });
  }

  revalidatePath('/');
  return { success: true };
}

export async function updateMemberRole(teamId: string, targetUserId: string, newRole: string) {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');

  const myMembership = await (prisma.teamMember as any).findUnique({
    where: { teamId_userId: { teamId, userId: user.id } }
  });
  if (!myMembership || myMembership.role !== 'OWNER') {
    throw new Error('Apenas o Anfitrião pode alterar cargos.');
  }
  if (targetUserId === user.id) throw new Error('Você não pode alterar seu próprio cargo.');

  await (prisma.teamMember as any).update({
    where: { teamId_userId: { teamId, userId: targetUserId } },
    data: { role: newRole }
  });

  revalidatePath('/');
  return { success: true };
}

export async function removeMember(teamId: string, targetUserId: string) {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');

  const myMembership = await (prisma.teamMember as any).findUnique({
    where: { teamId_userId: { teamId, userId: user.id } }
  });
  if (!myMembership || !['OWNER', 'VICE_OWNER'].includes(myMembership.role)) {
    throw new Error('Sem permissão para remover membros.');
  }
  if (targetUserId === user.id) throw new Error('Você não pode se remover. Exclua a equipe se quiser sair.');

  await (prisma.teamMember as any).delete({
    where: { teamId_userId: { teamId, userId: targetUserId } }
  });

  revalidatePath('/');
  return { success: true };
}

export async function assignTaskToMember(
  teamId: string,
  assignedToId: string,
  title: string,
  priority: string,
  date?: string
) {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');

  const myMembership = await (prisma.teamMember as any).findUnique({
    where: { teamId_userId: { teamId, userId: user.id } }
  });
  if (!myMembership || !['OWNER', 'VICE_OWNER', 'SUPERVISOR'].includes(myMembership.role)) {
    throw new Error('Sem permissão para atribuir tarefas.');
  }

  // Supervisors can only assign to WORKERs
  if (myMembership.role === 'SUPERVISOR') {
    const targetMembership = await (prisma.teamMember as any).findUnique({
      where: { teamId_userId: { teamId, userId: assignedToId } }
    });
    if (!targetMembership || targetMembership.role !== 'WORKER') {
      throw new Error('Supervisores só podem atribuir tarefas a Trabalhadores.');
    }
  }

  const task = await (prisma.task as any).create({
    data: {
      title,
      priority,
      date: date ? new Date(date) : null,
      teamId,
      assignedToId,
      assignedById: user.id,
      userId: assignedToId,
      isDone: false
    }
  });

  revalidatePath('/');
  return { success: true, taskId: task.id };
}

export async function getTeamDetails(teamId: string) {
  const user = await getUser();
  if (!user) return null;
  try {
    const team = await (prisma.team as any).findFirst({
      where: { id: teamId, members: { some: { userId: user.id } } },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, email: true, image: true } } },
          orderBy: { joinedAt: 'asc' }
        },
        tasks: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { id: true, name: true, image: true } }
          }
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { user: { select: { id: true, name: true, image: true } } },
          take: 100
        },
        invitations: {
          where: { status: 'PENDING' },
          select: { id: true, email: true, role: true, status: true, createdAt: true }
        }
      }
    });
    return team;
  } catch {
    return null;
  }
}

export async function sendTeamMessage(teamId: string, content: string) {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');

  const membership = await (prisma.teamMember as any).findUnique({
    where: { teamId_userId: { teamId, userId: user.id } }
  });
  if (!membership) throw new Error('Você não é membro desta equipe.');

  await (prisma.teamMessage as any).create({
    data: { content, teamId, userId: user.id }
  });

  revalidatePath('/');
  return { success: true };
}

export async function getTeamStats(teamId: string) {
  const user = await getUser();
  if (!user) return null;

  const membership = await (prisma.teamMember as any).findUnique({
    where: { teamId_userId: { teamId, userId: user.id } }
  });
  if (!membership) return null;

  const members = await (prisma.teamMember as any).findMany({
    where: { teamId },
    include: { user: { select: { id: true, name: true, email: true, image: true } } }
  });

  const stats = await Promise.all(
    members.map(async (m: any) => {
      const allTasks = await (prisma.task as any).findMany({
        where: { teamId, assignedToId: m.userId }
      });
      const done = allTasks.filter((t: any) => t.isDone);
      const pending = allTasks.filter((t: any) => !t.isDone);

      // Group done tasks by day of week (0=Sun, 6=Sat)
      const byDay = [0, 0, 0, 0, 0, 0, 0];
      done.forEach((t: any) => {
        if (t.updatedAt) {
          const d = new Date(t.updatedAt).getDay();
          byDay[d]++;
        }
      });

      return {
        userId: m.userId,
        name: m.user.name,
        email: m.user.email,
        image: m.user.image,
        role: m.role,
        total: allTasks.length,
        done: done.length,
        pending: pending.length,
        rate: allTasks.length > 0 ? Math.round((done.length / allTasks.length) * 100) : 0,
        byDay
      };
    })
  );

  return stats;
}

export async function cancelInvitation(invitationId: string) {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');

  const invitation = await (prisma.teamInvitation as any).findUnique({
    where: { id: invitationId },
    include: { team: true }
  });
  if (!invitation) throw new Error('Convite não encontrado.');

  // Only team owner/vice can cancel
  const myMembership = await (prisma.teamMember as any).findUnique({
    where: { teamId_userId: { teamId: invitation.teamId, userId: user.id } }
  });
  if (!myMembership || !['OWNER', 'VICE_OWNER'].includes(myMembership.role)) {
    throw new Error('Sem permissão para cancelar convite.');
  }

  await (prisma.teamInvitation as any).delete({ where: { id: invitationId } });
  revalidatePath('/');
  return { success: true };
}

