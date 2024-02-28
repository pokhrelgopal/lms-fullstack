import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    name: "Dashboard",
    href: "/teacher",
    current: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
        />
      </svg>
    ),
  },
  {
    name: "Courses",
    href: "/teacher/courses",
    current: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
        />
      </svg>
    ),
  },
];

const TeacherSidebar = () => {
  const pathname = usePathname();
  navigation.forEach((item) => {
    item.current = item.href === pathname;
  });
  return (
    <>
      <aside className="hidden md:block min-h-screen h-full border-r">
        <div className="flex items-center justify-between mb-5 md:mb-0 w-full mt-4">
          <div className="w-full flex flex-col">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <p
                  className={`py-4 pl-5 flex items-center gap-2 mx-5 rounded font-medium${
                    item.current
                      ? "py-4 pl-5 mx-5 rounded  bg-indigo-800 text-white "
                      : ""
                  }`}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.icon}
                  <span> {item.name}</span>
                </p>
              </Link>
            ))}
          </div>
        </div>
      </aside>
      <div className="md:hidden bg-black md:mt-6">
        <div className="flex items-center pt-3 px-4 md-px-0 justify-between mb-5 md:mb-0">
          <div className="flex md:flex-col">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  item.current
                    ? "bg-gray-200 rounded-full text-blue-600 w-fit"
                    : "text-white"
                }`}
                aria-current={item.current ? "page" : undefined}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherSidebar;
