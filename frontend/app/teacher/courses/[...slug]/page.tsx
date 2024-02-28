/* eslint-disable @next/next/no-img-element */
"use client";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  useQuery,
  useQueryClient,
  InvalidateQueryFilters,
} from "@tanstack/react-query";
import {
  getCourseBySlug,
  updateCourse,
  fetchCategories,
  deleteCourse,
  getModuleCount,
} from "@/utils/api";
import Spinner from "@/components/elements/Spinner";
import Error from "@/components/elements/Error";
import Section from "@/components/elements/Section";

const SingleCourse = () => {
  const { slug } = useParams();

  const {
    isLoading: isLoadingCourseDetails,
    error: errorCourseDetails,
    data: courseDetails,
  } = useQuery<any>({
    queryKey: ["course-details", slug],
    queryFn: () => getCourseBySlug(slug),
  });

  const {
    isLoading: isLoadingCategories,
    error: errorCategories,
    data: categories,
  } = useQuery<any>({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
  });

  const {
    isLoading: isLoadingModuleCount,
    error: errorModuleCount,
    data: moduleCount,
  } = useQuery<any>({
    queryKey: ["modules"],
    queryFn: () => getModuleCount(courseDetails?.id),
    enabled: !!courseDetails?.id,
  });

  const queryClient = useQueryClient();

  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [language, setLanguage] = useState("");
  const [categoryID, setCategoryID] = useState("");
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    if (courseDetails) {
      setCourseName(courseDetails.name || "");
      setDescription(courseDetails.description || "");
      setDifficultyLevel(courseDetails.level_of_difficulty || "");
      setPrice(courseDetails.price || "");
      setDuration(courseDetails.duration || "");
      setLanguage(courseDetails.language || "");
    }
  }, [courseDetails]);

  const handleImageChange = (e: any) => {
    setNewImage(e.target.files[0]);
  };

  if (isLoadingCourseDetails || isLoadingCategories || isLoadingModuleCount) {
    return <Spinner />;
  }
  if (errorCourseDetails || errorCategories || errorModuleCount) {
    return <Error />;
  }

  //! Publish/Unpublish Course
  const handlePublish = async () => {
    const { modules_count } = moduleCount;

    if (
      description.trim().length == 0 ||
      courseName.trim().length == 0 ||
      difficultyLevel.trim().length == 0 ||
      !price ||
      !duration ||
      language.trim().length == 0
    ) {
      MySwal.fire({
        title: "Cannot Publish",
        text: "Please fill all the fields.",
        icon: "warning",
        confirmButtonText: "Okay",
      });
      return;
    }

    if (courseDetails.publish_status && modules_count == 0) {
      let formData = {
        publish_status: !courseDetails.publish_status,
      };
      const response = await updateCourse(courseDetails?.url_slug, formData);
      const { id } = response;
      if (id) {
        queryClient.invalidateQueries(
          "course-details" as InvalidateQueryFilters
        );
        MySwal.fire({
          title: "Course Updated Successfully!",
          icon: "success",
          confirmButtonText: "Okay",
        });
      }
    }
    if (modules_count > 0) {
      let formData = {
        publish_status: !courseDetails.publish_status,
      };
      const response = await updateCourse(courseDetails?.url_slug, formData);
      const { id } = response;
      if (id) {
        queryClient.invalidateQueries(
          "course-details" as InvalidateQueryFilters
        );
        MySwal.fire({
          title: "Course Updated Successfully!",
          icon: "success",
          confirmButtonText: "Okay",
        });
      }
    } else {
      MySwal.fire({
        title: "Cannot Publish",
        text: "A course must have at least one module to be published.",
        icon: "warning",
        confirmButtonText: "Okay",
      });
    }
  };
  const handleUpdate = async () => {
    let formData = new FormData();
    formData.append("name", courseName);
    formData.append("description", description);
    formData.append("level_of_difficulty", difficultyLevel);
    formData.append("price", price);
    formData.append("duration", duration);
    formData.append("language", language);
    if (newImage) {
      formData.append("thumbnail_image", newImage);
    }
    if (categoryID != "None") {
      formData.append("category_id", categoryID);
    }
    console.log(courseName);
    console.log(description);
    console.log(difficultyLevel);
    console.log(price);
    console.log(duration);
    console.log(language);

    if (
      description.trim().length == 0 ||
      courseName.trim().length == 0 ||
      difficultyLevel.trim().length == 0 ||
      !price ||
      !duration ||
      language.trim().length == 0
    ) {
      MySwal.fire({
        title: "Cannot Update",
        text: "Please fill all the fields.",
        icon: "warning",
        confirmButtonText: "Okay",
      });
      return;
    }

    const response = await updateCourse(courseDetails?.url_slug, formData);
    const { id } = response;
    if (id) {
      queryClient.invalidateQueries("course-details" as InvalidateQueryFilters);
      MySwal.fire({
        title: "Course Updated Successfully!",
        icon: "success",
        confirmButtonText: "Okay",
      });
      window.location.href = `/teacher/courses`;
    }
  };
  const handleDeleteCourse = async (slug: any) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCourse(slug);
          queryClient.invalidateQueries(
            "course-details" as InvalidateQueryFilters
          );
          Swal.fire({
            title: "Deleted!",
            text: "Course has been deleted.",
            icon: "success",
          }).then(() => {
            window.location.href = `/teacher/courses`;
          });
        } catch (error) {
          console.error("Error deleting course:", error);
          Swal.fire({
            title: "Error",
            text: "An error occurred while deleting the course.",
            icon: "error",
          });
        }
      }
    });
  };
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold mb-4">Update Course</h1>
        <div className="flex space-x-2 items-center justify-center">
          <button
            onClick={handlePublish}
            className={`bg-indigo-700 px-3 py-2 text-white rounded`}
          >
            {courseDetails.publish_status ? "Unpublish" : "Publish"}
          </button>
          <button
            onClick={() => handleDeleteCourse(courseDetails.url_slug)}
            className={`bg-red-500 px-3 py-2 text-white rounded`}
          >
            Delete
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <form action="" method="post" onSubmit={(e) => e.preventDefault()}>
            <div className="mb-3">
              <label className="md:text-lg font-semibold">Course Name</label>
              <input
                type="text"
                className="border border-neutral-300 rounded p-2 w-full mt-1"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="Eg. Introduction to Programming"
              />
            </div>
            <div>
              <label className="md:text-lg font-semibold">Description</label>
              <textarea
                name="description"
                id="description"
                rows={5}
                className="border border-neutral-300 rounded p-2 w-full mt-1"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Eg. Introduction to Programming"
              />
            </div>
            <div>
              <label className="md:text-lg font-semibold">Category</label>
              <select
                className="border border-neutral-300 rounded p-2 w-full mt-1"
                value={categoryID}
                onChange={(e) => setCategoryID(e.target.value)}
              >
                <option value="None">Select Category</option>
                {categories.map((category: any) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="md:text-lg font-semibold">
                Level of Difficulty
              </label>
              <select
                className="border border-neutral-300 rounded p-2 w-full mt-1"
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(e.target.value)}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="md:text-lg font-semibold">Price(NPR)</label>
              <input
                type="number"
                className="border border-neutral-300 rounded p-2 w-full mt-1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="md:text-lg font-semibold">
                Duration (in hours)
              </label>
              <input
                type="number"
                className="border border-neutral-300 rounded p-2 w-full mt-1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="md:text-lg font-semibold">Language</label>
              <input
                type="text"
                className="border border-neutral-300 rounded p-2 w-full mt-1"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="md:text-lg font-semibold">
                Thumbnail Image
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <p className=" text-center my-2">
                    <span className="md:text-lg font-semibold">
                      Current Image
                    </span>
                  </p>
                  <img
                    src={courseDetails.thumbnail_image}
                    alt=""
                    className="h-48 w-full object-cover"
                  />
                </div>
                <div>
                  <p className=" text-center my-2 w-full">
                    <span className="md:text-lg text-center font-semibold">
                      New Image
                    </span>
                  </p>
                  {newImage ? (
                    <img
                      src={URL.createObjectURL(newImage)}
                      alt=""
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="h-48 w-full border-dashed border-2 border-neutral-300 flex items-center justify-center"></div>
                  )}
                </div>
              </div>
              <br />
              <input type="file" onChange={handleImageChange} />
            </div>
            <div>
              <button
                onClick={handleUpdate}
                className="bg-indigo-700 px-4 py-2 text-white rounded"
              >
                Update Course
              </button>
            </div>
          </form>
        </div>
        <div>
          <Section
            section={courseDetails.sections}
            courseID={courseDetails.id}
          />
        </div>
      </div>
    </section>
  );
};

export default SingleCourse;
