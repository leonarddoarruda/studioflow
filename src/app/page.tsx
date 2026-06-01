import Link from "next/link";
import {
  Calendar,
  Package,
  MessageCircle,
  Users,
  Wallet,
  ArrowRight,
  Scissors,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { brand } from "@/lib/brand";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-stone-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button>Criar conta</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-amber-50" />
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-violet-200/30 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-amber-200/30 blur-3xl" />

          <div className="relative mx-auto max-w-6xl px-6 py-24 text-center">
            <span className="inline-block rounded-full bg-violet-100 px-4 py-1.5 text-sm font-medium text-violet-700">
              Projeto fullstack pessoal — {brand.author.name}
            </span>
            <h1 className="font-display mt-6 text-4xl font-bold tracking-tight text-stone-900 sm:text-6xl">
              Seu salão,{" "}
              <span className="bg-gradient-to-r from-violet-600 to-violet-800 bg-clip-text text-transparent">
                sob controle total
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-stone-600">
              {brand.description}
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/login">
                <Button size="lg">
                  Acessar painel
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="secondary" size="lg">
                  Sou cliente — agendar
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="border-y border-stone-200 bg-white py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-display text-center text-3xl font-bold text-stone-900">
              Tudo que um salão precisa
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-stone-500">
              Desenvolvido do zero pensando na rotina real de um salão de beleza.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Calendar,
                  title: "Agendamentos",
                  desc: "Clientes agendam online. Confirmação automática via WhatsApp.",
                  color: "violet",
                },
                {
                  icon: Wallet,
                  title: "Fluxo de Caixa",
                  desc: "Receitas, despesas, saldo mensal e gráfico dos últimos 6 meses.",
                  color: "emerald",
                },
                {
                  icon: Package,
                  title: "Estoque",
                  desc: "Controle de produtos com alertas quando o estoque está baixo.",
                  color: "amber",
                },
                {
                  icon: Users,
                  title: "Equipe & Clientes",
                  desc: "Perfis de admin, profissional e cliente com acesso separado.",
                  color: "blue",
                },
                {
                  icon: MessageCircle,
                  title: "WhatsApp",
                  desc: "Notificações para cliente e salão via Evolution API.",
                  color: "green",
                },
                {
                  icon: Scissors,
                  title: "Serviços",
                  desc: "Catálogo completo com preços, duração e status.",
                  color: "rose",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="group rounded-2xl border border-stone-200 bg-stone-50/50 p-6 transition-all hover:border-violet-200 hover:bg-white hover:shadow-lg hover:shadow-violet-100/50"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-violet-100 p-3 transition-colors group-hover:bg-violet-600">
                    <Icon className="h-5 w-5 text-violet-600 group-hover:text-white" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-stone-900">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-500">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-display text-3xl font-bold text-stone-900">
              Sobre o projeto
            </h2>
            <p className="mt-4 leading-relaxed text-stone-600">
              O <strong>{brand.name}</strong> nasceu como um projeto pessoal para
              demonstrar habilidades em desenvolvimento fullstack — do banco de
              dados à interface, passando por autenticação, API REST e integração
              com WhatsApp. Código aberto e disponível no GitHub.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <a
                href={brand.author.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:border-stone-300 hover:bg-stone-50"
              >
                <ExternalLink className="h-4 w-4" />
                GitHub
              </a>
              <a
                href={brand.author.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:border-stone-300 hover:bg-stone-50"
              >
                <ExternalLink className="h-4 w-4" />
                LinkedIn
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200 bg-stone-900 py-10 text-center text-sm text-stone-400">
        <p>
          <span className="font-display text-base font-semibold text-white">
            {brand.name}
          </span>{" "}
          — desenvolvido por{" "}
          <span className="text-violet-300">{brand.author.name}</span>
        </p>
        <p className="mt-1 text-stone-500">{brand.author.role}</p>
      </footer>
    </div>
  );
}
