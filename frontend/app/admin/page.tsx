"use client";
import Spinner from "@/components/elements/Spinner";
import { getAdminDashboardDetails } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";

const Dashboard = () => {
  const { data, isLoading } = useQuery<any>({
    queryKey: ["dashboard"],
    queryFn: () => getAdminDashboardDetails(),
  });

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <section>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
        <Link href="/admin/students">
          <div className="bg-neutral-50 border p-4 flex items-center gap-4">
            <div className="bg-emerald-100 rounded-full p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold">
                {data.student_count}
              </p>
              <p>{data.student_count > 1 ? "Students" : "Student"}</p>
            </div>
          </div>
        </Link>
        <Link href="/admin/courses">
          <div className="bg-neutral-50 border p-4 flex items-center gap-4">
            <div className="bg-emerald-100 rounded-full p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                />
              </svg>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold">
                {/* {data.published_courses_count + data.unpublished_courses_count} */}
                {data.published_courses_count}
              </p>
              <p>Courses</p>
            </div>
          </div>
        </Link>
        <Link href="/admin/instructors">
          <div className="bg-neutral-50 border p-4 flex items-center gap-4">
            <div className="bg-emerald-100 rounded-full p-2">
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
                  d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold">
                {data.instructor_count}
              </p>
              <p>{data.instructor_count > 1 ? "Instructors" : "Instructor"}</p>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default Dashboard;
