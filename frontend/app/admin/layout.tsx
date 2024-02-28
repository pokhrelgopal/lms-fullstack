"use client";
import AdminSidebar from "@/components/common/AdminSidebar";
import PanelBar from "@/components/common/PanelBar";
import Link from "next/link";
export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen">
      <section className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-6">
          <AdminSidebar />
          <div className="col-span-5">
            <PanelBar />
            <div className="px-4 md:px-10 mt-4">{children}</div>
          </div>
        </div>
      </section>
    </main>
  );
}
