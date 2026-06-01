import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user || !["ADMIN", "STAFF"].includes(session.user.role)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [todayAppointments, pendingAppointments, totalClients, totalServices, allProducts] =
    await Promise.all([
      prisma.appointment.count({
        where: {
          date: { gte: today, lt: tomorrow },
          status: { notIn: ["CANCELLED"] },
        },
      }),
      prisma.appointment.count({ where: { status: "PENDING" } }),
      prisma.user.count({ where: { role: "CLIENT", active: true } }),
      prisma.service.count({ where: { active: true } }),
      prisma.product.findMany({
        where: { active: true },
        select: { id: true, name: true, quantity: true, minQuantity: true },
      }),
    ]);

  const lowStock = allProducts.filter((p) => p.quantity <= p.minQuantity);

  const upcomingAppointments = await prisma.appointment.findMany({
    where: {
      date: { gte: new Date() },
      status: { notIn: ["CANCELLED", "COMPLETED"] },
    },
    include: {
      client: { select: { name: true } },
      service: { select: { name: true } },
      staff: { select: { name: true } },
    },
    orderBy: { date: "asc" },
    take: 5,
  });

  return NextResponse.json({
    todayAppointments,
    pendingAppointments,
    totalClients,
    lowStockCount: lowStock.length,
    totalServices,
    lowStock,
    upcomingAppointments,
  });
}
