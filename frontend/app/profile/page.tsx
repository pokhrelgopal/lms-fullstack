/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { updateUser, getUser } from "@/utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useQuery,
  useQueryClient,
  InvalidateQueryFilters,
} from "@tanstack/react-query";
import Spinner from "@/components/elements/Spinner";

// Function to display toast notification
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

const Profile = () => {
  const {
    isLoading,
    error,
    data: user,
  } = useQuery<any>({
    queryKey: ["user"],
    queryFn: () => getUser(),
  });

  const queryClient = useQueryClient();
  const [full_name, setFull_name] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [about, setAbout] = React.useState("");
  const [confirm_password, setConfirm_password] = React.useState("");
  const [newProfilePic, setNewProfilePic] = React.useState<any | null>(null);
  const [previewProfilePic, setPreviewProfilePic] = React.useState<
    string | null
  >(null);

  React.useEffect(() => {
    if (user) {
      setFull_name(user.full_name);
      setEmail(user.email);
      if (user.about == null) setAbout("");
      else setAbout(user.about);
    }
  }, [user]);

  const handleFormSubmit = async () => {
    if (!full_name || !email || !about) {
      toastNotification({
        message: "Full name, email and about are required",
        type: "error",
      });
      return;
    }
    let updatedUser = {
      full_name,
      email,
      about,
    };
    const res = await updateUser(updatedUser);
    if (res.response?.data?.email[0]) {
      toastNotification({
        message: "Email already taken.",
        type: "error",
      });
      return;
    }
    const { id, email: Email, full_name: Fullname } = res;
    if (id && Email && Fullname) {
      toastNotification({
        message: "Profile updated successfully",
        type: "success",
      });
    }
    queryClient.invalidateQueries("user" as InvalidateQueryFilters);
  };

  const handlePasswordChange = async () => {
    if (!password || !confirm_password) {
      toastNotification({
        message: "Password and confirm password are required",
        type: "error",
      });
      return;
    }
    if (password !== confirm_password) {
      toastNotification({
        message: "Password and confirm password do not match",
        type: "error",
      });
      return;
    }
    let updatedUser = {
      password,
    };
    const res = await updateUser(updatedUser);
    const { id, email: Email, full_name: Fullname } = res;
    if (id && Email && Fullname) {
      toastNotification({
        message: "Password updated successfully",
        type: "success",
      });
    }
    setPassword("");
    setConfirm_password("");
  };

  const handleProfilePicChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    setNewProfilePic(selectedFile);

    if (selectedFile) {
      const previewURL = URL.createObjectURL(selectedFile);
      setPreviewProfilePic(previewURL);
    }
  };
  const handlePictureChange = async () => {
    const formData = new FormData();
    formData.append("profile_image", newProfilePic);

    const res = await updateUser(formData);
    const { id, email: Email, full_name: Fullname } = res;
    if (id && Email && Fullname) {
      toastNotification({
        message: "Profile image updated successfully",
        type: "success",
      });
    }

    queryClient.invalidateQueries("user" as InvalidateQueryFilters);
    setNewProfilePic(null);
    setPreviewProfilePic(null);
  };

  if (isLoading) return <Spinner />;

  return (
    <>
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold mb-3">My Profile</h1>
        <form className="mt-4" onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <img
              src={user?.profile_image}
              alt=""
              className="h-40 w-40 object-cover rounded-full mb-3"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              style={{ display: "none" }}
              id="profilePicInput"
            />
            {!newProfilePic && (
              <label
                htmlFor="profilePicInput"
                className="my-4 text-blue-600 cursor-pointer"
              >
                Change Profile Image
              </label>
            )}
            {newProfilePic && (
              <button
                onClick={handlePictureChange}
                className="my-4 text-blue-600"
              >
                Save Changes
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5 gap-3">
            <div className="space-y-3">
              <div>
                <label htmlFor="full_name">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  id="full_name"
                  value={full_name}
                  onChange={(e) => setFull_name(e.target.value)}
                  className="border border-gray-300 p-2 rounded w-full"
                />
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-300 p-2 rounded w-full"
                />
              </div>
              <div>
                <label htmlFor="about">About</label>
                <textarea
                  name="about"
                  rows={5}
                  id="about"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="border border-gray-300 p-2 rounded w-full"
                />
              </div>
              <button
                onClick={handleFormSubmit}
                type="submit"
                className="bg-indigo-800 text-white px-4 py-2 rounded"
              >
                Save Changes
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border border-gray-300 p-2 rounded w-full"
                />
              </div>
              <div>
                <label htmlFor="confirm_password">Confirm Password</label>
                <input
                  type="password"
                  name="confirm_password"
                  id="confirm_password"
                  value={confirm_password}
                  onChange={(e) => setConfirm_password(e.target.value)}
                  className="border border-gray-300 p-2 rounded w-full"
                />
              </div>
              <button
                onClick={handlePasswordChange}
                type="submit"
                className="bg-indigo-800 text-white px-4 py-2 rounded"
              >
                Change Password
              </button>
            </div>
            {/* Add other input fields as needed */}
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" />
    </>
  );
};

export default Profile;
