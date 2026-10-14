export type LeadOrigin = 'Website' | 'LinkedIn' | 'Evento' | 'Indicação' | 'Google Ads';
export type ServiceInterest = 'Transporte Rodoviário' | 'Marítimo' | 'Aéreo' | 'Armazenagem' | 'Outros';
export type Budget = '< €5k' | '€5k-€20k' | '> €20k';
export type PipelineStage = 
  | 'Novo Lead'
  | 'Em Qualificação'
  | 'MQL Qualificado (SQL)'
  | 'Reunião de Diagnóstico Agendada'
  | 'Proposta Comercial Enviada'
  | 'Negociação / Ajustes'
  | 'Ganho'
  | 'Perdido';
export type Owner = 'Content Specialist' | 'Customer Success' | 'CMO';

export interface Lead {
  id: string;
  nomeCompleto: string;
  empresa: string;
  email: string;
  telefone: string;
  origem: LeadOrigin;
  servicoInteresse: ServiceInterest;
  budget: Budget;
  dataEntrada: string;
  proprietario: Owner;
  pipelineStage: PipelineStage;
  motivoPerda?: string;
  notas: string[];
  historico: HistoryEntry[];
  automacoes: AutomationLog[];
}

export interface HistoryEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}

export interface AutomationLog {
  id: string;
  timestamp: string;
  rule: string;
  status: 'Executada' | 'Pendente' | 'Falhada';
  details: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  active: boolean;
}
