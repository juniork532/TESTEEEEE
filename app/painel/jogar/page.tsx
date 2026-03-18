"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/lib/utils"
import { Gamepad2, TrendingUp, Coins, AlertCircle } from "lucide-react"

const quickBets = [5, 10, 20, 50, 100, 200]

export default function JogarPage() {
  const [valor, setValor] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  
  const valorNum = parseFloat(valor) || 0
  const multiplicador = 2.5 // Base multiplier
  const potentialWin = valorNum * multiplicador

  async function handlePlay() {
    if (valorNum < 5) return
    setIsPlaying(true)
    // Game logic would go here
    // For now, just show the game is starting
  }

  return (
    <div className="max-w-2xl mx-auto pb-20 lg:pb-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Jogar</h1>
        <p className="text-muted-foreground">Faca sua aposta e multiplique seus ganhos</p>
      </div>

      <div className="grid gap-6">
        {/* Game preview card */}
        <Card className="overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative">
            {isPlaying ? (
              <div className="text-center">
                <Gamepad2 className="w-16 h-16 text-primary animate-pulse mx-auto mb-4" />
                <p className="text-xl font-bold text-foreground">Jogo em andamento...</p>
                <p className="text-muted-foreground">Colete as moedas para ganhar!</p>
              </div>
            ) : (
              <div className="text-center">
                <Gamepad2 className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">
                  Faca uma aposta para comecar
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Bet controls */}
        <Card>
          <CardHeader>
            <CardTitle>Fazer Aposta</CardTitle>
            <CardDescription>Minimo de R$ 5,00 por aposta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="valor">Valor da Aposta (R$)</Label>
              <Input
                id="valor"
                type="number"
                placeholder="0,00"
                min="5"
                step="0.01"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="text-xl font-bold h-12 text-center"
                disabled={isPlaying}
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {quickBets.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant={valorNum === amount ? "default" : "outline"}
                  onClick={() => setValor(amount.toString())}
                  disabled={isPlaying}
                >
                  {formatCurrency(amount)}
                </Button>
              ))}
            </div>

            {/* Stats preview */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Multiplicador</span>
                </div>
                <p className="text-2xl font-bold text-primary">{multiplicador}x</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-1">
                  <Coins className="w-4 h-4 text-accent" />
                  <span className="text-sm text-muted-foreground">Ganho Potencial</span>
                </div>
                <p className="text-2xl font-bold text-accent">
                  {valorNum > 0 ? formatCurrency(potentialWin) : "-"}
                </p>
              </div>
            </div>

            {valorNum > 0 && valorNum < 5 && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />
                Aposta minima de R$ 5,00
              </div>
            )}

            <Button 
              className="w-full" 
              size="lg"
              disabled={valorNum < 5 || isPlaying}
              onClick={handlePlay}
            >
              {isPlaying ? "Jogando..." : "Iniciar Jogo"}
            </Button>
          </CardContent>
        </Card>

        {/* Info card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Como funciona</p>
                <p>
                  Colete moedas durante o jogo para aumentar seu multiplicador. 
                  Quanto mais moedas coletar, maior sera seu ganho. 
                  Cuidado com os obstaculos!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
