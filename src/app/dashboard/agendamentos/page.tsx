"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { formatDateTime, appointmentStatusLabels } from "@/lib/utils";

interface Appointment {
  id: string;
  date: string;
  status: string;
  notes: string | null;
  client: { id: string; name: string; phone: string | null };
  staff: { id: string; name: string } | null;
  service: { id: string; name: string; duration: number; price: string };
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  async function fetchAppointments() {
    setLoading(true);
    const params = filter ? `?status=${filter}` : "";
    const res = await fetch(`/api/appointments${params}`);
    const data = await res.json();
    setAppointments(data);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchAppointments();
  }

  async function cancelAppointment(id: string) {
    if (!confirm("Deseja cancelar este agendamento?")) return;
    await fetch(`/api/appointments/${id}`, { method: "DELETE" });
    fetchAppointments();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agendamentos</h1>
          <p className="text-gray-600">Gerencie todos os agendamentos</p>
        </div>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          options={[
            { value: "", label: "Todos os status" },
            { value: "PENDING", label: "Pendentes" },
            { value: "CONFIRMED", label: "Confirmados" },
            { value: "COMPLETED", label: "Concluídos" },
            { value: "CANCELLED", label: "Cancelados" },
          ]}
        />
      </div>

      <Card>
        {loading ? (
          <p className="text-gray-500">Carregando...</p>
        ) : appointments.length === 0 ? (
          <p className="text-gray-500">Nenhum agendamento encontrado</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="pb-3 pr-4 font-medium">Cliente</th>
                  <th className="pb-3 pr-4 font-medium">Serviço</th>
                  <th className="pb-3 pr-4 font-medium">Data/Hora</th>
                  <th className="pb-3 pr-4 font-medium">Profissional</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt) => (
                  <tr key={apt.id} className="border-b border-gray-100">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-gray-900">{apt.client.name}</p>
                      {apt.client.phone && (
                        <p className="text-xs text-gray-400">{apt.client.phone}</p>
                      )}
                    </td>
                    <td className="py-3 pr-4">{apt.service.name}</td>
                    <td className="py-3 pr-4">{formatDateTime(apt.date)}</td>
                    <td className="py-3 pr-4">{apt.staff?.name ?? "—"}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={apt.status}>
                        {appointmentStatusLabels[apt.status]}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        {apt.status === "CONFIRMED" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateStatus(apt.id, "COMPLETED")}
                          >
                            Concluir
                          </Button>
                        )}
                        {apt.status !== "CANCELLED" && apt.status !== "COMPLETED" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => cancelAppointment(apt.id)}
                          >
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
