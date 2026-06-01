import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/icons/social";
import { Button } from "@/components/ui/button";
import { portfolio } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: `${portfolio.name} — ${portfolio.role}`,
  description: portfolio.headline,
  keywords: [
    "desenvolvedor fullstack",
    "node.js",
    "react",
    "typescript",
    "postgresql",
    "portfólio",
    "leonardo arruda",
  ],
  authors: [{ name: portfolio.name }],
  openGraph: {
    title: `${portfolio.name} — Portfólio`,
    description: portfolio.headline,
    type: "website",
    locale: "pt_BR",
  },
};

const navLinks = [
  { href: "#sobre", label: "Sobre" },
  { href: "#projetos", label: "Projetos" },
  { href: "#skills", label: "Skills" },
  { href: "#contato", label: "Contato" },
];

export default function PortfolioPage() {
  const { contact } = portfolio;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-stone-100">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0b0f19]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="font-display text-lg font-semibold tracking-tight text-white"
          >
            Leonardo<span className="text-sky-400">.</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-sm text-stone-400 transition-colors hover:text-white"
              >
                {label}
              </a>
            ))}
          </nav>
          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="bg-sky-500 hover:from-sky-500 hover:to-sky-600">
              LinkedIn
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </a>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
            <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
                backgroundSize: "64px 64px",
              }}
            />
          </div>

          <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1fr_auto] lg:items-center lg:py-28">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-1.5 text-sm text-sky-300">
                <Sparkles className="h-3.5 w-3.5" />
                Disponível para oportunidades
              </div>
              <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Olá, sou{" "}
                <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                  {portfolio.name}
                </span>
              </h1>
              <p className="mt-4 text-xl font-medium text-stone-300">
                {portfolio.role}
              </p>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-stone-400">
                {portfolio.headline}
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-stone-500">
                <MapPin className="h-4 w-4 shrink-0" />
                {portfolio.location}
              </div>
              <div className="mt-10 flex flex-wrap gap-4">
                <a href="#projetos">
                  <Button size="lg" className="bg-sky-500 shadow-lg shadow-sky-500/20 hover:from-sky-500 hover:to-sky-600">
                    Ver projetos
                  </Button>
                </a>
                <a href={`mailto:${contact.email}`}>
                  <Button variant="secondary" size="lg" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                    <Mail className="h-4 w-4" />
                    Entrar em contato
                  </Button>
                </a>
              </div>
              <div className="mt-10 flex items-center gap-4">
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-stone-300 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  <GitHubIcon className="h-5 w-5" />
                </a>
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-stone-300 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  <LinkedInIcon className="h-5 w-5" />
                </a>
                <a
                  href={`mailto:${contact.email}`}
                  aria-label="Email"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-stone-300 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  <Mail className="h-5 w-5" />
                </a>
                <a
                  href={`https://wa.me/55${contact.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-stone-300 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  <Phone className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div className="relative mx-auto lg:mx-0">
              <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-sky-500/30 to-violet-500/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-2 shadow-2xl shadow-black/40">
                <Image
                  src="/profile.jpg"
                  alt={`Foto de perfil de ${portfolio.name}`}
                  width={320}
                  height={320}
                  className="aspect-square w-64 rounded-2xl object-cover sm:w-72 lg:w-80"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Sobre */}
        <section id="sobre" className="border-t border-white/5 bg-[#0f1524] py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <p className="text-sm font-medium uppercase tracking-widest text-sky-400">
                  Sobre mim
                </p>
                <h2 className="font-display mt-3 text-3xl font-bold text-white sm:text-4xl">
                  Desenvolvedor em evolução constante
                </h2>
                <p className="mt-6 leading-relaxed text-stone-400">
                  {portfolio.about}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-sky-500/10 p-3">
                    <GraduationCap className="h-6 w-6 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Formação</h3>
                    <p className="mt-1 text-stone-300">
                      {portfolio.education.course}
                    </p>
                    <p className="mt-1 text-sm text-stone-500">
                      {portfolio.education.institution} ·{" "}
                      {portfolio.education.period}
                    </p>
                  </div>
                </div>
                <div className="mt-8 border-t border-white/5 pt-8">
                  <h3 className="font-semibold text-white">Foco atual</h3>
                  <ul className="mt-4 space-y-3 text-sm text-stone-400">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                      Desenvolvimento fullstack com Node.js, React e TypeScript
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                      Modelagem e consultas com PostgreSQL e Prisma
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                      APIs REST e aplicações web completas de ponta a ponta
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projetos */}
        <section id="projetos" className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-widest text-sky-400">
                Portfólio
              </p>
              <h2 className="font-display mt-3 text-3xl font-bold text-white sm:text-4xl">
                Projetos que desenvolvi
              </h2>
              <p className="mt-4 text-stone-400">
                Seleção de projetos pessoais que demonstram minha stack fullstack —
                Node.js, React, TypeScript e PostgreSQL.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {portfolio.projects.map((project) => (
                <article
                  key={project.title}
                  className={`group relative flex flex-col rounded-2xl border p-6 transition-all hover:-translate-y-1 hover:shadow-xl ${
                    project.featured
                      ? "border-sky-500/30 bg-gradient-to-br from-sky-500/10 to-transparent shadow-lg shadow-sky-500/5"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:shadow-black/20"
                  }`}
                >
                  {project.featured && (
                    <span className="mb-4 inline-flex w-fit rounded-full bg-sky-500/20 px-3 py-1 text-xs font-medium text-sky-300">
                      Destaque
                    </span>
                  )}
                  <h3 className="text-xl font-semibold text-white">
                    {project.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-stone-400">
                    {project.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-stone-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-stone-300 transition-colors hover:border-white/20 hover:bg-white/5 hover:text-white"
                    >
                      <GitHubIcon className="h-4 w-4" />
                      Código
                    </a>
                    {project.demo && (
                      <Link
                        href={project.demo}
                        className="inline-flex items-center gap-2 rounded-xl bg-sky-500/20 px-4 py-2 text-sm font-medium text-sky-300 transition-colors hover:bg-sky-500/30"
                      >
                        Ver demo
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="border-t border-white/5 bg-[#0f1524] py-20">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-sky-400">
              Competências
            </p>
            <h2 className="font-display mt-3 text-3xl font-bold text-white sm:text-4xl">
              Tecnologias & habilidades
            </h2>
            <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3">
              {portfolio.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-stone-300 transition-colors hover:border-sky-500/30 hover:bg-sky-500/10 hover:text-sky-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Contato */}
        <section id="contato" className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-sky-500/10 via-[#0f1524] to-violet-500/10 p-8 sm:p-12">
              <div className="max-w-2xl">
                <p className="text-sm font-medium uppercase tracking-widest text-sky-400">
                  Contato
                </p>
                <h2 className="font-display mt-3 text-3xl font-bold text-white sm:text-4xl">
                  Vamos conversar?
                </h2>
                <p className="mt-4 text-stone-400">
                  Estou aberto a oportunidades, feedbacks sobre meus projetos e
                  conexões na área de tecnologia.
                </p>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <a
                  href={`mailto:${contact.email}`}
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-sky-500/30 hover:bg-sky-500/5"
                >
                  <Mail className="h-5 w-5 text-sky-400" />
                  <p className="mt-3 text-xs uppercase tracking-wide text-stone-500">
                    Email
                  </p>
                  <p className="mt-1 break-all text-sm font-medium text-white group-hover:text-sky-200">
                    {contact.email}
                  </p>
                </a>
                <a
                  href={`https://wa.me/55${contact.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-sky-500/30 hover:bg-sky-500/5"
                >
                  <Phone className="h-5 w-5 text-sky-400" />
                  <p className="mt-3 text-xs uppercase tracking-wide text-stone-500">
                    WhatsApp
                  </p>
                  <p className="mt-1 text-sm font-medium text-white group-hover:text-sky-200">
                    {contact.phoneDisplay}
                  </p>
                </a>
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-sky-500/30 hover:bg-sky-500/5"
                >
                  <LinkedInIcon className="h-5 w-5 text-sky-400" />
                  <p className="mt-3 text-xs uppercase tracking-wide text-stone-500">
                    LinkedIn
                  </p>
                  <p className="mt-1 text-sm font-medium text-white group-hover:text-sky-200">
                    /leonardo-arruda
                  </p>
                </a>
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-sky-500/30 hover:bg-sky-500/5"
                >
                  <GitHubIcon className="h-5 w-5 text-sky-400" />
                  <p className="mt-3 text-xs uppercase tracking-wide text-stone-500">
                    GitHub
                  </p>
                  <p className="mt-1 text-sm font-medium text-white group-hover:text-sky-200">
                    @leonarddoarruda
                  </p>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-8 text-center text-sm text-stone-500">
        <p>
          © {new Date().getFullYear()} {portfolio.name}. Desenvolvido com Next.js
          & Tailwind CSS.
        </p>
      </footer>
    </div>
  );
}
