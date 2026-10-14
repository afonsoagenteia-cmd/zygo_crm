import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { Lead, LeadUpdate, PipelineStage, AutomationLog, HistoryEntry } from '../types';
import { INITIAL_LEADS } from '../data';
import { leadsService } from '../services/leadsService';
import { isSupabaseConfigured } from '../lib/supabase';

interface CRMContextType {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  addLead: (lead: Omit<Lead, 'id' | 'historico' | 'automacoes' | 'notas' | 'pipelineStage'>) => Promise<void>;
  updateLead: (leadId: string, leadData: LeadUpdate) => Promise<void>;
  deleteLead: (leadId: string) => Promise<void>;
  updateLeadStage: (leadId: string, newStage: PipelineStage, motivoPerda?: string) => Promise<void>;
  addNota: (leadId: string, nota: string) => Promise<void>;
  getLeadById: (id: string) => Lead | undefined;
  slaAlerts: { leadId: string; leadName: string; hoursSinceEntry: number }[];
  refreshLeads: () => Promise<void>;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export function CRMProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load leads on mount
  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      setError(null);

      if (isSupabaseConfigured()) {
        // Load from Supabase
        const data = await leadsService.getAll();
        setLeads(data);
      } else {
        // Fallback to local data
        console.warn('Supabase not configured, using local data');
        const savedLeads = localStorage.getItem('zygo-crm-leads');
        setLeads(savedLeads ? JSON.parse(savedLeads) as Lead[] : INITIAL_LEADS);
      }
    } catch (err) {
      console.error('Error loading leads:', err);
      setError('Erro ao carregar leads. Usando dados locais.');
      setLeads(INITIAL_LEADS);
    } finally {
      setLoading(false);
    }
  };

  const refreshLeads = async () => {
    await loadLeads();
  };

  const updateLead = useCallback(async (leadId: string, leadData: LeadUpdate) => {
    if (isSupabaseConfigured()) {
      await leadsService.update(leadId, leadData);
      await refreshLeads();
      return;
    }

    const timestamp = new Date().toISOString();
    setLeads(prev => prev.map(lead => lead.id === leadId ? {
      ...lead,
      ...leadData,
      historico: [...lead.historico, {
        id: `h-${Date.now()}`,
        timestamp,
        action: 'Dados do lead editados',
        details: 'Informações de contacto e qualificação atualizadas',
      }],
    } : lead));
  }, []);

  const deleteLead = useCallback(async (leadId: string) => {
    if (isSupabaseConfigured()) {
      await leadsService.delete(leadId);
    }
    setLeads(prev => prev.filter(lead => lead.id !== leadId));
  }, []);

  const addLead = useCallback(async (leadData: Omit<Lead, 'id' | 'historico' | 'automacoes' | 'notas' | 'pipelineStage'>) => {
    try {
      if (isSupabaseConfigured()) {
        const newLead = await leadsService.create(leadData);
        if (newLead) {
          setLeads(prev => [newLead, ...prev]);
        }
      } else {
        // Fallback to local
        const now = new Date().toISOString();
        const newLead: Lead = {
          ...leadData,
          id: `lead-${Date.now()}`,
          pipelineStage: 'Novo Lead',
          notas: [],
          historico: [
            { id: `h-${Date.now()}`, timestamp: now, action: 'Lead criado', details: `Via ${leadData.origem}` }
          ],
          automacoes: [
            {
              id: `a-${Date.now()}`,
              timestamp: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
              rule: 'Regra 1: Boas-vindas Automáticas',
              status: 'Executada',
              details: 'Email de boas-vindas enviado ao lead + Content Specialist notificado por Slack/Email'
            }
          ]
        };
        setLeads(prev => [newLead, ...prev]);
      }
    } catch (err) {
      console.error('Error adding lead:', err);
      throw err;
    }
  }, []);

  const updateLeadStage = useCallback(async (leadId: string, newStage: PipelineStage, motivoPerda?: string) => {
    try {
      if (isSupabaseConfigured()) {
        const success = await leadsService.updateStage(leadId, newStage, motivoPerda);
        if (success) {
          await refreshLeads();
        }
      } else {
        // Fallback to local
        const now = new Date().toISOString();
        setLeads(prev => prev.map(lead => {
          if (lead.id !== leadId) return lead;
          
          const historyEntry: HistoryEntry = {
            id: `h-${Date.now()}`,
            timestamp: now,
            action: 'Etapa alterada',
            details: `De "${lead.pipelineStage}" para "${newStage}"`
          };

          const newAutomations: AutomationLog[] = [];

          // Regra 3: Se etapa é "Ganho" → Handover
          if (newStage === 'Ganho') {
            newAutomations.push({
              id: `a-${Date.now()}`,
              timestamp: now,
              rule: 'Regra 3: Handover para Operações',
              status: 'Executada',
              details: 'Tarefa "Handover para Operações" criada + Email de boas-vindas do Cliente enviado'
            });
          }

          return {
            ...lead,
            pipelineStage: newStage,
            motivoPerda: motivoPerda || lead.motivoPerda,
            historico: [...lead.historico, historyEntry],
            automacoes: [...lead.automacoes, ...newAutomations],
          };
        }));
      }
    } catch (err) {
      console.error('Error updating lead stage:', err);
      throw err;
    }
  }, []);

  const addNota = useCallback(async (leadId: string, nota: string) => {
    try {
      if (isSupabaseConfigured()) {
        const success = await leadsService.addNote(leadId, nota);
        if (success) {
          await refreshLeads();
        }
      } else {
        // Fallback to local
        setLeads(prev => prev.map(lead => {
          if (lead.id !== leadId) return lead;
          return { ...lead, notas: [...lead.notas, nota] };
        }));
      }
    } catch (err) {
      console.error('Error adding note:', err);
      throw err;
    }
  }, []);

  const getLeadById = useCallback((id: string) => {
    return leads.find(l => l.id === id);
  }, [leads]);

  useEffect(() => {
    if (!loading && !isSupabaseConfigured()) {
      localStorage.setItem('zygo-crm-leads', JSON.stringify(leads));
    }
  }, [leads, loading]);

  // SLA Alerts: leads em "Novo Lead" há mais de 24h
  const slaAlerts = leads
    .filter(lead => {
      if (lead.pipelineStage !== 'Novo Lead') return false;
      const hoursSinceEntry = (Date.now() - new Date(lead.dataEntrada).getTime()) / (1000 * 60 * 60);
      return hoursSinceEntry > 24;
    })
    .map(lead => ({
      leadId: lead.id,
      leadName: lead.nomeCompleto,
      hoursSinceEntry: Math.round((Date.now() - new Date(lead.dataEntrada).getTime()) / (1000 * 60 * 60))
    }));

  return (
    <CRMContext.Provider value={{ 
      leads, 
      loading, 
      error,
      addLead, 
      updateLead,
      deleteLead,
      updateLeadStage, 
      addNota, 
      getLeadById, 
      slaAlerts,
      refreshLeads 
    }}>
      {children}
    </CRMContext.Provider>
  );
}

export function useCRM() {
  const context = useContext(CRMContext);
  if (!context) throw new Error('useCRM must be used within CRMProvider');
  return context;
}
