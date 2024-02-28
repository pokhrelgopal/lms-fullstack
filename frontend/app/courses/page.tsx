/* eslint-disable @next/next/no-img-element */
"use client";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import Spinner from "@/components/elements/Spinner";
import Error from "@/components/elements/Error";

import convertToTimeAgo from "@/services/timeAgo";
import { fetchCategories, fetchCourseSummaries } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useState } from "react";

const Courses = () => {
  const [search, setSearch] = useState("");
  const {
    isLoading: isLoadingCategories,
    error: errorCategories,
    data: categories,
  } = useQuery<any>({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
  });

  const {
    isLoading: isLoadingCourses,
    error: errorCourses,
    data: courses,
  } = useQuery<any>({
    queryKey: ["course-summaries", search],
    queryFn: () => fetchCourseSummaries(search),
  });

  const handleCategoryClick = (categoryName: string) => {
    setSearch(categoryName);
  };

  if (isLoadingCategories || isLoadingCourses) {
    return <Spinner />;
  }

  if (errorCategories || errorCourses) {
    return <Error />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <section className="block flex-1 px-4 mt-6 md:px-20">
        <div className="hidden md:flex space-x-3 text-sm">
          <p
            onClick={() => handleCategoryClick("")}
            className={`border-2 w-fit border-emerald-500 rounded-full px-3 py-1.5 cursor-pointer ${
              search === "" ? "bg-emerald-500 text-white" : ""
            }`}
          >
            All Courses
          </p>
          {categories &&
            categories?.map((category: any) => (
              // category.courses.length > 0 &&
              <p
                onClick={() => handleCategoryClick(category.name)}
                key={category.id}
                className={`border-2 w-fit border-emerald-500 rounded-full px-3 py-1.5 cursor-pointer ${
                  search === category.name ? "bg-emerald-500 text-white" : ""
                }`}
              >
                {category.name}
              </p>
            ))}
        </div>{" "}
        <section className="pt-8 md:pt-16">
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
      </section>

      <Footer />
    </div>
  );
};

export default Courses;
