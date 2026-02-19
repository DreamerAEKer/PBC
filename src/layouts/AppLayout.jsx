import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, Package, Menu, X } from 'lucide-react';
import { useState } from 'react';

const SidebarItem = ({ to, icon: Icon, label, onClick }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                ? 'bg-thp-red text-white shadow-md'
                : 'text-gray-600 hover:bg-red-50 hover:text-thp-red'
                }`}
        >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
        </NavLink>
    );
};

export default function AppLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="h-full flex flex-col">
                    {/* Logo Area */}
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-thp-red rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">
                                ป
                            </div>
                            <div>
                                <h1 className="text-thp-blue font-bold text-lg leading-tight">Thailand Post</h1>
                                <p className="text-xs text-gray-500">Business CRM <span className="text-thp-red font-bold ml-1">v0.01</span></p>
                            </div>
                        </div>
                        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        <SidebarItem to="/" icon={LayoutDashboard} label="ภาพรวม (Dashboard)" onClick={() => setIsSidebarOpen(false)} />
                        <SidebarItem to="/customers" icon={Users} label="ข้อมูลลูกค้า" onClick={() => setIsSidebarOpen(false)} />
                        <div className="pt-4 pb-2">
                            <div className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                System
                            </div>
                        </div>
                        <SidebarItem to="/settings" icon={Settings} label="ตั้งค่าหัวข้อ" onClick={() => setIsSidebarOpen(false)} />
                    </nav>

                    {/* User Info */}
                    <div className="p-4 border-t border-gray-100">
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-10 h-10 rounded-full bg-thp-blue text-white flex items-center justify-center font-bold">
                                A
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
                                <p className="text-xs text-gray-500 truncate">Head of Business Dept</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-thp-red rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
                            ป
                        </div>
                        <span className="font-bold text-thp-blue">THP CRM</span>
                    </div>
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <Menu size={24} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-6xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}
