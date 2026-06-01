import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando seed...");

  const adminPassword = await bcrypt.hash("admin123", 12);
  const staffPassword = await bcrypt.hash("staff123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@salao.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@salao.com",
      password: adminPassword,
      phone: "5511999990001",
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "maria@salao.com" },
    update: {},
    create: {
      name: "Maria Profissional",
      email: "maria@salao.com",
      password: staffPassword,
      phone: "5511999990002",
      role: "STAFF",
    },
  });

  const existingSalon = await prisma.salonSettings.findFirst();
  if (!existingSalon) {
    await prisma.salonSettings.create({
      data: {
        name: "Salão Beleza & Estilo",
        phone: "(11) 3333-4444",
        whatsappPhone: "551133334444",
        address: "Rua das Flores, 123 — São Paulo, SP",
        openingTime: "09:00",
        closingTime: "19:00",
        slotDuration: 30,
      },
    });
  }

  const services = [
    { name: "Corte Feminino", description: "Corte e finalização", duration: 60, price: 80 },
    { name: "Corte Masculino", description: "Corte tradicional ou degradê", duration: 30, price: 45 },
    { name: "Escova", description: "Escova modeladora", duration: 45, price: 60 },
    { name: "Coloração", description: "Coloração completa", duration: 120, price: 180 },
    { name: "Manicure", description: "Unhas das mãos", duration: 45, price: 35 },
    { name: "Pedicure", description: "Unhas dos pés", duration: 60, price: 40 },
    { name: "Hidratação Capilar", description: "Tratamento profundo", duration: 90, price: 120 },
    { name: "Design de Sobrancelha", description: "Modelagem com pinça", duration: 30, price: 30 },
  ];

  for (const service of services) {
    const existing = await prisma.service.findFirst({ where: { name: service.name } });
    if (!existing) {
      await prisma.service.create({ data: service });
    }
  }

  const products = [
    { name: "Shampoo Profissional", sku: "SHP-001", quantity: 20, minQuantity: 5, price: 45 },
    { name: "Condicionador", sku: "CND-001", quantity: 18, minQuantity: 5, price: 42 },
    { name: "Tintura Castanho", sku: "TNT-001", quantity: 8, minQuantity: 3, price: 35 },
    { name: "Esmalte Vermelho", sku: "ESM-001", quantity: 30, minQuantity: 10, price: 12 },
    { name: "Acetona", sku: "ACE-001", quantity: 3, minQuantity: 5, price: 8 },
  ];

  for (const product of products) {
    const existing = await prisma.product.findUnique({ where: { sku: product.sku } });
    if (!existing) {
      await prisma.product.create({ data: product });
    }
  }

  const now = new Date();
  const sampleTransactions = [
    { type: "INCOME" as const, category: "SERVICE" as const, amount: 80, description: "Corte Feminino — Ana Paula", date: new Date(now.getFullYear(), now.getMonth(), 5), paymentMethod: "PIX" as const },
    { type: "INCOME" as const, category: "SERVICE" as const, amount: 180, description: "Coloração — Carla Mendes", date: new Date(now.getFullYear(), now.getMonth(), 8), paymentMethod: "CREDIT_CARD" as const },
    { type: "INCOME" as const, category: "PRODUCT_SALE" as const, amount: 45, description: "Venda Shampoo Profissional", date: new Date(now.getFullYear(), now.getMonth(), 10), paymentMethod: "PIX" as const },
    { type: "EXPENSE" as const, category: "RENT" as const, amount: 2500, description: "Aluguel do salão", date: new Date(now.getFullYear(), now.getMonth(), 1), paymentMethod: "TRANSFER" as const },
    { type: "EXPENSE" as const, category: "SUPPLIES" as const, amount: 680, description: "Reposição de tinturas e insumos", date: new Date(now.getFullYear(), now.getMonth(), 12), paymentMethod: "PIX" as const },
    { type: "EXPENSE" as const, category: "SALARY" as const, amount: 1800, description: "Salário — Maria Profissional", date: new Date(now.getFullYear(), now.getMonth(), 5), paymentMethod: "TRANSFER" as const },
    { type: "EXPENSE" as const, category: "UTILITIES" as const, amount: 320, description: "Conta de energia", date: new Date(now.getFullYear(), now.getMonth(), 15), paymentMethod: "PIX" as const },
  ];

  const existingTx = await prisma.financialTransaction.count();
  if (existingTx === 0) {
    for (const tx of sampleTransactions) {
      await prisma.financialTransaction.create({
        data: { ...tx, userId: admin.id },
      });
    }
  }

  console.log("✅ Seed concluído!");
  console.log("");
  console.log("Contas de acesso:");
  console.log("  Admin: admin@salao.com / admin123");
  console.log("  Profissional: maria@salao.com / staff123");
  console.log(`  Admin ID: ${admin.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
