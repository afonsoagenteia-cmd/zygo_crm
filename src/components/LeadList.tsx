import { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { STAGE_COLORS } from '../data';
import { Search, Filter, Eye, ChevronDown } from 'lucide-react';
import { PipelineStage, LeadOrigin } from '../types';

interface LeadListProps {
  onSelectLead: (leadId: string) => void;
}

export default function LeadList({ onSelectLead }: LeadListProps) {
  const { leads } = useCRM();
  const [search, setSearch] = useState('');
  const [filterStage, setFilterStage] = useState<string>('');
  const [filterOrigem, setFilterOrigem] = useState<string>('');
  const [filterProprietario, setFilterProprietario] = useState<string>('');

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = search === '' || 
      lead.nomeCompleto.toLowerCase().includes(search.toLowerCase()) ||
      lead.empresa.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase());
    const matchesStage = filterStage === '' || lead.pipelineStage === filterStage;
    const matchesOrigem = filterOrigem === '' || lead.origem === filterOrigem;
    const matchesProprietario = filterProprietario === '' || lead.proprietario === filterProprietario;
    return matchesSearch && matchesStage && matchesOrigem && matchesProprietario;
  });

  return (
    <div className="p-8 space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Lista de Leads</h2>
        <p className="text-gray-500 text-sm">{leads.length} leads registados no sistema</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Pesquisar por nome, empresa ou email..."
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={filterStage}
            onChange={e => setFilterStage(e.target.value)}
            className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Todas as etapas</option>
            <option value="Novo Lead">Novo Lead</option>
            <option value="Em Qualificação">Em Qualificação</option>
            <option value="MQL Qualificado (SQL)">MQL Qualificado</option>
            <option value="Reunião de Diagnóstico Agendada">Reunião Agendada</option>
            <option value="Proposta Comercial Enviada">Proposta Enviada</option>
            <option value="Negociação / Ajustes">Negociação</option>
            <option value="Ganho">Ganho</option>
            <option value="Perdido">Perdido</option>
          </select>
          <select
            value={filterOrigem}
            onChange={e => setFilterOrigem(e.target.value)}
            className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Todas as origens</option>
            <option value="Website">Website</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Evento">Evento</option>
            <option value="Indicação">Indicação</option>
            <option value="Google Ads">Google Ads</option>
          </select>
          <select
            value={filterProprietario}
            onChange={e => setFilterProprietario(e.target.value)}
            className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Todos os proprietários</option>
            <option value="Sales Rep">Sales Rep</option>
            <option value="Sales Manager">Sales Manager</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3 font-medium">Nome / Empresa</th>
                <th className="px-4 py-3 font-medium">Contacto</th>
                <th className="px-4 py-3 font-medium">Origem</th>
                <th className="px-4 py-3 font-medium">Serviço</th>
                <th className="px-4 py-3 font-medium">Budget</th>
                <th className="px-4 py-3 font-medium">Etapa</th>
                <th className="px-4 py-3 font-medium">Proprietário</th>
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{lead.nomeCompleto}</p>
                      <p className="text-xs text-gray-500">{lead.empresa}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-gray-700">{lead.email}</p>
                    <p className="text-xs text-gray-400">{lead.telefone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{lead.origem}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-700">{lead.servicoInteresse}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium text-gray-700">{lead.budget}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs text-white px-2 py-1 rounded ${STAGE_COLORS[lead.pipelineStage]}`}>
                      {lead.pipelineStage}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-700">{lead.proprietario}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-500">
                      {new Date(lead.dataEntrada).toLocaleDateString('pt-PT')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onSelectLead(lead.id)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredLeads.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">Nenhum lead encontrado com os filtros aplicados</p>
          </div>
        )}
      </div>
    </div>
  );
}
