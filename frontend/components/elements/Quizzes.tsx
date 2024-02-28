import { createQuiz, deleteQuiz } from "@/utils/api";
import Link from "next/link";
import React from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

import {
  useQuery,
  useQueryClient,
  InvalidateQueryFilters,
} from "@tanstack/react-query";

interface Props {
  sectionID: any;
  quizzes: any;
}
const Quizzes = ({ sectionID, quizzes }: Props) => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = React.useState(false);
  const [question, setQuestion] = React.useState("");
  const [order, setOrder] = React.useState<number | string>("");
  const [option_1, setOption_1] = React.useState("");
  const [option_2, setOption_2] = React.useState("");
  const [option_3, setOption_3] = React.useState("");
  const [option_4, setOption_4] = React.useState("");
  const [answer, setAnswer] = React.useState("");

  const sortedQuizzes = quizzes
    .slice()
    .sort((a: any, b: any) => a.order - b.order);

  const handleCreateQuiz = async () => {
    if (
      !question ||
      !order ||
      !option_1 ||
      !option_2 ||
      !option_3 ||
      !option_4 ||
      !answer
    ) {
      return MySwal.fire({
        icon: "error",
        text: "Please fill all fields!",
      });
    }
    if (
      answer.trim() !== option_1.trim() &&
      answer.trim() !== option_2.trim() &&
      answer.trim() !== option_3.trim() &&
      answer.trim() !== option_4.trim()
    ) {
      return MySwal.fire({
        icon: "error",
        text: "Answer must be one of the options!",
      });
    }
    try {
      await createQuiz({
        question,
        order: Number(order),
        option_1,
        option_2,
        option_3,
        option_4,
        answer,
        section_id: sectionID,
      });
      queryClient.invalidateQueries("course-details" as InvalidateQueryFilters);
      MySwal.fire({
        icon: "success",
        text: "Quiz created successfully!",
      });
      setQuestion("");
      setOrder("");
      setOption_1("");
      setOption_2("");
      setOption_3("");
      setOption_4("");
      setAnswer("");
      setShowForm(false);
    } catch (error) {
      MySwal.fire({
        icon: "error",
        text: "Something went wrong!",
      });
    }
  };
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
          await deleteQuiz(id);
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
    <section className="md:mb-6">
      <div className="mt-1">
        {sortedQuizzes.map((quiz: any) => (
          <div key={quiz.id} className="border rounded-md p-2 mb-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <p className="text-gray-600">{quiz.order}.</p>
                <p className="ml-2">{quiz.question}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/teacher/courses/section/quiz/${quiz.id}`}>
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
                <p
                  className="cursor-pointer"
                  onClick={() => handleDelete(quiz.id)}
                >
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
        {!showForm ? "Add Quiz" : "Hide Form"}
      </button>
      {showForm && (
        <form className="mt-3" onSubmit={(e) => e.preventDefault()}>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Question"
              className="border rounded-md p-2 w-full"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="number"
              placeholder="Order"
              className="border rounded-md p-2 w-full"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="mb-3">
              <input
                type="text"
                placeholder="Option 1"
                className="border rounded-md p-2 w-full"
                value={option_1}
                onChange={(e) => setOption_1(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Option 2"
                className="border rounded-md p-2 w-full"
                value={option_2}
                onChange={(e) => setOption_2(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Option 3"
                className="border rounded-md p-2 w-full"
                value={option_3}
                onChange={(e) => setOption_3(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Option 4"
                className="border rounded-md p-2 w-full"
                value={option_4}
                onChange={(e) => setOption_4(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Answer"
              className="border rounded-md p-2 w-full"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </div>
          <button
            className="bg-indigo-700 w-full px-4 py-2 text-white rounded"
            onClick={handleCreateQuiz}
          >
            Add Quiz
          </button>
        </form>
      )}
    </section>
  );
};

export default Quizzes;
