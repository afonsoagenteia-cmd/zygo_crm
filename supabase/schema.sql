-- ============================================
-- ZYGO CRM - Database Schema for Supabase
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Users table (for authentication and role management)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('Content Specialist', 'Customer Success', 'CMO')) NOT NULL DEFAULT 'Content Specialist',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads table (main entity)
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome_completo TEXT NOT NULL,
  empresa TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  origem TEXT CHECK (origem IN ('Website', 'LinkedIn', 'Instagram', 'Facebook', 'Evento', 'Indicação', 'Google Ads')) NOT NULL,
  servico_interesse TEXT CHECK (servico_interesse IN ('O MeuCatálogo', 'Última milha', 'Interprovincial', 'Armazém', 'Outros')) NOT NULL,
  data_entrada TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  proprietario TEXT CHECK (proprietario IN ('Content Specialist', 'Customer Success', 'CMO')) NOT NULL,
  pipeline_stage TEXT CHECK (pipeline_stage IN (
    'Novo Lead',
    'Em Qualificação',
    'MQL Qualificado (SQL)',
    'Reunião de Diagnóstico Agendada',
    'Proposta Comercial Enviada',
    'Negociação / Ajustes',
    'Ganho',
    'Perdido'
  )) NOT NULL DEFAULT 'Novo Lead',
  motivo_perda TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notes table (for lead notes)
CREATE TABLE IF NOT EXISTS lead_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- History table (for activity tracking)
CREATE TABLE IF NOT EXISTS lead_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL,
  details TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automations log table
CREATE TABLE IF NOT EXISTS automation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
  rule TEXT NOT NULL,
  status TEXT CHECK (status IN ('Executada', 'Pendente', 'Falhada')) NOT NULL DEFAULT 'Executada',
  details TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES (for performance)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_leads_pipeline_stage ON leads(pipeline_stage);
CREATE INDEX IF NOT EXISTS idx_leads_proprietario ON leads(proprietario);
CREATE INDEX IF NOT EXISTS idx_leads_data_entrada ON leads(data_entrada DESC);
CREATE INDEX IF NOT EXISTS idx_leads_origem ON leads(origem);
CREATE INDEX IF NOT EXISTS idx_lead_notes_lead_id ON lead_notes(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_history_lead_id ON lead_history(lead_id);
CREATE INDEX IF NOT EXISTS idx_automation_logs_lead_id ON automation_logs(lead_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;

-- Policies: Allow authenticated users to read/write
-- For now, we'll use permissive policies (can be tightened later)

-- Users policies
CREATE POLICY "Users can view all users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can insert" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (true);

-- Leads policies
CREATE POLICY "Authenticated users can view leads" ON leads
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert leads" ON leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can update leads" ON leads
  FOR UPDATE USING (true);

CREATE POLICY "Authenticated users can delete leads" ON leads
  FOR DELETE USING (true);

-- Lead notes policies
CREATE POLICY "Users can view notes" ON lead_notes
  FOR SELECT USING (true);

CREATE POLICY "Users can insert notes" ON lead_notes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can delete notes" ON lead_notes
  FOR DELETE USING (true);

-- Lead history policies
CREATE POLICY "Users can view history" ON lead_history
  FOR SELECT USING (true);

CREATE POLICY "Users can insert history" ON lead_history
  FOR INSERT WITH CHECK (true);

-- Automation logs policies
CREATE POLICY "Users can view automation logs" ON automation_logs
  FOR SELECT USING (true);

CREATE POLICY "Users can insert automation logs" ON automation_logs
  FOR INSERT WITH CHECK (true);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for leads table
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA (Optional - for testing)
-- ============================================

-- Insert sample leads
INSERT INTO leads (nome_completo, empresa, email, telefone, origem, servico_interesse, proprietario, pipeline_stage) VALUES
  ('Carlos Mendes', 'LogiTrans Portugal', 'carlos.mendes@logitrans.pt', '+351 912 345 678', 'Website', 'Interprovincial', 'Content Specialist', 'Em Qualificação'),
  ('Ana Rodrigues', 'Global Freight Lda', 'ana.rodrigues@globalfreight.com', '+351 923 456 789', 'LinkedIn', 'Última milha', 'CMO', 'Proposta Comercial Enviada'),
  ('Miguel Santos', 'Express Cargo', 'miguel@expresscargo.pt', '+351 934 567 890', 'Instagram', 'O MeuCatálogo', 'Content Specialist', 'Novo Lead'),
  ('Sofia Pereira', 'MedLogistics SA', 'sofia.pereira@medlog.pt', '+351 945 678 901', 'Evento', 'Armazém', 'Customer Success', 'Ganho'),
  ('Ricardo Ferreira', 'TechShip Solutions', 'ricardo@techship.io', '+351 956 789 012', 'Facebook', 'Outros', 'Content Specialist', 'Perdido'),
  ('Beatriz Almeida', 'Fresh Atlantic', 'beatriz@freshatlantic.pt', '+351 967 890 123', 'Website', 'Interprovincial', 'Customer Success', 'Reunião de Diagnóstico Agendada')
ON CONFLICT DO NOTHING;

-- ============================================
-- VIEWS (for easier querying)
-- ============================================

-- View for leads with notes count
CREATE OR REPLACE VIEW leads_with_notes AS
SELECT 
  l.*,
  COUNT(n.id) as notes_count
FROM leads l
LEFT JOIN lead_notes n ON l.id = n.lead_id
GROUP BY l.id;

-- View for leads with stage history
CREATE OR REPLACE VIEW leads_with_history AS
SELECT 
  l.*,
  COUNT(h.id) as history_count,
  MAX(h.created_at) as last_activity
FROM leads l
LEFT JOIN lead_history h ON l.id = h.lead_id
GROUP BY l.id;
