import { prisma } from "@/lib/prisma";

export async function createServiceIncomeFromAppointment(
  appointmentId: string,
  userId: string
) {
  const existing = await prisma.financialTransaction.findUnique({
    where: { appointmentId },
  });

  if (existing) return existing;

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      client: { select: { name: true } },
      service: { select: { name: true, price: true } },
    },
  });

  if (!appointment) return null;

  return prisma.financialTransaction.create({
    data: {
      type: "INCOME",
      category: "SERVICE",
      amount: appointment.service.price,
      description: `${appointment.service.name} — ${appointment.client.name}`,
      date: appointment.date,
      paymentMethod: "PIX",
      appointmentId,
      userId,
    },
  });
}

export function getMonthRange(year: number, month: number) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);
  return { start, end };
}
