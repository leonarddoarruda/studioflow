"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SalonSettings {
  name: string;
  phone: string;
  whatsappPhone: string;
  address: string | null;
  openingTime: string;
  closingTime: string;
  slotDuration: number;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SalonSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/salon")
      .then((r) => r.json())
      .then(setSettings);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/salon", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        phone: form.get("phone"),
        whatsappPhone: form.get("whatsappPhone"),
        address: form.get("address") || undefined,
        openingTime: form.get("openingTime"),
        closingTime: form.get("closingTime"),
        slotDuration: Number(form.get("slotDuration")),
      }),
    });

    setLoading(false);
    if (res.ok) {
      setSaved(true);
      setSettings(await res.json());
    }
  }

  if (!settings) {
    return <p className="text-gray-500">Carregando...</p>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Dados do salão e horários de funcionamento</p>
      </div>

      <Card>
        <CardHeader title="Dados do salão" />
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input id="name" name="name" label="Nome do salão" required defaultValue={settings.name} />
          <Input id="phone" name="phone" label="Telefone" required defaultValue={settings.phone} />
          <Input
            id="whatsappPhone"
            name="whatsappPhone"
            label="WhatsApp do salão (para receber notificações)"
            required
            defaultValue={settings.whatsappPhone}
          />
          <Input id="address" name="address" label="Endereço" defaultValue={settings.address ?? ""} />

          <div className="grid gap-4 sm:grid-cols-3">
            <Input id="openingTime" name="openingTime" type="time" label="Abertura" required defaultValue={settings.openingTime} />
            <Input id="closingTime" name="closingTime" type="time" label="Fechamento" required defaultValue={settings.closingTime} />
            <Input id="slotDuration" name="slotDuration" type="number" label="Intervalo (min)" required min={15} step={15} defaultValue={settings.slotDuration} />
          </div>

          {saved && (
            <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
              Configurações salvas com sucesso!
            </p>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar configurações"}
          </Button>
        </form>
      </Card>

      <Card>
        <CardHeader
          title="WhatsApp — Evolution API"
          description="Configure as variáveis no arquivo .env para ativar notificações automáticas."
        />
        <div className="space-y-2 text-sm text-gray-600">
          <p><code className="rounded bg-gray-100 px-1">EVOLUTION_API_URL</code> — URL da sua instância Evolution API</p>
          <p><code className="rounded bg-gray-100 px-1">EVOLUTION_API_KEY</code> — Chave de API</p>
          <p><code className="rounded bg-gray-100 px-1">EVOLUTION_INSTANCE_NAME</code> — Nome da instância WhatsApp</p>
          <p className="mt-4 text-gray-500">
            Ao criar um agendamento, o sistema envia mensagem de confirmação para o cliente
            e notificação para o WhatsApp do salão.
          </p>
        </div>
      </Card>
    </div>
  );
}
