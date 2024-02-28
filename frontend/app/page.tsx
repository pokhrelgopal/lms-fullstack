/* eslint-disable @next/next/no-img-element */
"use client";

import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import PopularCourses from "@/components/templates/PopularCourses";
import WhyUs from "@/components/templates/WhyUs";

export default function Home() {
  return (
    <>
      <>
        <Header />
        <section className="bg-white dark:bg-gray-900">
          <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:pt-16 lg:px-12">
            <h1 className="mb-4 text-3xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-5xl dark:text-white">
              Welcome to the Future of Online Education
            </h1>
            <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 dark:text-gray-400">
              Our e-learning platform seamlessly blends innovation and
              education, providing a dynamic space where curiosity thrives and
              potential unfolds. Dive into a world of interactive lessons,
              engaging content, and personalized learning paths. Elevate your
              skills, empower your future—welcome to the future of online
              education.
            </p>
            <div className="flex flex-col mb-8 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
              <a
                href="#popular"
                className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center  rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 focus:ring-4 focus:ring-emerald-300 dark:focus:ring-primary-900"
              >
                Start Learning
                <svg
                  className="ml-2 -mr-1 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
            </div>
          </div>
        </section>
        <PopularCourses />
        {/* <WhyUs /> */}
        <Footer />
      </>
    </>
  );
}
