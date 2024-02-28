/* eslint-disable @next/next/no-img-element */
"use client";
import Error from "@/components/elements/Error";
import Spinner from "@/components/elements/Spinner";
import convertToTimeAgo from "@/services/timeAgo";
import { getCoursesForInstructor } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";

const Courses = () => {
  const {
    isLoading: isLoadingCourses,
    error: errorCourses,
    data: courses,
  } = useQuery<any>({
    queryKey: ["course-summaries"],
    queryFn: () => getCoursesForInstructor(),
  });

  if (isLoadingCourses) {
    return <Spinner />;
  }
  if (errorCourses) {
    return <Error />;
  }
  return (
    <section>
      <section className="py-4">
        <div className="flex items-center mb-3 justify-between">
          <h1 className="text-2xl font-bold">My Courses</h1>
          <Link href="/teacher/courses/add">
            <button className="flex items-center gap-2 bg-zinc-800 px-3 py-2 text-white rounded hover:bg-zinc-700 transition duration-300">
              <span>Add Course</span>
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
                  d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </button>
          </Link>
        </div>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {courses?.map((course: any) => (
            <Link href={`/teacher/courses/${course.url_slug}`} key={course.id}>
              <div className="relative w-full md:w-64 cursor-pointer overflow-hidden">
                {!course.publish_status && (
                  <div className="absolute right-0 top-0 h-16 w-16">
                    <div className="absolute text-sm transform rotate-45 bg-red-600 text-center text-white py-1 right-[-35px] top-[32px] w-[170px]">
                      Unpublished
                    </div>
                  </div>
                )}
                <div>
                  <img
                    src={course.thumbnail_image}
                    alt="course"
                    className="object-cover h-64 md:h-40 w-full md:w-64"
                  />
                </div>
                <div className="">
                  <p className="my-3 font-semibold">{course.name}</p>
                  <p className="my-3 italic text-xs text-gray-500">
                    Updated {convertToTimeAgo(course.updated_at)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
};

export default Courses;
