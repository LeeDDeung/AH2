import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    Menu, X, LogOut,
    User, Activity, Calendar, MessageCircle,
    FileText, Shield, PieChart, CreditCard, Settings
} from 'lucide-react';
import { cn, Button } from '../ui';

// Rotating Message Component
export const RotatingMessageLines: React.FC<{ messages: string[] }> = ({ messages }) => {
    const [index, setIndex] = useState(() => {
        const stored = localStorage.getItem('lastMessageIndex');
        if (stored) {
            const nextIndex = (parseInt(stored) + 1) % messages.length;
            localStorage.setItem('lastMessageIndex', nextIndex.toString());
            return nextIndex;
        }
        return 0;
    });

    return (
        <div className="flex h-full flex-col items-center justify-center p-8 text-center bg-brand-50">
            <h2 className="text-2xl font-serif font-medium text-brand-800 animate-fade-in transition-all duration-500">
                {messages[index]}
            </h2>
        </div>
    );
};

// Logic for Sidebar Items based on Role
const getNavItems = (role: string) => {
    switch (role) {
        case 'PATIENT':
            return [
                { href: '/patient', label: '현재 상태 입력', icon: Activity, end: true },
                // { href: '/patient/timeline', label: '나의 타임라인', icon: Calendar }, // To be implemented
                { href: '/patient/result', label: 'AI 예측 결과', icon: PieChart },
                { href: '/patient/chat', label: 'AI 상담소', icon: MessageCircle },
                { href: '/patient/subscription', label: '구독/플랜', icon: CreditCard },
            ];
        case 'DOCTOR':
            return [
                { href: '/doctor', label: '환자 입력', icon: User, end: true },
                { href: '/doctor/result', label: '예측 리포트', icon: FileText },
                { href: '/doctor/chat', label: 'AI 상담소', icon: MessageCircle },
            ];
        case 'PLANNER':
            return [
                { href: '/planner', label: '고객 정보 입력', icon: User, end: true },
                { href: '/planner/result', label: '리스크 분석', icon: Shield },
                { href: '/planner/chat', label: 'AI 상담소', icon: MessageCircle },
            ];
        default:
            return [];
    }
};

const AppShell: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navItems = user ? getNavItems(user.role) : [];

    const handleLogout = () => {
        logout();
        navigate('/goodbye');
    };

    return (
        <div className="flex h-screen bg-brand-50">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-brand-100 transition-transform duration-200 ease-in-out lg:static lg:transform-none",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-16 items-center justify-between px-6 border-b border-brand-100">
                    <span className="text-xl font-serif font-bold text-brand-800">HopeOne</span>
                    <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
                        <X className="h-6 w-6 text-brand-500" />
                    </button>
                </div>

                <nav className="flex-1 space-y-1 px-3 py-4">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            end={item.end}
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-brand-100 text-brand-900"
                                        : "text-brand-600 hover:bg-brand-50 hover:text-brand-900"
                                )
                            }
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="border-t border-brand-100 p-4">
                    <div className="flex items-center mb-4 px-3">
                        <div className="h-8 w-8 rounded-full bg-brand-200 flex items-center justify-center text-brand-700 font-bold">
                            {user?.role[0]}
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-brand-900">{user?.role} Mode</p>
                        </div>
                    </div>
                    <Button variant="ghost" className="w-full justify-start text-brand-600" onClick={handleLogout}>
                        <LogOut className="mr-3 h-5 w-5" />
                        로그아웃
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-16 items-center justify-between border-b border-brand-100 bg-white px-6 lg:hidden">
                    <button onClick={() => setIsSidebarOpen(true)}>
                        <Menu className="h-6 w-6 text-brand-500" />
                    </button>
                    <span className="text-lg font-serif font-bold text-brand-800">HopeOne</span>
                    <div className="w-6" /> {/* Spacer */}
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AppShell;
