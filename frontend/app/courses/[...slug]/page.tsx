/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import { checkEnrollment, fetchCourseDetails } from "@/utils/api";
import Spinner from "@/components/elements/Spinner";
import Error from "@/components/elements/Error";
import Link from "next/link";
import convertToTimeAgo from "@/services/timeAgo";
import Modal from "@/components/elements/Modal";
import Discussion from "@/components/elements/Discussion";
import Review from "@/components/elements/Review";

import { initiatePayment } from "@/utils/khalti";
import CourseDetails from "@/components/elements/CourseDetails";

const SingleCourse = () => {
  const { slug } = useParams();
  const [showModal, setShowModal] = React.useState(false);
  const [selectedCourse, setSelectedCourse] = React.useState<any>(null);
  const [activeTab, setActiveTab] = useState("discussion");

  const {
    isLoading: isLoadingCourseDetails,
    error: errorCourseDetails,
    data: courseDetails,
  } = useQuery<any>({
    queryKey: ["course-details", slug],
    queryFn: () => fetchCourseDetails(slug),
  });

  const {
    isLoading: isEnrolledLoading,
    error: isEnrolledError,
    data: isEnrolledData,
  } = useQuery<any>({
    queryKey: ["is-enrolled", courseDetails?.id],
    queryFn: () => checkEnrollment(courseDetails?.id),
  });

  if (isLoadingCourseDetails || isEnrolledLoading) {
    return <Spinner />;
  }
  if (errorCourseDetails || isEnrolledError) {
    return <Error />;
  }

  const handleBuyNow = async () => {
    const formData = {
      return_url: "http://localhost:3000/payment-success",
      website_url: "http://localhost:3000",
      amount: courseDetails?.price,
      purchase_order_id: courseDetails?.id,
      purchase_order_name: courseDetails?.name,
    };
    try {
      const response = await initiatePayment(formData);
      const { payment_url } = response;
      if (payment_url) {
        window.location.href = payment_url;
      } else {
        MySwal.fire({
          title: "Oops !",
          text: "Error while processing payment. Try again later",
          icon: "warning",
          confirmButtonText: "Okay",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        selectedCourse={selectedCourse}
      />
      <div className="flex flex-col min-h-screen">
        <Header />
        <section className="flex-1">
          <div className="bg-zinc-900 w-full h-fit px-4 md:px-20 py-5 md:py-10">
            <div className="grid grid-cols-1 md:grid-cols-4">
              <div className="col-span-3 self-center">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-200">
                  {courseDetails.name}
                </h1>
                <p className="text-gray-200 mt-3">
                  Created by{" "}
                  <Link href={`/instructors/${courseDetails.instructor?.id}`}>
                    <span className="underline underline-offset-4 cursor-pointer text-indigo-200">
                      {courseDetails?.instructor?.full_name}
                    </span>
                  </Link>
                </p>
                <p className="text-gray-200 mt-3">
                  Last Updated {convertToTimeAgo(courseDetails.updated_at)}
                </p>
                <p className="text-gray-200 mt-3 flex gap-2">
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
                      d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                    />
                  </svg>
                  <span>{courseDetails?.language}</span>
                </p>
              </div>
              <div className="self-center border bg-white border-gray-400 h-fit mt-3">
                <div className="relative">
                  <img
                    src={courseDetails?.thumbnail_image}
                    alt=""
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-8 h-8 cursor-pointer animate-ping text-white"
                      onClick={() => {
                        setShowModal(true);
                        setSelectedCourse(courseDetails.url_slug);
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-xl font-bold">
                    NPR {courseDetails?.price}
                  </p>
                  {isEnrolledData ? (
                    <Link href={`/watch/${courseDetails.url_slug}`}>
                      <p>
                        <button className="mt-3 bg-indigo-700 text-white px-4 py-2 w-full">
                          Go to Course
                        </button>
                      </p>
                    </Link>
                  ) : (
                    <p>
                      <button
                        onClick={handleBuyNow}
                        className="mt-3 bg-indigo-700 text-white px-4 py-2 w-full"
                      >
                        Buy Now
                      </button>
                    </p>
                  )}
                  <p className="mt-3 font-semibold">This course includes</p>
                  <div className="mt-3 font-light text-sm">
                    <p className=" flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z"
                        />
                      </svg>

                      <span>
                        {courseDetails?.duration} hours on-demand video
                      </span>
                    </p>
                    <p className=" flex items-center gap-2 mt-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
                        />
                      </svg>

                      <span>Certificate of completion</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="px-4 md:px-20 py-4 md:py-6">
          <div className="flex justify-center">
            <div>
              <h1 className="text-3xl font-bold">Course Details</h1>
              <CourseDetails courseDetails={courseDetails} />
            </div>
          </div>
        </section>
        <section className="px-4 md:px-20 py-5 md:py-10 ">
          <div className="flex items-center gap-5 mb-8">
            <button
              onClick={() => setActiveTab("discussion")}
              className={`px-4 py-2 border-2 rounded ${
                activeTab === "discussion" ? "border-indigo-700" : ""
              }`}
            >
              Discussions
            </button>
            <button
              onClick={() => setActiveTab("review")}
              className={`px-4 py-2 border-2 rounded ${
                activeTab === "review" ? "border-indigo-700" : ""
              }`}
            >
              Reviews
            </button>
          </div>
          <div className="">
            {activeTab === "discussion" ? (
              <Discussion
                course_id={courseDetails?.id}
                discussion={courseDetails?.discussions}
              />
            ) : (
              <Review
                course_id={courseDetails?.id}
                reviews={courseDetails?.reviews}
              />
            )}
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default SingleCourse;
