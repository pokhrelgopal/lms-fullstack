/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { fetchEnrolledCourses } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/elements/Spinner";
import Error from "@/components/elements/Error";
import Link from "next/link";
import convertToTimeAgo from "@/services/timeAgo";
import ProgressBar from "@/components/elements/ProgressBar";

const MyCourses = () => {
  const { isLoading, error, data } = useQuery<any>({
    queryKey: ["enrolled-courses"],
    queryFn: () => fetchEnrolledCourses(),
  });

  if (isLoading) {
    return <Spinner />;
  }
  if (error) {
    return <Error />;
  }
  return (
    <div className="flex">
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {data?.map((item: any) => (
          <Link href={`/courses/${item.course.url_slug}`} key={item.course.id}>
            <div className="w-full md:w-64 cursor-pointer">
              <div>
                <img
                  src={item.course.thumbnail_image}
                  alt="course"
                  className="object-cover h-64 md:h-40 w-full md:w-64"
                />
              </div>
              <ProgressBar course_id={item.course.id} />
              <div className="">
                <p className="my-3 font-semibold">{item.course.name}</p>
                <p className="my-3 text-sm tracking-wide">
                  {item.course.instructor.full_name}
                </p>
                <p className="my-3 italic text-xs text-gray-500">
                  Updated {convertToTimeAgo(item.course.updated_at)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MyCourses;
