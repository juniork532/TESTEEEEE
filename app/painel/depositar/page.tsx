"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/lib/utils"
import { Loader2, Gift, Zap, Copy, Check } from "lucide-react"

const quickAmounts = [20, 50, 100, 200, 500, 1000]

export default function DepositarPage() {
  const [valor, setValor] = useState("")
  const [loading, setLoading] = useState(false)
  const [pixCode, setPixCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const valorNum = parseFloat(valor) || 0
  const bonus = valorNum >= 20 ? valorNum : 0 // 100% bonus on first deposit
  const total = valorNum + bonus

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (valorNum < 20) return
    
    setLoading(true)
    
    // Simulate PIX generation (replace with actual gateway integration)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock PIX code
    setPixCode("00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef1234567890")
    setLoading(false)
  }

  async function handleCopy() {
    if (!pixCode) return
    await navigator.clipboard.writeText(pixCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (pixCode) {
    return (
      <div className="max-w-lg mx-auto pb-20 lg:pb-6">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <CardTitle>PIX Gerado!</CardTitle>
            <CardDescription>
              Copie o codigo abaixo e pague no app do seu banco
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary mb-2">
                {formatCurrency(valorNum)}
              </p>
              {bonus > 0 && (
                <p className="text-sm text-accent">
                  + {formatCurrency(bonus)} de bonus
                </p>
              )}
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">Codigo PIX Copia e Cola:</p>
              <div className="flex gap-2">
                <Input 
                  value={pixCode} 
                  readOnly 
                  className="font-mono text-xs"
                />
                <Button onClick={handleCopy} variant="outline" size="icon">
                  {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
              <p className="text-sm text-muted-foreground">
                O deposito sera confirmado automaticamente apos o pagamento. Pode levar ate 5 minutos.
              </p>
            </div>

            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => {
                setPixCode(null)
                setValor("")
              }}
            >
              Fazer outro deposito
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto pb-20 lg:pb-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Depositar</h1>
        <p className="text-muted-foreground">Adicione saldo via PIX instantaneo</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Gift className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Bonus de 100%</CardTitle>
              <CardDescription>No seu primeiro deposito</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Valor do Deposito</CardTitle>
          <CardDescription>Minimo de R$ 20,00</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input
                id="valor"
                type="number"
                placeholder="0,00"
                min="20"
                step="0.01"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="text-2xl font-bold h-14 text-center"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant={valorNum === amount ? "default" : "outline"}
                  onClick={() => setValor(amount.toString())}
                  className="h-12"
                >
                  {formatCurrency(amount)}
                </Button>
              ))}
            </div>

            {valorNum >= 20 && (
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Deposito</span>
                  <span className="text-foreground">{formatCurrency(valorNum)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Bonus (100%)</span>
                  <span className="text-primary">+{formatCurrency(bonus)}</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-semibold">
                  <span className="text-foreground">Total na conta</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={valorNum < 20 || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Gerando PIX...
                </>
              ) : (
                "Gerar PIX"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
