/* eslint-disable @next/next/no-img-element */
"use client";
import {
  useQuery,
  useQueryClient,
  InvalidateQueryFilters,
} from "@tanstack/react-query";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
import React from "react";
import { deleteUser, getUserByRole, fetchCourseSummaries } from "@/utils/api";
import Spinner from "@/components/elements/Spinner";
import convertToTimeAgo from "@/services/timeAgo";
const Courses = () => {
  const queryClient = useQueryClient();
  const { data: courses, isLoading: isLoadingCourses } = useQuery<any>({
    queryKey: ["courses"],
    queryFn: () => fetchCourseSummaries(),
  });
  if (isLoadingCourses) {
    return <Spinner />;
  }
  return (
    <div>
      {" "}
      <section className="pt-4 md:pt-8">
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-5">
          {courses?.map((course: any) => (
            <div key={course.id} className="w-full md:w-64 cursor-pointer">
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
          ))}
        </div>
      </section>
    </div>
  );
};

export default Courses;
