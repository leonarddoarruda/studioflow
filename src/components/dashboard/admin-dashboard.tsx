"use client";

import Link from "next/link";
import { Calendar, Users, AlertTriangle, Clock, Wallet, TrendingUp } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTime, formatCurrency, appointmentStatusLabels } from "@/lib/utils";

interface AdminDashboardProps {
  stats: {
    todayAppointments: number;
    pendingAppointments: number;
    totalClients: number;
    lowStockCount: number;
    monthIncome: number;
    monthExpense: number;
    monthBalance: number;
  };
  lowStock: { id: string; name: string; quantity: number; minQuantity: number }[];
  upcomingAppointments: {
    id: string;
    date: Date;
    status: string;
    client: { name: string };
    service: { name: string };
    staff: { name: string } | null;
  }[];
}

export function AdminDashboard({
  stats,
  lowStock,
  upcomingAppointments,
}: AdminDashboardProps) {
  const statCards = [
    {
      label: "Agendamentos hoje",
      value: stats.todayAppointments,
      icon: Calendar,
      color: "text-violet-600 bg-violet-50",
    },
    {
      label: "Receitas do mês",
      value: formatCurrency(stats.monthIncome),
      icon: TrendingUp,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Saldo do mês",
      value: formatCurrency(stats.monthBalance),
      icon: Wallet,
      color: stats.monthBalance >= 0 ? "text-violet-600 bg-violet-50" : "text-red-600 bg-red-50",
    },
    {
      label: "Clientes ativos",
      value: stats.totalClients,
      icon: Users,
      color: "text-blue-600 bg-blue-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-stone-900">Painel</h1>
        <p className="text-stone-500">Visão geral do salão</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="p-4">
            <div className="flex items-center gap-4">
              <div className={`rounded-xl p-3 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-stone-900">{value}</p>
                <p className="text-sm text-stone-500">{label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Próximos agendamentos"
            action={
              <Link href="/dashboard/agendamentos">
                <Button variant="ghost" size="sm">Ver todos</Button>
              </Link>
            }
          />
          {upcomingAppointments.length === 0 ? (
            <p className="text-sm text-stone-500">Nenhum agendamento próximo</p>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between rounded-xl border border-stone-100 p-3">
                  <div>
                    <p className="font-medium text-stone-900">{apt.client.name}</p>
                    <p className="text-sm text-stone-500">
                      {apt.service.name}{apt.staff && ` • ${apt.staff.name}`}
                    </p>
                    <p className="text-xs text-stone-400">{formatDateTime(apt.date)}</p>
                  </div>
                  <Badge variant={apt.status}>{appointmentStatusLabels[apt.status]}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Resumo financeiro"
              action={
                <Link href="/dashboard/financeiro">
                  <Button variant="ghost" size="sm">Ver fluxo de caixa</Button>
                </Link>
              }
            />
            <div className="space-y-3">
              <div className="flex justify-between rounded-xl bg-emerald-50 px-4 py-3">
                <span className="text-sm text-emerald-700">Receitas</span>
                <span className="font-semibold text-emerald-700">{formatCurrency(stats.monthIncome)}</span>
              </div>
              <div className="flex justify-between rounded-xl bg-red-50 px-4 py-3">
                <span className="text-sm text-red-700">Despesas</span>
                <span className="font-semibold text-red-700">{formatCurrency(stats.monthExpense)}</span>
              </div>
              <div className="flex justify-between rounded-xl bg-violet-50 px-4 py-3">
                <span className="text-sm text-violet-700">Saldo</span>
                <span className={`font-bold ${stats.monthBalance >= 0 ? "text-violet-700" : "text-red-600"}`}>
                  {formatCurrency(stats.monthBalance)}
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Alertas de estoque"
              action={
                <Link href="/dashboard/estoque">
                  <Button variant="ghost" size="sm">Gerenciar</Button>
                </Link>
              }
            />
            {lowStock.length === 0 ? (
              <p className="text-sm text-stone-500">Estoque em dia ✓</p>
            ) : (
              <div className="space-y-2">
                {lowStock.map((product) => (
                  <div key={product.id} className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50 p-3">
                    <p className="font-medium text-stone-900">{product.name}</p>
                    <p className="text-sm text-amber-700">
                      {product.quantity} / mín. {product.minQuantity}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
