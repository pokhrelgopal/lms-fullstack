"use client";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import React from "react";
import Link from "next/link";
import { getUserByRole } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/elements/Spinner";
import InstructorCard from "@/components/elements/InstructorCard";
import Error from "@/components/elements/Error";

const Instructors = () => {
  const {
    isLoading: isLoadingInstructors,
    error,
    data: instructors,
  } = useQuery<any>({
    queryKey: ["instructors"],
    queryFn: () => getUserByRole("instructor"),
  });
  console.log(instructors);
  if (isLoadingInstructors) return <Spinner />;
  if (error) return <Error />;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <section className="flex-1 px-4 md:px-20 py-8 bg-gray-100">
        <>
          <h1 className="text-3xl md:text-3xl font-bold my-5">
            Our
            <span className="text-emerald-700"> Instructors</span>
          </h1>
          {instructors?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {instructors?.map((instructor: any) => (
                <Link
                  href={`/instructors/${instructor.id}`}
                  key={instructor.id}
                >
                  <div className="w-full cursor-pointer">
                    <InstructorCard instructor={instructor} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      </section>

      <Footer />
    </div>
  );
};

export default Instructors;
