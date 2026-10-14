import { LayoutDashboard, Users, GitBranch, PlusCircle, Zap, Bell, Menu, X } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  slaAlertCount: number;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ currentPage, onNavigate, slaAlertCount, isOpen, onToggle }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'pipeline', label: 'Pipeline', icon: GitBranch },
    { id: 'new-lead', label: 'Novo Lead', icon: PlusCircle },
    { id: 'automations', label: 'Automações', icon: Zap },
  ];

  const handleNavigate = (page: string) => {
    onNavigate(page);
    // Fechar sidebar em mobile após navegação
    if (window.innerWidth < 1024) {
      onToggle();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen z-50
        w-64 bg-[#063C20] text-white flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo ZYGO */}
        <div className="px-6 py-7 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C0D637] rounded-xl flex items-center justify-center shadow-lg shadow-[#C0D637]/20">
              <span className="font-display font-black text-[#063C20] text-xl tracking-tighter">Z</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-xl tracking-tight text-white leading-none">
                ZYGO
              </h1>
              <p className="text-[10px] text-white/50 mt-1 tracking-widest uppercase">Follow-up CRM</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map(item => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-[#C0D637] text-[#063C20] shadow-lg shadow-[#C0D637]/20'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className={`w-[18px] h-[18px] ${isActive ? 'text-[#063C20]' : 'text-white/60 group-hover:text-white'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#063C20]" />
                )}
              </button>
            );
          })}
        </nav>

        {slaAlertCount > 0 && (
          <div className="px-4 pb-2">
            <button
              onClick={() => handleNavigate('dashboard')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[#C0D637]/15 border border-[#C0D637]/30 text-[#C0D637] hover:bg-[#C0D637]/25 transition-all"
            >
              <Bell className="w-4 h-4" />
              <div className="text-left flex-1">
                <p className="text-xs font-semibold">SLA Alerta</p>
                <p className="text-[10px] text-[#C0D637]/80">{slaAlertCount} lead(s) em risco</p>
              </div>
            </button>
          </div>
        )}

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-[#C0D637] flex items-center justify-center text-xs font-bold text-[#063C20]">
              CM
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-white">CMO</p>
              <p className="text-[10px] text-white/50 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C0D637]" />
                Online
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
