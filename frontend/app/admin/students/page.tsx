/* eslint-disable @next/next/no-img-element */
"use client";
import {
  useQuery,
  useQueryClient,
  InvalidateQueryFilters,
} from "@tanstack/react-query";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
import React from "react";
import { deleteUserById, getUserByRole } from "@/utils/api";
import Spinner from "@/components/elements/Spinner";

const Students = () => {
  const queryClient = useQueryClient();
  const { data: students, isLoading: isLoadingStudents } = useQuery<any>({
    queryKey: ["students"],
    queryFn: () => getUserByRole("student"),
  });
  if (isLoadingStudents) {
    return <Spinner />;
  }
  const handleDeleteStudent = async (id: any) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this student!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });
    if (result.isConfirmed) {
      const res = await deleteUserById(id);
      console.log(res);
      queryClient.invalidateQueries("student" as InvalidateQueryFilters);

      await Swal.fire("Deleted!", "Your student has been deleted.", "success");
    }
  };
  return (
    <div>
      <section className="flex-1 px-2 md:px-4 py-4 md:py-8">
        {students && (
          <>
            <div className="grid grid-cols-1">
              {students?.map((student: any) => (
                <div
                  key={student.id}
                  className="w-full cursor-pointer rounded-md shadow-sm mb-4"
                >
                  <div className="bg-gray-100 p-4 rounded-md shadow-sm flex items-center justify-between">
                    <div className="flex items-center justify-center gap-4">
                      <img
                        src={student.profile_image}
                        alt="student"
                        className="object-cover h-10 w-10 rounded-full"
                      />
                      <p className="text-center font-semibold">
                        {student.full_name}
                      </p>
                      <p className="text-center text-sm">{student.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span onClick={() => handleDeleteStudent(student.id)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 text-red-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {isLoadingStudents && <Spinner />}
      </section>
    </div>
  );
};

export default Students;
