import { useState } from 'react';
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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        slaAlertCount={slaAlerts.length}
      />
      <main className="flex-1 overflow-auto">
        {renderPage()}
      </main>
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
