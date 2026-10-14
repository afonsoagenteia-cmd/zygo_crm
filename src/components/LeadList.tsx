import { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { STAGE_COLORS } from '../data';
import { Search, Eye } from 'lucide-react';

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

  const selectClass = "px-4 py-2.5 bg-white border border-[#063C20]/15 rounded-xl text-sm text-[#063C20] focus:border-[#063C20] focus:ring-2 focus:ring-[#C0D637]/30 outline-none transition-all";

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#063C20]/50 font-medium mb-2">Base de dados</p>
          <h2 className="font-display text-4xl font-bold text-[#063C20] tracking-tight">Leads</h2>
          <p className="text-[#063C20]/60 text-sm mt-2">{leads.length} leads registados no sistema</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#063C20]/8 p-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[260px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#063C20]/40" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Pesquisar por nome, empresa ou email..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#063C20]/15 rounded-xl text-sm text-[#063C20] placeholder:text-[#063C20]/30 focus:border-[#063C20] focus:ring-2 focus:ring-[#C0D637]/30 outline-none transition-all"
            />
          </div>
          <select
            value={filterStage}
            onChange={e => setFilterStage(e.target.value)}
            className={selectClass}
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
            className={selectClass}
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
            className={selectClass}
          >
            <option value="">Todos os proprietários</option>
            <option value="Content Specialist">Content Specialist</option>
            <option value="Customer Success">Customer Success</option>
            <option value="CMO">CMO</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#063C20]/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] text-[#063C20]/50 uppercase tracking-widest border-b border-[#063C20]/8">
                <th className="px-6 py-4 font-semibold">Nome / Empresa</th>
                <th className="px-6 py-4 font-semibold">Contacto</th>
                <th className="px-6 py-4 font-semibold">Origem</th>
                <th className="px-6 py-4 font-semibold">Serviço</th>
                <th className="px-6 py-4 font-semibold">Budget</th>
                <th className="px-6 py-4 font-semibold">Etapa</th>
                <th className="px-6 py-4 font-semibold">Proprietário</th>
                <th className="px-6 py-4 font-semibold">Data</th>
                <th className="px-6 py-4 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#063C20]/5">
              {filteredLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-[#C0D637]/5 group">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-[#063C20]">{lead.nomeCompleto}</p>
                      <p className="text-xs text-[#063C20]/50 mt-0.5">{lead.empresa}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-[#063C20]/70">{lead.email}</p>
                    <p className="text-xs text-[#063C20]/40 mt-0.5">{lead.telefone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-[#063C20]/5 text-[#063C20] px-2.5 py-1 rounded-md font-medium">{lead.origem}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-[#063C20]/70">{lead.servicoInteresse}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold text-[#063C20] bg-[#C0D637]/20 px-2 py-1 rounded-md">{lead.budget}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs text-white px-2.5 py-1 rounded-md font-medium ${STAGE_COLORS[lead.pipelineStage]}`}>
                      {lead.pipelineStage}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-[#063C20]/70 font-medium">{lead.proprietario}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-[#063C20]/50 tabular-nums">
                      {new Date(lead.dataEntrada).toLocaleDateString('pt-PT')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onSelectLead(lead.id)}
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
        {filteredLeads.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm text-[#063C20]/40">Nenhum lead encontrado com os filtros aplicados</p>
          </div>
        )}
      </div>
    </div>
  );
}
