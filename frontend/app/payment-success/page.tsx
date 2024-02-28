"use client";
import React from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createPayment, enrollCourse } from "@/utils/api";

const Payment = () => {
  const searchParams = useSearchParams();
  const pidx = searchParams.get("pidx");
  const txnId = searchParams.get("transaction_id");
  const amount = searchParams.get("amount");
  const mobile = searchParams.get("mobile");
  const purchase_order_id = searchParams.get("purchase_order_id");
  const purchase_order_name = searchParams.get("purchase_order_name");
  const transaction_id = searchParams.get("transaction_id");

  // console.log(
  //   pidx +
  //     "--" +
  //     txnId +
  //     "--" +
  //     amount +
  //     "--" +
  //     mobile +
  //     "--" +
  //     purchase_order_id +
  //     "--" +
  //     purchase_order_name +
  //     "--" +
  //     transaction_id
  // );

  React.useEffect(() => {
    if (pidx && txnId && amount && mobile && purchase_order_id) {
      const handlePayment = async () => {
        const formData = {
          course_id: purchase_order_id,
          user_id: localStorage.getItem("user_id"),
          amount: +amount,
          pidx,
        };
        try {
          await createPayment(formData);
          await enrollCourse(purchase_order_id);
        } catch (error) {
          console.error(error);
        }
      };
      handlePayment();
    }
  }, [
    pidx,
    txnId,
    amount,
    mobile,
    purchase_order_id,
    purchase_order_name,
    transaction_id,
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <section className="flex-1 px-4 md:px-20">
        <div className="flex items-center justify-center my-28">
          <div>
            <div className="flex flex-col items-center space-y-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="text-green-600 w-28 h-28"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h1 className="text-4xl font-bold">Thank You !</h1>
              <p className="max-w-xl text-center">
                Thank you for purchasing the course{" "}
                <span className="font-bold">
                  {purchase_order_name?.replace(/-/g, " ")}
                </span>
                . You can now access the course by clicking the button below.
              </p>
              <Link href={`/profile/my-courses`}>
                <p className="inline-flex items-center px-4 py-2 text-white bg-indigo-600 border border-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring">
                  <span className="text-sm font-medium">Go to Course</span>
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
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Payment;
