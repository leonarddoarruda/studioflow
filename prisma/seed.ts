import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";
import bcrypt from "bcryptjs";

const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const dbPath = url.startsWith("file:./")
  ? `file:${path.join(process.cwd(), url.slice(6))}`
  : url;

const prisma = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url: dbPath }) });

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
  ];

  for (const service of services) {
    const existing = await prisma.service.findFirst({ where: { name: service.name } });
    if (!existing) await prisma.service.create({ data: service });
  }

  console.log("✅ Seed concluído!");
  console.log("  Admin: admin@salao.com / admin123");
  console.log("  Profissional: maria@salao.com / staff123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
