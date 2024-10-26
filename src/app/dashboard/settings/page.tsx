"use client";

import DashContainer from "@/app/components/DashContainer";
import Layout from "@/app/components/Layout";
import CustomInput from "@/app/components/Input"; // Assuming you have this component
import SyncLoader from "react-spinners/ClipLoader";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { User } from "@prisma/client";
import toast from "react-hot-toast";

function Page() {
  // const [timezone, setTimezone] = useState("GMT +01:00");
  // const [language, setLanguage] = useState("en");
  // const [checked, setChecked] = React.useState(true);
  // const [active, setActive] = useState("General");
  const [isLoading, setIsLoading] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [user, setUser] = useState<User>();

  // Profile details
  const [id, setId] = useState<number>(user?.id ?? 0);
  const [name, setName] = useState<string>(user?.name ?? "");
  const [email, setEmail] = useState<string>(user?.email ?? "");
  const [designation, setDesignation] = useState<string>(
    user?.designation ?? ""
  );
  const [imagePreview, setImagePreview] = useState<string | null>(
    user?.profilePic ?? ""
  );
  const [imageLink, setImageLink] = useState<string | null>(
    user?.profilePic ?? ""
  );
  const [image, setImage] = useState<File | null>(null);
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  useEffect(() => {
    const getUser = async () => {
      const data = localStorage.getItem("user");
      const temp = data ? JSON.parse(data) : null;
      setUser(temp);
      setId(temp?.id);
      setName(temp?.name);
      setEmail(temp?.email);
      setDesignation(temp?.designation);
      setImageLink(temp?.profilePic);
    };
    getUser();
  }, []);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>,
    setLink: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);

      // Create a local URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string); // Set the uploaded image preview
      };
      reader.readAsDataURL(selectedFile); // Read the file as a data URL
      handleFileUpload(selectedFile, setLink);
    }
  };

  const handleFileUpload = async (
    file: File | null,
    setLink: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    setLink(result.fileUrl);

    console.log(image);
    console.log(imagePreview);

    // Set upload status based on response
    if (response.ok) {
      toast.success(`File uploaded successfully!`);
    } else {
      toast.error(`File upload failed.`);
    }
  };

  // Handle form submission for profile update
  const handleSubmit = async () => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("id", id.toString());
    formData.append("name", name);
    formData.append("email", email);
    formData.append("designation", designation);
    if (imageLink) formData.append("profilePic", imageLink);

    try {
      const response = await fetch("/api/profile/update", {
        method: "PATCH", // Make sure the method matches your backend implementation
        body: formData,
      });

      const data: { message: string; user: User } = await response.json();

      if (response.ok) {
        toast.success("Profile updated successfully!");
        localStorage.removeItem("user");
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating profile.");
    }
    setIsLoading(false);
  };

  const handleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChanging(true);

    try {
      const response = await fetch("/api/profile/change-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id, // Replace this with the actual user ID or fetch it from the session
          oldPassword: oldPassword,
          newPassword: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password updated successfully!");
        // Optionally reset form inputs
        setOldPassword("");
        setNewPassword("");
      } else {
        toast.error(data.error || "Failed to update password");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating password");
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <DashContainer>
      <Layout header="Settings" desc="User Settings">
        <div className="mx-auto px-2 py-6">
          {/* <div className="flex gap-4 text-sm mb-8 overflow-x-auto">
            {headings.map((heading) => (
              <SettingPills
                key={heading}
                name={heading}
                active={active}
                setActive={setActive}
              />
            ))}
          </div> */}
          {/* General Section */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-4">General</h2>
            <hr className="my-3" />
            {/* Profile Photo */}
            <div className="mb-4 flex w-full !justify-between">
              <label className="block dark:text-white text-gray-700 font-bold mb-2">
                Photo
              </label>
              <div className="w-24 h-24 bg-[#A2A2A833] rounded-full flex items-center justify-center relative">
                {imageLink ? (
                  <Image
                    src={imageLink} // Display the uploaded image preview
                    alt="Uploaded"
                    className="w-full h-full rounded-full"
                    width={96}
                    height={96}
                  />
                ) : (
                  <i className="fas fa-camera text-2xl text-gray-400"></i>
                )}
                <input
                  type="file"
                  onChange={(e) =>
                    handleFileChange(e, setImage, setImagePreview, setImageLink)
                  } // Handle file change
                  className="hidden"
                  accept=".jpg,.jpeg,.png"
                  id="file-input"
                />
                <label
                  htmlFor="file-input"
                  className="absolute inset-0 cursor-pointer"
                ></label>
              </div>
            </div>
            <hr className="my-3" />

            {/* Name */}
            <CustomInput
              htmlFor="name"
              label="Name"
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              required
            />
            <hr className="my-3" />

            {/* Email Address */}
            <CustomInput
              htmlFor="email"
              label="Email"
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              required
            />
            <hr className="my-3" />

            {/* Designation */}
            <CustomInput
              htmlFor="designation"
              label="Designation"
              id="designation"
              type="text"
              placeholder="Enter your designation"
              value={designation}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDesignation(e.target.value)
              }
              required
            />
            <div className="flex justify-end mt-6">
              <button
                onClick={handleSubmit}
                className="bg-primary text-white px-6 py-2 rounded-lg"
              >
                {isLoading ? (
                  <SyncLoader color={"#FFFFFF"} />
                ) : (
                  "Update Profile"
                )}
              </button>
            </div>
          </section>

          {/* Security Section */}
          <section className="mt-9">
            <h2 className="text-lg font-semibold mb-4">Security</h2>
            <hr className="my-3" />

            <CustomInput
              htmlFor="password"
              label="Old Password"
              id="password"
              type="password"
              placeholder="Enter your password"
              value={oldPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setOldPassword(e.target.value)
              }
              required
            />
            <hr className="my-3" />
            <CustomInput
              htmlFor="password"
              label="Password"
              id="password"
              type="password"
              placeholder="Enter your password"
              value={newPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewPassword(e.target.value)
              }
              required
            />
            <div className="flex justify-end mt-6">
              <button
                onClick={handleChange}
                className="bg-primary text-white px-6 py-2 rounded-lg"
              >
                {isChanging ? (
                  <SyncLoader color={"#FFFFFF"} />
                ) : (
                  "Change Password"
                )}
              </button>
            </div>

            {/* Automatic Time Zone */}
            {/* <div className="mb-4 flex w-full !justify-between items-center">
              <label className="w-[200px] md:w-[520px] dark:text-white text-gray-700 font-bold">
                Automatic Time Zone
              </label>
              <div className="flex items-center w-full">
                <Switch
                  checked={checked}
                  onChange={(event) => setChecked(event.target.checked)}
                  inputProps={{ "aria-label": "controlled" }}
                />
                <span className="ml-2 bg-transparent p-2 rounded-lg">
                  {timezone}
                </span>
              </div>
            </div>
            <hr className="my-3" /> */}

            {/* Language Selector */}
            {/* <div className="mb-4 flex w-full !justify-between items-center">
              <label className="block w-[200px] md:w-[520px] dark:text-white text-gray-700 font-bold">
                Language
              </label>
              <div className="flex items-center w-full">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="block bg-transparent p-2 rounded-lg"
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                </select>
              </div>
            </div> */}
          </section>

          {/* Save Button */}
        </div>
      </Layout>
    </DashContainer>
  );
}

export default Page;
