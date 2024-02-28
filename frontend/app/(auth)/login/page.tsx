/* eslint-disable @next/next/no-img-element */
"use client";
import { login } from "@/utils/api";
import Link from "next/link";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";

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

interface IToken {
  user_id: string;
  email: string;
  is_admin: boolean;
  is_teacher: boolean;
}
interface DecodedToken {
  exp: number;
  user_id: string;
  email: string;
  role: string;
}

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = async () => {
    if (!email || !password) {
      toastNotification({
        message: "All fields are required",
        type: "error",
      });
      return;
    }
    try {
      const res = await login(email, password);
      const { access, refresh } = res;
      if (!access || !refresh) {
        toastNotification({
          message: "Invalid credentials",
          type: "error",
        });
      }
      localStorage.setItem("access", access);

      if (access && refresh) {
        setCookie("access", access, {
          expires: new Date(Date.now() + 86400000),
          secure: true,
          sameSite: "strict",
        });
        setCookie("refresh", refresh, {
          expires: new Date(Date.now() + 86400000 * 7),
          secure: true,
          sameSite: "strict",
        });
        const decodedToken = jwtDecode<DecodedToken>(access);
        const { user_id, role } = decodedToken;
        localStorage.setItem("user_id", user_id);
        localStorage.setItem("role", role);

        if (role === "admin") {
          window.location.href = "/admin";
        } else if (role === "instructor") {
          window.location.href = "/teacher";
        } else {
          window.location.href = "/";
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <ToastContainer />
      <section className="flex justify-center bg-white md:bg-gray-100 -z-50 min-h-screen p-2 shadow">
        <div className="flex items-center justify-center mt-16 max-h-[500px]">
          <div className="bg-white rounded md:rounded-none w-full md:w-[500px] min-h-full p-8">
            <h1 className="text-2xl md:text-3xl text-black font-bold">
              Welcome to StudyHub
            </h1>
            <p className="py-3">
              We make it easy for everyone to study what they want at their own
              pace.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="pt-4 z-50"
            >
              <div className="py-2 space-y-2">
                <label htmlFor="email">Email address</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                  className="bg-slate-100 p-2 rounded ring-1 outline-0 ring-slate-200 w-full"
                  placeholder="example@email.com"
                />
              </div>
              <div className="py-2 space-y-2">
                <label htmlFor="password">Password</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="bg-slate-100 p-2 rounded ring-1 outline-0 ring-slate-200 w-full"
                  placeholder="••••••••"
                />
              </div>
              <div className="py-2">
                <button
                  onClick={handleSubmit}
                  type="submit"
                  className="bg-indigo-600 cursor-pointer rounded text-white p-2 w-full"
                >
                  Login
                </button>
              </div>
              <div className="flex justify-between">
                <a href="#" className="text-blue-600 text-sm">
                  Forgot password?
                </a>
                <Link href="/register">
                  <p className="text-blue-600 text-sm">Create an account</p>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
