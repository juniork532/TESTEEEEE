-- Subway Pay Database Schema
-- Migration 001: Create core tables

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT,
  email TEXT UNIQUE NOT NULL,
  telefone TEXT,
  cpf TEXT UNIQUE,
  saldo DECIMAL(10,2) DEFAULT 0.00,
  saldo_bonus DECIMAL(10,2) DEFAULT 0.00,
  codigo_indicacao TEXT UNIQUE,
  indicado_por UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Deposits table
CREATE TABLE IF NOT EXISTS public.depositos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  valor DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'cancelado', 'expirado')),
  gateway TEXT,
  transaction_id TEXT,
  pix_code TEXT,
  pix_qrcode TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.depositos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "depositos_select_own" ON public.depositos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "depositos_insert_own" ON public.depositos FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Withdrawals table
CREATE TABLE IF NOT EXISTS public.saques (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  valor DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'cancelado')),
  pix_tipo TEXT CHECK (pix_tipo IN ('cpf', 'telefone', 'email', 'aleatoria')),
  pix_chave TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.saques ENABLE ROW LEVEL SECURITY;
CREATE POLICY "saques_select_own" ON public.saques FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "saques_insert_own" ON public.saques FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Games/Bets table
CREATE TABLE IF NOT EXISTS public.apostas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  valor DECIMAL(10,2) NOT NULL,
  multiplicador DECIMAL(5,2) DEFAULT 1.00,
  resultado DECIMAL(10,2),
  status TEXT DEFAULT 'jogando' CHECK (status IN ('jogando', 'ganhou', 'perdeu')),
  moedas_coletadas INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.apostas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "apostas_select_own" ON public.apostas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "apostas_insert_own" ON public.apostas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "apostas_update_own" ON public.apostas FOR UPDATE USING (auth.uid() = user_id);

-- System configurations table (admin only)
CREATE TABLE IF NOT EXISTS public.configuracoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chave TEXT UNIQUE NOT NULL,
  valor TEXT,
  descricao TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default configurations
INSERT INTO public.configuracoes (chave, valor, descricao) VALUES
  ('deposito_minimo', '20', 'Valor mínimo para depósito em reais'),
  ('deposito_maximo', '5000', 'Valor máximo para depósito em reais'),
  ('saque_minimo', '100', 'Valor mínimo para saque em reais'),
  ('saque_maximo', '10000', 'Valor máximo para saque em reais'),
  ('multiplicador_base', '1.5', 'Multiplicador base do jogo'),
  ('dificuldade', '50', 'Dificuldade do jogo (0-100)'),
  ('bonus_primeiro_deposito', '100', 'Porcentagem de bônus no primeiro depósito'),
  ('comissao_afiliado', '5', 'Porcentagem de comissão para afiliados')
ON CONFLICT (chave) DO NOTHING;

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nome, codigo_indicacao)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'nome', NULL),
    SUBSTRING(MD5(NEW.id::TEXT) FROM 1 FOR 8)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
