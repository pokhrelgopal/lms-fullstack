import React, { useState } from "react";

interface CourseDetailsProps {
  courseDetails: any;
}

const CourseDetails = ({ courseDetails }: CourseDetailsProps) => {
  const [selectedSection, setSelectedSection] = useState<number | null>(null);

  const handleSectionClick = (index: number) => {
    setSelectedSection(selectedSection === index ? null : index);
  };

  return (
    <div className="">
      <h1 className="text-2xl font-bold mt-4 mb-2">Course Description</h1>
      <p className="text-justify">{courseDetails.description}</p>
      <div className="mt-4 md:mt-8">
        <h1 className="text-2xl font-bold">Course Contents</h1>
        <div className="divide-y divide-neutral-400">
          {courseDetails?.sections?.map((section: any, index: number) => (
            <div key={index} className="mb-3">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => handleSectionClick(index)}
              >
                <h1 className="md:text-lg mt-4 mb-2">{section.name}</h1>
                <p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`w-4 h-4 ${
                      selectedSection === index ? "transform rotate-180" : ""
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </p>
              </div>

              {selectedSection === index && (
                <div className="ml-2 space-y-3">
                  {section?.modules?.map((lesson: any, lessonIndex: number) => (
                    <p key={lessonIndex} className="flex items-center gap-3">
                      <span>
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
                            d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                          />
                        </svg>
                      </span>
                      <span className="">{lesson.name}</span>
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
