import { Shield, Smartphone, CreditCard, Users, Gift, Clock } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "100% Seguro",
    description: "Plataforma protegida com criptografia de ponta. Seus dados e dinheiro estao sempre seguros.",
  },
  {
    icon: Smartphone,
    title: "Jogue em Qualquer Lugar",
    description: "Acesse pelo celular ou computador. Nossa plataforma e 100% responsiva.",
  },
  {
    icon: CreditCard,
    title: "PIX Instantaneo",
    description: "Deposite e saque via PIX. Transacoes processadas em segundos.",
  },
  {
    icon: Users,
    title: "Programa de Afiliados",
    description: "Indique amigos e ganhe comissao em todos os depositos deles.",
  },
  {
    icon: Gift,
    title: "Bonus Exclusivos",
    description: "Ganhe bonus no primeiro deposito e promocoes especiais toda semana.",
  },
  {
    icon: Clock,
    title: "Suporte 24/7",
    description: "Equipe de suporte disponivel 24 horas para ajudar voce.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 bg-card/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Por que escolher o Subway Pay?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Oferecemos a melhor experiencia de jogos online com pagamentos rapidos e seguros.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
