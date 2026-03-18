import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"
import { 
  Wallet, 
  Gamepad2, 
  TrendingUp, 
  ArrowDownCircle,
  ArrowUpCircle,
  Trophy,
  Coins
} from "lucide-react"

export default async function PainelPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // Fetch recent bets
  const { data: recentBets } = await supabase
    .from("apostas")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  // Fetch stats
  const { data: betsStats } = await supabase
    .from("apostas")
    .select("status, valor, resultado")
    .eq("user_id", user.id)

  const totalBets = betsStats?.length || 0
  const totalWins = betsStats?.filter(b => b.status === "ganhou").length || 0
  const totalWinnings = betsStats?.filter(b => b.status === "ganhou").reduce((acc, b) => acc + (Number(b.resultado) || 0), 0) || 0

  const saldo = Number(profile?.saldo) || 0
  const saldoBonus = Number(profile?.saldo_bonus) || 0
  const nome = profile?.nome || user.email?.split("@")[0] || "Usuario"

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Welcome section */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Ola, {nome}!
        </h1>
        <p className="text-muted-foreground">
          Bem-vindo ao seu painel. Veja seu saldo e comece a jogar.
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/painel/depositar">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <ArrowDownCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Depositar</p>
                <p className="text-sm text-muted-foreground">Via PIX</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/painel/jogar">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer bg-primary/5 border-primary/20">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Jogar</p>
                <p className="text-sm text-muted-foreground">Iniciar partida</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Balance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saldo Disponivel
            </CardTitle>
            <Wallet className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(saldo)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saldo Bonus
            </CardTitle>
            <Coins className="w-5 h-5 text-accent" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-accent">
              {formatCurrency(saldoBonus)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Ganho
            </CardTitle>
            <TrendingUp className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(totalWinnings)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Vitorias
            </CardTitle>
            <Trophy className="w-5 h-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {totalWins}/{totalBets}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Atividade Recente</CardTitle>
          <Link href="/painel/historico">
            <Button variant="ghost" size="sm">Ver tudo</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentBets && recentBets.length > 0 ? (
            <div className="space-y-3">
              {recentBets.map((bet) => (
                <div 
                  key={bet.id} 
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      bet.status === "ganhou" ? "bg-primary/10" : 
                      bet.status === "perdeu" ? "bg-destructive/10" : "bg-muted"
                    }`}>
                      <Gamepad2 className={`w-5 h-5 ${
                        bet.status === "ganhou" ? "text-primary" : 
                        bet.status === "perdeu" ? "text-destructive" : "text-muted-foreground"
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Aposta de {formatCurrency(Number(bet.valor))}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Multiplicador: {bet.multiplicador}x
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      bet.status === "ganhou" ? "text-primary" : 
                      bet.status === "perdeu" ? "text-destructive" : "text-muted-foreground"
                    }`}>
                      {bet.status === "ganhou" ? `+${formatCurrency(Number(bet.resultado))}` :
                       bet.status === "perdeu" ? `-${formatCurrency(Number(bet.valor))}` :
                       "Em andamento"}
                    </p>
                    <p className={`text-xs ${
                      bet.status === "ganhou" ? "text-primary" : 
                      bet.status === "perdeu" ? "text-destructive" : "text-muted-foreground"
                    }`}>
                      {bet.status === "ganhou" ? "Vitoria" : 
                       bet.status === "perdeu" ? "Derrota" : "Jogando"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Gamepad2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Nenhuma atividade ainda</p>
              <Link href="/painel/jogar">
                <Button className="mt-4">Comecar a jogar</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/painel/sacar">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center gap-4 p-4">
              <ArrowUpCircle className="w-6 h-6 text-muted-foreground" />
              <span className="font-medium text-foreground">Solicitar Saque</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/painel/afiliados">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center gap-4 p-4">
              <Trophy className="w-6 h-6 text-muted-foreground" />
              <span className="font-medium text-foreground">Programa de Afiliados</span>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
