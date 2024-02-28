"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import Error from "@/components/elements/Error";
import QuizTaken from "@/components/elements/QuizTaken";
import Spinner from "@/components/elements/Spinner";
import {
  addQuizScore,
  checkEnrollment,
  checkQuizTaken,
  getQuizBySectionId,
} from "@/utils/api";

const Quiz = () => {
  const { id } = useParams();
  const {
    data: quizTaken,
    isLoading: quizTakenLoading,
    error: quizTakenError,
  } = useQuery<any>({
    queryKey: ["quizTaken", id],
    queryFn: () => checkQuizTaken(id),
  });
  const [correct, setCorrect] = React.useState(0);
  const [submitted, setSubmitted] = React.useState(false);

  const {
    isLoading,
    error,
    data: quizzes,
  } = useQuery<any>({
    queryKey: ["quiz", id],
    queryFn: () => getQuizBySectionId(id),
  });

  const quizLoaded = Boolean(!isLoading && !error && quizzes);
  const course_id = quizzes?.[0]?.section?.course;

  const {
    isLoading: isEnrolledLoading,
    error: isEnrolledError,
    data: isEnrolledData,
  } = useQuery<any>({
    queryKey: ["is-enrolled", course_id],
    queryFn: () => checkEnrollment(course_id),
    enabled: quizLoaded,
  });

  if (isLoading || quizTakenLoading || isEnrolledLoading) {
    return <Spinner />;
  }
  if (error || quizTakenError || isEnrolledError) {
    return <Error />;
  }
  if (!isEnrolledData) {
    MySwal.fire({
      title: "You are not enrolled in this course",
      icon: "error",
      confirmButtonText: "Ok",
    });
    return <Error />;
  }
  const handleSubmitAnswer = async () => {
    setSubmitted(true);
    const answer = quizzes?.map((quiz: any) => quiz.answer);
    const radios = document.querySelectorAll("input[type=radio]:checked");
    const userAnswers = Array.from(radios).map((radio: any) => radio.value);
    const correctAnswers = answer?.filter((ans: any) =>
      userAnswers.includes(ans)
    );
    for (let i = 0; i < answer?.length; i++) {
      if (answer[i] !== userAnswers[i]) {
        const correctAnswer = document.querySelector(
          `input[value="${answer[i]}"]`
        );
        correctAnswer?.parentElement?.classList.add("text-green-500");
      }
    }
    setCorrect(correctAnswers?.length);

    try {
      await addQuizScore({
        section_id: id[0],
        user_id: localStorage.getItem("user_id"),
        score: correctAnswers?.length,
      });
      MySwal.fire({
        title: `${correctAnswers?.length}/${answer?.length} Correct Answers`,
        icon: `${correctAnswers?.length > 0 ? "success" : "error"}`,
        confirmButtonText: "Ok",
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <section className="flex-1 px-4 md:px-20 my-8">
        {!quizTaken?.completed ? (
          <>
            {" "}
            <div className="space-y-4">
              {quizzes?.map((quiz: any) => (
                <div key={quiz.id}>
                  <div className="font-bold text-lg">Q. {quiz.question}</div>
                  <div className="space-y-2 ml-6 mt-2">
                    <p className="flex items-center">
                      <input
                        type="radio"
                        name={quiz.id}
                        value={quiz.option_1}
                        className="mr-2"
                      />
                      <span>{quiz.option_1}</span>
                    </p>
                    <p className="flex items-center">
                      <input
                        type="radio"
                        name={quiz.id}
                        value={quiz.option_2}
                        className="mr-2"
                      />
                      <span>{quiz.option_2}</span>
                    </p>
                    <p className="flex items-center">
                      <input
                        type="radio"
                        name={quiz.id}
                        value={quiz.option_3}
                        className="mr-2"
                      />
                      <span>{quiz.option_3}</span>
                    </p>
                    <p className="flex items-center">
                      <input
                        type="radio"
                        name={quiz.id}
                        value={quiz.option_4}
                        className="mr-2"
                      />
                      <span>{quiz.option_4}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="ml-6">
              {!submitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  className="bg-emerald-700 text-white px-10 py-3 mt-8"
                >
                  Submit Answers
                </button>
              ) : (
                <p
                  onClick={() => {
                    window.history.back();
                  }}
                  className="mt-6 cursor-pointer inline-flex items-center px-4 py-2 text-white bg-indigo-600 border border-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring"
                >
                  <span className="text-sm font-medium">Go back to course</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                    />
                  </svg>
                </p>
              )}
            </div>
          </>
        ) : (
          <QuizTaken
            score={quizTaken?.score}
            total_questions={quizTaken?.total_questions}
          />
        )}
      </section>
      <Footer />
    </div>
  );
};
export default Quiz;
