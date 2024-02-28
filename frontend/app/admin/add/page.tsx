"use client";
import {
  useQuery,
  useQueryClient,
  InvalidateQueryFilters,
} from "@tanstack/react-query";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
import React from "react";
import { createAdmin } from "@/utils/api";
const Settings = () => {
  const queryClient = useQueryClient();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const handleAdminAdd = async () => {
    if (!name || !email || !password || !confirmPassword) {
      return MySwal.fire({
        icon: "error",
        text: "Please fill all the fields",
      });
    }
    if (password !== confirmPassword) {
      return MySwal.fire({
        icon: "error",
        text: "Passwords do not match",
      });
    }
    const formData = {
      full_name: name,
      email,
      password,
      role: "admin",
    };
    try {
      await createAdmin(formData);
      queryClient.invalidateQueries("admin-users" as InvalidateQueryFilters);
      MySwal.fire({
        icon: "success",
        text: "Admin user added successfully",
      });
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      MySwal.fire({
        icon: "error",
        text: "Something went wrong",
      });
    }
  };
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add Admin User</h1>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <form action="" onSubmit={(e) => e.preventDefault()}>
          <div className="mb-3">
            <label htmlFor="fullname">Full Name</label>
            <input
              type="text"
              className="border border-neutral-300 rounded p-2 w-full mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=""
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              className="border border-neutral-300 rounded p-2 w-full mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="border border-neutral-300 rounded p-2 w-full mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              className="border border-neutral-300 rounded p-2 w-full mt-1"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder=""
            />
          </div>
          <div className="mb-3">
            <button
              onClick={handleAdminAdd}
              type="submit"
              className="bg-indigo-700 text-white rounded py-2 px-4 hover:bg-primary-200 transition duration-200"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
