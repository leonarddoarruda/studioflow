"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: string;
  active: boolean;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    const res = await fetch("/api/services");
    setServices(await res.json());
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get("name"),
      description: form.get("description") || undefined,
      duration: Number(form.get("duration")),
      price: Number(form.get("price")),
    };

    const url = editing ? `/api/services/${editing.id}` : "/api/services";
    const method = editing ? "PATCH" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setLoading(false);
    setShowForm(false);
    setEditing(null);
    fetchServices();
  }

  async function handleDelete(id: string) {
    if (!confirm("Desativar este serviço?")) return;
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    fetchServices();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Serviços</h1>
          <p className="text-gray-600">Catálogo de serviços do salão</p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditing(null); }}>
          <Plus className="h-4 w-4" />
          Novo serviço
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader title={editing ? "Editar serviço" : "Novo serviço"} />
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <Input
              id="name"
              name="name"
              label="Nome"
              required
              defaultValue={editing?.name}
            />
            <Input
              id="duration"
              name="duration"
              type="number"
              label="Duração (minutos)"
              required
              min={15}
              step={15}
              defaultValue={editing?.duration ?? 60}
            />
            <Input
              id="price"
              name="price"
              type="number"
              label="Preço (R$)"
              required
              min={0}
              step={0.01}
              defaultValue={editing ? Number(editing.price) : undefined}
            />
            <Input
              id="description"
              name="description"
              label="Descrição"
              defaultValue={editing?.description ?? ""}
            />
            <div className="flex gap-2 sm:col-span-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => { setShowForm(false); setEditing(null); }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="pb-3 pr-4 font-medium">Serviço</th>
                <th className="pb-3 pr-4 font-medium">Duração</th>
                <th className="pb-3 pr-4 font-medium">Preço</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-b border-gray-100">
                  <td className="py-3 pr-4">
                    <p className="font-medium text-gray-900">{service.name}</p>
                    {service.description && (
                      <p className="text-xs text-gray-400">{service.description}</p>
                    )}
                  </td>
                  <td className="py-3 pr-4">{service.duration} min</td>
                  <td className="py-3 pr-4">{formatCurrency(service.price)}</td>
                  <td className="py-3 pr-4">
                    <Badge variant={service.active ? "CONFIRMED" : "CANCELLED"}>
                      {service.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => { setEditing(service); setShowForm(true); }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(service.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
