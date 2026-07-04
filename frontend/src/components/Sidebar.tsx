import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();
  const role = localStorage.getItem('role') || "Guest";

  const getLinkClass = (path: string) => {
    const alignmentClass = isCollapsed ? "justify-center" : "justify-between";
    const paddingClass = isCollapsed ? "px-0" : "px-3";

    const baseClass = `flex items-center ${alignmentClass} ${paddingClass} py-2.5 rounded-lg text-sm font-medium transition-colors text-slate-300 hover:bg-slate-700 hover:text-white overflow-hidden whitespace-nowrap`;
    const activeClass = "bg-slate-700 text-white font-semibold";
    return location.pathname === path ? `${baseClass} ${activeClass}` : baseClass;
  };

  return (
    <aside className={`bg-slate-900 text-white flex flex-col p-3 transition-all duration-300 h-screen sticky top-0 border-r border-slate-800 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`mb-6 p-2 text-2xl hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors flex ${isCollapsed ? 'justify-center w-full' : 'text-left'}`}
      >
        {isCollapsed ? '☰' : '☰ MENU'}
      </button>

      <nav className="flex flex-col gap-1 flex-1">
        
        <Link to="/dashboard" className={getLinkClass('/dashboard')}>
          <div className="flex items-center gap-3">
            <span className="text-base flex items-center justify-center min-w-[24px]">📊</span>
            {!isCollapsed && <span>Dashboard</span>}
          </div>
          {!isCollapsed && <span className="text-slate-500 font-bold">❯</span>}
        </Link>
        
        <Link to="/addevent" className={getLinkClass('/addevent')}>
          <div className="flex items-center gap-3">
            <span className="text-base flex items-center justify-center min-w-[24px]">➕</span>
            {!isCollapsed && <span>Add Event</span>}
          </div>
          {!isCollapsed && <span className="text-slate-500 font-bold">❯</span>}
        </Link>

        <Link to="/updateevent" className={getLinkClass('/updateevent')}>
          <div className="flex items-center gap-3">
            <span className="text-base flex items-center justify-center min-w-[24px]">📝</span>
            {!isCollapsed && <span>Update Event</span>}
          </div>
          {!isCollapsed && <span className="text-slate-500 font-bold">❯</span>}
        </Link>

        {role !== 'SoC' && (
          <>
            <Link to="/sochandle" className={getLinkClass('/sochandle')}>
              <div className="flex items-center gap-3">
                <span className="text-base flex items-center justify-center min-w-[24px]">🔗</span>
                {!isCollapsed && <span>Soc Handle</span>}
              </div>
              {!isCollapsed && <span className="text-slate-500 font-bold">❯</span>}
            </Link>

            <Link to="/adminhandle" className={getLinkClass('/adminhandle')}>
              <div className="flex items-center gap-3">
                <span className="text-base flex items-center justify-center min-w-[24px]">⭐️</span>
                {!isCollapsed && <span>Admin Handle</span>}
              </div>
              {!isCollapsed && <span className="text-slate-500 font-bold">❯</span>}
            </Link>
          </>
        )}

      </nav>
    </aside>
  );
}

export default Sidebar;