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
  return { id: user.id, name: user.name, email: user.email, role: (user as any).role, plan: (user as any).plan, status: (user as any).status };
}

// ========================
// TASKS
// ========================
export async function getTasks() {
  const user = await getUser();
  if (!user) return [];
  return prisma.task.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function createTask(data: {
  title: string;
  priority: string;
  time?: string;
  projectId?: string;
  date?: string;
  routineName?: string;
  isImportant?: boolean;
}) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  // Enforce FREE plan limits
  if ((user as any).plan === 'FREE') {
    const count = await prisma.task.count({ where: { userId: user.id } });
    if (count >= 50) throw new Error("Limite de 50 tarefas atingido. Faça upgrade para o Plano Pro para tarefas ilimitadas!");
  }

  const task = await prisma.task.create({
    data: {
      title: data.title,
      priority: data.priority,
      time: data.time || null,
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
  const user = await getUser();
  if (!user) return [];
  return prisma.project.findMany({
    where: { userId: user.id },
    include: { _count: { select: { tasks: true } } },
    orderBy: { createdAt: "asc" },
  });
}

export async function createProject(data: { name: string; color: string }) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  // Enforce FREE plan limits
  if ((user as any).plan === 'FREE') {
    const count = await prisma.project.count({ where: { userId: user.id } });
    if (count >= 2) throw new Error("Limite de 2 projetos atingido. Faça upgrade para o Plano Pro para projetos ilimitados!");
  }

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

  // Enforce FREE plan limits
  if ((user as any).plan === 'FREE') {
    const count = await prisma.routine.count({ where: { userId: user.id } });
    if (count >= 1) throw new Error("Limite de 1 rotina atingido. Faça upgrade para o Plano Pro para rotinas ilimitadas!");
  }

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
  if (!user) return { streak: 0, weeklyRate: 0, totalDone: 0 };

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

  return { streak, weeklyRate, totalDone: allDone.length };
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
