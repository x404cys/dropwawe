'use client';
import ResponsiveNavbar from './_components/ResponsiveNavbar';
import Sidebar from './_components/SideBar';
import { ApiProvider } from './context/AdminContext';
import { AdminProvider } from './context/DataContext';
import { SidebarProvider } from './context/SideBarContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div dir="rtl " className="font-medium">
      <div className="mx-auto mb-4 flex flex-row gap-6">
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
  );
}
