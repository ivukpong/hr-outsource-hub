"use client";

import React, { useCallback, useState } from "react";
import DashContainer from "@/app/components/DashContainer";
import CustomInput from "@/app/components/Input";
import Layout from "@/app/components/Layout";
import Link from "next/link";
import SyncLoader from "react-spinners/ClipLoader";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import CustomSelect from "@/app/components/Select";
import { useEffect } from "react";
import { Department, Team } from "@prisma/client";
import Image from "next/image";
import { nationalities } from "@/app/data";
import AddressInput from "@/app/components/AddressInput";
import Modal from "@/app/components/Modal";

export default function Page() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date().toISOString());
  const [maritalStatus, setMaritalStatus] = useState("");
  const [gender, setGender] = useState("");
  const [nationality, setNationality] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [page, setPage] = useState(0);
  const [department, setDepartment] = useState("");
  const [teamId, setTeamId] = useState("");
  const [workingDays, setWorkingDays] = useState("0");
  const [startDate, setStartDate] = useState(new Date().toISOString());
  const [location, setLocation] = useState("");
  const [imageLink, setImageLink] = useState<string | null>(null);
  const [offerLetterLink, setOfferLetterLink] = useState<string | null>(null);
  const [payrollSlipLink, setPayrollSlipLink] = useState<string | null>(null);
  const [cvLink, setCVLink] = useState<string | null>(null);
  const [idLink, setIDLink] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [offerLetter, setOfferLetter] = useState<File | null>(null);
  const [payrollSlip, setPayrollSlip] = useState<File | null>(null);
  const [cv, setCV] = useState<File | null>(null);
  const [id, setID] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  async function fetchDepartments() {
    const res = await fetch("/api/departments");
    const data = await res.json();
    setDepartments(data);
  }

  const fetchTeams = useCallback(async () => {
    const res = await fetch("/api/teams");
    const data = await res.json();
    setTeams(
      data.filter((team: Team) => team.departmentId === parseInt(department))
    );
  }, [department]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [department, fetchTeams]);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>,
    setLink: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      console.log(image);

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

  const handleSubmit = async () => {
    // Reset loading state
    setLoading(true);

    // Array to collect all validation errors
    const errors = [];

    // Basic validation: Ensure required fields are not empty
    if (!imageLink) errors.push("Profile picture is required");
    if (!firstName.trim()) errors.push("First name is required");
    if (!lastName.trim()) errors.push("Last name is required");
    if (!mobileNumber.trim()) errors.push("Mobile number is required");
    if (!emailAddress.trim()) errors.push("Email address is required");
    if (!dateOfBirth) errors.push("Date of birth is required");
    if (!maritalStatus.trim()) errors.push("Marital status is required");
    if (!gender.trim()) errors.push("Gender is required");
    if (!nationality.trim()) errors.push("Nationality is required");
    if (!address.trim()) errors.push("Address is required");
    if (!city.trim()) errors.push("City is required");
    if (!teamId) errors.push("Team ID is required");
    if (!state.trim()) errors.push("State is required");
    if (!workingDays) errors.push("Working days is required");
    if (!startDate) errors.push("Start date is required");
    if (!location) errors.push("Office location is required");
    if (!offerLetterLink) errors.push("Offer letter is required");
    if (!payrollSlipLink) errors.push("Payroll slip is required");
    if (!cvLink) errors.push("CV is required");
    if (!idLink) errors.push("Means of ID is required");
    if (!department) errors.push("Department ID is required");

    // Check if there are any validation errors
    if (errors.length > 0) {
      // Display all errors using toast
      errors.forEach((error) => toast.error(error));

      // Stop loading and return early since there are validation errors
      setLoading(false);
      return;
    }

    // Adjust location value based on input
    const officeLocation =
      location === "1" ? "Remote" : location === "2" ? "Hybrid" : "On-site";

    // Prepare employee data
    const employeeData = {
      profilePic: imageLink,
      firstName,
      lastName,
      mobileNumber,
      emailAddress,
      dateOfBirth: new Date(dateOfBirth).toISOString(),
      maritalStatus,
      gender,
      nationality,
      address,
      city,
      teamId: parseInt(teamId),
      state,
      zipCode, // Optional, no validation
      workingDays: parseInt(workingDays),
      startDate: new Date(startDate).toISOString(),
      officeLocation,
      offerLetter: offerLetterLink,
      payrollSlip: payrollSlipLink,
      cv: cvLink,
      meansOfId: idLink,
      departmentId: parseInt(department),
    };

    // Send data to the server
    const response = await fetch("/api/employees", {
      method: "POST",
      body: JSON.stringify(employeeData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      toast.success("Employee added successfully!");
      handleOpenModal();
    } else {
      toast.error(data.error || "Failed to add employee.");
    }

    setLoading(false);
  };

  return (
    <DashContainer>
      <Layout header="Employees" desc="Employee Information">
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <div className="p-8 rounded-lg text-center max-w-sm">
            {/* Success Icon */}
            <div className="text-[100px] mb-4">🎉</div>
            {/* Success Message */}
            <h2 className="text-2xl font-semibold mb-2">
              Employee Added Successfully
            </h2>
            <p className="text-gray-600 mb-6">
              This employee has been added successfully.
            </p>
            {/* Go Home Button */}
            <Link
              href="/dashboard/employees"
              className="bg-primary hover:bg-orange-600 text-white py-2 px-4 rounded-lg w-full"
            >
              Go to Employees List
            </Link>
          </div>
        </Modal>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.5 },
            },
          }}
          className="w-full mx-auto p-8 border text-dark dark:text-white border-grey rounded-[10px]"
        >
          <div className="flex items-center justify-between mb-8 overflow-auto">
            <div
              onClick={() => setPage(0)}
              className={`flex items-center cursor-pointer space-x-2 mr-5 pb-2 ${page === 0 ? "text-primary font-bold border-b-primary border-b-[3px]" : ""}`}
            >
              <i className="fas fa-user"></i>
              <span className="whitespace-nowrap">Personal Information</span>
            </div>
            <div
              onClick={() => setPage(1)}
              className={`flex items-center cursor-pointer space-x-2 mx-5 pb-2 ${page === 1 ? "text-primary font-bold border-b-primary border-b-[3px]" : ""}`}
            >
              <i className="fas fa-briefcase"></i>
              <span className="whitespace-nowrap">
                Professional Information
              </span>
            </div>
            <div
              onClick={() => setPage(2)}
              className={`flex items-center cursor-pointer space-x-2 mx-5 pb-2 ${page === 2 ? "text-primary font-bold border-b-primary border-b-[3px]" : ""}`}
            >
              <i className="fas fa-file-alt"></i>
              <span className="whitespace-nowrap">Documents</span>
            </div>
            {/* <div
              onClick={() => setPage(3)}
              className={`flex items-center cursor-pointer space-x-2 ml-5 pb-2 ${page === 3 ? "text-primary font-bold border-b-primary border-b-[3px]" : ""}`}
            >
              <i className="fas fa-lock"></i>
              <span className="whitespace-nowrap">Account Access</span>
            </div> */}
          </div>
          {page === 0 ? (
            <motion.div
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg"
            >
              <div className="flex items-center mb-6">
                <div>
                  <div className="w-24 h-24 bg-[#A2A2A833] rounded flex items-center justify-center relative">
                    {imagePreview ? (
                      <Image
                        src={imagePreview} // Display the uploaded image preview
                        alt="Uploaded"
                        className="w-full h-full rounded"
                      />
                    ) : (
                      <i className="fas fa-camera text-2xl text-gray-400"></i>
                    )}
                    <input
                      type="file"
                      onChange={(e) =>
                        handleFileChange(
                          e,
                          setImage,
                          setImagePreview,
                          setImageLink
                        )
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
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <CustomInput
                  htmlFor="firstName"
                  label="First Name"
                  id="firstName"
                  type="text"
                  placeholder="Enter First Name"
                  value={firstName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFirstName(e.target.value)
                  }
                  required
                />

                <CustomInput
                  htmlFor="lastName"
                  label="Last Name"
                  id="lastName"
                  type="text"
                  placeholder="Enter Last Name"
                  value={lastName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setLastName(e.target.value)
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <CustomInput
                  htmlFor="mobileNumber"
                  id="mobileNumber"
                  label="Mobile Number"
                  type="text"
                  placeholder="Enter Mobile Number"
                  value={mobileNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setMobileNumber(e.target.value)
                  }
                  required
                />
                <CustomInput
                  htmlFor="emailAddress"
                  id="emailAddress"
                  label="Email Address"
                  type="email"
                  placeholder="Enter Email Address"
                  value={emailAddress}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmailAddress(e.target.value)
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div className="relative">
                  <CustomInput
                    htmlFor="dateOfBirth"
                    id="dateOfBirth"
                    label="Date of Birth"
                    type="date"
                    placeholder="Enter Date of Birth"
                    value={dateOfBirth}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setDateOfBirth(e.target.value)
                    }
                    required
                  />
                  <i className="fas fa-calendar-alt right-3 absolute top-10 text-gray-400"></i>
                </div>
                <CustomSelect
                  htmlFor="maritalStatus"
                  id="maritalStatus"
                  label="Marital Status"
                  value={maritalStatus}
                  type
                  options={[
                    { id: 1, name: "Single" },
                    { id: 2, name: "Married" },
                    { id: 3, name: "Divorced" },
                  ]}
                  onChange={(e) => setMaritalStatus(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <CustomSelect
                  htmlFor="gender"
                  id="gender"
                  label="Gender"
                  value={gender}
                  type
                  options={[
                    { id: 1, name: "Male" },
                    { id: 2, name: "Female" },
                    { id: 3, name: "Other" },
                  ]}
                  onChange={(e) => setGender(e.target.value)}
                  required
                />

                <CustomSelect
                  htmlFor="nationality"
                  id="nationality"
                  value={nationality}
                  label="Nationality"
                  type
                  options={nationalities}
                  onChange={(e) => setNationality(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                {/* <CustomInput
                  htmlFor="address"
                  id="address"
                  label="Address"
                  type="text"
                  placeholder="Enter Address"
                  value={address}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setAddress(e.target.value)
                  }
                  required
                /> */}
                <AddressInput
                  htmlFor="address"
                  id="address"
                  label="Address"
                  type="text"
                  placeholder="Enter Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  icon // Enables the search functionality and shows the search icon
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <CustomInput
                  htmlFor="city"
                  id="city"
                  label="City"
                  type="text"
                  placeholder="Enter City"
                  value={city}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCity(e.target.value)
                  }
                  required
                />
                <CustomInput
                  htmlFor="state"
                  id="state"
                  label="State"
                  type="text"
                  placeholder="Enter State"
                  value={state}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setState(e.target.value)
                  }
                  required
                />
                <CustomInput
                  htmlFor="zipCode"
                  id="zipCode"
                  label="Zip Code"
                  type="text"
                  placeholder="Enter ZIP Code"
                  value={zipCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setZipCode(e.target.value)
                  }
                  required
                />
              </div>
            </motion.div>
          ) : page === 1 ? (
            <motion.div
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg"
            >
              {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <CustomInput
                  htmlFor="employeeID"
                  id="employeeID"
                  type="text"
                  placeholder="Enter Employee ID"
                  value={employeeID}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmployeeID(e.target.value)
                  }
                  required
                />

                <CustomInput
                  htmlFor="username"
                  id="username"
                  type="text"
                  placeholder="Enter Username"
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUsername(e.target.value)
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <CustomInput
                  htmlFor="employmentType"
                  id="employmentType"
                  type="text"
                  placeholder="Enter Employment Type"
                  value={employmentType}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmploymentType(e.target.value)
                  }
                  required
                />
                <CustomInput
                  htmlFor="emailAddress"
                  id="emailAddress"
                  type="email"
                  placeholder="Enter Email Address"
                  value={emailAddress}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmailAddress(e.target.value)
                  }
                  required
                />
              </div> */}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div className="relative">
                  <CustomSelect
                    htmlFor="department"
                    id="department"
                    label="Department"
                    value={department}
                    options={departments}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                  />
                </div>
                <CustomSelect
                  htmlFor="designation"
                  id="designation"
                  label="Designation"
                  value={teamId}
                  options={teams}
                  onChange={(e) => setTeamId(e.target.value)}
                  required
                />
                {/* <CustomInput
                  htmlFor="designation"
                  id="designation"
                  label="Designation"
                  type="text"
                  placeholder="Enter Designation"
                  value={designation}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setDesignation(e.target.value)
                  }
                  required
                /> */}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <CustomInput
                  htmlFor="workingDays"
                  id="workingDays"
                  label="Working Days"
                  type="number"
                  placeholder="Enter Working Days"
                  value={workingDays}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setWorkingDays(e.target.value)
                  }
                  required
                />
                <CustomInput
                  htmlFor="startDate"
                  id="startDate"
                  label="Start Date"
                  type="date"
                  placeholder="Enter Start Date"
                  value={startDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setStartDate(e.target.value)
                  }
                  required
                />
              </div>

              <div className="mb-4">
                <CustomSelect
                  htmlFor="location"
                  id="location"
                  label="Work Type"
                  value={location}
                  options={[
                    { id: 1, name: "Remote" },
                    { id: 2, name: "Hybrid" },
                    { id: 3, name: "On-site" },
                  ]}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Upload Offer Letter Section */}
                <div>
                  <h2 className="mb-2">Upload Offer Letter</h2>
                  <div className="border border-dashed border-[#E04403] p-6 text-center mb-4">
                    <i className="fas fa-upload text-2xl text-[#E04403] mb-2"></i>
                    <input
                      type="file"
                      onChange={(e) =>
                        handleFileChange(
                          e,
                          setOfferLetter,
                          () => {},
                          setOfferLetterLink
                        )
                      }
                      className="hidden"
                      accept=".pdf,.docx,.jpg,.jpeg,.png"
                      id="offer-letter-input"
                    />
                    <label
                      htmlFor="offer-letter-input"
                      className="cursor-pointer"
                      // onClick={() =>
                      //   handleFileUpload(offerLetter, "offerLetter")
                      // }
                    >
                      {offerLetter ? (
                        <p>
                          <span className="text-[#E04403] underline">
                            {offerLetter?.name}
                          </span>
                        </p>
                      ) : (
                        <p>
                          Drag & Drop or{" "}
                          <span className="text-[#E04403] underline">
                            choose file
                          </span>{" "}
                          to upload
                        </p>
                      )}
                      <p>Supported formats: .jpeg, pdf, docx</p>
                    </label>
                  </div>
                </div>

                {/* Upload Payroll Slip Section */}
                <div>
                  <h2 className="mb-2">Upload Payroll Slip</h2>
                  <div className="border border-dashed border-[#E04403] p-6 text-center mb-4">
                    <i className="fas fa-upload text-2xl text-[#E04403] mb-2"></i>
                    <input
                      type="file"
                      onChange={(e) =>
                        handleFileChange(
                          e,
                          setPayrollSlip,
                          () => {},
                          setPayrollSlipLink
                        )
                      }
                      className="hidden"
                      accept=".pdf,.docx,.jpg,.jpeg,.png"
                      id="payroll-slip-input"
                    />
                    <label
                      htmlFor="payroll-slip-input"
                      className="cursor-pointer"
                      // onClick={() =>
                      // handleFileUpload(payrollSlip, "payrollSlip")
                      // }
                    >
                      {payrollSlip ? (
                        <p>
                          <span className="text-[#E04403] underline">
                            {payrollSlip?.name}
                          </span>
                        </p>
                      ) : (
                        <p>
                          Drag & Drop or{" "}
                          <span className="text-[#E04403] underline">
                            choose file
                          </span>{" "}
                          to upload
                        </p>
                      )}
                      <p>Supported formats: .jpeg, pdf</p>
                    </label>
                  </div>
                </div>

                {/* Upload Curriculum Vitae (CV) Section */}
                <div>
                  <h2 className="mb-2">Upload Curriculum Vitae (CV)</h2>
                  <div className="border border-dashed border-[#E04403] p-6 text-center mb-4">
                    <i className="fas fa-upload text-2xl text-[#E04403] mb-2"></i>
                    <input
                      type="file"
                      onChange={(e) =>
                        handleFileChange(e, setCV, () => {}, setCVLink)
                      }
                      className="hidden"
                      accept=".pdf,.docx,.jpg,.jpeg,.png"
                      id="cv-input"
                    />
                    <label
                      htmlFor="cv-input"
                      className="cursor-pointer"
                      // onClick={() => handleFileUpload(cv, "cv")}
                    >
                      {cv ? (
                        <p>
                          <span className="text-[#E04403] underline">
                            {cv?.name}
                          </span>
                        </p>
                      ) : (
                        <p>
                          Drag & Drop or{" "}
                          <span className="text-[#E04403] underline">
                            choose file
                          </span>{" "}
                          to upload
                        </p>
                      )}
                      <p>Supported formats: .jpeg, pdf, docx</p>
                    </label>
                  </div>
                </div>

                {/* Upload Means of Identification Section */}
                <div>
                  <h2 className="mb-2">Upload Means of Identification</h2>
                  <div className="border border-dashed border-[#E04403] p-6 text-center mb-4">
                    <i className="fas fa-upload text-2xl text-[#E04403] mb-2"></i>
                    <input
                      type="file"
                      onChange={(e) =>
                        handleFileChange(e, setID, () => {}, setIDLink)
                      }
                      className="hidden"
                      accept=".pdf,.docx,.jpg,.jpeg,.png"
                      id="id-input"
                    />
                    <label
                      htmlFor="id-input"
                      className="cursor-pointer"
                      // onClick={() => handleFileUpload(id, "id")}
                    >
                      {id ? (
                        <p>
                          <span className="text-[#E04403] underline">
                            {id?.name}
                          </span>
                        </p>
                      ) : (
                        <p>
                          Drag & Drop or{" "}
                          <span className="text-[#E04403] underline">
                            choose file
                          </span>{" "}
                          to upload
                        </p>
                      )}
                      <p>Supported formats: .jpeg, pdf</p>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <div className="flex justify-end space-x-4">
            <button className="bg-gray-700 text-white py-2 px-4 rounded">
              <Link href={"/dashboard/employees"}>Cancel</Link>
            </button>

            <button
              onClick={() => (page === 2 ? handleSubmit() : setPage(page + 1))}
              className="bg-primary text-white py-2 px-4 rounded"
            >
              {loading && <SyncLoader color={"#FFFFFF"} />}
              {loading ? "" : page === 2 ? "Add" : "Next"}
            </button>
          </div>
        </motion.div>
      </Layout>
    </DashContainer>
  );
}
