import { useState, type FormEvent } from 'react';
import { useCRM } from '../context/CRMContext';
import { LeadOrigin, ServiceInterest, Budget, Owner } from '../types';
import { CheckCircle, Zap } from 'lucide-react';

export default function LeadForm() {
  const { addLead } = useCRM();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    nomeCompleto: '',
    empresa: '',
    email: '',
    telefone: '',
    origem: '' as LeadOrigin | '',
    servicoInteresse: '' as ServiceInterest | '',
    budget: '' as Budget | '',
    proprietario: '' as Owner | '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.nomeCompleto || !form.empresa || !form.email || !form.telefone || !form.origem || !form.servicoInteresse || !form.budget || !form.proprietario) return;

    addLead({
      nomeCompleto: form.nomeCompleto,
      empresa: form.empresa,
      email: form.email,
      telefone: form.telefone,
      origem: form.origem as LeadOrigin,
      servicoInteresse: form.servicoInteresse as ServiceInterest,
      budget: form.budget as Budget,
      dataEntrada: new Date().toISOString(),
      proprietario: form.proprietario as Owner,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ nomeCompleto: '', empresa: '', email: '', telefone: '', origem: '', servicoInteresse: '', budget: '', proprietario: '' });
    }, 3000);
  };

  const inputClass = "w-full px-4 py-3 bg-white border border-[#063C20]/15 rounded-xl text-sm text-[#063C20] placeholder:text-[#063C20]/30 focus:border-[#063C20] focus:ring-2 focus:ring-[#C0D637]/30 outline-none transition-all";
  const labelClass = "text-xs font-semibold text-[#063C20]/70 uppercase tracking-wider mb-2 block";

  if (submitted) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[70vh]">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 bg-[#C0D637] rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-[#C0D637]/30">
            <CheckCircle className="w-10 h-10 text-[#063C20]" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-display text-3xl font-bold text-[#063C20] tracking-tight">Lead Registado</h3>
            <p className="text-[#063C20]/60 mt-2">O lead foi adicionado ao sistema com sucesso</p>
          </div>
          <div className="bg-[#063C20] rounded-2xl p-5 text-left">
            <p className="text-xs font-semibold text-[#C0D637] mb-3 flex items-center gap-2 uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" /> Automações executadas
            </p>
            <ul className="text-sm text-white/90 space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[#C0D637]" />
                Email de boas-vindas enviado (5 min)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[#C0D637]" />
                Content Specialist notificado
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-[#063C20]/50 font-medium mb-2">Registo</p>
        <h2 className="font-display text-4xl font-bold text-[#063C20] tracking-tight">Novo Lead</h2>
        <p className="text-[#063C20]/60 text-sm mt-2">Preencha todos os campos obrigatórios para criar um novo lead</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#063C20]/8 p-8 space-y-8">
        <div>
          <h3 className="text-xs font-semibold text-[#063C20]/50 uppercase tracking-widest mb-5 pb-3 border-b border-[#063C20]/8">
            Informações de contacto
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Nome Completo</label>
              <input
                type="text"
                required
                value={form.nomeCompleto}
                onChange={e => setForm({ ...form, nomeCompleto: e.target.value })}
                className={inputClass}
                placeholder="Ex: João Silva"
              />
            </div>
            <div>
              <label className={labelClass}>Empresa</label>
              <input
                type="text"
                required
                value={form.empresa}
                onChange={e => setForm({ ...form, empresa: e.target.value })}
                className={inputClass}
                placeholder="Ex: LogiTrans Portugal"
              />
            </div>
            <div>
              <label className={labelClass}>Email Corporativo</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className={inputClass}
                placeholder="joao@empresa.pt"
              />
            </div>
            <div>
              <label className={labelClass}>Telefone</label>
              <input
                type="tel"
                required
                value={form.telefone}
                onChange={e => setForm({ ...form, telefone: e.target.value })}
                className={inputClass}
                placeholder="+351 912 345 678"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-[#063C20]/50 uppercase tracking-widest mb-5 pb-3 border-b border-[#063C20]/8">
            Qualificação
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Origem do Lead</label>
              <select
                required
                value={form.origem}
                onChange={e => setForm({ ...form, origem: e.target.value as LeadOrigin })}
                className={inputClass + " bg-white"}
              >
                <option value="">Selecionar origem...</option>
                <option value="Website">Website</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Evento">Evento</option>
                <option value="Indicação">Indicação</option>
                <option value="Google Ads">Google Ads</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Serviço de Interesse</label>
              <select
                required
                value={form.servicoInteresse}
                onChange={e => setForm({ ...form, servicoInteresse: e.target.value as ServiceInterest })}
                className={inputClass + " bg-white"}
              >
                <option value="">Selecionar serviço...</option>
                <option value="Transporte Rodoviário">Transporte Rodoviário</option>
                <option value="Marítimo">Marítimo</option>
                <option value="Aéreo">Aéreo</option>
                <option value="Armazenagem">Armazenagem</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Budget Estimado</label>
              <select
                required
                value={form.budget}
                onChange={e => setForm({ ...form, budget: e.target.value as Budget })}
                className={inputClass + " bg-white"}
              >
                <option value="">Selecionar budget...</option>
                <option value="< €5k">&lt; €5k</option>
                <option value="€5k-€20k">€5k - €20k</option>
                <option value="> €20k">&gt; €20k</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Proprietário do Lead</label>
              <select
                required
                value={form.proprietario}
                onChange={e => setForm({ ...form, proprietario: e.target.value as Owner })}
                className={inputClass + " bg-white"}
              >
                <option value="">Selecionar proprietário...</option>
                <option value="Content Specialist">Content Specialist</option>
                <option value="Customer Success">Customer Success</option>
                <option value="CMO">CMO</option>
              </select>
            </div>
          </div>
        </div>

        {/* Automation info */}
        <div className="bg-[#C0D637]/15 border border-[#C0D637]/40 rounded-xl p-5">
          <p className="text-xs font-semibold text-[#063C20] mb-2 flex items-center gap-2 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" /> Automações automáticas
          </p>
          <ul className="text-xs text-[#063C20]/80 space-y-1">
            <li>• Regra 1: Email de boas-vindas em 5 min + Notificação ao Content Specialist</li>
            <li>• Regra 2: Monitorização SLA (alerta se sem contacto em 24h)</li>
          </ul>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#063C20]/8">
          <button
            type="button"
            onClick={() => setForm({ nomeCompleto: '', empresa: '', email: '', telefone: '', origem: '', servicoInteresse: '', budget: '', proprietario: '' })}
            className="px-5 py-3 text-sm font-medium text-[#063C20]/70 bg-[#063C20]/5 rounded-xl hover:bg-[#063C20]/10 transition-colors"
          >
            Limpar
          </button>
          <button
            type="submit"
            className="px-6 py-3 text-sm font-semibold text-[#063C20] bg-[#C0D637] rounded-xl hover:bg-[#C0D637]/90 transition-colors shadow-lg shadow-[#C0D637]/20"
          >
            Registar Lead
          </button>
        </div>
      </form>
    </div>
  );
}
