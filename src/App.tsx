import { useState } from 'react';
import { Menu, Database, AlertCircle } from 'lucide-react';
import { CRMProvider, useCRM } from './context/CRMContext';
import { isSupabaseConfigured } from './lib/supabase';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LeadForm from './components/LeadForm';
import Pipeline from './components/Pipeline';
import LeadList from './components/LeadList';
import LeadDetail from './components/LeadDetail';
import Automations from './components/Automations';

function CRMApp() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { slaAlerts, loading, error } = useCRM();
  const supabaseConfigured = isSupabaseConfigured();

  const handleSelectLead = (leadId: string) => {
    setSelectedLeadId(leadId);
    setCurrentPage('lead-detail');
    // Fechar sidebar em mobile ao selecionar um lead
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromDetail = () => {
    setSelectedLeadId(null);
    setCurrentPage('leads');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSelectedLeadId(null);
    // Scroll to top ao mudar de página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderPage = () => {
    if (currentPage === 'lead-detail' && selectedLeadId) {
      return <LeadDetail leadId={selectedLeadId} onBack={handleBackFromDetail} />;
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onSelectLead={handleSelectLead} />;
      case 'leads':
        return <LeadList onSelectLead={handleSelectLead} />;
      case 'pipeline':
        return <Pipeline onSelectLead={handleSelectLead} />;
      case 'new-lead':
        return <LeadForm />;
      case 'automations':
        return <Automations />;
      default:
        return <Dashboard onSelectLead={handleSelectLead} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAFAF7]">
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        slaAlertCount={slaAlerts.length}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
      />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-[#063C20] text-white px-4 py-3 flex items-center justify-between shadow-md">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-white/10 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#C0D637] rounded-lg flex items-center justify-center">
              <span className="font-display font-black text-[#063C20] text-sm">Z</span>
            </div>
            <span className="font-display font-bold text-lg">ZYGO</span>
          </div>
          <div className="w-9" /> {/* Spacer para centrar */}
        </header>

        {/* Database Status Banner */}
        {!supabaseConfigured && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-2 text-xs text-amber-800">
            <Database className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">Modo Demo:</span>
            <span>A usar dados locais. Configure o Supabase para persistência real.</span>
            <a
              href="/DEPLOY.md"
              target="_blank"
              className="ml-auto underline font-semibold hover:text-amber-900 flex-shrink-0"
            >
              Ver guia →
            </a>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border-b border-red-200 px-4 py-2 flex items-center gap-2 text-xs text-red-800">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-[#063C20]/20 border-t-[#C0D637] rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-[#063C20]/60">A carregar dados...</p>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-auto">
          {!loading && renderPage()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <CRMProvider>
      <CRMApp />
    </CRMProvider>
  );
}
