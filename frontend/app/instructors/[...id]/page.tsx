/* eslint-disable @next/next/no-img-element */
"use client";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import { useParams } from "next/navigation";
import React from "react";

import { useQuery } from "@tanstack/react-query";
import { getInstructorById, getCourseSummaryByTeacher } from "@/utils/api";
import Spinner from "@/components/elements/Spinner";
import Error from "@/components/elements/Error";
import Link from "next/link";
import convertToTimeAgo from "@/services/timeAgo";
const SingleInstructor = () => {
  const { id } = useParams();
  const {
    isLoading: isLoadingInstructor,
    error: errorInstructor,
    data: instructor,
  } = useQuery<any>({
    queryKey: ["instructor", id],
    queryFn: () => getInstructorById(id),
  });

  const {
    isLoading: isLoadingCourseSummary,
    error: errorCourseSummary,
    data: courses,
  } = useQuery<any>({
    queryKey: ["course-summary", id],
    queryFn: () => getCourseSummaryByTeacher(id),
  });

  if (isLoadingInstructor || isLoadingCourseSummary) {
    return <Spinner />;
  }
  if (errorInstructor || errorCourseSummary) {
    return <Error />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <section className="flex-1">
        <div className="-z-20">
          <img
            src="/assets/profile-bg.jpg"
            alt=""
            className="h-60 md:h-72 w-full object-cover"
          />
        </div>
        <div className="px-4 md:px-20 z-20 flex flex-col md:flex-row gap-5">
          <div className="-mt-16 rounded-full flex justify-center md:justify-normal">
            <img
              src={instructor?.profile_image}
              alt=""
              className="p-1 h-40 w-40 rounded-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold mt-2 text-center md:text-left">
              {instructor?.full_name}
            </h1>
            <p className="text-gray-500 capitalize text-center md:text-left">
              {instructor?.role}
            </p>
            <p className="mt-3 max-w-4xl text-center md:text-left">
              {instructor?.about}
            </p>
          </div>
        </div>
      </section>
      <section className="px-4 md:px-20 pt-8 md:pt-16">
        <h1 className="text-xl md:text-2xl font-bold my-5">
          <span className="text-emerald-700"> Courses ({courses?.length})</span>
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

      <Footer />
    </div>
  );
};

export default SingleInstructor;
