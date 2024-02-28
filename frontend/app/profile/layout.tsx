"use client";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import ProfileSidebar from "@/components/common/ProfileSidebar";
export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <section className="flex-1 px-4 md:px-20 my-4">
        <div className="grid grid-cols-1 md:grid-cols-6">
          <ProfileSidebar />
          <div className="col-span-5">{children}</div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
