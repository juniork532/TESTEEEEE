"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency } from "@/lib/utils"
import { LogOut, Bell, Menu, X } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface Profile {
  id: string
  nome: string | null
  email: string
  saldo: number
  saldo_bonus: number
}

interface PainelHeaderProps {
  user: User
  profile: Profile | null
}

export function PainelHeader({ user, profile }: PainelHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const saldo = profile?.saldo || 0
  const saldoBonus = profile?.saldo_bonus || 0
  const nome = profile?.nome || user.email?.split("@")[0] || "Usuario"

  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Mobile menu button */}
        <button 
          className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Balance display */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end lg:items-start">
            <span className="text-xs text-muted-foreground">Saldo disponivel</span>
            <span className="text-lg font-bold text-primary">
              {formatCurrency(saldo)}
            </span>
          </div>
          {saldoBonus > 0 && (
            <div className="hidden sm:flex flex-col items-start px-3 py-1 rounded-lg bg-accent/10 border border-accent/20">
              <span className="text-xs text-muted-foreground">Bonus</span>
              <span className="text-sm font-semibold text-accent">
                {formatCurrency(saldoBonus)}
              </span>
            </div>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </Button>

          <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-border">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-foreground">{nome}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Sair">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 py-4 border-t border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium text-foreground">{nome}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
          {saldoBonus > 0 && (
            <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
              <span className="text-xs text-muted-foreground">Saldo Bonus: </span>
              <span className="text-sm font-semibold text-accent">
                {formatCurrency(saldoBonus)}
              </span>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
