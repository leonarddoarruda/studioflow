import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { ClientDashboard } from "@/components/dashboard/client-dashboard";
import { getMonthRange } from "@/lib/finance";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  if (session.user.role === "CLIENT") {
    const appointments = await prisma.appointment.findMany({
      where: { clientId: session.user.id },
      include: {
        service: { select: { name: true, price: true, duration: true } },
        staff: { select: { name: true } },
      },
      orderBy: { date: "desc" },
      take: 10,
    });

    return <ClientDashboard appointments={appointments} userName={session.user.name} />;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const monthStart = getMonthRange(today.getFullYear(), today.getMonth() + 1);

  const [todayCount, pendingCount, clientCount, lowStock, upcoming, monthTransactions] =
    await Promise.all([
      prisma.appointment.count({
        where: {
          date: { gte: today, lt: tomorrow },
          status: { notIn: ["CANCELLED"] },
        },
      }),
      prisma.appointment.count({ where: { status: "PENDING" } }),
      prisma.user.count({ where: { role: "CLIENT", active: true } }),
      prisma.product
        .findMany({
          where: { active: true },
          select: { id: true, name: true, quantity: true, minQuantity: true },
        })
        .then((p) => p.filter((x) => x.quantity <= x.minQuantity)),
      prisma.appointment.findMany({
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
      }),
      prisma.financialTransaction.findMany({
        where: { date: { gte: monthStart.start, lte: monthStart.end } },
        select: { type: true, amount: true },
      }),
    ]);

  const monthIncome = monthTransactions
    .filter((t) => t.type === "INCOME")
    .reduce((s, t) => s + t.amount, 0);
  const monthExpense = monthTransactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((s, t) => s + t.amount, 0);

  return (
    <AdminDashboard
      stats={{
        todayAppointments: todayCount,
        pendingAppointments: pendingCount,
        totalClients: clientCount,
        lowStockCount: lowStock.length,
        monthIncome,
        monthExpense,
        monthBalance: monthIncome - monthExpense,
      }}
      lowStock={lowStock}
      upcomingAppointments={upcoming}
    />
  );
}
