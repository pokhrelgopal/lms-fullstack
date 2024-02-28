import { deleteCookie } from "cookies-next";
import Link from "next/link";
import React from "react";

const PanelBar = () => {
  const handleLogoutClick = () => {
    deleteCookie("access");
    deleteCookie("refresh");
    localStorage.removeItem("user_id");
    localStorage.removeItem("refresh");
    localStorage.removeItem("access");
    window.location.href = "/login";
  };
  return (
    <div className="bg-neutral-200 px-4 md:px-10 py-4 flex items-center justify-between">
      <Link className="" href="/">
        <p className=" text-indigo-600 flex items-center justify-end gap-2">
          <span>Student View</span>
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
              d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
            />
          </svg>
        </p>
      </Link>
      <p
        onClick={handleLogoutClick}
        className="cursor-pointer flex items-center gap-2 text-red-600"
      >
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
            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
          />
        </svg>
        <span>Logout</span>
      </p>
    </div>
  );
};

export default PanelBar;
