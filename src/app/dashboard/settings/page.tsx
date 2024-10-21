"use client";

import DashContainer from "@/app/components/DashContainer";
import Layout from "@/app/components/Layout";
import SettingPills from "@/app/components/SettingPills";
import CustomInput from "@/app/components/Input"; // Assuming you have this component
import { headings } from "@/app/data";
import { Switch } from "@mui/material";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { User } from "@prisma/client";

function Page() {
  const [timezone, setTimezone] = useState("GMT +01:00");
  const [language, setLanguage] = useState("en");
  const [active, setActive] = useState("General");
  const [checked, setChecked] = React.useState(true);
  const [user, setUser] = useState<User>();

  // Profile details
  const [id, setId] = useState<number>(user?.id ?? 0);
  const [name, setName] = useState<string>(user?.name ?? "");
  const [email, setEmail] = useState<string>(user?.email ?? "");
  const [designation, setDesignation] = useState<string>(
    user?.designation ?? ""
  );
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    user?.profilePic ?? ""
  );
  const [imageLink, setImageLink] = useState<string | null>(
    user?.profilePic ?? ""
  );
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const data = localStorage.getItem("user");
      const temp = data ? JSON.parse(data) : null;
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

    // Set upload status based on response
    if (response.ok) {
      toast.success(`File uploaded successfully!`);
    } else {
      toast.error(`File upload failed.`);
    }
  };

  // Handle form submission for profile update
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("id", id.toString());
    formData.append("name", name);
    formData.append("email", email);
    formData.append("designation", designation);
    formData.append("profilePic", imageLink);
    if (profilePic) {
      formData.append("file", profilePic); // Ensure this matches the backend expectation
    }

    try {
      const response = await fetch("/api/auth/profile-update", {
        method: "PATCH", // Make sure the method matches your backend implementation
        body: formData,
      });

      if (response.ok) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      toast.error("An error occurred while updating profile.");
    }
  };

  return (
    <DashContainer>
      <Layout header="Settings" desc="User Settings">
        <div className="mx-auto px-2 py-6">
          <div className="flex gap-4 text-sm mb-8 overflow-x-auto">
            {headings.map((heading) => (
              <SettingPills
                key={heading}
                name={heading}
                active={active}
                setActive={setActive}
              />
            ))}
          </div>
          {/* Basics Section */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Basics</h2>
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
          </section>

          {/* Preferences Section */}
          <section className="mt-9">
            <h2 className="text-lg font-semibold mb-4">Preferences</h2>
            <hr className="my-3" />

            {/* Automatic Time Zone */}
            <div className="mb-4 flex w-full !justify-between items-center">
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
            <hr className="my-3" />

            {/* Language Selector */}
            <div className="mb-4 flex w-full !justify-between items-center">
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
                  {/* Add more language options as needed */}
                </select>
              </div>
            </div>
          </section>

          {/* Save Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Layout>
    </DashContainer>
  );
}

export default Page;
