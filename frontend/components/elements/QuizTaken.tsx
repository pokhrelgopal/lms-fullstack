import React from "react";

interface Props {
  score: number;
  total_questions: number;
}

const QuizTaken = ({ score, total_questions }: Props) => {
  return (
    <section className="flex-1 px-4 md:px-20">
      <div className="flex items-center justify-center my-28">
        <div>
          <div className="flex flex-col items-center space-y-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-16 h-16 text-red-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
              />
            </svg>

            <h1 className="text-center text-4xl font-bold">
              You have already taken this Quiz !
            </h1>
            <p className="text-2xl font-bold mt-4">
              Your score is {score} out of {total_questions}
            </p>
            <p
              onClick={() => {
                window.history.back();
              }}
              className="mt-9 cursor-pointer inline-flex items-center px-4 py-2 text-white bg-indigo-600 border border-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring"
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuizTaken;
