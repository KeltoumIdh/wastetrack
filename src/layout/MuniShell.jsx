import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function MuniShell() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#050b0e] text-[#e8f5f0]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
