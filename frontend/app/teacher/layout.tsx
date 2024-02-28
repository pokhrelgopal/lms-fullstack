"use client";
import PanelBar from "@/components/common/PanelBar";
import TeacherSidebar from "@/components/common/TeacherSidebar";
export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen">
      <section className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-6">
          <TeacherSidebar />
          <div className="col-span-5">
            <PanelBar />
            <div className="px-4 md:px-10 mt-2 md:mt-4">{children}</div>
          </div>
        </div>
      </section>
    </main>
  );
}
