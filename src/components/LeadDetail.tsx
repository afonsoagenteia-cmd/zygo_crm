import { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { PIPELINE_STAGES, STAGE_COLORS } from '../data';
import { PipelineStage } from '../types';
import { ArrowLeft, Building2, Mail, Phone, Globe, Briefcase, DollarSign, User, Calendar, ChevronRight, MessageSquare, Zap, Clock, AlertTriangle, Send } from 'lucide-react';

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
        <p className="text-gray-500">Lead não encontrado</p>
        <button onClick={onBack} className="mt-4 text-blue-600 text-sm hover:underline">← Voltar</button>
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
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">{lead.nomeCompleto}</h2>
          <p className="text-gray-500 text-sm">{lead.empresa}</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowStageDropdown(!showStageDropdown)}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg flex items-center gap-2 ${STAGE_COLORS[lead.pipelineStage]}`}
          >
            {lead.pipelineStage}
            <ChevronRight className="w-4 h-4 rotate-90" />
          </button>
          {showStageDropdown && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-2">
              {PIPELINE_STAGES.map(stage => (
                <button
                  key={stage}
                  onClick={() => handleStageChange(stage)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
                    stage === lead.pipelineStage ? 'font-semibold text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${STAGE_COLORS[stage]}`} />
                  {stage}
                  {stage === lead.pipelineStage && <span className="ml-auto text-xs">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-1">
          {PIPELINE_STAGES.filter(s => s !== 'Perdido').map((stage, idx) => (
            <div key={stage} className="flex-1 flex items-center">
              <div className={`h-2 flex-1 rounded-full ${
                idx <= currentStageIndex && lead.pipelineStage !== 'Perdido'
                  ? STAGE_COLORS[stage]
                  : 'bg-gray-200'
              }`} />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-500">Entrada</span>
          <span className="text-xs text-gray-500">Fecho</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Informações do Lead</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm text-gray-900">{lead.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Telefone</p>
                  <p className="text-sm text-gray-900">{lead.telefone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Empresa</p>
                  <p className="text-sm text-gray-900">{lead.empresa}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Origem</p>
                  <p className="text-sm text-gray-900">{lead.origem}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Serviço de Interesse</p>
                  <p className="text-sm text-gray-900">{lead.servicoInteresse}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Budget Estimado</p>
                  <p className="text-sm text-gray-900">{lead.budget}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Proprietário</p>
                  <p className="text-sm text-gray-900">{lead.proprietario}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Data de Entrada</p>
                  <p className="text-sm text-gray-900">{new Date(lead.dataEntrada).toLocaleString('pt-PT')}</p>
                </div>
              </div>
            </div>
            {lead.motivoPerda && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs font-semibold text-red-700 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Motivo da Perda
                </p>
                <p className="text-sm text-red-600 mt-1">{lead.motivoPerda}</p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Notas
            </h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newNota}
                onChange={e => setNewNota(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddNota()}
                placeholder="Adicionar nota..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <button
                onClick={handleAddNota}
                disabled={!newNota.trim()}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            {lead.notas.length > 0 ? (
              <div className="space-y-2">
                {lead.notas.map((nota, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                    {nota}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Sem notas ainda</p>
            )}
          </div>

          {/* History */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Histórico de Atividades
            </h3>
            <div className="space-y-3">
              {[...lead.historico].reverse().map(entry => (
                <div key={entry.id} className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{entry.action}</p>
                    <p className="text-xs text-gray-500">{entry.details}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
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
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Automações
            </h3>
            {lead.automacoes.length > 0 ? (
              <div className="space-y-3">
                {lead.automacoes.map(auto => (
                  <div key={auto.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-gray-900">{auto.rule}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        auto.status === 'Executada' ? 'bg-green-100 text-green-700' :
                        auto.status === 'Pendente' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {auto.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{auto.details}</p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(auto.timestamp).toLocaleString('pt-PT')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Nenhuma automação executada</p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
            <div className="space-y-2">
              {PIPELINE_STAGES.filter(s => s !== lead.pipelineStage && s !== 'Perdido').map(stage => (
                <button
                  key={stage}
                  onClick={() => handleStageChange(stage)}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-gray-50 border border-gray-100 flex items-center gap-2 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full ${STAGE_COLORS[stage]}`} />
                  Mover para: {stage}
                </button>
              ))}
              {lead.pipelineStage !== 'Perdido' && (
                <button
                  onClick={() => handleStageChange('Perdido')}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-red-50 border border-red-100 text-red-600 flex items-center gap-2 transition-colors"
                >
                  <AlertTriangle className="w-3 h-3" />
                  Marcar como Perdido
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
