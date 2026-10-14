import { useCRM } from '../context/CRMContext';
import { PIPELINE_STAGES, STAGE_COLORS } from '../data';
import { TrendingUp, Users, AlertTriangle, CheckCircle, XCircle, Clock, DollarSign, Target } from 'lucide-react';

export default function Dashboard() {
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

  const budgetCounts = leads.reduce((acc, lead) => {
    acc[lead.budget] = (acc[lead.budget] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recentLeads = [...leads].sort((a, b) => new Date(b.dataEntrada).getTime() - new Date(a.dataEntrada).getTime()).slice(0, 5);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-500 text-sm">Visão geral do pipeline de vendas</p>
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('pt-PT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total de Leads</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalLeads}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +{leadsNovosHoje} hoje
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Leads Ativos</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{leadsAtivos}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Em progresso no funil</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Taxa de Conversão</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{taxaConversao}%</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">{leadsGanhos} ganhos / {leadsPerdidos} perdidos</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Alertas SLA</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{slaAlerts.length}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${slaAlerts.length > 0 ? 'bg-red-100' : 'bg-green-100'}`}>
              {slaAlerts.length > 0 ? (
                <AlertTriangle className="w-6 h-6 text-red-600" />
              ) : (
                <CheckCircle className="w-6 h-6 text-green-600" />
              )}
            </div>
          </div>
          <p className={`text-xs mt-2 ${slaAlerts.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {slaAlerts.length > 0 ? 'SLA quebrado (>24h)' : 'Tudo em dia ✓'}
          </p>
        </div>
      </div>

      {/* SLA Alerts */}
      {slaAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-red-800 flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4" />
            Regra 2: Alertas SLA Quebrado — Leads em "Novo Lead" há mais de 24h
          </h3>
          <div className="space-y-2">
            {slaAlerts.map(alert => (
              <div key={alert.leadId} className="flex items-center justify-between bg-white rounded-lg p-3 border border-red-100">
                <span className="text-sm font-medium text-gray-900">{alert.leadName}</span>
                <span className="text-xs text-red-600 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {alert.hoursSinceEntry}h sem contacto
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-red-600 mt-2">→ Sales Manager e CMO notificados automaticamente</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Distribuição no Pipeline</h3>
          <div className="space-y-3">
            {stageCounts.map(({ stage, count }) => (
              <div key={stage} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${STAGE_COLORS[stage]}`} />
                <span className="text-xs text-gray-600 flex-1 truncate">{stage}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${STAGE_COLORS[stage]}`}
                      style={{ width: `${totalLeads > 0 ? (count / totalLeads) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-900 w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Origem dos Leads */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Origem dos Leads</h3>
          <div className="space-y-3">
            {Object.entries(origemCounts).map(([origem, count]) => (
              <div key={origem} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{origem}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${(count / totalLeads) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-900 w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-sm font-semibold text-gray-900 mt-6 mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> Budget Estimado
          </h3>
          <div className="space-y-3">
            {Object.entries(budgetCounts).map(([budget, count]) => (
              <div key={budget} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{budget}</span>
                <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded">{count} leads</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Leads Recentes</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b">
                <th className="pb-3 font-medium">Nome</th>
                <th className="pb-3 font-medium">Empresa</th>
                <th className="pb-3 font-medium">Origem</th>
                <th className="pb-3 font-medium">Etapa</th>
                <th className="pb-3 font-medium">Proprietário</th>
                <th className="pb-3 font-medium">Data Entrada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentLeads.map(lead => (
                <tr key={lead.id} className="text-sm hover:bg-gray-50">
                  <td className="py-3 font-medium text-gray-900">{lead.nomeCompleto}</td>
                  <td className="py-3 text-gray-600">{lead.empresa}</td>
                  <td className="py-3">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{lead.origem}</span>
                  </td>
                  <td className="py-3">
                    <span className={`text-xs text-white px-2 py-1 rounded ${STAGE_COLORS[lead.pipelineStage]}`}>
                      {lead.pipelineStage}
                    </span>
                  </td>
                  <td className="py-3 text-gray-600">{lead.proprietario}</td>
                  <td className="py-3 text-gray-500 text-xs">
                    {new Date(lead.dataEntrada).toLocaleDateString('pt-PT')}
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
