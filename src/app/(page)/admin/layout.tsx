'use client';

import ResponsiveNavbar from './_components/ResponsiveNavbar';
import Sidebar from './_components/SideBar';
import { ApiProvider } from './context/AdminContext';
import AdminGuard from './context/AdminGuard';
import { AdminProvider } from './context/DataContext';
import { SidebarProvider } from './context/SideBarContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div dir="ltr" className="font-medium">
        <div className="mx-auto my-2 flex flex-row gap-6">
          <div className="flex-1">
            <AdminProvider>
              <SidebarProvider>
                <ApiProvider>
                  <div dir="rtl" className="flex justify-between">
                    <div className="hidden md:block">
                      <Sidebar />
                    </div>

                    <div className="w-full">
                      <ResponsiveNavbar />
                      {children}
                    </div>
                  </div>
                </ApiProvider>
              </SidebarProvider>
            </AdminProvider>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
