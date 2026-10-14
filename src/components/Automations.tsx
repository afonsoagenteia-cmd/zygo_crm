import { useState } from 'react';
import { AUTOMATION_RULES } from '../data';
import { useCRM } from '../context/CRMContext';
import { Zap, ToggleLeft, ToggleRight, CheckCircle, Clock, AlertCircle, Play, Pause, Bell } from 'lucide-react';

export default function Automations() {
  const { leads, slaAlerts } = useCRM();
  const [rules, setRules] = useState(AUTOMATION_RULES);
  const [showSimulate, setShowSimulate] = useState<string | null>(null);

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, active: !r.active } : r));
  };

  // Count automations executed
  const totalAutomations = leads.reduce((acc, lead) => acc + lead.automacoes.length, 0);
  const successfulAutomations = leads.reduce((acc, lead) => 
    acc + lead.automacoes.filter(a => a.status === 'Executada').length, 0
  );

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Zap className="w-6 h-6 text-amber-500" />
          Automações do CRM
        </h2>
        <p className="text-gray-500 text-sm">Configure e monitorize as regras automáticas do sistema</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalAutomations}</p>
              <p className="text-xs text-gray-500">Total Executadas</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{successfulAutomations}</p>
              <p className="text-xs text-gray-500">Com Sucesso</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${slaAlerts.length > 0 ? 'bg-red-100' : 'bg-green-100'}`}>
              <Bell className={`w-5 h-5 ${slaAlerts.length > 0 ? 'text-red-600' : 'text-green-600'}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{slaAlerts.length}</p>
              <p className="text-xs text-gray-500">Alertas SLA Ativos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rules */}
      <div className="space-y-4">
        {rules.map(rule => (
          <div key={rule.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${rule.active ? 'bg-amber-100' : 'bg-gray-100'}`}>
                    <Zap className={`w-5 h-5 ${rule.active ? 'text-amber-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{rule.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{rule.description}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1.5">
                        <Play className="w-3 h-3 text-blue-500" />
                        <span className="text-xs text-gray-600"><strong>Trigger:</strong> {rule.trigger}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                      <span className="text-xs text-gray-600"><strong>Ação:</strong> {rule.action}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleRule(rule.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    rule.active
                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {rule.active ? (
                    <>
                      <ToggleRight className="w-4 h-4" />
                      Ativa
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-4 h-4" />
                      Inativa
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Execution Log Preview */}
            {rule.active && (
              <div className="border-t border-gray-100 bg-gray-50 px-6 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {rule.id === 'rule-1' && `${leads.length} leads receberam boas-vindas automáticas`}
                      {rule.id === 'rule-2' && `${slaAlerts.length} alerta(s) SLA ativo(s)`}
                      {rule.id === 'rule-3' && `${leads.filter(l => l.pipelineStage === 'Ganho').length} handovers realizados`}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowSimulate(showSimulate === rule.id ? null : rule.id)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {showSimulate === rule.id ? 'Fechar' : 'Simular execução'}
                  </button>
                </div>
                {showSimulate === rule.id && (
                  <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                    <p className="text-xs font-medium text-gray-700 mb-2">Simulação da regra:</p>
                    <div className="space-y-1.5">
                      {rule.id === 'rule-1' && leads.slice(0, 3).map(l => (
                        <div key={l.id} className="flex items-center gap-2 text-xs">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span className="text-gray-600">Email enviado para <strong>{l.email}</strong></span>
                          <span className="text-gray-400">→ {l.proprietario} notificado</span>
                        </div>
                      ))}
                      {rule.id === 'rule-2' && (
                        slaAlerts.length > 0 ? slaAlerts.map(a => (
                          <div key={a.leadId} className="flex items-center gap-2 text-xs">
                            <AlertCircle className="w-3 h-3 text-red-500" />
                            <span className="text-gray-600"><strong>{a.leadName}</strong> — {a.hoursSinceEntry}h sem contacto</span>
                            <span className="text-gray-400">→ Sales Manager + CMO notificados</span>
                          </div>
                        )) : (
                          <p className="text-xs text-green-600 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Nenhum lead com SLA quebrado
                          </p>
                        )
                      )}
                      {rule.id === 'rule-3' && leads.filter(l => l.pipelineStage === 'Ganho').map(l => (
                        <div key={l.id} className="flex items-center gap-2 text-xs">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span className="text-gray-600">Handover criado para <strong>{l.empresa}</strong></span>
                          <span className="text-gray-400">→ Email boas-vindas Cliente enviado</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Automation Flow Diagram */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Fluxo de Automação</h3>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
            Novo Lead
          </div>
          <div className="text-gray-300">→</div>
          <div className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium">
            📧 Email + Notificação
          </div>
          <div className="text-gray-300">→</div>
          <div className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">
            Qualificação
          </div>
          <div className="text-gray-300">→</div>
          <div className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium">
            Reunião
          </div>
          <div className="text-gray-300">→</div>
          <div className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-xs font-medium">
            Proposta
          </div>
          <div className="text-gray-300">→</div>
          <div className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium">
            ✅ Ganho → Handover
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center">
          <div className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-xs font-medium flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            24h sem contacto → Alerta SLA (Manager + CMO)
          </div>
        </div>
      </div>
    </div>
  );
}
