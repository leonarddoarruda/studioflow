import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { transactionSchema } from "@/lib/validations";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = transactionSchema.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
        { status: 400 }
      );
    }

    const { date, ...rest } = parsed.data;

    const transaction = await prisma.financialTransaction.update({
      where: { id },
      data: {
        ...rest,
        ...(date && { date: new Date(`${date}T12:00:00`) }),
      },
    });

    return NextResponse.json(transaction);
  } catch {
    return NextResponse.json(
      { error: "Erro ao atualizar transação" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { id } = await params;

  const transaction = await prisma.financialTransaction.findUnique({
    where: { id },
  });

  if (!transaction) {
    return NextResponse.json(
      { error: "Transação não encontrada" },
      { status: 404 }
    );
  }

  if (transaction.appointmentId) {
    return NextResponse.json(
      { error: "Receitas vinculadas a agendamentos não podem ser excluídas" },
      { status: 400 }
    );
  }

  await prisma.financialTransaction.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
