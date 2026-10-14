import { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { STAGE_COLORS } from '../data';
import { Search, Eye, Download } from 'lucide-react';

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

  const exportLeads = () => {
    const columns: { label: string; value: (lead: typeof leads[number]) => string }[] = [
      { label: 'ID', value: lead => lead.id },
      { label: 'Nome completo', value: lead => lead.nomeCompleto },
      { label: 'Empresa', value: lead => lead.empresa },
      { label: 'Email', value: lead => lead.email },
      { label: 'Telefone', value: lead => lead.telefone },
      { label: 'Origem', value: lead => lead.origem },
      { label: 'Serviço de interesse', value: lead => lead.servicoInteresse },
      { label: 'Data de entrada', value: lead => new Date(lead.dataEntrada).toLocaleString('pt-BR') },
      { label: 'Proprietário', value: lead => lead.proprietario },
      { label: 'Etapa', value: lead => lead.pipelineStage },
      { label: 'Motivo da perda', value: lead => lead.motivoPerda || '' },
      { label: 'Notas', value: lead => lead.notas.join(' | ') },
    ];
    const escapeCsv = (value: string) => {
      const safeValue = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
      return `"${safeValue.replace(/"/g, '""')}"`;
    };
    const csv = [
      columns.map(column => escapeCsv(column.label)).join(';'),
      ...filteredLeads.map(lead => columns.map(column => escapeCsv(column.value(lead))).join(';')),
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads-zygo-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const selectClass = "px-4 py-2.5 bg-white border border-[#063C20]/15 rounded-xl text-sm text-[#063C20] focus:border-[#063C20] focus:ring-2 focus:ring-[#C0D637]/30 outline-none transition-all";

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#063C20]/50 font-medium mb-2">Base de dados</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#063C20] tracking-tight">Leads</h2>
          <p className="text-[#063C20]/60 text-sm mt-2">{leads.length} leads registados no sistema</p>
        </div>
        <button
          type="button"
          onClick={exportLeads}
          disabled={filteredLeads.length === 0}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#063C20] text-white rounded-xl text-sm font-semibold hover:bg-[#0B5C33] disabled:opacity-40 disabled:cursor-not-allowed"
          title="Baixar os leads que correspondem aos filtros"
        >
          <Download className="w-4 h-4" />
          Baixar CSV ({filteredLeads.length})
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-[#063C20]/8 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:flex-1 sm:min-w-[200px]">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#063C20]/40" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Pesquisar..."
              className="w-full pl-10 sm:pl-11 pr-4 py-2.5 bg-white border border-[#063C20]/15 rounded-xl text-sm text-[#063C20] placeholder:text-[#063C20]/30 focus:border-[#063C20] focus:ring-2 focus:ring-[#C0D637]/30 outline-none transition-all"
            />
          </div>
          <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3">
            <select
              value={filterStage}
              onChange={e => setFilterStage(e.target.value)}
              className={selectClass + " text-xs sm:text-sm py-2 sm:py-2.5"}
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
              className={selectClass + " text-xs sm:text-sm py-2 sm:py-2.5"}
            >
              <option value="">Todas origens</option>
              <option value="Website">Website</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="Evento">Evento</option>
              <option value="Indicação">Indicação</option>
              <option value="Google Ads">Google Ads</option>
            </select>
            <select
              value={filterProprietario}
              onChange={e => setFilterProprietario(e.target.value)}
              className={selectClass + " text-xs sm:text-sm py-2 sm:py-2.5 col-span-2 sm:col-span-1"}
            >
              <option value="">Todos proprietários</option>
              <option value="Content Specialist">Content Specialist</option>
              <option value="Customer Success">Customer Success</option>
              <option value="CMO">CMO</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mobile: Card view */}
      <div className="sm:hidden space-y-3">
        {filteredLeads.map(lead => (
          <div
            key={lead.id}
            onClick={() => onSelectLead(lead.id)}
            className="bg-white rounded-xl border border-[#063C20]/8 p-4 active:bg-[#C0D637]/5"
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
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-[10px] bg-[#063C20]/5 text-[#063C20] px-2 py-0.5 rounded">{lead.origem}</span>
              <span className="text-[10px] text-[#063C20]/60">{lead.servicoInteresse}</span>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#063C20]/5">
              <span className="text-[10px] text-[#063C20]/50">{lead.proprietario}</span>
              <span className="text-[10px] text-[#063C20]/40 tabular-nums">
                {new Date(lead.dataEntrada).toLocaleDateString('pt-PT')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: Table */}
      <div className="hidden sm:block bg-white rounded-2xl border border-[#063C20]/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] text-[#063C20]/50 uppercase tracking-widest border-b border-[#063C20]/8">
                <th className="px-4 lg:px-6 py-4 font-semibold">Nome / Empresa</th>
                <th className="px-4 lg:px-6 py-4 font-semibold">Contacto</th>
                <th className="px-4 lg:px-6 py-4 font-semibold">Origem</th>
                <th className="px-4 lg:px-6 py-4 font-semibold">Serviço</th>
                <th className="px-4 lg:px-6 py-4 font-semibold">Etapa</th>
                <th className="px-4 lg:px-6 py-4 font-semibold">Proprietário</th>
                <th className="px-4 lg:px-6 py-4 font-semibold">Data</th>
                <th className="px-4 lg:px-6 py-4 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#063C20]/5">
              {filteredLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-[#C0D637]/5 group">
                  <td className="px-4 lg:px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-[#063C20]">{lead.nomeCompleto}</p>
                      <p className="text-xs text-[#063C20]/50 mt-0.5">{lead.empresa}</p>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <p className="text-xs text-[#063C20]/70 truncate max-w-[180px]">{lead.email}</p>
                    <p className="text-xs text-[#063C20]/40 mt-0.5">{lead.telefone}</p>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <span className="text-xs bg-[#063C20]/5 text-[#063C20] px-2.5 py-1 rounded-md font-medium">{lead.origem}</span>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <span className="text-xs text-[#063C20]/70">{lead.servicoInteresse}</span>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <span className={`text-xs text-white px-2.5 py-1 rounded-md font-medium ${STAGE_COLORS[lead.pipelineStage]}`}>
                      {lead.pipelineStage}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <span className="text-xs text-[#063C20]/70 font-medium">{lead.proprietario}</span>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <span className="text-xs text-[#063C20]/50 tabular-nums">
                      {new Date(lead.dataEntrada).toLocaleDateString('pt-PT')}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
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
      </div>

      {filteredLeads.length === 0 && (
        <div className="text-center py-16">
          <p className="text-sm text-[#063C20]/40">Nenhum lead encontrado com os filtros aplicados</p>
        </div>
      )}
    </div>
  );
}
