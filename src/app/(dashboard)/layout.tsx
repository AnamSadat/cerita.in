import { DashboardSidebar } from '@/components/view/dashboard/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-neutral-800">
      <DashboardSidebar />
      <main className="flex-1 m-3 p-6 bg-neutral-950 rounded-2xl shadow-lg ">
        {children}
      </main>
    </div>
  );
}
