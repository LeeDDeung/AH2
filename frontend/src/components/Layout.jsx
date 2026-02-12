import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children, activeTab, onTabChange }) => {
    return (
        <div className="flex h-screen bg-warm-50 overflow-hidden">
            {/* Sidebar - Hidden on mobile, needs a mobile drawer implementation for full responsiveness */}
            <Sidebar activeTab={activeTab} onTabChange={onTabChange} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Mobile Header (Visible only on small screens) */}
                <header className="md:hidden bg-white border-b border-warm-200 p-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-warm-800">OpenAH</span>
                    <button className="text-warm-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-5xl mx-auto h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
