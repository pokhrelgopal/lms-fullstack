/* eslint-disable @next/next/no-img-element */
import React from "react";
import convertToTimeAgo from "@/services/timeAgo";
import { API_URL } from "@/utils/endpoints";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useQuery,
  useQueryClient,
  InvalidateQueryFilters,
} from "@tanstack/react-query";
import { addReview, checkEnrollment } from "@/utils/api";
interface Props {
  reviews: any;
  course_id: any;
}

//Function to display toast notification
const toastNotification = ({ message, type }: any) => {
  if (message) {
    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "warning":
        toast.warning(message);
        break;
      default:
        toast.info(message);
        break;
    }
  }
};

const Review = ({ reviews, course_id }: Props) => {
  const [rating, setRating] = React.useState<any>(0);
  const [comment, setComment] = React.useState<any>("");
  const user_id = localStorage.getItem("user_id");
  const queryClient = useQueryClient();
  const handleComment = async (e: any) => {
    const isEnrolled = await checkEnrollment(course_id);
    if (!isEnrolled) {
      toastNotification({
        message: "You need to enroll in this course first",
        type: "error",
      });
      setComment("");
      return;
    }
    if (!comment || comment.trim().length < 0) return;
    const formData = {
      course_id,
      user_id,
      rating,
      review: comment,
    };
    const response = await addReview(formData);
    if (response?.response?.data?.non_field_errors) {
      toastNotification({
        message: "Something went wrong, please try again later",
        type: "error",
      });
      return;
    }
    setComment("");
    setRating(0);
    queryClient.invalidateQueries("course-details" as InvalidateQueryFilters);
  };
  return (
    <>
      <ToastContainer position="bottom-right" />
      <div className="w-[700px]">
        <h1 className="text-2xl font-bold mb-3">
          {!reviews ? " (No Reviews yet)" : `Reviews (${reviews.length}) `}
        </h1>
        <div className="my-3 mb-8">
          <form action="" method="post" onSubmit={(e) => e.preventDefault()}>
            <div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                name="comment"
                id="comment"
                rows={3}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="Write a review"
              ></textarea>
            </div>
            <div className="mb-4">
              <select
                onChange={(e) => setRating(e.target.value)}
                name="rating"
                id="rating"
                className="w-full border border-gray-300 rounded p-2"
              >
                <option value="">Select a rating</option>
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>
            <button
              onClick={handleComment}
              type="submit"
              className="block bg-indigo-700 hover:bg-indigo-800 transition duration-300 text-white rounded px-4 py-2"
            >
              Submit Review
            </button>
            {/* </div> */}
          </form>
        </div>
        <div className="space-y-5">
          {reviews.map((review: any) => {
            return (
              <div key={review.id}>
                <div className="flex items-center">
                  <img
                    src={`${API_URL}${review.user.profile_image}`}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="ml-2 flex items-center gap-5">
                    <h3 className=" font-semibold">{review.user.full_name}</h3>
                    <p className="text-sm text-gray-500">
                      {convertToTimeAgo(review.created_at)}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="flex">
                    {Array.from({ length: review.rating }, (_, i) => (
                      <StarComponent key={i} />
                    ))}
                  </p>
                </div>
                <div className="mt-2">
                  <p className="">{review.review}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Review;

export function StarComponent({ color }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`w-5 h-5 text-yellow-500 ${color}`}
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
