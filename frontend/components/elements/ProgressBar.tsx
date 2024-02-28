import { checkCourseProgress, getCertificate } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import React from "react";

interface Props {
  course_id: any;
}

const ProgressBar = ({ course_id }: Props) => {
  const { data, isLoading, error } = useQuery<any>({
    queryKey: ["course-progress", course_id],
    queryFn: () => checkCourseProgress(course_id),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading progress</div>;
  }
  console.log(data);
  const { completed_modules, total_modules } = data;
  const percentage = Math.floor((completed_modules / total_modules) * 100);

  const getCertification = async () => {
    const res = await getCertificate(course_id);
    console.log(res);
    window.location.href = res[0].certificate;
  };

  return (
    <div className="mt-1">
      {percentage === 100 ? (
        <div className="flex justify-end mt-2">
          <button
            onClick={getCertification}
            className="bg-green-500 text-white px-2 py-1 rounded text-xs"
          >
            Get Certificate
          </button>
        </div>
      ) : (
        <p className="text-gray-600 text-right text-sm font-semibold">
          {percentage} % completed
        </p>
      )}

      <div className="w-full h-2 bg-gray-300 rounded overflow-hidden mt-2">
        <div
          className="h-full bg-green-500 transition-width ease-in-out duration-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
