import { UserPlus, Wallet, Gamepad2, Banknote } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Crie sua Conta",
    description: "Cadastre-se em menos de 1 minuto. E rapido e facil.",
  },
  {
    icon: Wallet,
    step: "02",
    title: "Faca um Deposito",
    description: "Deposite a partir de R$20 via PIX. Credito instantaneo.",
  },
  {
    icon: Gamepad2,
    step: "03",
    title: "Jogue e Colete",
    description: "Jogue nosso game exclusivo e colete o maximo de moedas.",
  },
  {
    icon: Banknote,
    step: "04",
    title: "Saque seus Ganhos",
    description: "Solicite o saque e receba via PIX em minutos.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Como Funciona?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Em apenas 4 passos simples voce ja pode comecar a jogar e ganhar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <div key={index} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-border" />
              )}
              
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-10 h-10 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
