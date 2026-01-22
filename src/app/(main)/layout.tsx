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

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <ZenaSidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />

      {/* Main Content Area - automatically expands/contracts */}
      <div className="flex-1 flex flex-col min-h-screen overflow-auto transition-all duration-300 ease-in-out bg-gray-100">
        <Header />

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="mx-auto w-full max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}