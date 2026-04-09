import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <TopNav />
      <main className="ml-[240px] pt-16 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
