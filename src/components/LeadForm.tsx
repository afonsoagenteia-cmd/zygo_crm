import { useState, type FormEvent } from 'react';
import { useCRM } from '../context/CRMContext';
import { LeadOrigin, ServiceInterest, Budget, Owner } from '../types';
import { UserPlus, CheckCircle, Building2, Mail, Phone, Globe, Briefcase, DollarSign, Calendar, User } from 'lucide-react';

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

  if (submitted) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Lead Registado com Sucesso!</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left max-w-md mx-auto">
            <p className="text-xs font-semibold text-blue-800 mb-2">🤖 Automações executadas:</p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>✓ Email de boas-vindas enviado (5 min)</li>
              <li>✓ Content Specialist notificado por Slack/Email</li>
            </ul>
          </div>
          <p className="text-sm text-gray-500">A redirecionar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <UserPlus className="w-6 h-6 text-blue-600" />
          Registar Novo Lead
        </h2>
        <p className="text-gray-500 text-sm mt-1">Preencha todos os campos obrigatórios para criar um novo lead no sistema</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nome Completo */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> Nome Completo *
            </label>
            <input
              type="text"
              required
              value={form.nomeCompleto}
              onChange={e => setForm({ ...form, nomeCompleto: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Ex: João Silva"
            />
          </div>

          {/* Empresa */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" /> Empresa *
            </label>
            <input
              type="text"
              required
              value={form.empresa}
              onChange={e => setForm({ ...form, empresa: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Ex: LogiTrans Portugal"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> Email Corporativo *
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Ex: joao@empresa.pt"
            />
          </div>

          {/* Telefone */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> Telefone *
            </label>
            <input
              type="tel"
              required
              value={form.telefone}
              onChange={e => setForm({ ...form, telefone: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Ex: +351 912 345 678"
            />
          </div>

          {/* Origem */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> Origem do Lead *
            </label>
            <select
              required
              value={form.origem}
              onChange={e => setForm({ ...form, origem: e.target.value as LeadOrigin })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              <option value="">Selecionar origem...</option>
              <option value="Website">Website</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Evento">Evento</option>
              <option value="Indicação">Indicação</option>
              <option value="Google Ads">Google Ads</option>
            </select>
          </div>

          {/* Serviço de Interesse */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5" /> Serviço de Interesse *
            </label>
            <select
              required
              value={form.servicoInteresse}
              onChange={e => setForm({ ...form, servicoInteresse: e.target.value as ServiceInterest })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              <option value="">Selecionar serviço...</option>
              <option value="Transporte Rodoviário">Transporte Rodoviário</option>
              <option value="Marítimo">Marítimo</option>
              <option value="Aéreo">Aéreo</option>
              <option value="Armazenagem">Armazenagem</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          {/* Budget */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" /> Budget Estimado *
            </label>
            <select
              required
              value={form.budget}
              onChange={e => setForm({ ...form, budget: e.target.value as Budget })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              <option value="">Selecionar budget...</option>
              <option value="< €5k">&lt; €5k</option>
              <option value="€5k-€20k">€5k - €20k</option>
              <option value="> €20k">&gt; €20k</option>
            </select>
          </div>

          {/* Proprietário */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Proprietário do Lead *
            </label>
            <select
              required
              value={form.proprietario}
              onChange={e => setForm({ ...form, proprietario: e.target.value as Owner })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              <option value="">Selecionar proprietário...</option>
              <option value="Content Specialist">Content Specialist</option>
              <option value="Customer Success">Customer Success</option>
              <option value="CMO">CMO</option>
            </select>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs font-semibold text-blue-800 mb-1">🤖 Automações que serão executadas:</p>
          <ul className="text-xs text-blue-700 space-y-0.5">
            <li>• Regra 1: Email de boas-vindas enviado em 5 min + Notificação ao Content Specialist</li>
            <li>• Regra 2: Monitorização SLA (alerta se sem contacto em 24h)</li>
          </ul>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setForm({ nomeCompleto: '', empresa: '', email: '', telefone: '', origem: '', servicoInteresse: '', budget: '', proprietario: '' })}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Limpar
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Registar Lead
          </button>
        </div>
      </form>
    </div>
  );
}
