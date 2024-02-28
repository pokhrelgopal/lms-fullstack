/* eslint-disable @next/next/no-img-element */
import React from "react";
interface Props {
  instructor: any;
}
const InstructorCard = ({ instructor }: Props) => {
  return (
    <div className="bg-white p-1 rounded-md shadow-sm py-10">
      <div className="flex items-center justify-center">
        <img
          src={instructor.profile_image}
          alt="instructor"
          className="object-cover h-24 w-24 rounded-full"
        />
      </div>
      <p className="text-center pt-4 font-semibold">{instructor.full_name}</p>
      <p className="text-center pt-1 text-xs">Instructor</p>
      <p className="p-4 text-sm text-center">
        {instructor.about?.length > 100
          ? instructor.about?.substring(0, 100) + "..."
          : instructor.about}
      </p>
      <p className="flex justify-center">
        <button className="border-2 rounded-full px-3 py-1.5 border-emerald-700 bg-emerald-700 text-white hover:bg-white hover:text-black transition ease-in-out duration-300">
          View Profile
        </button>
      </p>
    </div>
  );
};

export default InstructorCard;
