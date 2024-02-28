"use client";
import React from "react";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);
import {
  checkEnrollment,
  fetchCourseDetails,
  checkCourseProgress,
  createCertificate,
} from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Spinner from "@/components/elements/Spinner";
import Error from "@/components/elements/Error";
import ReactPlayer from "react-player";
import { API_URL } from "@/utils/endpoints";
import Link from "next/link";
import Tick from "@/components/elements/Tick";

const Watch = () => {
  const { slug } = useParams();
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

  const {
    isLoading: isLoadingCourseProgress,
    error: errorCourseProgress,
    data: courseProgress,
  } = useQuery<any>({
    queryKey: ["course-progress", courseDetails?.id],
    queryFn: () => checkCourseProgress(courseDetails?.id),
  });

  const [openSections, setOpenSections] = React.useState<string[]>([]);

  const [selectedUrl, setSelectedUrl] = React.useState<string>(
    courseDetails?.sections[0]?.modules[0]?.video_url || ""
  );

  const toggleSection = (sectionId: string) => {
    setOpenSections((prevOpenSections: any) =>
      prevOpenSections.includes(sectionId)
        ? prevOpenSections.filter((id: any) => id !== sectionId)
        : [...prevOpenSections, sectionId]
    );
  };

  React.useEffect(() => {
    if (courseDetails) {
      const firstModule = courseDetails?.sections[0]?.modules[0]?.video_url;
      setSelectedUrl(firstModule);
    }
  }, [courseDetails]);

  if (isLoadingCourseDetails || isEnrolledLoading || isLoadingCourseProgress) {
    return <Spinner />;
  }
  if (errorCourseDetails || isEnrolledError || errorCourseProgress) {
    return <Error />;
  }
  if (!isEnrolledData) {
    window.location.href = `/courses/${slug}`;
  }

  const { completed_modules, total_modules } = courseProgress;

  if (completed_modules === total_modules) {
    try {
      const formData = {
        user_id: localStorage.getItem("user_id"),
        course_id: courseDetails?.id,
      };
      createCertificate(formData);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <section className="flex-1 px-4 md:px-20 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="col-span-3">
            <ReactPlayer
              url={`${API_URL}${selectedUrl}`}
              controls
              width="100%"
              height="100%"
              playing
            />
          </div>
          <div className="space-y-4">
            {courseDetails?.sections?.map((section: any) => {
              const isOpen = openSections.includes(section.id);

              return (
                <div key={section.id}>
                  <h1
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection(section.id)}
                  >
                    <span className="text-lg font-bold">{section.name}</span>
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className={`w-5 h-5 ${
                          isOpen ? "transform rotate-180" : ""
                        }`}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m19.5 8.25-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </span>
                  </h1>
                  <div className="space-y-5">
                    {" "}
                    {isOpen &&
                      section?.modules.map((module: any) => (
                        <Module
                          key={module.id}
                          module={module}
                          setSelectedUrl={setSelectedUrl}
                        />
                      ))}
                    {isOpen && section?.quizzes?.length > 0 && (
                      <Link href={`/quiz/${section.id}`}>
                        <p className="my-2 cursor-pointer flex items-center gap-2">
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
                              d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                            />
                          </svg>
                          <span>Quiz</span>
                        </p>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Watch;

export function Module({ module, setSelectedUrl }: any) {
  return (
    <div
      key={module.id}
      className="my-2 cursor-pointer"
      onClick={() => {
        setSelectedUrl(module.video_url);
      }}
    >
      <div>
        <Tick module_id={module.id} module_name={module.name} />
      </div>

      <div className="ml-2 mt-4">
        {module?.resources?.map((resource: any) => (
          <a
            key={resource.id}
            href={`${API_URL}${resource.file}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-gray-600 text-sm"
          >
            <span className="cursor-pointer">
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
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </span>
            <span>{resource.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
