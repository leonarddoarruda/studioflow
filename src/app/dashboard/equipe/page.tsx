"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { roleLabels } from "@/lib/utils";
import { Plus } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  active: boolean;
}

export default function TeamPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const res = await fetch("/api/users");
    setUsers(await res.json());
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        role: form.get("role"),
        password: form.get("password"),
      }),
    });

    setLoading(false);

    if (res.ok) {
      setShowForm(false);
      fetchUsers();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipe</h1>
          <p className="text-gray-600">Profissionais e administradores</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" />
          Novo membro
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader title="Novo membro da equipe" />
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <Input id="name" name="name" label="Nome" required />
            <Input id="email" name="email" type="email" label="E-mail" required />
            <Input id="phone" name="phone" type="tel" label="Telefone" />
            <Select
              id="role"
              name="role"
              label="Função"
              options={[
                { value: "STAFF", label: "Profissional" },
                { value: "ADMIN", label: "Administrador" },
              ]}
            />
            <Input
              id="password"
              name="password"
              type="password"
              label="Senha"
              required
              minLength={6}
            />
            <div className="flex gap-2 sm:col-span-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar"}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
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
                <th className="pb-3 pr-4 font-medium">Nome</th>
                <th className="pb-3 pr-4 font-medium">E-mail</th>
                <th className="pb-3 pr-4 font-medium">Telefone</th>
                <th className="pb-3 pr-4 font-medium">Função</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter((u) => u.role !== "CLIENT")
                .map((user) => (
                  <tr key={user.id} className="border-b border-gray-100">
                    <td className="py-3 pr-4 font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="py-3 pr-4">{user.email}</td>
                    <td className="py-3 pr-4">{user.phone ?? "—"}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={user.role}>
                        {roleLabels[user.role]}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge variant={user.active ? "CONFIRMED" : "CANCELLED"}>
                        {user.active ? "Ativo" : "Inativo"}
                      </Badge>
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
