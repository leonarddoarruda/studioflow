import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";
import bcrypt from "bcryptjs";

async function main() {
  const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
  console.log("DATABASE_URL:", url.startsWith("postgres") ? "PostgreSQL (verifique credenciais)" : url);
  console.log("AUTH_SECRET:", process.env.AUTH_SECRET ? "OK" : "❌ FALTANDO — adicione no .env");
  console.log("AUTH_URL:", process.env.AUTH_URL ?? "http://localhost:3000");

  if (url.startsWith("postgres")) {
    console.log("\n❌ DATABASE_URL aponta para PostgreSQL invalido.");
    console.log("   Para desenvolvimento local, use no .env:");
    console.log('   DATABASE_URL="file:./prisma/dev.db"');
    process.exit(1);
  }

  const dbPath = url.startsWith("file:./")
    ? `file:${path.join(process.cwd(), url.slice(6))}`
    : url;

  const prisma = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url: dbPath }) });

  try {
    const user = await prisma.user.findUnique({ where: { email: "admin@salao.com" } });
    if (!user) {
      console.log("\n❌ Admin nao existe. Rode: npm run db:seed");
    } else {
      const ok = await bcrypt.compare("admin123", user.password);
      console.log("\n✅ Admin encontrado:", user.name);
      console.log("   Senha admin123:", ok ? "✅ CORRETA" : "❌ INCORRETA — rode: npm run db:seed");
    }
  } catch (e) {
    console.error("\n❌ Erro no banco:", (e as Error).message);
    console.log("   Rode: npx prisma migrate deploy && npm run db:seed");
  } finally {
    await prisma.$disconnect();
  }
}

main();
