"use client";
import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  useQuery,
  useQueryClient,
  InvalidateQueryFilters,
} from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  createResource,
  deleteResource,
  getModuleById,
  updateModule,
} from "@/utils/api";
import Spinner from "@/components/elements/Spinner";

const MySwal = withReactContent(Swal);

const SingleModule = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery<any>({
    queryKey: ["module", id[0]],
    queryFn: () => getModuleById(id[0]),
    enabled: !!id,
  });
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = React.useState(false);
  const [resourceName, setResourceName] = React.useState("");
  const [resourceFile, setResourceFile] = useState<File | null>(null);
  const [name, setName] = useState<any>("");
  const [description, setDescription] = useState<any>("");
  const [order, setOrder] = useState<any>(0);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [duration, setDuration] = useState<any>(0);
  const [isFree, setIsFree] = useState<any>(false);

  React.useEffect(() => {
    if (data) {
      setName(data.name);
      setDescription(data.description);
      setOrder(data.order);
      setDuration(data.duration);
      setIsFree(data.is_free);
    }
  }, [data]);
  if (isLoading) return <Spinner />;

  const handleUpdateModule = async () => {
    if (!name || !description || !order || !duration) {
      return MySwal.fire({
        icon: "error",
        text: "Please fill all fields!",
      });
    }
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("order", String(Number(order)));
      formData.append("duration", String(Number(duration)));
      formData.append("is_free", String(isFree));

      if (videoFile) {
        formData.append("video_url", videoFile || "");
      }

      formData.append("section_id", data.section.id);
      await updateModule(formData, id);
      queryClient.invalidateQueries("module" as InvalidateQueryFilters);
      MySwal.fire({
        icon: "success",
        title: "Module updated successfully!",
      });
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Error updating module",
        text: "An error occurred while updating the module.",
      });
    }
  };
  const handleAddResource = async () => {
    if (!resourceName || !resourceFile) {
      return MySwal.fire({
        icon: "error",
        text: "Please fill all fields!",
      });
    }
    try {
      const formData = new FormData();
      formData.append("title", resourceName);
      formData.append("description", "");
      formData.append("file", resourceFile || "");
      formData.append("module_id", id[0]);
      await createResource(formData);
      queryClient.invalidateQueries("module" as InvalidateQueryFilters);
      MySwal.fire({
        icon: "success",
        title: "Resource added successfully!",
      });
      setResourceName("");
      setResourceFile(null);
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Error adding resource",
        text: "An error occurred while adding the resource.",
      });
    }
  };
  const handleResourceDelete = async (id: string) => {
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
          await deleteResource(id);
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
      <form className="" onSubmit={(e) => e.preventDefault()}>
        <h1 className="text-2xl font-bold mb-5">Update Module</h1>
        <div className="mb-3">
          <label htmlFor="name" className="font-semibold">
            Module Name
          </label>
          <input
            type="text"
            id="name"
            className="border border-neutral-300 rounded p-2 w-full mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Module Name"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="order" className="font-semibold">
            Module Order
          </label>
          <input
            type="number"
            id="order"
            className="border border-neutral-300 rounded p-2 w-full mt-1"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            placeholder="Module Order"
          />
        </div>
        <div>
          <label htmlFor="description" className="font-semibold">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="border border-neutral-300 rounded p-2 w-full mt-1"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="duration" className="font-semibold">
            Duration (in minutes)
          </label>
          <input
            type="number"
            id="duration"
            className="border border-neutral-300 rounded p-2 w-full mt-1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Duration"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="videoFile" className="font-semibold">
            Video File
          </label>
          {/* preview existing video */}
          {data?.video_url && (
            <video
              src={data?.video_url}
              controls
              className="my-2 w-full h-full object-cover"
            />
          )}
          <br />
          <input
            type="file"
            id="videoFile"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
          />
        </div>
        <div className="mb-3 flex items-center gap-2">
          <label htmlFor="isFree" className="font-semibold">
            Is Free
          </label>
          <input
            type="checkbox"
            id="isFree"
            className="border border-neutral-300 h-6 rounded p-2 mt-1"
            checked={isFree}
            onChange={(e) => setIsFree(e.target.checked)}
            placeholder="Is Free"
          />
        </div>
        <div>
          <button
            onClick={handleUpdateModule}
            className="bg-indigo-700 px-4 py-2 w-full mt-3 text-white rounded"
          >
            Update Module
          </button>
        </div>
      </form>
      <div>
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold mb-5">Resources</h1>
          </div>
          <div>
            {data?.resources?.map((resource: any) => (
              <div
                key={resource.id}
                className="flex justify-between items-center border border-neutral-300 rounded p-2 mb-2"
              >
                <div>
                  <p className="font-semibold">{resource.title}</p>
                  <p className="text-sm">{resource.description}</p>
                </div>
                <div>
                  <button
                    onClick={() => handleResourceDelete(resource.id)}
                    className="bg-red-700 px-4 py-2 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-700 px-4 py-2 mt-3 text-white rounded"
          >
            {!showForm ? "Show Form" : "Hide Form"}
          </button>
          {showForm && (
            <div className="mt-7">
              <div className="mb-3">
                <label htmlFor="resourceName" className="font-semibold">
                  Resource Name
                </label>
                <input
                  type="text"
                  id="resourceName"
                  className="border border-neutral-300 rounded p-2 w-full mt-1"
                  value={resourceName}
                  onChange={(e) => setResourceName(e.target.value)}
                  placeholder="Resource Name"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="resourceFile" className="font-semibold">
                  Resource File
                </label>{" "}
                <br />
                <input
                  type="file"
                  id="resourceFile"
                  accept="video/*"
                  onChange={(e) => setResourceFile(e.target.files?.[0] || null)}
                />
              </div>
              <div>
                <button
                  onClick={handleAddResource}
                  className="bg-indigo-700 px-4 py-2 w-full mt-3 text-white rounded"
                >
                  Add Resource
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleModule;
