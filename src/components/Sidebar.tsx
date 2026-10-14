import { LayoutDashboard, Users, GitBranch, PlusCircle, Zap, Bell, Settings } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  slaAlertCount: number;
}

export default function Sidebar({ currentPage, onNavigate, slaAlertCount }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'pipeline', label: 'Pipeline', icon: GitBranch },
    { id: 'new-lead', label: 'Novo Lead', icon: PlusCircle },
    { id: 'automations', label: 'Automações', icon: Zap },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col min-h-screen">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-400" />
          <span>LogiCRM</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Gestão de Leads & Follow-up</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              currentPage === item.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>

      {slaAlertCount > 0 && (
        <div className="p-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 transition-all"
          >
            <Bell className="w-5 h-5 animate-pulse" />
            <div className="text-left">
              <p className="text-xs font-medium">Alertas SLA</p>
              <p className="text-xs text-red-400">{slaAlertCount} lead(s) em risco</p>
            </div>
          </button>
        </div>
      )}

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
            CMO
          </div>
          <div>
            <p className="text-xs font-medium">CMO</p>
            <p className="text-xs text-slate-400">Online</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
