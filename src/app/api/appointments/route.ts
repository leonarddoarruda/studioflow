import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { appointmentSchema } from "@/lib/validations";
import { formatDateTime } from "@/lib/utils";
import {
  notifyClientAppointment,
  notifySalonNewAppointment,
} from "@/lib/whatsapp/evolution";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const date = searchParams.get("date");

  const where: Record<string, unknown> = {};

  if (session.user.role === "CLIENT") {
    where.clientId = session.user.id;
  }

  if (status) {
    where.status = status;
  }

  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    where.date = { gte: start, lte: end };
  }

  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      client: { select: { id: true, name: true, email: true, phone: true } },
      staff: { select: { id: true, name: true } },
      service: { select: { id: true, name: true, duration: true, price: true } },
    },
    orderBy: { date: "asc" },
  });

  return NextResponse.json(appointments);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = appointmentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
        { status: 400 }
      );
    }

    const { serviceId, staffId, date, time, notes, clientId } = parsed.data;

    const appointmentDate = new Date(`${date}T${time}:00`);

    if (appointmentDate <= new Date()) {
      return NextResponse.json(
        { error: "A data do agendamento deve ser futura" },
        { status: 400 }
      );
    }

    const resolvedClientId =
      session.user.role === "CLIENT"
        ? session.user.id
        : clientId ?? session.user.id;

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service || !service.active) {
      return NextResponse.json(
        { error: "Serviço não encontrado" },
        { status: 404 }
      );
    }

    const conflict = await prisma.appointment.findFirst({
      where: {
        staffId: staffId ?? undefined,
        date: {
          gte: new Date(appointmentDate.getTime() - service.duration * 60000),
          lte: new Date(appointmentDate.getTime() + service.duration * 60000),
        },
        status: { notIn: ["CANCELLED"] },
      },
    });

    if (conflict && staffId) {
      return NextResponse.json(
        { error: "Horário indisponível para este profissional" },
        { status: 409 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        clientId: resolvedClientId,
        staffId: staffId || null,
        serviceId,
        date: appointmentDate,
        notes,
        status: "CONFIRMED",
      },
      include: {
        client: { select: { name: true, phone: true } },
        staff: { select: { name: true } },
        service: { select: { name: true } },
      },
    });

    const salon = await prisma.salonSettings.findFirst();

    const notificationData = {
      clientName: appointment.client.name,
      clientPhone: appointment.client.phone ?? "",
      serviceName: appointment.service.name,
      staffName: appointment.staff?.name,
      dateTime: formatDateTime(appointment.date),
      salonName: salon?.name ?? "Salão de Beleza",
      salonPhone: salon?.phone ?? "",
    };

    await Promise.all([
      notifyClientAppointment(notificationData),
      notifySalonNewAppointment({
        ...notificationData,
        salonPhone: salon?.whatsappPhone ?? salon?.phone ?? "",
      }),
    ]);

    return NextResponse.json(appointment, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erro ao criar agendamento" },
      { status: 500 }
    );
  }
}
