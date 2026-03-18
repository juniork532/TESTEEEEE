-- Subway Pay Database Schema
-- Migration 001: Create core tables

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT,
  email TEXT NOT NULL,
  telefone TEXT,
  cpf TEXT,
  saldo DECIMAL(10,2) DEFAULT 0.00,
  saldo_bonus DECIMAL(10,2) DEFAULT 0.00,
  codigo_indicacao TEXT,
  indicado_por UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Deposits table
CREATE TABLE IF NOT EXISTS public.depositos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  valor DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pendente',
  gateway TEXT,
  transaction_id TEXT,
  pix_code TEXT,
  pix_qrcode TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.depositos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "depositos_select_own" ON public.depositos;
DROP POLICY IF EXISTS "depositos_insert_own" ON public.depositos;

CREATE POLICY "depositos_select_own" ON public.depositos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "depositos_insert_own" ON public.depositos FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Withdrawals table
CREATE TABLE IF NOT EXISTS public.saques (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  valor DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pendente',
  pix_tipo TEXT,
  pix_chave TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.saques ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "saques_select_own" ON public.saques;
DROP POLICY IF EXISTS "saques_insert_own" ON public.saques;

CREATE POLICY "saques_select_own" ON public.saques FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "saques_insert_own" ON public.saques FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Games/Bets table
CREATE TABLE IF NOT EXISTS public.apostas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  valor DECIMAL(10,2) NOT NULL,
  multiplicador DECIMAL(5,2) DEFAULT 1.00,
  resultado DECIMAL(10,2),
  status TEXT DEFAULT 'jogando',
  moedas_coletadas INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.apostas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "apostas_select_own" ON public.apostas;
DROP POLICY IF EXISTS "apostas_insert_own" ON public.apostas;
DROP POLICY IF EXISTS "apostas_update_own" ON public.apostas;

CREATE POLICY "apostas_select_own" ON public.apostas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "apostas_insert_own" ON public.apostas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "apostas_update_own" ON public.apostas FOR UPDATE USING (auth.uid() = user_id);

-- System configurations table
CREATE TABLE IF NOT EXISTS public.configuracoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chave TEXT UNIQUE NOT NULL,
  valor TEXT,
  descricao TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default configurations
INSERT INTO public.configuracoes (chave, valor, descricao) VALUES
  ('deposito_minimo', '20', 'Valor minimo para deposito em reais'),
  ('deposito_maximo', '5000', 'Valor maximo para deposito em reais'),
  ('saque_minimo', '100', 'Valor minimo para saque em reais'),
  ('saque_maximo', '10000', 'Valor maximo para saque em reais'),
  ('multiplicador_base', '1.5', 'Multiplicador base do jogo'),
  ('dificuldade', '50', 'Dificuldade do jogo (0-100)'),
  ('bonus_primeiro_deposito', '100', 'Porcentagem de bonus no primeiro deposito'),
  ('comissao_afiliado', '5', 'Porcentagem de comissao para afiliados')
ON CONFLICT (chave) DO NOTHING;
