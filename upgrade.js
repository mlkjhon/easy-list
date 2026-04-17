const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.user.updateMany({
      where: { email: 'jhonatan.m.araujo@aluno.senai.br' },
      data: { plan: 'PREMIUM', role: 'ADMIN' },
    });
    console.log('Jhonatan is now ADMIN and PREMIUM.');
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
