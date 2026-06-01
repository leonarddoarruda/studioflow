import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { transactionSchema } from "@/lib/validations";
import { getMonthRange } from "@/lib/finance";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const month = parseInt(searchParams.get("month") ?? String(new Date().getMonth() + 1));
  const year = parseInt(searchParams.get("year") ?? String(new Date().getFullYear()));
  const type = searchParams.get("type");

  const { start, end } = getMonthRange(year, month);

  const where: Record<string, unknown> = {
    date: { gte: start, lte: end },
  };

  if (type === "INCOME" || type === "EXPENSE") {
    where.type = type;
  }

  const transactions = await prisma.financialTransaction.findMany({
    where,
    include: {
      user: { select: { name: true } },
      appointment: {
        select: {
          client: { select: { name: true } },
          service: { select: { name: true } },
        },
      },
    },
    orderBy: { date: "desc" },
  });

  const income = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const byCategory = transactions.reduce<Record<string, number>>((acc, t) => {
    const key = `${t.type}_${t.category}`;
    acc[key] = (acc[key] ?? 0) + t.amount;
    return acc;
  }, {});

  const last6Months = await Promise.all(
    Array.from({ length: 6 }, (_, i) => {
      const d = new Date(year, month - 1 - i, 1);
      const range = getMonthRange(d.getFullYear(), d.getMonth() + 1);
      return prisma.financialTransaction.findMany({
        where: { date: { gte: range.start, lte: range.end } },
        select: { type: true, amount: true },
      }).then((items) => ({
        month: d.getMonth() + 1,
        year: d.getFullYear(),
        income: items.filter((x) => x.type === "INCOME").reduce((s, x) => s + x.amount, 0),
        expense: items.filter((x) => x.type === "EXPENSE").reduce((s, x) => s + x.amount, 0),
      }));
    })
  );

  return NextResponse.json({
    transactions,
    summary: {
      income,
      expense,
      balance: income - expense,
      count: transactions.length,
    },
    byCategory,
    cashFlow: last6Months.reverse(),
    period: { month, year },
  });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = transactionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
        { status: 400 }
      );
    }

    const { date, paymentMethod, appointmentId, ...rest } = parsed.data;

    const transaction = await prisma.financialTransaction.create({
      data: {
        ...rest,
        date: new Date(`${date}T12:00:00`),
        paymentMethod: paymentMethod ?? "PIX",
        appointmentId: appointmentId || null,
        userId: session.user.id,
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erro ao registrar transação" },
      { status: 500 }
    );
  }
}
