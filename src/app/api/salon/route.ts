import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { salonSettingsSchema } from "@/lib/validations";

export async function GET() {
  const settings = await prisma.salonSettings.findFirst();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = salonSettingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
        { status: 400 }
      );
    }

    const existing = await prisma.salonSettings.findFirst();

    const settings = existing
      ? await prisma.salonSettings.update({
          where: { id: existing.id },
          data: parsed.data,
        })
      : await prisma.salonSettings.create({ data: parsed.data });

    return NextResponse.json(settings);
  } catch {
    return NextResponse.json(
      { error: "Erro ao salvar configurações" },
      { status: 500 }
    );
  }
}
