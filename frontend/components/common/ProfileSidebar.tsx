import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "My Profile", href: "/profile", current: true },
  { name: "My Courses", href: "/profile/my-courses", current: false },
];

const ProfileSidebar = () => {
  const pathname = usePathname();
  navigation.forEach((item) => {
    item.current = item.href === pathname;
  });
  return (
    <aside>
      <div className="flex items-center justify-between mb-5 md:mb-0">
        <div className="flex md:flex-col">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                item.current
                  ? "bg-gray-200 rounded-full text-blue-600 w-fit"
                  : ""
              }`}
              aria-current={item.current ? "page" : undefined}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
