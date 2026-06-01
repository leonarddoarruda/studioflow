import { normalizePhone } from "@/lib/utils";

interface SendMessageParams {
  phone: string;
  message: string;
}

interface AppointmentNotificationData {
  clientName: string;
  clientPhone: string;
  serviceName: string;
  staffName?: string;
  dateTime: string;
  salonName: string;
  salonPhone: string;
}

export async function sendWhatsAppMessage({
  phone,
  message,
}: SendMessageParams): Promise<boolean> {
  const apiUrl = process.env.EVOLUTION_API_URL;
  const apiKey = process.env.EVOLUTION_API_KEY;
  const instance = process.env.EVOLUTION_INSTANCE_NAME;

  if (!apiUrl || !apiKey || !instance) {
    console.warn("[WhatsApp] Evolution API não configurada. Mensagem simulada:");
    console.warn(`Para: ${phone}`);
    console.warn(message);
    return false;
  }

  try {
    const response = await fetch(
      `${apiUrl}/message/sendText/${instance}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
        },
        body: JSON.stringify({
          number: normalizePhone(phone),
          text: message,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("[WhatsApp] Erro ao enviar:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[WhatsApp] Falha na conexão:", error);
    return false;
  }
}

export async function notifyClientAppointment(
  data: AppointmentNotificationData
): Promise<boolean> {
  const message = `✨ *Confirmação de Agendamento*

Olá, *${data.clientName}*!

Seu agendamento foi registrado com sucesso:

📅 *Data:* ${data.dateTime}
💇 *Serviço:* ${data.serviceName}${data.staffName ? `\n👤 *Profissional:* ${data.staffName}` : ""}
🏪 *Salão:* ${data.salonName}

Em caso de dúvidas ou para remarcar, entre em contato: ${data.salonPhone}

Aguardamos você! 💅`;

  if (!data.clientPhone) {
    console.warn("[WhatsApp] Cliente sem telefone cadastrado");
    return false;
  }

  return sendWhatsAppMessage({ phone: data.clientPhone, message });
}

export async function notifySalonNewAppointment(
  data: AppointmentNotificationData
): Promise<boolean> {
  const message = `🔔 *Novo Agendamento*

Um novo agendamento foi realizado:

👤 *Cliente:* ${data.clientName}
📅 *Data:* ${data.dateTime}
💇 *Serviço:* ${data.serviceName}${data.staffName ? `\n👤 *Profissional:* ${data.staffName}` : ""}${data.clientPhone ? `\n📱 *Telefone:* ${data.clientPhone}` : ""}

Acesse o painel para gerenciar.`;

  return sendWhatsAppMessage({
    phone: data.salonPhone,
    message,
  });
}

export async function notifyAppointmentStatusChange(
  data: AppointmentNotificationData & { status: string }
): Promise<boolean> {
  const statusMessages: Record<string, string> = {
    CONFIRMED: "✅ Seu agendamento foi *confirmado*!",
    CANCELLED: "❌ Seu agendamento foi *cancelado*.",
    COMPLETED: "🎉 Obrigado pela visita! Seu atendimento foi *concluído*.",
    NO_SHOW: "⚠️ Registramos que você *não compareceu* ao agendamento.",
  };

  const statusMsg = statusMessages[data.status];
  if (!statusMsg || !data.clientPhone) return false;

  const message = `${statusMsg}

📅 *Data:* ${data.dateTime}
💇 *Serviço:* ${data.serviceName}
🏪 *${data.salonName}*

${data.salonPhone}`;

  return sendWhatsAppMessage({ phone: data.clientPhone, message });
}
