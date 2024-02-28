"use client";
import React from "react";
import { createCourse } from "@/utils/api";

const AddCourse = () => {
  const [courseName, setCourseName] = React.useState("");
  const handleCreation = async () => {
    const formData = {
      name: courseName,
      instructor_id: localStorage.getItem("user_id"),
    };
    const response = await createCourse(formData);
    const { url_slug } = response;
    if (url_slug) {
      window.location.href = `/teacher/courses/${url_slug}`;
    }
  };
  return (
    <div className="mt-20">
      <h1 className="text-3xl font-bold">Create Course</h1>
      <p className="my-2 text-lg">
        Please enter the name of your course. Course name must be unique.
      </p>
      <form
        action=""
        className="flex flex-col"
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          <input
            className="border border-neutral-300 rounded px-4 py-3 w-full md:w-1/2 mt-3"
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="Eg. Introduction to Programming"
          />
        </div>
        <div className="mt-4">
          <button
            onClick={handleCreation}
            className="bg-indigo-700 px-4 py-2 text-white rounded"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourse;
