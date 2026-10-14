import { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { PIPELINE_STAGES, STAGE_COLORS, STAGE_BG_COLORS } from '../data';
import { PipelineStage, Lead } from '../types';
import { GripVertical, ChevronRight, AlertTriangle, X } from 'lucide-react';

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
    <div className="p-8 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pipeline de Vendas</h2>
          <p className="text-gray-500 text-sm">Arraste os leads entre as etapas do funil</p>
        </div>
        <div className="text-sm text-gray-500">
          {leads.filter(l => l.pipelineStage !== 'Perdido' && l.pipelineStage !== 'Ganho').length} leads ativos
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4">
        {activeStages.map(stage => {
          const stageLeads = leads.filter(l => l.pipelineStage === stage);
          return (
            <div
              key={stage}
              className={`flex-shrink-0 w-64 rounded-xl border ${STAGE_BG_COLORS[stage]} p-3`}
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDrop(stage)}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-gray-700 truncate flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${STAGE_COLORS[stage]}`} />
                  {stage}
                </h3>
                <span className="text-xs font-bold bg-white/80 px-2 py-0.5 rounded-full text-gray-600">
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
                    className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical className="w-3.5 h-3.5 text-gray-300 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">{lead.nomeCompleto}</p>
                        <p className="text-xs text-gray-500 truncate">{lead.empresa}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                            {lead.budget}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {lead.proprietario}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {stageLeads.length === 0 && (
                  <div className="text-center py-6 text-xs text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                    Arraste leads aqui
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Column for Lost leads */}
        <div
          className={`flex-shrink-0 w-56 rounded-xl border ${STAGE_BG_COLORS['Perdido']} p-3`}
          onDragOver={e => e.preventDefault()}
          onDrop={() => handleDrop('Perdido')}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-gray-700 flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${STAGE_COLORS['Perdido']}`} />
              Perdido
            </h3>
            <span className="text-xs font-bold bg-white/80 px-2 py-0.5 rounded-full text-gray-600">
              {leads.filter(l => l.pipelineStage === 'Perdido').length}
            </span>
          </div>
          <div className="space-y-2 min-h-[100px]">
            {leads.filter(l => l.pipelineStage === 'Perdido').map(lead => (
              <div
                key={lead.id}
                onClick={() => onSelectLead(lead.id)}
                className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow opacity-75"
              >
                <p className="text-xs font-semibold text-gray-900 truncate">{lead.nomeCompleto}</p>
                <p className="text-xs text-gray-500 truncate">{lead.empresa}</p>
                {lead.motivoPerda && (
                  <p className="text-[10px] text-red-500 mt-1 truncate">⚠ {lead.motivoPerda}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Motivo da Perda Modal */}
      {showPerdaModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Motivo da Perda
              </h3>
              <button onClick={() => { setShowPerdaModal(null); setMotivoPerda(''); }}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Campo obrigatório para classificar o lead como "Perdido".
            </p>
            <textarea
              value={motivoPerda}
              onChange={e => setMotivoPerda(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
              rows={4}
              placeholder="Ex: Budget insuficiente, concorrência, sem resposta..."
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => { setShowPerdaModal(null); setMotivoPerda(''); }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmPerda}
                disabled={!motivoPerda.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
