/* eslint-disable @next/next/no-img-element */
"use client";
import { register } from "@/utils/api";
import Link from "next/link";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Token {
  user_id: string;
  email: string;
  is_admin: boolean;
  is_teacher: boolean;
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

const Register = () => {
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState("student");
  const inactiveClass = "border-gray-200 bg-gray-200";
  const activeClass = "border-indigo-700 bg-gray-200";
  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      toastNotification({
        message: "All fields are required",
        type: "error",
      });
      return;
    }
    if (password !== confirmPassword) {
      toastNotification({
        message: "Passwords do not match",
        type: "error",
      });
      return;
    }
    if (password.length < 6) {
      toastNotification({
        message: "Password must be at least 6 characters",
        type: "error",
      });
      return;
    }
    const formData = {
      full_name: fullName,
      email,
      password,
      role: selectedRole,
    };

    try {
      const response = await register(formData);
      if (response.id && response.email) {
        window.location.href = "/login";
      }
      if (response.response.data.email) {
        toastNotification({
          message: response.response.data.email[0],
          type: "error",
        });
      } else {
        toastNotification({
          message: "Something went wrong. Please try again later.",
          type: "error",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <ToastContainer />
      <section className="flex justify-center bg-white md:bg-gray-100 -z-50 min-h-screen p-2 shadow">
        <div className="flex items-center justify-center my-3 max-h-[700px]">
          <div className="bg-white h-fit rounded md:rounded-none w-full md:w-[500px] min-h-full p-4 md:p-8">
            <h1 className="text-2xl md:text-3xl text-black font-bold">
              Create an account
            </h1>
            <p className="py-1">Join us and start learning today!</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="pt-3 z-50"
            >
              <div className="py-2 space-y-2">
                <label htmlFor="fullName" className="text-sm">
                  Full Name
                </label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  type="text"
                  className="bg-slate-100 p-2 rounded ring-1 outline-0 ring-slate-200 w-full"
                  placeholder="John Doe"
                />
              </div>
              <div className="py-2 space-y-2">
                <label htmlFor="email" className="text-sm">
                  Email address
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                  className="bg-slate-100 p-2 rounded ring-1 outline-0 ring-slate-200 w-full"
                  placeholder="example@email.com"
                />
              </div>
              <div className="py-2 space-y-2">
                <label htmlFor="password" className="text-sm">
                  Password
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="bg-slate-100 p-2 rounded ring-1 outline-0 ring-slate-200 w-full"
                  placeholder="••••••••"
                />
              </div>
              <div className="py-2 space-y-2">
                <label htmlFor="confirmPassword" className="text-sm">
                  Confirm Password
                </label>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  className="bg-slate-100 p-2 rounded ring-1 outline-0 ring-slate-200 w-full"
                  placeholder="••••••••"
                />
              </div>
              <div className="py-2 space-y-2">
                <label htmlFor="confirmPassword" className="text-sm"></label>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedRole("student")}
                    className={`border-2 ${
                      selectedRole === "student" ? activeClass : inactiveClass
                    } w-full px-4 py-2 rounded`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole("instructor")}
                    className={`border-2 ${
                      selectedRole === "instructor"
                        ? activeClass
                        : inactiveClass
                    } w-full px-4 py-2 rounded`}
                  >
                    Instructor
                  </button>
                </div>
              </div>
              <div className="py-2">
                <button
                  onClick={handleRegister}
                  type="submit"
                  className="bg-indigo-600 cursor-pointer rounded text-white p-2 w-full"
                >
                  Create Account
                </button>
              </div>
              <div className="flex justify-between">
                <a href="#" className="text-blue-600 text-sm">
                  Forgot password?
                </a>
                <Link href="/login">
                  <p className="text-blue-600 text-sm">
                    Already have an account
                  </p>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
