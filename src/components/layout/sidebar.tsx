"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Calendar,
  Package,
  Scissors,
  Settings,
  Users,
  LayoutDashboard,
  LogOut,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";
import { brand } from "@/lib/brand";
import type { Role } from "@/generated/prisma/client";

const adminLinks = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { href: "/dashboard/agendamentos", label: "Agendamentos", icon: Calendar },
  { href: "/dashboard/financeiro", label: "Financeiro", icon: Wallet },
  { href: "/dashboard/servicos", label: "Serviços", icon: Scissors },
  { href: "/dashboard/equipe", label: "Equipe", icon: Users },
  { href: "/dashboard/estoque", label: "Estoque", icon: Package },
  { href: "/dashboard/configuracoes", label: "Configurações", icon: Settings },
];

const clientLinks = [
  { href: "/dashboard", label: "Meus Agendamentos", icon: Calendar },
  { href: "/dashboard/agendar", label: "Agendar", icon: Calendar },
];

const staffLinks = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { href: "/dashboard/agendamentos", label: "Agendamentos", icon: Calendar },
  { href: "/dashboard/estoque", label: "Estoque", icon: Package },
];

export function Sidebar({
  user,
}: {
  user: { name: string; email: string; role: Role };
}) {
  const pathname = usePathname();

  const links =
    user.role === "ADMIN"
      ? adminLinks
      : user.role === "STAFF"
        ? staffLinks
        : clientLinks;

  return (
    <aside className="flex w-64 flex-col border-r border-stone-200 bg-white">
      <div className="border-b border-stone-200 p-6">
        <Logo size="sm" />
        <p className="mt-3 truncate text-sm text-stone-500">{user.name}</p>
        <p className="truncate text-xs text-stone-400">{user.email}</p>
      </div>

      <nav className="flex-1 space-y-0.5 p-3">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              pathname === href
                ? "bg-violet-50 text-violet-700 shadow-sm"
                : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-stone-200 p-4">
        <p className="mb-2 px-3 text-xs text-stone-400">
          by {brand.author.name}
        </p>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}
