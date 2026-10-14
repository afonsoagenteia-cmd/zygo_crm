import { useState } from 'react';
import { Menu } from 'lucide-react';
import { CRMProvider, useCRM } from './context/CRMContext';
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
  const { slaAlerts } = useCRM();

  const handleSelectLead = (leadId: string) => {
    setSelectedLeadId(leadId);
    setCurrentPage('lead-detail');
  };

  const handleBackFromDetail = () => {
    setSelectedLeadId(null);
    setCurrentPage('leads');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSelectedLeadId(null);
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
        return <Dashboard />;
      case 'leads':
        return <LeadList onSelectLead={handleSelectLead} />;
      case 'pipeline':
        return <Pipeline onSelectLead={handleSelectLead} />;
      case 'new-lead':
        return <LeadForm />;
      case 'automations':
        return <Automations />;
      default:
        return <Dashboard />;
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
        <main className="flex-1 overflow-auto">
          {renderPage()}
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
