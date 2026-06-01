import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";
import { notifyAppointmentStatusChange } from "@/lib/whatsapp/evolution";
import { createServiceIncomeFromAppointment } from "@/lib/finance";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "STAFF"].includes(session.user.role)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { status, staffId, notes } = body;

    const existing = await prisma.appointment.findUnique({
      where: { id },
      include: {
        client: { select: { name: true, phone: true } },
        staff: { select: { name: true } },
        service: { select: { name: true, price: true } },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Agendamento não encontrado" },
        { status: 404 }
      );
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(staffId !== undefined && { staffId: staffId || null }),
        ...(notes !== undefined && { notes }),
      },
      include: {
        client: { select: { id: true, name: true, phone: true } },
        staff: { select: { id: true, name: true } },
        service: { select: { id: true, name: true, duration: true, price: true } },
      },
    });

    if (status && status !== existing.status) {
      const salon = await prisma.salonSettings.findFirst();
      await notifyAppointmentStatusChange({
        clientName: existing.client.name,
        clientPhone: existing.client.phone ?? "",
        serviceName: existing.service.name,
        staffName: existing.staff?.name,
        dateTime: formatDateTime(existing.date),
        salonName: salon?.name ?? "Salão de Beleza",
        salonPhone: salon?.phone ?? "",
        status,
      });

      if (status === "COMPLETED") {
        await createServiceIncomeFromAppointment(id, session.user.id);
      }
    }

    return NextResponse.json(appointment);
  } catch {
    return NextResponse.json(
      { error: "Erro ao atualizar agendamento" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.appointment.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json(
      { error: "Agendamento não encontrado" },
      { status: 404 }
    );
  }

  if (
    session.user.role === "CLIENT" &&
    existing.clientId !== session.user.id
  ) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  await prisma.appointment.update({
    where: { id },
    data: { status: "CANCELLED" },
  });

  return NextResponse.json({ success: true });
}
