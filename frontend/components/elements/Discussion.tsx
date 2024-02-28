/* eslint-disable @next/next/no-img-element */
import convertToTimeAgo from "@/services/timeAgo";
import { API_URL } from "@/utils/endpoints";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useQuery,
  useQueryClient,
  InvalidateQueryFilters,
} from "@tanstack/react-query";
import {
  checkEnrollment,
  createDiscussion,
  postComment,
  replyToComment,
} from "@/utils/api";
import useAuth from "@/hooks/useAuth";

interface Props {
  course_id: any;
  discussion: any;
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

const Discussion = ({ discussion, course_id }: Props) => {
  const queryClient = useQueryClient();
  const [replyFormIndex, setReplyFormIndex] = useState<number | null>(null);
  const [selectedCommentId, setSelectedCommentId] = useState<any>(null);
  const [comment, setComment] = useState<any>("");
  const [reply, setReply] = useState<any>("");
  const [showAllComments, setShowAllComments] = useState<boolean>(false);

  const comments = discussion[0]?.comments;
  const user_id = localStorage.getItem("user_id");

  const handleReplyClick = (index: number, id: any) => {
    setSelectedCommentId(id);
    setReplyFormIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  const handleReply = async (e: any) => {
    const isEnrolled = await checkEnrollment(course_id);
    if (!isEnrolled) {
      toastNotification({
        message: "You need to enroll in this course first",
        type: "error",
      });
      setReply("");
      return;
    }
    if (!reply || reply.trim().length < 0) return;
    const formData = {
      comment_id: selectedCommentId,
      user_id,
      reply,
    };
    try {
      await replyToComment(formData);
      setReply("");
      setReplyFormIndex(null);
      queryClient.invalidateQueries("course-details" as InvalidateQueryFilters);
    } catch (error) {
      console.error(error);
    }
  };
  const handleComment = async (e: any) => {
    if (!comment || comment.trim().length < 0) return;
    const formData = {
      discussion_id: discussion[0].id,
      user_id,
      comment,
    };
    try {
      await postComment(formData);
      setComment("");
      queryClient.invalidateQueries("course-details" as InvalidateQueryFilters);
    } catch (error) {
      console.error(error);
    }
  };

  const discussionId = discussion[0]?.id;
  const { isLoggedIn } = useAuth();
  // const isEnrolled = await checkEnrollment(course_id);
  return (
    <>
      <div className="">
        <h1 className="text-2xl font-bold mb-3">
          {!discussionId ? " (No discussions yet)" : "Discussions"}
        </h1>
        {!discussionId && isLoggedIn && (
          <div>
            <button
              onClick={async () => {
                const formData = {
                  course_id,
                };
                const isEnrolled = await checkEnrollment(course_id);
                if (!isEnrolled) {
                  toastNotification({
                    message: "You need to enroll in this course first",
                    type: "error",
                  });
                  return;
                }
                try {
                  createDiscussion(formData);
                  queryClient.invalidateQueries(
                    "course-details" as InvalidateQueryFilters
                  );
                } catch (error) {
                  console.error(error);
                }
              }}
              type="submit"
              className="mt-5 block bg-indigo-700 hover:bg-indigo-800 transition duration-300 text-white rounded px-4 py-2"
            >
              Start a discussion
            </button>
          </div>
        )}

        {discussionId && (
          <div className="my-3">
            <form action="" method="post" onSubmit={(e) => e.preventDefault()}>
              <div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  name="comment"
                  id="comment"
                  rows={3}
                  className="w-full border border-gray-300 rounded p-2"
                  placeholder="Start a discussion"
                ></textarea>
                <button
                  onClick={handleComment}
                  type="submit"
                  className="block w-32 bg-indigo-700 hover:bg-indigo-800 transition duration-300 text-white rounded px-4 py-2"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="divide-y divide-gray-300">
          {comments &&
            comments
              .slice(0, showAllComments ? comments.length : 1)
              .map((comment: any, index: number) => (
                <div key={comment.id} className="mb-4 py-4">
                  <div className="flex items-center mb-2">
                    <img
                      src={`${API_URL}${comment.user.profile_image}`}
                      alt="Profile"
                      className="w-10 h-10 rounded-full mr-2 object-cover"
                    />
                    <span className="font-semibold">
                      {comment.user.full_name}
                    </span>{" "}
                    <span className="text-xs ml-3">
                      {convertToTimeAgo(comment.updated_at)}
                    </span>
                  </div>

                  <p className="text-gray-600">{comment.comment}</p>
                  <p
                    className="mt-2 flex items-center gap-2 text-gray-500 cursor-pointer w-fit"
                    onClick={() => handleReplyClick(index, comment.id)}
                  >
                    <span>Reply</span>
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
                        d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                      />
                    </svg>
                  </p>

                  {replyFormIndex === index && (
                    <form
                      action=""
                      method="post"
                      onSubmit={(e) => e.preventDefault()}
                      className="mt-2"
                    >
                      <div>
                        <textarea
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                          name="reply"
                          id="reply"
                          className="w-full border border-gray-300 rounded p-2"
                          placeholder="Reply to this discussion"
                        ></textarea>
                        <button
                          onClick={handleReply}
                          type="submit"
                          className="block bg-indigo-700 hover:bg-indigo-800 transition duration-300 text-white rounded px-4 py-2"
                        >
                          Reply
                        </button>
                      </div>
                    </form>
                  )}

                  {comment.replies &&
                    comment.replies.map((reply: any) => (
                      <div key={reply.id} className="ml-8 mt-4 p-2">
                        <div className="flex items-center mb-2">
                          <img
                            src={`${API_URL}${reply.user.profile_image}`}
                            alt="Profile"
                            className="w-8 h-8 rounded-full object-cover mr-2"
                          />
                          <span className="font-semibold">
                            {reply.user.full_name}
                          </span>
                          <span className="text-xs ml-3">
                            {convertToTimeAgo(reply.updated_at)}
                          </span>
                        </div>

                        <p className="text-gray-600">{reply.reply}</p>
                      </div>
                    ))}
                </div>
              ))}
        </div>
        {comments && comments.length > 1 && !showAllComments && (
          <button
            onClick={() => setShowAllComments(true)}
            className="text-blue-500 cursor-pointer"
          >
            Show All Comments
          </button>
        )}
        {
          // show less
          comments && comments.length > 1 && showAllComments && (
            <button
              onClick={() => setShowAllComments(false)}
              className="text-blue-500 cursor-pointer"
            >
              Show Less
            </button>
          )
        }
      </div>
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default Discussion;
