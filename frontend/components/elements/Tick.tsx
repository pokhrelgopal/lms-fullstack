import { checkModuleCompletion, createProgress } from "@/utils/api";
import React from "react";
import {
  useQuery,
  useQueryClient,
  InvalidateQueryFilters,
} from "@tanstack/react-query";

interface Props {
  module_id: any;
  module_name: any;
}

const Tick = ({ module_id, module_name }: Props) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<any>({
    queryKey: ["module-completion", module_id],
    queryFn: () => checkModuleCompletion(module_id),
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error loading progress</div>;
  }
  const { completed } = data;
  const handleComplete = async () => {
    const user_id = localStorage.getItem("user_id");
    const formData = {
      user_id,
      module_id,
      completed: true,
    };
    await createProgress(formData);
    queryClient.invalidateQueries(
      "module-completion" as InvalidateQueryFilters
    );
  };
  return (
    <>
      <div className="flex items-center gap-2">
        {completed ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 text-green-500 h-5"
          >
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <span className="cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
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
        )}
        <span className="text-sm ml-2">{module_name}</span>
      </div>
      {!completed && (
        <div className="flex justify-end">
          <button
            onClick={handleComplete}
            className="underline underline-offset-4 text-blue-600 flex items-center gap-2 py-1 px-2 rounded text-sm mt-2"
          >
            Mark as completed
          </button>
        </div>
      )}
    </>
  );
};

export default Tick;
