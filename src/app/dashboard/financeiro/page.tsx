"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  formatCurrency,
  formatDate,
  transactionTypeLabels,
  transactionCategoryLabels,
  paymentMethodLabels,
  monthNames,
} from "@/lib/utils";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Wallet,
  Trash2,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";

interface Transaction {
  id: string;
  type: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  paymentMethod: string;
  appointmentId: string | null;
  user: { name: string };
}

interface FinanceData {
  transactions: Transaction[];
  summary: { income: number; expense: number; balance: number; count: number };
  cashFlow: { month: number; year: number; income: number; expense: number }[];
  period: { month: number; year: number };
}

export default function FinancePage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [data, setData] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<"INCOME" | "EXPENSE">("EXPENSE");

  useEffect(() => {
    fetchFinance();
  }, [month, year]);

  async function fetchFinance() {
    setLoading(true);
    const res = await fetch(`/api/finance?month=${month}&year=${year}`);
    setData(await res.json());
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    await fetch("/api/finance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: form.get("type"),
        category: form.get("category"),
        amount: Number(form.get("amount")),
        description: form.get("description"),
        date: form.get("date"),
        paymentMethod: form.get("paymentMethod"),
      }),
    });

    setShowForm(false);
    fetchFinance();
  }

  async function handleDelete(id: string, linked: boolean) {
    if (linked) {
      alert("Receitas de agendamentos são geradas automaticamente.");
      return;
    }
    if (!confirm("Excluir esta transação?")) return;
    await fetch(`/api/finance/${id}`, { method: "DELETE" });
    fetchFinance();
  }

  const incomeCategories = [
    { value: "SERVICE", label: "Serviço" },
    { value: "PRODUCT_SALE", label: "Venda de produto" },
    { value: "OTHER_INCOME", label: "Outras receitas" },
  ];

  const expenseCategories = [
    { value: "RENT", label: "Aluguel" },
    { value: "SUPPLIES", label: "Insumos" },
    { value: "SALARY", label: "Salários" },
    { value: "UTILITIES", label: "Contas" },
    { value: "MARKETING", label: "Marketing" },
    { value: "OTHER_EXPENSE", label: "Outras despesas" },
  ];

  const maxCashFlow = Math.max(
    ...(data?.cashFlow.map((c) => Math.max(c.income, c.expense)) ?? [1])
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-stone-900">
            Fluxo de Caixa
          </h1>
          <p className="text-stone-500">
            Controle financeiro — {monthNames[month - 1]} {year}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={String(month)}
            onChange={(e) => setMonth(Number(e.target.value))}
            options={monthNames.map((m, i) => ({
              value: String(i + 1),
              label: m,
            }))}
          />
          <Select
            value={String(year)}
            onChange={(e) => setYear(Number(e.target.value))}
            options={[year - 1, year, year + 1].map((y) => ({
              value: String(y),
              label: String(y),
            }))}
          />
          <Button onClick={() => { setShowForm(true); setFormType("INCOME"); }}>
            <ArrowUpCircle className="h-4 w-4" />
            Receita
          </Button>
          <Button variant="secondary" onClick={() => { setShowForm(true); setFormType("EXPENSE"); }}>
            <ArrowDownCircle className="h-4 w-4" />
            Despesa
          </Button>
        </div>
      </div>

      {data && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-emerald-100 bg-gradient-to-br from-emerald-50 to-white">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-100 p-3">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-stone-500">Receitas</p>
                <p className="text-2xl font-bold text-emerald-700">
                  {formatCurrency(data.summary.income)}
                </p>
              </div>
            </div>
          </Card>
          <Card className="border-red-100 bg-gradient-to-br from-red-50 to-white">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-red-100 p-3">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-stone-500">Despesas</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(data.summary.expense)}
                </p>
              </div>
            </div>
          </Card>
          <Card className="border-violet-100 bg-gradient-to-br from-violet-50 to-white">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-violet-100 p-3">
                <Wallet className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-sm text-stone-500">Saldo do mês</p>
                <p className={`text-2xl font-bold ${data.summary.balance >= 0 ? "text-violet-700" : "text-red-600"}`}>
                  {formatCurrency(data.summary.balance)}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {data && data.cashFlow.length > 0 && (
        <Card>
          <CardHeader title="Fluxo de caixa — últimos 6 meses" />
          <div className="flex items-end justify-between gap-3 h-40 pt-4">
            {data.cashFlow.map((item) => (
              <div key={`${item.year}-${item.month}`} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full items-end justify-center gap-1 h-28">
                  <div
                    className="w-3 rounded-t bg-emerald-400 transition-all"
                    style={{ height: `${(item.income / maxCashFlow) * 100}%`, minHeight: item.income > 0 ? 4 : 0 }}
                    title={`Receitas: ${formatCurrency(item.income)}`}
                  />
                  <div
                    className="w-3 rounded-t bg-red-300 transition-all"
                    style={{ height: `${(item.expense / maxCashFlow) * 100}%`, minHeight: item.expense > 0 ? 4 : 0 }}
                    title={`Despesas: ${formatCurrency(item.expense)}`}
                  />
                </div>
                <span className="text-xs text-stone-400">
                  {monthNames[item.month - 1]?.slice(0, 3)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center gap-6 text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> Receitas
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-300" /> Despesas
            </span>
          </div>
        </Card>
      )}

      {showForm && (
        <Card>
          <CardHeader
            title={formType === "INCOME" ? "Nova receita" : "Nova despesa"}
          />
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <input type="hidden" name="type" value={formType} />
            <Select
              id="category"
              name="category"
              label="Categoria"
              required
              options={formType === "INCOME" ? incomeCategories : expenseCategories}
            />
            <Input id="amount" name="amount" type="number" label="Valor (R$)" required min={0.01} step={0.01} />
            <Input id="description" name="description" label="Descrição" required className="sm:col-span-2" />
            <Input id="date" name="date" type="date" label="Data" required defaultValue={new Date().toISOString().split("T")[0]} />
            <Select
              id="paymentMethod"
              name="paymentMethod"
              label="Forma de pagamento"
              options={Object.entries(paymentMethodLabels).map(([value, label]) => ({ value, label }))}
            />
            <div className="flex gap-2 sm:col-span-2">
              <Button type="submit">Salvar</Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancelar</Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <CardHeader title="Movimentações" description={`${data?.summary.count ?? 0} lançamentos neste mês`} />
        {loading ? (
          <p className="text-stone-500">Carregando...</p>
        ) : !data?.transactions.length ? (
          <div className="py-12 text-center">
            <Wallet className="mx-auto h-10 w-10 text-stone-300" />
            <p className="mt-3 text-stone-500">Nenhuma movimentação neste período</p>
            <Button className="mt-4" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4" /> Registrar lançamento
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-left text-stone-500">
                  <th className="pb-3 pr-4 font-medium">Data</th>
                  <th className="pb-3 pr-4 font-medium">Descrição</th>
                  <th className="pb-3 pr-4 font-medium">Categoria</th>
                  <th className="pb-3 pr-4 font-medium">Pagamento</th>
                  <th className="pb-3 pr-4 font-medium">Valor</th>
                  <th className="pb-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {data.transactions.map((t) => (
                  <tr key={t.id} className="border-b border-stone-100">
                    <td className="py-3 pr-4">{formatDate(t.date)}</td>
                    <td className="py-3 pr-4">
                      <p className="font-medium text-stone-900">{t.description}</p>
                      {t.appointmentId && (
                        <span className="text-xs text-violet-500">via agendamento</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={t.type}>
                        {transactionCategoryLabels[t.category]}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4">{paymentMethodLabels[t.paymentMethod]}</td>
                    <td className={`py-3 pr-4 font-semibold ${t.type === "INCOME" ? "text-emerald-600" : "text-red-600"}`}>
                      {t.type === "INCOME" ? "+" : "-"}{formatCurrency(t.amount)}
                    </td>
                    <td className="py-3">
                      {!t.appointmentId && (
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(t.id, !!t.appointmentId)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
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
