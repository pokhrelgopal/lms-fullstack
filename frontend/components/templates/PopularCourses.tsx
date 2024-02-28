/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import Link from "next/link";
import { fetchCourseSummaries } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../elements/Spinner";
import convertToTimeAgo from "@/services/timeAgo";
const PopularCourses = () => {
  const {
    isLoading,
    error,
    data: courses,
  } = useQuery<any>({
    queryKey: ["course-summaries"],
    queryFn: () => fetchCourseSummaries(),
  });

  isLoading && <Spinner />;
  error && <p>Error</p>;
  return (
    <section id="popular" className="px-4 md:px-20 py-8 md:py-16">
      <h1 className="text-3xl md:text-3xl font-bold my-5">
        Popular<span className="text-emerald-700"> Courses</span>
      </h1>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {courses?.map((course: any) => (
          <Link href={`/courses/${course.url_slug}`} key={course.id}>
            <div className="w-full md:w-64 cursor-pointer">
              <div>
                <img
                  src={course.thumbnail_image}
                  alt="course"
                  className="object-cover h-64 md:h-40 w-full md:w-64"
                />
              </div>
              <div className="">
                <p className="my-3 font-semibold">{course.name}</p>
                <p className="my-3 text-sm tracking-wide">
                  {course.instructor.full_name}
                </p>
                <p className="my-3 italic text-xs text-gray-500">
                  Updated {convertToTimeAgo(course.updated_at)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default PopularCourses;
