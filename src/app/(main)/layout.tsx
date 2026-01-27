"use client";


import React from "react";
import ZenaSidebar from '../../components/appSidebar/AppsideBar';
import Header from '../../components/header/Header';
import "../globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <div className="flex h-screen bg-gray-50 relative overflow-hidden">
      {/* Sidebar - Desktop and Mobile */}
      <ZenaSidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen transition-all duration-300 ease-in-out bg-gray-100 min-w-0 overflow-hidden">
        <Header onMenuClick={() => setIsMobileOpen(true)} />

        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-white custom-scrollbar">
          <div className="mx-auto w-full max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}