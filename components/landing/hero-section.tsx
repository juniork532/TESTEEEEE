import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Coins, Zap, TrendingUp } from "lucide-react";

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Novidade: Bonus de 100% no primeiro deposito</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance leading-tight">
            Jogue, Colete Moedas e{" "}
            <span className="text-primary">Multiplique</span>{" "}
            seus Ganhos
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty">
            Entre no mundo do Subway Pay. Deposite via PIX, jogue nosso game exclusivo e transforme suas moedas em dinheiro real.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/cadastrar">
              <Button size="lg" className="min-w-[200px]">
                Comecar Agora
                <Coins className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="min-w-[200px]">
                Ja tenho conta
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="flex flex-col items-center p-6 rounded-xl bg-card border border-border">
              <TrendingUp className="w-8 h-8 text-primary mb-3" />
              <span className="text-3xl font-bold text-foreground">2.5x</span>
              <span className="text-sm text-muted-foreground">Multiplicador medio</span>
            </div>
            <div className="flex flex-col items-center p-6 rounded-xl bg-card border border-border">
              <Coins className="w-8 h-8 text-accent mb-3" />
              <span className="text-3xl font-bold text-foreground">R$20</span>
              <span className="text-sm text-muted-foreground">Deposito minimo</span>
            </div>
            <div className="flex flex-col items-center p-6 rounded-xl bg-card border border-border">
              <Zap className="w-8 h-8 text-secondary mb-3" />
              <span className="text-3xl font-bold text-foreground">5min</span>
              <span className="text-sm text-muted-foreground">Saque instantaneo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
