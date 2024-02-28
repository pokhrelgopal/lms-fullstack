// "use client";

import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ProfileMenu from "../elements/ProfileMenu";

export default function Header() {
  const pathname = usePathname();
  const { isLoggedIn, user } = useAuth();
  const { role } = user || { role: null };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigation = [
    { name: "Home", href: "/", current: true },
    { name: "Courses", href: "/courses", current: false },
    { name: "Instructors", href: "/instructors", current: false },
  ];
  if (role === "admin") {
    navigation.push({ name: "Admin View", href: "/admin", current: false });
  }
  if (role === "instructor") {
    navigation.push({ name: "Teacher View", href: "/teacher", current: false });
  }
  navigation.forEach((item) => {
    item.current = item.href === pathname;
  });
  return (
    <header>
      <div className="bg-gray-900 py-5 px-4 md:px-20 flex items-center justify-between">
        <div className="flex items-center space-x-16">
          <Link href="/">
            <p className="text-xl font-semibold space-x-1 block">
              <span className="text-2xl text-emerald-500">LearnHub</span>
            </p>
          </Link>
          <div className="hidden md:block">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-white hover:text-emerald-500 px-4 py-2 rounded text-sm font-medium ${
                  item.current ? "bg-gray-700" : ""
                }`}
                aria-current={item.current ? "page" : undefined}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="md:hidden">
          {mobileMenuOpen && (
            <svg
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          )}

          {!mobileMenuOpen && (
            <svg
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
        </div>

        <div className="hidden md:block">
          {!isLoggedIn ? (
            <Link href={"/login"}>
              <button className="bg-emerald-700 hover:bg-emerald-800 transition duration-200 text-white px-3 md:px-4 py-1.5 md:py-2 rounded">
                Sign in
              </button>
            </Link>
          ) : (
            <ProfileMenu />
          )}
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="bg-gray-900 flex flex-col p-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-white hover:text-emerald-500 p-4 rounded text-sm font-medium ${
                item.current ? "bg-gray-700" : ""
              }`}
              aria-current={item.current ? "page" : undefined}
            >
              {item.name}
            </Link>
          ))}
          <div className="mt-4">
            {!isLoggedIn ? (
              <Link href={"/login"}>
                <button className="bg-emerald-700 hover:bg-emerald-800 transition duration-200 text-white px-4 py-2 rounded">
                  Sign in
                </button>
              </Link>
            ) : (
              <>
                <ProfileMenu />
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
