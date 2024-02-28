import { createSection, deleteSection } from "@/utils/api";
import React from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

import {
  useQuery,
  useQueryClient,
  InvalidateQueryFilters,
} from "@tanstack/react-query";
import Link from "next/link";

interface Props {
  courseID: string;
  section: any;
}

const Section = ({ courseID, section }: Props) => {
  const [showForm, setShowForm] = React.useState(false);
  const [name, setName] = React.useState("");
  const [order, setOrder] = React.useState("");
  const [description, setDescription] = React.useState("");
  const queryClient = useQueryClient();
  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteSection(id);
          queryClient.invalidateQueries(
            "course-details" as InvalidateQueryFilters
          );

          Swal.fire({
            title: "Deleted!",
            text: "Section has been deleted.",
            icon: "success",
          });
        } catch (error) {
          console.error("Error deleting section:", error);
          Swal.fire({
            title: "Error",
            text: "An error occurred while deleting the section.",
            icon: "error",
          });
        }
      }
    });
  };

  const handleCreateSection = async () => {
    if (!name || !order || !description) {
      return MySwal.fire({
        title: "Error",
        text: "Please fill out all the fields.",
        icon: "error",
      });
    }
    try {
      const res = await createSection({
        course_id: courseID,
        name,
        description,
        order,
      });
      if (res.response?.data?.non_field_errors[0]) {
        return MySwal.fire({
          title: "Error",
          text: "Section with that name already exists.",
          icon: "error",
        });
      }
      queryClient.invalidateQueries("course-details" as InvalidateQueryFilters);
      setShowForm(false);
      setName("");
      setOrder("");
      setDescription("");
      Swal.fire({
        title: "Created!",
        text: "Section has been created.",
        icon: "success",
      });
    } catch (error) {
      console.error("Error creating section:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while creating the section.",
        icon: "error",
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Sections</h1>
      </div>
      <div className="mt-1">
        {section?.map((item: any) => (
          <div key={item.id} className="border rounded-md p-2 mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className=" mr-3">{item.order}.</span>
                <span>{item.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Link href={`/teacher/courses/section/${item.id}`}>
                  <p>
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
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                  </p>
                </Link>
                <p onClick={() => handleDelete(item.id)}>
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
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-neutral-700 px-4 py-2 text-white rounded"
      >
        {!showForm ? "Show Form" : "Hide Form"}
      </button>
      {showForm && (
        <form className="mt-3" onSubmit={(e) => e.preventDefault()}>
          <div className="mb-3">
            <input
              type="text"
              className="border border-neutral-300 rounded p-2 w-full mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Section Name"
            />
          </div>
          <div className="mb-3">
            <input
              type="number"
              className="border border-neutral-300 rounded p-2 w-full mt-1"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              placeholder="Section Order"
            />
          </div>
          <div>
            <textarea
              name="description"
              id="description"
              rows={3}
              className="border border-neutral-300 rounded p-2 w-full mt-1"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />
          </div>
          <div>
            <button
              onClick={handleCreateSection}
              className="bg-indigo-700 px-4 py-2 w-full mt-3 text-white rounded"
            >
              Add Section
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Section;
