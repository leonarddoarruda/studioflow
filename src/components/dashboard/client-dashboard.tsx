"use client";

import Link from "next/link";
import { Calendar, Plus } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatDateTime,
  formatCurrency,
  appointmentStatusLabels,
} from "@/lib/utils";

interface ClientDashboardProps {
  userName: string;
  appointments: {
    id: string;
    date: Date;
    status: string;
    notes: string | null;
    service: { name: string; price: unknown; duration: number };
    staff: { name: string } | null;
  }[];
}

export function ClientDashboard({ userName, appointments }: ClientDashboardProps) {
  const upcoming = appointments.filter(
    (a) => new Date(a.date) >= new Date() && a.status !== "CANCELLED"
  );
  const past = appointments.filter(
    (a) => new Date(a.date) < new Date() || a.status === "CANCELLED"
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Olá, {userName.split(" ")[0]}!
          </h1>
          <p className="text-gray-600">Gerencie seus agendamentos</p>
        </div>
        <Link href="/dashboard/agendar">
          <Button>
            <Plus className="h-4 w-4" />
            Novo agendamento
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader title="Próximos agendamentos" />
        {upcoming.length === 0 ? (
          <div className="py-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-500">Nenhum agendamento futuro</p>
            <Link href="/dashboard/agendar">
              <Button className="mt-4" variant="secondary">
                Agendar agora
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 p-4"
              >
                <div>
                  <p className="font-medium text-gray-900">{apt.service.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatDateTime(apt.date)} • {apt.service.duration} min
                    {apt.staff && ` • ${apt.staff.name}`}
                  </p>
                  <p className="text-sm font-medium text-rose-600">
                    {formatCurrency(String(apt.service.price))}
                  </p>
                </div>
                <Badge variant={apt.status}>
                  {appointmentStatusLabels[apt.status]}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      {past.length > 0 && (
        <Card>
          <CardHeader title="Histórico" />
          <div className="space-y-3">
            {past.slice(0, 5).map((apt) => (
              <div
                key={apt.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 p-3 opacity-75"
              >
                <div>
                  <p className="font-medium text-gray-900">{apt.service.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatDateTime(apt.date)}
                  </p>
                </div>
                <Badge variant={apt.status}>
                  {appointmentStatusLabels[apt.status]}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
