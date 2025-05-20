import React from 'react';
import { Outlet } from 'react-router-dom';
import GlobalHeader from './GlobalHeader';
import GlobalFooter from './GlobalFooter';

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 전역 Header */}
      <GlobalHeader />
      {/* 메인 컨텐츠 */}
      <main className="flex-grow">
        <Outlet />
      </main>
      {/* 전역 Footer */}
      <GlobalFooter />
    </div>
  );
}

export default Layout;