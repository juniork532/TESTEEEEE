"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Home, 
  Gamepad2, 
  Wallet, 
  ArrowDownCircle, 
  ArrowUpCircle,
  Users,
  Settings,
  HelpCircle
} from "lucide-react"

const menuItems = [
  { href: "/painel", label: "Inicio", icon: Home },
  { href: "/painel/jogar", label: "Jogar", icon: Gamepad2 },
  { href: "/painel/carteira", label: "Carteira", icon: Wallet },
  { href: "/painel/depositar", label: "Depositar", icon: ArrowDownCircle },
  { href: "/painel/sacar", label: "Sacar", icon: ArrowUpCircle },
  { href: "/painel/afiliados", label: "Afiliados", icon: Users },
  { href: "/painel/configuracoes", label: "Configuracoes", icon: Settings },
  { href: "/painel/ajuda", label: "Ajuda", icon: HelpCircle },
]

export function PainelSidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-card border-r border-border">
        <div className="flex items-center gap-3 h-16 px-6 border-b border-border">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">S</span>
          </div>
          <span className="font-bold text-lg text-foreground">Subway Pay</span>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm font-medium text-foreground mb-1">Bonus Ativo</p>
            <p className="text-xs text-muted-foreground">100% no primeiro deposito</p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="flex items-center justify-around h-16">
          {menuItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
