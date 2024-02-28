"use client";
import { getQuizById, updateQuiz } from "@/utils/api";
import React from "react";
import Swal from "sweetalert2";
import {
  useQuery,
  useQueryClient,
  InvalidateQueryFilters,
} from "@tanstack/react-query";

import withReactContent from "sweetalert2-react-content";
import { useParams } from "next/navigation";
import Spinner from "@/components/elements/Spinner";
const MySwal = withReactContent(Swal);
const SingleQuiz = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery<any>({
    queryKey: ["quiz", id],
    queryFn: () => getQuizById(id),
    enabled: !!id,
  });
  const queryClient = useQueryClient();
  const [question, setQuestion] = React.useState<string>("");
  const [answer, setAnswer] = React.useState<string>("");
  const [order, setOrder] = React.useState<number>(0);
  const [option1, setOption1] = React.useState<string>("");
  const [option2, setOption2] = React.useState<string>("");
  const [option3, setOption3] = React.useState<string>("");
  const [option4, setOption4] = React.useState<string>("");

  React.useEffect(() => {
    if (data) {
      setQuestion(data.question);
      setAnswer(data.answer);
      setOrder(data.order);
      setOption1(data.option_1);
      setOption2(data.option_2);
      setOption3(data.option_3);
      setOption4(data.option_4);
    }
  }, [data]);

  if (isLoading) return <Spinner />;

  const handleUpdateQuiz = async () => {
    if (
      !question ||
      !answer ||
      !order ||
      !option1 ||
      !option2 ||
      !option3 ||
      !option4
    ) {
      return MySwal.fire({
        icon: "error",
        text: "Please fill all fields!",
      });
    }
    const formData = {
      section_id: data.section.id,
      question,
      answer,
      order,
      option_1: option1,
      option_2: option2,
      option_3: option3,
      option_4: option4,
    };
    try {
      await updateQuiz(data.id, formData);
      queryClient.invalidateQueries("quiz" as InvalidateQueryFilters);
      MySwal.fire({
        icon: "success",
        text: "Quiz updated successfully!",
      });
    } catch (error) {
      MySwal.fire({
        icon: "error",
        text: "Something went wrong!",
      });
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div>
        <h1 className="text-2xl font-bold mb-3">Update Quiz</h1>
        <form action="" onSubmit={(e) => e.preventDefault()}>
          <div className="mb-3">
            <label htmlFor="name" className="font-semibold block mb-1">
              Question
            </label>
            <input
              type="text"
              className="border border-neutral-300 rounded p-2 w-full mt-1"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="font-semibold block mb-1">
              Order
            </label>
            <input
              type="number"
              className="border border-neutral-300 rounded p-2 w-full mt-1"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value))}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="font-semibold block mb-1">
              Option 1
            </label>
            <input
              type="text"
              className="border border-neutral-300 rounded p-2 w-full mt-1"
              value={option1}
              onChange={(e) => setOption1(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="font-semibold block mb-1">
              Option 2
            </label>
            <input
              type="text"
              className="border border-neutral-300 rounded p-2 w-full mt-1"
              value={option2}
              onChange={(e) => setOption2(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="font-semibold block mb-1">
              Option 3
            </label>
            <input
              type="text"
              className="border border-neutral-300 rounded p-2 w-full mt-1"
              value={option3}
              onChange={(e) => setOption3(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="font-semibold block mb-1">
              Option 4
            </label>
            <input
              type="text"
              className="border border-neutral-300 rounded p-2 w-full mt-1"
              value={option4}
              onChange={(e) => setOption4(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="font-semibold block mb-1">
              Answer
            </label>
            <input
              type="text"
              className="border border-neutral-300 rounded p-2 w-full mt-1"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <button
              onClick={handleUpdateQuiz}
              className="bg-indigo-700 w-full px-4 py-2 text-white rounded"
            >
              Update Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SingleQuiz;
