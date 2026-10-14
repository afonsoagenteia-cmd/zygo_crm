import { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { PIPELINE_STAGES, STAGE_COLORS } from '../data';
import { PipelineStage } from '../types';
import { ArrowLeft, ChevronDown, MessageSquare, Zap, Clock, AlertTriangle, Send } from 'lucide-react';

interface LeadDetailProps {
  leadId: string;
  onBack: () => void;
}

export default function LeadDetail({ leadId, onBack }: LeadDetailProps) {
  const { getLeadById, updateLeadStage, addNota } = useCRM();
  const lead = getLeadById(leadId);
  const [newNota, setNewNota] = useState('');
  const [showStageDropdown, setShowStageDropdown] = useState(false);

  if (!lead) {
    return (
      <div className="p-8 text-center">
        <p className="text-[#063C20]/50">Lead não encontrado</p>
        <button onClick={onBack} className="mt-4 text-[#063C20] text-sm hover:underline">← Voltar</button>
      </div>
    );
  }

  const handleAddNota = () => {
    if (newNota.trim()) {
      addNota(leadId, newNota);
      setNewNota('');
    }
  };

  const handleStageChange = (newStage: PipelineStage) => {
    if (newStage === 'Perdido') {
      const motivo = prompt('Motivo da perda (obrigatório):');
      if (motivo && motivo.trim()) {
        updateLeadStage(leadId, newStage, motivo);
      }
    } else {
      updateLeadStage(leadId, newStage);
    }
    setShowStageDropdown(false);
  };

  const currentStageIndex = PIPELINE_STAGES.indexOf(lead.pipelineStage);

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-[#063C20]/5 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#063C20]" />
        </button>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-widest text-[#063C20]/50 font-medium">Lead</p>
          <h2 className="font-display text-3xl font-bold text-[#063C20] tracking-tight">{lead.nomeCompleto}</h2>
          <p className="text-[#063C20]/60 text-sm mt-0.5">{lead.empresa}</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowStageDropdown(!showStageDropdown)}
            className={`px-4 py-2.5 text-sm font-semibold text-white rounded-xl flex items-center gap-2 shadow-lg ${STAGE_COLORS[lead.pipelineStage]}`}
          >
            {lead.pipelineStage}
            <ChevronDown className={`w-4 h-4 transition-transform ${showStageDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showStageDropdown && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-[#063C20]/10 z-50 py-2 overflow-hidden">
              {PIPELINE_STAGES.map(stage => (
                <button
                  key={stage}
                  onClick={() => handleStageChange(stage)}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#C0D637]/10 flex items-center gap-3 transition-colors ${
                    stage === lead.pipelineStage ? 'font-semibold text-[#063C20] bg-[#C0D637]/5' : 'text-[#063C20]/70'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${STAGE_COLORS[stage]}`} />
                  {stage}
                  {stage === lead.pipelineStage && <span className="ml-auto text-[#C0D637]">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl p-5 border border-[#063C20]/8">
        <div className="flex items-center gap-1">
          {PIPELINE_STAGES.filter(s => s !== 'Perdido').map((stage, idx) => (
            <div key={stage} className="flex-1 flex items-center">
              <div className={`h-1.5 flex-1 rounded-full ${
                idx <= currentStageIndex && lead.pipelineStage !== 'Perdido'
                  ? STAGE_COLORS[stage]
                  : 'bg-[#063C20]/8'
              }`} />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-3">
          <span className="text-[10px] uppercase tracking-wider text-[#063C20]/40 font-medium">Entrada</span>
          <span className="text-[10px] uppercase tracking-wider text-[#063C20]/40 font-medium">Fecho</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <div className="bg-white rounded-2xl p-6 border border-[#063C20]/8">
            <h3 className="text-xs font-semibold text-[#063C20]/50 uppercase tracking-widest mb-5 pb-3 border-b border-[#063C20]/8">
              Informações do Lead
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { label: 'Email', value: lead.email },
                { label: 'Telefone', value: lead.telefone },
                { label: 'Empresa', value: lead.empresa },
                { label: 'Origem', value: lead.origem },
                { label: 'Serviço', value: lead.servicoInteresse },
                { label: 'Budget', value: lead.budget },
                { label: 'Proprietário', value: lead.proprietario },
                { label: 'Data Entrada', value: new Date(lead.dataEntrada).toLocaleString('pt-PT') },
              ].map(item => (
                <div key={item.label} className="group">
                  <p className="text-[10px] uppercase tracking-wider text-[#063C20]/40 font-semibold mb-1">{item.label}</p>
                  <p className="text-sm text-[#063C20] font-medium">{item.value}</p>
                </div>
              ))}
            </div>
            {lead.motivoPerda && (
              <div className="mt-5 p-4 bg-[#063C20]/5 border border-[#063C20]/10 rounded-xl">
                <p className="text-[10px] font-semibold text-[#063C20] uppercase tracking-wider mb-1 flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3" /> Motivo da Perda
                </p>
                <p className="text-sm text-[#063C20]">{lead.motivoPerda}</p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white rounded-2xl p-6 border border-[#063C20]/8">
            <h3 className="text-xs font-semibold text-[#063C20]/50 uppercase tracking-widest mb-5 pb-3 border-b border-[#063C20]/8 flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5" /> Notas
            </h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newNota}
                onChange={e => setNewNota(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddNota()}
                placeholder="Adicionar nota..."
                className="flex-1 px-4 py-2.5 bg-white border border-[#063C20]/15 rounded-xl text-sm text-[#063C20] placeholder:text-[#063C20]/30 focus:border-[#063C20] focus:ring-2 focus:ring-[#C0D637]/30 outline-none transition-all"
              />
              <button
                onClick={handleAddNota}
                disabled={!newNota.trim()}
                className="px-4 py-2.5 bg-[#C0D637] text-[#063C20] rounded-xl text-sm font-semibold hover:bg-[#C0D637]/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#C0D637]/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            {lead.notas.length > 0 ? (
              <div className="space-y-2">
                {lead.notas.map((nota, idx) => (
                  <div key={idx} className="p-3 bg-[#C0D637]/10 border-l-2 border-[#C0D637] rounded-r-lg text-sm text-[#063C20]">
                    {nota}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#063C20]/40">Sem notas ainda</p>
            )}
          </div>

          {/* History */}
          <div className="bg-white rounded-2xl p-6 border border-[#063C20]/8">
            <h3 className="text-xs font-semibold text-[#063C20]/50 uppercase tracking-widest mb-5 pb-3 border-b border-[#063C20]/8 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" /> Histórico de Atividades
            </h3>
            <div className="space-y-4">
              {[...lead.historico].reverse().map((entry, idx) => (
                <div key={entry.id} className="flex gap-4 items-start group">
                  <div className="flex flex-col items-center">
                    <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-[#C0D637]' : 'bg-[#063C20]/20'} group-hover:bg-[#C0D637] transition-colors`} />
                    {idx < lead.historico.length - 1 && (
                      <div className="w-px flex-1 bg-[#063C20]/10 mt-1 min-h-[20px]" />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <p className="text-sm font-semibold text-[#063C20]">{entry.action}</p>
                    <p className="text-xs text-[#063C20]/60 mt-0.5">{entry.details}</p>
                    <p className="text-[10px] text-[#063C20]/40 mt-1 tabular-nums">
                      {new Date(entry.timestamp).toLocaleString('pt-PT')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Automations */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#063C20]/8">
            <h3 className="text-xs font-semibold text-[#063C20]/50 uppercase tracking-widest mb-5 pb-3 border-b border-[#063C20]/8 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-[#C0D637]" /> Automações
            </h3>
            {lead.automacoes.length > 0 ? (
              <div className="space-y-3">
                {lead.automacoes.map(auto => (
                  <div key={auto.id} className="p-3 bg-[#063C20]/3 rounded-xl border border-[#063C20]/5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-[#063C20]">{auto.rule}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                        auto.status === 'Executada' ? 'bg-[#C0D637]/20 text-[#063C20]' :
                        auto.status === 'Pendente' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {auto.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#063C20]/60">{auto.details}</p>
                    <p className="text-[10px] text-[#063C20]/40 mt-1.5 tabular-nums">
                      {new Date(auto.timestamp).toLocaleString('pt-PT')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#063C20]/40">Nenhuma automação executada</p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 border border-[#063C20]/8">
            <h3 className="text-xs font-semibold text-[#063C20]/50 uppercase tracking-widest mb-5 pb-3 border-b border-[#063C20]/8">
              Ações Rápidas
            </h3>
            <div className="space-y-2">
              {PIPELINE_STAGES.filter(s => s !== lead.pipelineStage && s !== 'Perdido').map(stage => (
                <button
                  key={stage}
                  onClick={() => handleStageChange(stage)}
                  className="w-full text-left px-3 py-2.5 text-xs rounded-xl hover:bg-[#C0D637]/10 border border-[#063C20]/8 flex items-center gap-2 transition-colors group"
                >
                  <div className={`w-2 h-2 rounded-full ${STAGE_COLORS[stage]}`} />
                  <span className="text-[#063C20]/70 group-hover:text-[#063C20] font-medium">Mover para: {stage}</span>
                </button>
              ))}
              {lead.pipelineStage !== 'Perdido' && (
                <button
                  onClick={() => handleStageChange('Perdido')}
                  className="w-full text-left px-3 py-2.5 text-xs rounded-xl hover:bg-red-50 border border-[#063C20]/8 text-[#063C20]/70 hover:text-red-700 flex items-center gap-2 transition-colors mt-3 pt-3 border-t border-[#063C20]/8"
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span className="font-medium">Marcar como Perdido</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
