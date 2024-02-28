"use client";
import { fetchSectionModules } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
interface Props {
  section: any;
}

const SectionCard = ({ section }: Props) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownClick = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="bg-gray-50 p-4 rounded">
      <div className="flex items-center justify-between">
        <p className="text-lg">{section?.name}</p>
        <p onClick={handleDropdownClick} className="cursor-pointer">
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
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
        </p>
      </div>
      {isDropdownOpen && (
        <div className="mt-2 py-2">
          <DisplayModules id={section.id} />
        </div>
      )}
    </div>
  );
};

export default SectionCard;

interface DisplayModulesProps {
  id: string;
}

export const DisplayModules = ({ id }: DisplayModulesProps) => {
  const { isLoading, error, data } = useQuery<any>({
    queryKey: ["section-modules", id],
    queryFn: () => fetchSectionModules(id),
  });
  return (
    <>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error</div>}
      {data && (
        <div className="">
          {data?.modules?.map((module: any) => (
            <div className="flex items-center gap-2" key={module.id}>
              <p>
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
              </p>
              <p className="font-thin text-sm">{module.name}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
