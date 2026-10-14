import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Lead, LeadOrigin, ServiceInterest, Owner, PipelineStage } from '../types';

// ============================================
// LEADS SERVICE
// ============================================

export const leadsService = {
  // Get all leads
  async getAll(): Promise<Lead[]> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, returning empty array');
      return [];
    }

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('data_entrada', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }

    // Fetch notes, history, and automations for each lead
    const leadsWithRelations = await Promise.all(
      (data || []).map(async (lead) => {
        const [notes, history, automations] = await Promise.all([
          this.getNotes(lead.id),
          this.getHistory(lead.id),
          this.getAutomations(lead.id),
        ]);

        return {
          id: lead.id,
          nomeCompleto: lead.nome_completo,
          empresa: lead.empresa,
          email: lead.email,
          telefone: lead.telefone,
          origem: lead.origem as LeadOrigin,
          servicoInteresse: lead.servico_interesse as ServiceInterest,
          dataEntrada: lead.data_entrada,
          proprietario: lead.proprietario as Owner,
          pipelineStage: lead.pipeline_stage as PipelineStage,
          motivoPerda: lead.motivo_perda,
          notas: notes.map(n => n.content),
          historico: history.map(h => ({
            id: h.id,
            timestamp: h.created_at,
            action: h.action,
            details: h.details,
          })),
          automacoes: automations.map(a => ({
            id: a.id,
            timestamp: a.created_at,
            rule: a.rule,
            status: a.status as 'Executada' | 'Pendente' | 'Falhada',
            details: a.details,
          })),
        };
      })
    );

    return leadsWithRelations;
  },

  // Get lead by ID
  async getById(id: string): Promise<Lead | null> {
    if (!isSupabaseConfigured()) return null;

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching lead:', error);
      return null;
    }

    const [notes, history, automations] = await Promise.all([
      this.getNotes(id),
      this.getHistory(id),
      this.getAutomations(id),
    ]);

    return {
      id: data.id,
      nomeCompleto: data.nome_completo,
      empresa: data.empresa,
      email: data.email,
      telefone: data.telefone,
      origem: data.origem as LeadOrigin,
      servicoInteresse: data.servico_interesse as ServiceInterest,
      dataEntrada: data.data_entrada,
      proprietario: data.proprietario as Owner,
      pipelineStage: data.pipeline_stage as PipelineStage,
      motivoPerda: data.motivo_perda,
      notas: notes.map(n => n.content),
      historico: history.map(h => ({
        id: h.id,
        timestamp: h.created_at,
        action: h.action,
        details: h.details,
      })),
      automacoes: automations.map(a => ({
        id: a.id,
        timestamp: a.created_at,
        rule: a.rule,
        status: a.status as 'Executada' | 'Pendente' | 'Falhada',
        details: a.details,
      })),
    };
  },

  // Create new lead
  async create(leadData: Omit<Lead, 'id' | 'historico' | 'automacoes' | 'notas' | 'pipelineStage'>): Promise<Lead | null> {
    if (!isSupabaseConfigured()) return null;

    const { data, error } = await supabase
      .from('leads')
      .insert({
        nome_completo: leadData.nomeCompleto,
        empresa: leadData.empresa,
        email: leadData.email,
        telefone: leadData.telefone,
        origem: leadData.origem,
        servico_interesse: leadData.servicoInteresse,
        data_entrada: leadData.dataEntrada,
        proprietario: leadData.proprietario,
        pipeline_stage: 'Novo Lead',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating lead:', error);
      throw error;
    }

    // Create initial history entry
    await supabase.from('lead_history').insert({
      lead_id: data.id,
      action: 'Lead criado',
      details: `Via ${leadData.origem}`,
    });

    // Create automation log
    await supabase.from('automation_logs').insert({
      lead_id: data.id,
      rule: 'Regra 1: Boas-vindas Automáticas',
      status: 'Executada',
      details: 'Email de boas-vindas enviado + Content Specialist notificado',
    });

    return this.getById(data.id);
  },

  // Update lead stage
  async updateStage(id: string, newStage: PipelineStage, motivoPerda?: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    // Get current lead to get previous stage
    const currentLead = await this.getById(id);
    if (!currentLead) return false;

    const { error } = await supabase
      .from('leads')
      .update({
        pipeline_stage: newStage,
        motivo_perda: motivoPerda || currentLead.motivoPerda,
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating lead stage:', error);
      return false;
    }

    // Add history entry
    await supabase.from('lead_history').insert({
      lead_id: id,
      action: 'Etapa alterada',
      details: `De "${currentLead.pipelineStage}" para "${newStage}"`,
    });

    // If stage is "Ganho", create automation log
    if (newStage === 'Ganho') {
      await supabase.from('automation_logs').insert({
        lead_id: id,
        rule: 'Regra 3: Handover para Operações',
        status: 'Executada',
        details: 'Tarefa "Handover para Operações" criada + Email de boas-vindas do Cliente enviado',
      });
    }

    return true;
  },

  // Add note to lead
  async addNote(leadId: string, content: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    const { error } = await supabase
      .from('lead_notes')
      .insert({
        lead_id: leadId,
        content,
      });

    if (error) {
      console.error('Error adding note:', error);
      return false;
    }

    return true;
  },

  // Get notes for a lead
  async getNotes(leadId: string): Promise<{ id: string; content: string; created_at: string }[]> {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('lead_notes')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching notes:', error);
      return [];
    }

    return data || [];
  },

  // Get history for a lead
  async getHistory(leadId: string): Promise<{ id: string; action: string; details: string; created_at: string }[]> {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('lead_history')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching history:', error);
      return [];
    }

    return data || [];
  },

  // Get automations for a lead
  async getAutomations(leadId: string): Promise<{ id: string; rule: string; status: string; details: string; created_at: string }[]> {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('automation_logs')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching automations:', error);
      return [];
    }

    return data || [];
  },

  // Delete lead
  async delete(id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting lead:', error);
      return false;
    }

    return true;
  },
};
