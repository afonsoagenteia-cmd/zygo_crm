import { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { PIPELINE_STAGES, STAGE_COLORS, STAGE_BG_COLORS } from '../data';
import { PipelineStage } from '../types';
import { AlertTriangle, X } from 'lucide-react';

interface PipelineProps {
  onSelectLead: (leadId: string) => void;
}

export default function Pipeline({ onSelectLead }: PipelineProps) {
  const { leads, updateLeadStage } = useCRM();
  const [draggedLead, setDraggedLead] = useState<string | null>(null);
  const [showPerdaModal, setShowPerdaModal] = useState<{ leadId: string } | null>(null);
  const [motivoPerda, setMotivoPerda] = useState('');

  const handleDragStart = (leadId: string) => {
    setDraggedLead(leadId);
  };

  const handleDrop = (stage: PipelineStage) => {
    if (draggedLead && stage === 'Perdido') {
      setShowPerdaModal({ leadId: draggedLead });
      setDraggedLead(null);
      return;
    }
    if (draggedLead) {
      updateLeadStage(draggedLead, stage);
    }
    setDraggedLead(null);
  };

  const handleConfirmPerda = () => {
    if (showPerdaModal && motivoPerda.trim()) {
      updateLeadStage(showPerdaModal.leadId, 'Perdido', motivoPerda);
      setShowPerdaModal(null);
      setMotivoPerda('');
    }
  };

  const activeStages = PIPELINE_STAGES.filter(s => s !== 'Perdido');

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#063C20]/50 font-medium mb-2">Funil</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#063C20] tracking-tight">Pipeline</h2>
          <p className="text-[#063C20]/60 text-sm mt-2">Arraste os leads entre as etapas</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#063C20]/50 uppercase tracking-wider font-medium">
            {leads.filter(l => l.pipelineStage !== 'Perdido' && l.pipelineStage !== 'Ganho').length} leads ativos
          </span>
        </div>
      </div>

      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-4 -mx-2 px-2 snap-x snap-mandatory">
        {activeStages.map(stage => {
          const stageLeads = leads.filter(l => l.pipelineStage === stage);
          return (
            <div
              key={stage}
              className={`flex-shrink-0 w-[260px] sm:w-64 rounded-xl sm:rounded-2xl border ${STAGE_BG_COLORS[stage]} p-2 sm:p-3 snap-start`}
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDrop(stage)}
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3 px-1">
                <h3 className="text-[10px] sm:text-[11px] font-semibold text-[#063C20] truncate flex items-center gap-1.5 sm:gap-2 uppercase tracking-wider">
                  <div className={`w-1.5 h-1.5 rounded-full ${STAGE_COLORS[stage]}`} />
                  <span className="truncate">{stage}</span>
                </h3>
                <span className="text-[10px] font-bold bg-white/80 text-[#063C20] w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shadow-sm">
                  {stageLeads.length}
                </span>
              </div>

              <div className="space-y-2 min-h-[100px]">
                {stageLeads.map(lead => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={() => handleDragStart(lead.id)}
                    onClick={() => onSelectLead(lead.id)}
                    className="bg-white rounded-lg sm:rounded-xl p-2.5 sm:p-3 shadow-sm border border-[#063C20]/8 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-[#063C20]/20 transition-all group"
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-1 h-8 sm:h-10 rounded-full bg-[#063C20]/15 group-hover:bg-[#C0D637] transition-colors flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] sm:text-xs font-semibold text-[#063C20] truncate">{lead.nomeCompleto}</p>
                        <p className="text-[10px] sm:text-[11px] text-[#063C20]/60 truncate mt-0.5">{lead.empresa}</p>
                        <div className="flex items-center gap-2 mt-1.5 sm:mt-2">
                          <span className="text-[9px] sm:text-[10px] text-[#063C20]/50">
                            {lead.proprietario}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {stageLeads.length === 0 && (
                  <div className="text-center py-6 sm:py-8 text-[9px] sm:text-[10px] text-[#063C20]/30 border-2 border-dashed border-[#063C20]/10 rounded-lg sm:rounded-xl uppercase tracking-wider font-medium">
                    Arraste aqui
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Column for Lost leads */}
        <div
          className={`flex-shrink-0 w-[220px] sm:w-56 rounded-xl sm:rounded-2xl border ${STAGE_BG_COLORS['Perdido']} p-2 sm:p-3 snap-start`}
          onDragOver={e => e.preventDefault()}
          onDrop={() => handleDrop('Perdido')}
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3 px-1">
            <h3 className="text-[10px] sm:text-[11px] font-semibold text-[#063C20] flex items-center gap-1.5 sm:gap-2 uppercase tracking-wider">
              <div className={`w-1.5 h-1.5 rounded-full ${STAGE_COLORS['Perdido']}`} />
              Perdido
            </h3>
            <span className="text-[10px] font-bold bg-white/80 text-[#063C20] w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shadow-sm">
              {leads.filter(l => l.pipelineStage === 'Perdido').length}
            </span>
          </div>
          <div className="space-y-2 min-h-[100px]">
            {leads.filter(l => l.pipelineStage === 'Perdido').map(lead => (
              <div
                key={lead.id}
                onClick={() => onSelectLead(lead.id)}
                className="bg-white rounded-lg sm:rounded-xl p-2.5 sm:p-3 shadow-sm border border-[#063C20]/8 cursor-pointer hover:shadow-md transition-all opacity-75 hover:opacity-100"
              >
                <p className="text-[11px] sm:text-xs font-semibold text-[#063C20] truncate">{lead.nomeCompleto}</p>
                <p className="text-[10px] sm:text-[11px] text-[#063C20]/60 truncate mt-0.5">{lead.empresa}</p>
                {lead.motivoPerda && (
                  <p className="text-[9px] sm:text-[10px] text-[#063C20]/60 mt-1.5 pt-1.5 border-t border-[#063C20]/5 truncate">
                    ⚠ {lead.motivoPerda}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Motivo da Perda Modal */}
      {showPerdaModal && (
        <div className="fixed inset-0 bg-[#063C20]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#063C20]/5 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-[#063C20]" />
                </div>
                <h3 className="font-display text-xl font-bold text-[#063C20]">Motivo da Perda</h3>
              </div>
              <button onClick={() => { setShowPerdaModal(null); setMotivoPerda(''); }} className="p-1 hover:bg-[#063C20]/5 rounded-lg">
                <X className="w-5 h-5 text-[#063C20]/50" />
              </button>
            </div>
            <p className="text-sm text-[#063C20]/60 mb-5">
              Campo obrigatório para classificar o lead como "Perdido".
            </p>
            <textarea
              value={motivoPerda}
              onChange={e => setMotivoPerda(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#063C20]/15 rounded-xl text-sm text-[#063C20] placeholder:text-[#063C20]/30 focus:border-[#063C20] focus:ring-2 focus:ring-[#C0D637]/30 outline-none resize-none"
              rows={4}
              placeholder="Ex: Budget insuficiente, concorrência, sem resposta..."
              autoFocus
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => { setShowPerdaModal(null); setMotivoPerda(''); }}
                className="px-5 py-2.5 text-sm font-medium text-[#063C20]/70 bg-[#063C20]/5 rounded-xl hover:bg-[#063C20]/10"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmPerda}
                disabled={!motivoPerda.trim()}
                className="px-5 py-2.5 text-sm font-semibold text-[#063C20] bg-[#C0D637] rounded-xl hover:bg-[#C0D637]/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#C0D637]/20"
              >
                Confirmar Perda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
