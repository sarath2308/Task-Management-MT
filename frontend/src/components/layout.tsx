import React, { useState } from 'react';
import { Bell, LayoutDashboard, ListTodo, X } from 'lucide-react';
import { Link, useLocation } from 'react-router';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showNotif, setShowNotif] = useState(false);
  const location = useLocation();

  const notifications = [
    { id: 1, text: "Project 'Alpha' deadline tomorrow", time: "2m ago" },
    { id: 2, text: "New task assigned by Sarah", time: "1h ago" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-gray-900 bg-gray-900 hidden md:flex flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">T</div>
          <span className="text-xl font-bold tracking-tight">TaskFlow</span>
        </div>
        <nav className="space-y-2 flex-1">
          <Link to="/home" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${location.pathname === '/home' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/tasks" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${location.pathname === '/tasks' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
            <ListTodo size={20} /> My Tasks
          </Link>
        </nav>
      </aside>

      {/* MAIN BODY */}
      <div className="flex-1 flex flex-col">
        {/* TOPBAR */}
        <header className="h-16 border-b border-gray-900 bg-gray-950/50 backdrop-blur-md flex items-center justify-end px-8 gap-6 sticky top-0 z-40">
          <div className="relative">
            <button onClick={() => setShowNotif(!showNotif)} className="text-gray-400 hover:text-white relative p-2 rounded-full hover:bg-gray-800 transition">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-gray-950"></span>
            </button>

            {/* NOTIFICATION TAB */}
            {showNotif && (
              <div className="absolute right-0 mt-3 w-80 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
                  <h4 className="font-bold">Notifications</h4>
                  <button onClick={() => setShowNotif(false)}><X size={16} /></button>
                </div>
                <div className="space-y-3">
                  {notifications.map(n => (
                    <div key={n.id} className="p-3 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition cursor-pointer">
                      <p className="text-sm text-gray-200">{n.text}</p>
                      <span className="text-xs text-gray-500">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-gray-500">Pro Plan</p>
            </div>
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full border border-gray-700"></div>
          </div>
        </header>

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;