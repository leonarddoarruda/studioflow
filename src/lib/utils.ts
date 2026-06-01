import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string) {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(num);
}

export function formatDate(date: Date | string) {
  return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
}

export function formatDateTime(date: Date | string) {
  return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

export function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

export function normalizePhone(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.length === 11 || digits.length === 10) {
    digits = `55${digits}`;
  }
  return digits;
}

export const appointmentStatusLabels: Record<string, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  CANCELLED: "Cancelado",
  COMPLETED: "Concluído",
  NO_SHOW: "Não compareceu",
};

export const roleLabels: Record<string, string> = {
  ADMIN: "Administrador",
  STAFF: "Profissional",
  CLIENT: "Cliente",
};

export const stockMovementLabels: Record<string, string> = {
  IN: "Entrada",
  OUT: "Saída",
  ADJUSTMENT: "Ajuste",
};

export const transactionTypeLabels: Record<string, string> = {
  INCOME: "Receita",
  EXPENSE: "Despesa",
};

export const transactionCategoryLabels: Record<string, string> = {
  SERVICE: "Serviço",
  PRODUCT_SALE: "Venda de produto",
  OTHER_INCOME: "Outras receitas",
  RENT: "Aluguel",
  SUPPLIES: "Insumos",
  SALARY: "Salários",
  UTILITIES: "Contas (água, luz)",
  MARKETING: "Marketing",
  OTHER_EXPENSE: "Outras despesas",
};

export const paymentMethodLabels: Record<string, string> = {
  CASH: "Dinheiro",
  PIX: "PIX",
  CREDIT_CARD: "Cartão de crédito",
  DEBIT_CARD: "Cartão de débito",
  TRANSFER: "Transferência",
};

export const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
