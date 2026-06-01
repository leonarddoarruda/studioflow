"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";

interface Service {
  id: string;
  name: string;
  duration: number;
  price: string;
}

interface Staff {
  id: string;
  name: string;
}

function generateTimeSlots(opening = "09:00", closing = "19:00", duration = 30) {
  const slots: { value: string; label: string }[] = [];
  const [openH, openM] = opening.split(":").map(Number);
  const [closeH, closeM] = closing.split(":").map(Number);
  let current = openH * 60 + openM;
  const end = closeH * 60 + closeM;

  while (current + duration <= end) {
    const h = Math.floor(current / 60);
    const m = current % 60;
    const time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    slots.push({ value: time, label: time });
    current += duration;
  }

  return slots;
}

export default function BookAppointmentPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [timeSlots, setTimeSlots] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedService, setSelectedService] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/services").then((r) => r.json()),
      fetch("/api/staff").then((r) => r.json()),
      fetch("/api/salon").then((r) => r.json()),
    ]).then(([servicesData, staffData, salonData]) => {
      setServices(servicesData);
      setStaff(staffData);
      if (salonData) {
        setTimeSlots(
          generateTimeSlots(
            salonData.openingTime,
            salonData.closingTime,
            salonData.slotDuration
          )
        );
      } else {
        setTimeSlots(generateTimeSlots());
      }
    });
  }, []);

  const service = services.find((s) => s.id === selectedService);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceId: form.get("serviceId"),
        staffId: form.get("staffId") || undefined,
        date: form.get("date"),
        time: form.get("time"),
        notes: form.get("notes") || undefined,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Erro ao agendar");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Agendar serviço</h1>
        <p className="text-gray-600">
          Escolha o serviço, data e horário. Você receberá confirmação no WhatsApp.
        </p>
      </div>

      <Card>
        <CardHeader title="Novo agendamento" />
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            id="serviceId"
            name="serviceId"
            label="Serviço"
            required
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            options={[
              { value: "", label: "Selecione um serviço" },
              ...services.map((s) => ({
                value: s.id,
                label: `${s.name} — ${s.duration}min — ${formatCurrency(s.price)}`,
              })),
            ]}
          />

          {service && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {service.name}: {formatCurrency(service.price)} • {service.duration} minutos
            </p>
          )}

          <Select
            id="staffId"
            name="staffId"
            label="Profissional (opcional)"
            options={[
              { value: "", label: "Qualquer disponível" },
              ...staff.map((s) => ({ value: s.id, label: s.name })),
            ]}
          />

          <Input
            id="date"
            name="date"
            type="date"
            label="Data"
            required
            min={minDate}
          />

          <Select
            id="time"
            name="time"
            label="Horário"
            required
            options={[
              { value: "", label: "Selecione um horário" },
              ...timeSlots,
            ]}
          />

          <Input
            id="notes"
            name="notes"
            label="Observações (opcional)"
            placeholder="Alguma preferência ou informação extra"
          />

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Agendando..." : "Confirmar agendamento"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
