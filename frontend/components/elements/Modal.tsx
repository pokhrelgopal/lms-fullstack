"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchFreeModules } from "@/utils/api";
import ReactPlayer from "react-player";

interface ConfirmationModalProps {
  selectedCourse: any;
  isOpen: boolean;
  content?: any;
  onClose: () => void;
}

// ... (previous imports and code)

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  selectedCourse: slug,
}) => {
  const {
    isLoading: isLoadingFreeModules,
    error: errorFreeModules,
    data: freeModules,
  } = useQuery<any>({
    queryKey: ["free-modules", slug],
    queryFn: () => fetchFreeModules(slug),
  });

  const [selectedModule, setSelectedModule] = useState<number | null>(0);

  if (isLoadingFreeModules) {
    return <div>Loading...</div>;
  }

  if (errorFreeModules) {
    return <div>Error...</div>;
  }

  const handleModuleClick = (moduleId: number) => {
    setSelectedModule(moduleId);
  };

  return (
    <>
      {isOpen && (
        <>
          <div className="fixed top-0 left-0 w-full h-full min-h-screen bg-black opacity-70 z-30"></div>
          <div className="z-50 fixed top-0 left-0 flex items-center justify-center w-full h-full min-h-screen px-4 py-5">
            <div className="relative w-full max-w-[570px] bg-white z-50">
              <p
                onClick={() => onClose()}
                className="absolute top-2 right-2 text-3xl cursor-pointer"
              >
                &times;
              </p>
              <p className="p-3 ">
                <span className="text-sm">Course Preview</span>
                <span className="font-bold max-w-lg">
                  {freeModules[0]?.section?.course?.name}
                </span>
              </p>
              {freeModules.length > 0 ? (
                <>
                  <div>
                    <ReactPlayer
                      url={
                        selectedModule !== null
                          ? freeModules[selectedModule]?.video_url
                          : ""
                      }
                      controls
                      width="100%"
                      height="100%"
                      playing
                    />
                  </div>
                  <div className="divide-y divide-gray-500 border-y border-gray-500">
                    {freeModules.map((module: any, index: number) => (
                      <div
                        key={module.id}
                        className={`bg-gray-200 p-3 flex gap-3 cursor-pointer ${
                          selectedModule === index ? "bg-blue-200" : ""
                        }`}
                        onClick={() => handleModuleClick(index)}
                      >
                        <p>
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
                              d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                            />
                          </svg>
                        </p>
                        <p>{module.name}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="p-3 text-xl font-semibold text-center pb-5">
                  No free modules available
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ConfirmationModal;
