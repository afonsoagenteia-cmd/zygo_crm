import { useCRM } from '../context/CRMContext';
import { PIPELINE_STAGES, STAGE_COLORS } from '../data';
import { TrendingUp, Users, AlertTriangle, CheckCircle, Clock, Target, ArrowUpRight, Eye } from 'lucide-react';

interface DashboardProps {
  onSelectLead?: (leadId: string) => void;
}

export default function Dashboard({ onSelectLead }: DashboardProps) {
  const { leads, slaAlerts } = useCRM();

  const totalLeads = leads.length;
  const leadsGanhos = leads.filter(l => l.pipelineStage === 'Ganho').length;
  const leadsPerdidos = leads.filter(l => l.pipelineStage === 'Perdido').length;
  const leadsAtivos = leads.filter(l => l.pipelineStage !== 'Ganho' && l.pipelineStage !== 'Perdido').length;
  const taxaConversao = totalLeads > 0 ? ((leadsGanhos / totalLeads) * 100).toFixed(1) : '0';
  const leadsNovosHoje = leads.filter(l => {
    const today = new Date().toDateString();
    return new Date(l.dataEntrada).toDateString() === today;
  }).length;

  const stageCounts = PIPELINE_STAGES.map(stage => ({
    stage,
    count: leads.filter(l => l.pipelineStage === stage).length,
  }));

  const origemCounts = leads.reduce((acc, lead) => {
    acc[lead.origem] = (acc[lead.origem] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recentLeads = [...leads].sort((a, b) => new Date(b.dataEntrada).getTime() - new Date(a.dataEntrada).getTime()).slice(0, 5);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#063C20]/50 font-medium mb-2">Visão geral</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#063C20] tracking-tight">Dashboard</h2>
          <p className="text-[#063C20]/60 text-sm mt-2">
            {new Date().toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#063C20]/8 hover:shadow-lg hover:shadow-[#063C20]/5 group">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#063C20]/5 flex items-center justify-center">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#063C20]" />
            </div>
            {leadsNovosHoje > 0 && (
              <span className="text-[9px] sm:text-[10px] font-semibold bg-[#C0D637]/30 text-[#063C20] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center gap-1">
                <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />+{leadsNovosHoje}
              </span>
            )}
          </div>
          <p className="text-[10px] sm:text-xs text-[#063C20]/50 uppercase tracking-wider font-medium">Total Leads</p>
          <p className="font-display text-2xl sm:text-4xl font-bold text-[#063C20] mt-1 tracking-tight">{totalLeads}</p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#063C20]/8 hover:shadow-lg hover:shadow-[#063C20]/5">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#063C20]/5 flex items-center justify-center">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-[#063C20]" />
            </div>
          </div>
          <p className="text-[10px] sm:text-xs text-[#063C20]/50 uppercase tracking-wider font-medium">Leads Ativos</p>
          <p className="font-display text-2xl sm:text-4xl font-bold text-[#063C20] mt-1 tracking-tight">{leadsAtivos}</p>
          <p className="text-[10px] sm:text-xs text-[#063C20]/50 mt-1 hidden sm:block">Em progresso no funil</p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#063C20]/8 hover:shadow-lg hover:shadow-[#063C20]/5">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#C0D637]/20 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#063C20]" />
            </div>
          </div>
          <p className="text-[10px] sm:text-xs text-[#063C20]/50 uppercase tracking-wider font-medium">Conversão</p>
          <p className="font-display text-2xl sm:text-4xl font-bold text-[#063C20] mt-1 tracking-tight">{taxaConversao}<span className="text-lg sm:text-2xl">%</span></p>
          <p className="text-[10px] sm:text-xs text-[#063C20]/50 mt-1 hidden sm:block">{leadsGanhos} ganhos · {leadsPerdidos} perdidos</p>
        </div>

        <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${slaAlerts.length > 0 ? 'bg-[#063C20] border-[#063C20] text-white' : 'bg-white border-[#063C20]/8'}`}>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center ${slaAlerts.length > 0 ? 'bg-[#C0D637]' : 'bg-[#C0D637]/20'}`}>
              <AlertTriangle className={`w-4 h-4 sm:w-5 sm:h-5 ${slaAlerts.length > 0 ? 'text-[#063C20]' : 'text-[#063C20]'}`} />
            </div>
          </div>
          <p className={`text-[10px] sm:text-xs uppercase tracking-wider font-medium ${slaAlerts.length > 0 ? 'text-white/60' : 'text-[#063C20]/50'}`}>Alertas SLA</p>
          <p className={`font-display text-2xl sm:text-4xl font-bold mt-1 tracking-tight ${slaAlerts.length > 0 ? 'text-[#C0D637]' : 'text-[#063C20]'}`}>{slaAlerts.length}</p>
          <p className={`text-[10px] sm:text-xs mt-1 ${slaAlerts.length > 0 ? 'text-white/60' : 'text-[#063C20]/50'}`}>
            {slaAlerts.length > 0 ? 'Requer atenção' : 'Tudo em dia'}
          </p>
        </div>
      </div>

      {/* SLA Alerts */}
      {slaAlerts.length > 0 && (
        <div className="bg-[#063C20] rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-[#C0D637] rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-4 h-4 text-[#063C20]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Regra 2 · SLA Quebrado</h3>
              <p className="text-xs text-white/60">Leads em "Novo Lead" há mais de 24h</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {slaAlerts.map(alert => (
              <div key={alert.leadId} className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{alert.leadName}</p>
                  <p className="text-xs text-white/50">Sem contacto</p>
                </div>
                <span className="text-xs text-[#C0D637] font-semibold flex items-center gap-1 flex-shrink-0 ml-2">
                  <Clock className="w-3 h-3" />
                  {alert.hoursSinceEntry}h
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#C0D637] mt-4 flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-[#C0D637]" />
            CMO notificado automaticamente
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Pipeline Distribution */}
        <div className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#063C20]/8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 sm:mb-6">
            <h3 className="font-display text-base sm:text-lg font-semibold text-[#063C20]">Pipeline</h3>
            <span className="text-xs text-[#063C20]/50">Distribuição por etapa</span>
          </div>
          <div className="space-y-3">
            {stageCounts.map(({ stage, count }) => (
              <div key={stage} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${STAGE_COLORS[stage]}`} />
                <span className="text-xs text-[#063C20]/70 flex-1 truncate">{stage}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-1.5 bg-[#063C20]/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${STAGE_COLORS[stage]}`}
                      style={{ width: `${totalLeads > 0 ? (count / totalLeads) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-[#063C20] w-6 text-right tabular-nums">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Origem */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#063C20]/8">
          <h3 className="font-display text-base sm:text-lg font-semibold text-[#063C20] mb-4 sm:mb-6">Origem</h3>
          <div className="space-y-3 mb-8">
            {Object.entries(origemCounts).map(([origem, count]) => (
              <div key={origem} className="flex items-center justify-between">
                <span className="text-sm text-[#063C20]/70">{origem}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-[#063C20]/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C0D637] rounded-full"
                      style={{ width: `${(count / totalLeads) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-[#063C20] w-5 text-right tabular-nums">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-[#063C20]/8 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-[#063C20]/8 flex items-center justify-between">
          <h3 className="font-display text-base sm:text-lg font-semibold text-[#063C20]">Leads Recentes</h3>
          <span className="text-xs text-[#063C20]/50 hidden sm:block">Últimas entradas</span>
        </div>
        
        {/* Mobile: Card view */}
        <div className="sm:hidden divide-y divide-[#063C20]/5">
          {recentLeads.map(lead => (
            <div
              key={lead.id}
              onClick={() => onSelectLead?.(lead.id)}
              className="p-4 hover:bg-[#C0D637]/5 cursor-pointer active:bg-[#C0D637]/10"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#063C20] truncate">{lead.nomeCompleto}</p>
                  <p className="text-xs text-[#063C20]/60 truncate mt-0.5">{lead.empresa}</p>
                </div>
                <span className={`text-[10px] text-white px-2 py-0.5 rounded-md font-medium flex-shrink-0 ${STAGE_COLORS[lead.pipelineStage]}`}>
                  {lead.pipelineStage}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className="text-[10px] bg-[#063C20]/5 text-[#063C20] px-2 py-0.5 rounded">{lead.origem}</span>
                <span className="text-[10px] text-[#063C20]/50">{lead.proprietario}</span>
                <span className="text-[10px] text-[#063C20]/40 tabular-nums ml-auto">
                  {new Date(lead.dataEntrada).toLocaleDateString('pt-PT')}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Table view */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-[#063C20]/50 border-b border-[#063C20]/5">
                <th className="px-6 py-3 font-semibold">Nome</th>
                <th className="px-6 py-3 font-semibold">Empresa</th>
                <th className="px-6 py-3 font-semibold">Origem</th>
                <th className="px-6 py-3 font-semibold">Etapa</th>
                <th className="px-6 py-3 font-semibold">Proprietário</th>
                <th className="px-6 py-3 font-semibold">Data</th>
                <th className="px-6 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#063C20]/5">
              {recentLeads.map(lead => (
                <tr
                  key={lead.id}
                  onClick={() => onSelectLead?.(lead.id)}
                  className="hover:bg-[#C0D637]/5 cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm font-medium text-[#063C20]">{lead.nomeCompleto}</td>
                  <td className="px-6 py-4 text-sm text-[#063C20]/60">{lead.empresa}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-[#063C20]/5 text-[#063C20] px-2 py-1 rounded-md">{lead.origem}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs text-white px-2 py-1 rounded-md ${STAGE_COLORS[lead.pipelineStage]}`}>
                      {lead.pipelineStage}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#063C20]/70">{lead.proprietario}</td>
                  <td className="px-6 py-4 text-xs text-[#063C20]/50 tabular-nums">
                    {new Date(lead.dataEntrada).toLocaleDateString('pt-PT')}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectLead?.(lead.id);
                      }}
                      className="p-2 text-[#063C20]/40 hover:text-[#063C20] hover:bg-[#C0D637]/20 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
