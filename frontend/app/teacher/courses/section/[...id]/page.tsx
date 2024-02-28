"use client";
import { useParams } from "next/navigation";
import React from "react";

import {
  useQuery,
  useQueryClient,
  InvalidateQueryFilters,
} from "@tanstack/react-query";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
import { getSectionById, updateSection } from "@/utils/api";
import Spinner from "@/components/elements/Spinner";
import Module from "@/components/elements/Module";
import Quizzes from "@/components/elements/Quizzes";

const SectionEdit = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<any>({
    queryKey: ["course-progress", id],
    queryFn: () => getSectionById(id),
    enabled: !!id,
  });
  const [name, setName] = React.useState("");
  const [order, setOrder] = React.useState("");
  const [description, setDescription] = React.useState("");
  React.useEffect(() => {
    if (data) {
      setName(data.name);
      setOrder(data.order);
      setDescription(data.description);
    }
  }, [data]);
  if (isLoading) {
    return <Spinner />;
  }
  const handleSectionUpdate = async () => {
    if (!name || !order || !description) {
      return MySwal.fire({
        icon: "error",
        text: "Please fill all the fields",
      });
    }
    const formData = {
      name,
      order,
      description,
    };
    try {
      await updateSection(id, formData);
      queryClient.invalidateQueries("course-details" as InvalidateQueryFilters);
      MySwal.fire({
        icon: "success",
        text: "Section updated successfully",
      });
    } catch (error) {
      MySwal.fire({
        icon: "error",
        text: "Something went wrong",
      });
    }
  };
  return (
    <>
      {" "}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <h1 className="text-xl md:text-2xl font-bold mb-4">Update Section</h1>
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
                onClick={handleSectionUpdate}
                className="bg-indigo-700 px-4 py-2 w-full mt-3 text-white rounded"
              >
                Update Section
              </button>
            </div>
          </form>
          <div className="mt-5">
            <h1 className="text-xl md:text-2xl font-bold mb-4">
              Section Quizzes
            </h1>
            <Quizzes sectionID={id[0]} quizzes={data?.quizzes} />
          </div>
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold mb-4">
            Section Modules
          </h1>
          <Module sectionID={id[0]} modules={data?.modules} />
        </div>
      </section>
    </>
  );
};

export default SectionEdit;
