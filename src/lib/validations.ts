import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  phone: z.string().min(10, "Telefone inválido").optional(),
});

export const serviceSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  description: z.string().optional(),
  duration: z.coerce.number().min(15, "Duração mínima de 15 minutos"),
  price: z.coerce.number().min(0, "Preço inválido"),
  active: z.boolean().optional(),
});

export const appointmentSchema = z.object({
  serviceId: z.string().min(1, "Selecione um serviço"),
  staffId: z.string().optional(),
  date: z.string().min(1, "Selecione uma data"),
  time: z.string().min(1, "Selecione um horário"),
  notes: z.string().optional(),
  clientId: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  sku: z.string().min(2, "SKU obrigatório"),
  description: z.string().optional(),
  quantity: z.coerce.number().min(0).optional(),
  minQuantity: z.coerce.number().min(0).optional(),
  unit: z.string().optional(),
  price: z.coerce.number().min(0).optional(),
  active: z.boolean().optional(),
});

export const stockMovementSchema = z.object({
  type: z.enum(["IN", "OUT", "ADJUSTMENT"]),
  quantity: z.coerce.number().min(1, "Quantidade deve ser maior que zero"),
  reason: z.string().optional(),
});

export const salonSettingsSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  whatsappPhone: z.string().min(10),
  address: z.string().optional(),
  openingTime: z.string(),
  closingTime: z.string(),
  slotDuration: z.coerce.number().min(15).max(120),
});

export const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  role: z.enum(["ADMIN", "STAFF", "CLIENT"]),
  password: z.string().min(6).optional(),
  active: z.boolean().optional(),
});

export const transactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.enum([
    "SERVICE",
    "PRODUCT_SALE",
    "OTHER_INCOME",
    "RENT",
    "SUPPLIES",
    "SALARY",
    "UTILITIES",
    "MARKETING",
    "OTHER_EXPENSE",
  ]),
  amount: z.coerce.number().min(0.01, "Valor deve ser maior que zero"),
  description: z.string().min(2, "Descrição obrigatória"),
  date: z.string().min(1, "Data obrigatória"),
  paymentMethod: z
    .enum(["CASH", "PIX", "CREDIT_CARD", "DEBIT_CARD", "TRANSFER"])
    .optional(),
  appointmentId: z.string().optional(),
});
