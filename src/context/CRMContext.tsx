import React, { createContext, useContext, useState, useCallback } from 'react';
import { Lead, PipelineStage, AutomationLog, HistoryEntry } from '../types';
import { INITIAL_LEADS } from '../data';

interface CRMContextType {
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'historico' | 'automacoes' | 'notas' | 'pipelineStage'>) => void;
  updateLeadStage: (leadId: string, newStage: PipelineStage, motivoPerda?: string) => void;
  addNota: (leadId: string, nota: string) => void;
  getLeadById: (id: string) => Lead | undefined;
  slaAlerts: { leadId: string; leadName: string; hoursSinceEntry: number }[];
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export function CRMProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);

  const addLead = useCallback((leadData: Omit<Lead, 'id' | 'historico' | 'automacoes' | 'notas' | 'pipelineStage'>) => {
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
          details: 'Email de boas-vindas enviado ao lead + Sales Rep notificado por Slack/Email'
        }
      ]
    };
    setLeads(prev => [newLead, ...prev]);
  }, []);

  const updateLeadStage = useCallback((leadId: string, newStage: PipelineStage, motivoPerda?: string) => {
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
  }, []);

  const addNota = useCallback((leadId: string, nota: string) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id !== leadId) return lead;
      return { ...lead, notas: [...lead.notas, nota] };
    }));
  }, []);

  const getLeadById = useCallback((id: string) => {
    return leads.find(l => l.id === id);
  }, [leads]);

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
    <CRMContext.Provider value={{ leads, addLead, updateLeadStage, addNota, getLeadById, slaAlerts }}>
      {children}
    </CRMContext.Provider>
  );
}

export function useCRM() {
  const context = useContext(CRMContext);
  if (!context) throw new Error('useCRM must be used within CRMProvider');
  return context;
}
