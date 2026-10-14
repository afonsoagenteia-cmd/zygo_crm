import { useState } from 'react';
import { AUTOMATION_RULES } from '../data';
import { useCRM } from '../context/CRMContext';
import { Zap, CheckCircle, Clock, AlertCircle, Bell } from 'lucide-react';

export default function Automations() {
  const { leads, slaAlerts } = useCRM();
  const [rules, setRules] = useState(AUTOMATION_RULES);
  const [showSimulate, setShowSimulate] = useState<string | null>(null);

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, active: !r.active } : r));
  };

  const totalAutomations = leads.reduce((acc, lead) => acc + lead.automacoes.length, 0);
  const successfulAutomations = leads.reduce((acc, lead) => 
    acc + lead.automacoes.filter(a => a.status === 'Executada').length, 0
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-[1600px] mx-auto">
      <div>
        <p className="text-xs uppercase tracking-widest text-[#063C20]/50 font-medium mb-2">Sistema</p>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#063C20] tracking-tight flex items-center gap-3">
          Automações
          <span className="w-2 h-2 rounded-full bg-[#C0D637] animate-pulse" />
        </h2>
        <p className="text-[#063C20]/60 text-sm mt-2">Regras automáticas do sistema</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#063C20]/8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#063C20] rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-[#C0D637]" />
            </div>
            <div>
              <p className="font-display text-2xl sm:text-3xl font-bold text-[#063C20] tracking-tight">{totalAutomations}</p>
              <p className="text-[10px] sm:text-xs text-[#063C20]/50 uppercase tracking-wider font-medium mt-0.5">Total Executadas</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#063C20]/8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#C0D637] rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#063C20]" />
            </div>
            <div>
              <p className="font-display text-2xl sm:text-3xl font-bold text-[#063C20] tracking-tight">{successfulAutomations}</p>
              <p className="text-[10px] sm:text-xs text-[#063C20]/50 uppercase tracking-wider font-medium mt-0.5">Com Sucesso</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#063C20]/8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${slaAlerts.length > 0 ? 'bg-[#063C20]' : 'bg-[#C0D637]/20'}`}>
              <Bell className={`w-5 h-5 sm:w-6 sm:h-6 ${slaAlerts.length > 0 ? 'text-[#C0D637]' : 'text-[#063C20]'}`} />
            </div>
            <div>
              <p className="font-display text-2xl sm:text-3xl font-bold text-[#063C20] tracking-tight">{slaAlerts.length}</p>
              <p className="text-[10px] sm:text-xs text-[#063C20]/50 uppercase tracking-wider font-medium mt-0.5">Alertas SLA</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rules */}
      <div className="space-y-3 sm:space-y-4">
        {rules.map(rule => (
          <div key={rule.id} className="bg-white rounded-xl sm:rounded-2xl border border-[#063C20]/8 overflow-hidden">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3 sm:gap-4 flex-1">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${rule.active ? 'bg-[#063C20]' : 'bg-[#063C20]/5'}`}>
                    <Zap className={`w-4 h-4 sm:w-5 sm:h-5 ${rule.active ? 'text-[#C0D637]' : 'text-[#063C20]/30'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 mb-1 flex-wrap">
                      <h3 className="font-display text-base sm:text-lg font-semibold text-[#063C20]">{rule.name}</h3>
                      {rule.active && (
                        <span className="text-[9px] sm:text-[10px] font-semibold bg-[#C0D637]/20 text-[#063C20] px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Ativa
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-[#063C20]/60 mb-3 sm:mb-4">{rule.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      <div className="bg-[#063C20]/3 rounded-lg p-2.5 sm:p-3">
                        <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#063C20]/50 font-semibold mb-1">Trigger</p>
                        <p className="text-[11px] sm:text-xs text-[#063C20]">{rule.trigger}</p>
                      </div>
                      <div className="bg-[#C0D637]/10 rounded-lg p-2.5 sm:p-3">
                        <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#063C20]/50 font-semibold mb-1">Ação</p>
                        <p className="text-[11px] sm:text-xs text-[#063C20]">{rule.action}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleRule(rule.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    rule.active
                      ? 'bg-[#063C20] text-[#C0D637] hover:bg-[#063C20]/90'
                      : 'bg-[#063C20]/5 text-[#063C20]/50 hover:bg-[#063C20]/10'
                  }`}
                >
                  <div className={`w-8 h-4 rounded-full relative transition-colors ${rule.active ? 'bg-[#C0D637]' : 'bg-[#063C20]/20'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 rounded-full transition-all ${rule.active ? 'left-4 bg-[#063C20]' : 'left-0.5 bg-[#063C20]/40'}`} />
                  </div>
                </button>
              </div>
            </div>

            {/* Execution Log Preview */}
            {rule.active && (
              <div className="border-t border-[#063C20]/5 bg-[#063C20]/2 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#063C20]/40" />
                    <span className="text-xs text-[#063C20]/60">
                      {rule.id === 'rule-1' && `${leads.length} leads receberam boas-vindas automáticas`}
                      {rule.id === 'rule-2' && `${slaAlerts.length} alerta(s) SLA ativo(s)`}
                      {rule.id === 'rule-3' && `${leads.filter(l => l.pipelineStage === 'Ganho').length} handovers realizados`}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowSimulate(showSimulate === rule.id ? null : rule.id)}
                    className="text-xs text-[#063C20] hover:text-[#063C20]/70 font-semibold"
                  >
                    {showSimulate === rule.id ? 'Fechar' : 'Simular →'}
                  </button>
                </div>
                {showSimulate === rule.id && (
                  <div className="mt-4 p-4 bg-white rounded-xl border border-[#063C20]/8">
                    <p className="text-[10px] font-semibold text-[#063C20]/50 uppercase tracking-wider mb-3">Simulação</p>
                    <div className="space-y-2">
                      {rule.id === 'rule-1' && leads.slice(0, 3).map(l => (
                        <div key={l.id} className="flex items-center gap-3 text-xs">
                          <CheckCircle className="w-3.5 h-3.5 text-[#C0D637]" />
                          <span className="text-[#063C20]/70">Email enviado para <strong className="text-[#063C20]">{l.email}</strong></span>
                          <span className="text-[#063C20]/40">→</span>
                          <span className="text-[#063C20]/60">{l.proprietario} notificado</span>
                        </div>
                      ))}
                      {rule.id === 'rule-2' && (
                        slaAlerts.length > 0 ? slaAlerts.map(a => (
                          <div key={a.leadId} className="flex items-center gap-3 text-xs">
                            <AlertCircle className="w-3.5 h-3.5 text-[#063C20]" />
                            <span className="text-[#063C20]/70"><strong className="text-[#063C20]">{a.leadName}</strong> — {a.hoursSinceEntry}h sem contacto</span>
                            <span className="text-[#063C20]/40">→</span>
                            <span className="text-[#063C20]/60">CMO notificado</span>
                          </div>
                        )) : (
                          <p className="text-xs text-[#063C20]/60 flex items-center gap-2">
                            <CheckCircle className="w-3.5 h-3.5 text-[#C0D637]" /> Nenhum lead com SLA quebrado
                          </p>
                        )
                      )}
                      {rule.id === 'rule-3' && leads.filter(l => l.pipelineStage === 'Ganho').map(l => (
                        <div key={l.id} className="flex items-center gap-3 text-xs">
                          <CheckCircle className="w-3.5 h-3.5 text-[#C0D637]" />
                          <span className="text-[#063C20]/70">Handover criado para <strong className="text-[#063C20]">{l.empresa}</strong></span>
                          <span className="text-[#063C20]/40">→</span>
                          <span className="text-[#063C20]/60">Email boas-vindas Cliente enviado</span>
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
      <div className="bg-[#063C20] rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-white">
        <h3 className="font-display text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
          <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-[#C0D637]" />
          Fluxo de Automação
        </h3>
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
          <div className="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-white/10 border border-white/20 rounded-lg text-[10px] sm:text-xs font-medium">
            Novo Lead
          </div>
          <div className="text-[#C0D637] text-xs sm:text-sm">→</div>
          <div className="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-[#C0D637] text-[#063C20] rounded-lg text-[10px] sm:text-xs font-semibold">
            📧 Email
          </div>
          <div className="text-[#C0D637] text-xs sm:text-sm">→</div>
          <div className="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-white/10 border border-white/20 rounded-lg text-[10px] sm:text-xs font-medium">
            Qualificação
          </div>
          <div className="text-[#C0D637] text-xs sm:text-sm">→</div>
          <div className="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-white/10 border border-white/20 rounded-lg text-[10px] sm:text-xs font-medium hidden sm:block">
            Reunião
          </div>
          <div className="text-[#C0D637] text-xs sm:text-sm hidden sm:block">→</div>
          <div className="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-white/10 border border-white/20 rounded-lg text-[10px] sm:text-xs font-medium hidden sm:block">
            Proposta
          </div>
          <div className="text-[#C0D637] text-xs sm:text-sm hidden sm:block">→</div>
          <div className="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-[#C0D637] text-[#063C20] rounded-lg text-[10px] sm:text-xs font-semibold">
            ✅ Ganho
          </div>
        </div>
        <div className="mt-4 sm:mt-6 flex items-center justify-center">
          <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 border border-[#C0D637]/30 rounded-lg text-[10px] sm:text-xs font-medium text-[#C0D637] flex items-center gap-2">
            <AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            24h sem contacto → Alerta SLA (CMO)
          </div>
        </div>
      </div>
    </div>
  );
}
