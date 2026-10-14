import { useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import type { Lead, LeadOrigin, LeadUpdate, Owner, ServiceInterest } from '../types';

interface EditLeadModalProps {
  lead: Lead;
  onClose: () => void;
  onSave: (data: LeadUpdate) => Promise<void>;
}

const origins: LeadOrigin[] = ['Website', 'LinkedIn', 'Instagram', 'Facebook', 'Evento', 'Indicação', 'Google Ads'];
const services: ServiceInterest[] = ['O MeuCatálogo', 'Última milha', 'Interprovincial', 'Armazém', 'Outros'];
const owners: Owner[] = ['Content Specialist', 'Customer Success', 'CMO'];

export default function EditLeadModal({ lead, onClose, onSave }: EditLeadModalProps) {
  const [form, setForm] = useState<LeadUpdate>({
    nomeCompleto: lead.nomeCompleto,
    empresa: lead.empresa,
    email: lead.email,
    telefone: lead.telefone,
    origem: lead.origem,
    servicoInteresse: lead.servicoInteresse,
    proprietario: lead.proprietario,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const inputClass = 'w-full px-3 py-2.5 bg-white border border-[#063C20]/15 rounded-xl text-sm text-[#063C20] focus:border-[#063C20] focus:ring-2 focus:ring-[#C0D637]/30 outline-none';
  const labelClass = 'text-xs font-semibold text-[#063C20]/70 mb-1.5 block';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave(form);
      onClose();
    } catch {
      setError('Não foi possível salvar as alterações. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#063C20]/50 p-4 flex items-center justify-center" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-5 sm:p-7 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#063C20]/50 font-medium">Cadastro do lead</p>
            <h2 className="font-display text-2xl font-bold text-[#063C20] mt-1">Editar lead</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar" className="p-2 rounded-lg hover:bg-[#063C20]/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="sm:col-span-2"><span className={labelClass}>Nome completo</span><input required value={form.nomeCompleto} onChange={event => setForm({ ...form, nomeCompleto: event.target.value })} className={inputClass} /></label>
          <label><span className={labelClass}>Empresa</span><input required value={form.empresa} onChange={event => setForm({ ...form, empresa: event.target.value })} className={inputClass} /></label>
          <label><span className={labelClass}>Email</span><input required type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} className={inputClass} /></label>
          <label><span className={labelClass}>Telefone</span><input required type="tel" value={form.telefone} onChange={event => setForm({ ...form, telefone: event.target.value })} className={inputClass} /></label>
          <label><span className={labelClass}>Origem</span><select value={form.origem} onChange={event => setForm({ ...form, origem: event.target.value as LeadOrigin })} className={inputClass}>{origins.map(origin => <option key={origin}>{origin}</option>)}</select></label>
          <label><span className={labelClass}>Serviço de interesse</span><select value={form.servicoInteresse} onChange={event => setForm({ ...form, servicoInteresse: event.target.value as ServiceInterest })} className={inputClass}>{services.map(service => <option key={service}>{service}</option>)}</select></label>
          <label><span className={labelClass}>Proprietário</span><select value={form.proprietario} onChange={event => setForm({ ...form, proprietario: event.target.value as Owner })} className={inputClass}>{owners.map(owner => <option key={owner}>{owner}</option>)}</select></label>
        </div>

        {error && <p role="alert" className="text-sm text-red-700 bg-red-50 rounded-lg p-3">{error}</p>}
        <div className="flex justify-end gap-3 pt-3 border-t border-[#063C20]/8">
          <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm font-medium text-[#063C20]/70 bg-[#063C20]/5 rounded-xl hover:bg-[#063C20]/10">Cancelar</button>
          <button type="submit" disabled={saving} className="px-5 py-2.5 text-sm font-semibold text-[#063C20] bg-[#C0D637] rounded-xl hover:bg-[#C0D637]/90 disabled:opacity-60">{saving ? 'Salvando...' : 'Salvar alterações'}</button>
        </div>
      </form>
    </div>
  );
}
