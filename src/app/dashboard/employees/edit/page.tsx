"use client";

import DashContainer from "@/app/components/DashContainer";
import CustomInput from "@/app/components/Input";
import Layout from "@/app/components/Layout";
import CustomSelect from "@/app/components/Select";
import SyncLoader from "react-spinners/ClipLoader";
import { motion } from "framer-motion";
import { Department, Employee, Team } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

export default function Page() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [maritalStatus, setMaritalStatus] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [nationality, setNationality] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [page, setPage] = useState(0);
  const [departmentId, setDepartmentId] = useState<string>("");
  const [teamId, setTeamId] = useState("");
  const [workingDays, setWorkingDays] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [imageLink, setImageLink] = useState<string | null>(null);
  const [offerLetterLink, setOfferLetterLink] = useState<string | null>(null);
  const [payrollSlipLink, setPayrollSlipLink] = useState<string | null>(null);
  const [cvLink, setCVLink] = useState<string | null>(null);
  const [idLink, setIDLink] = useState<string | null>(null);
  const [offerLetter, setOfferLetter] = useState<File | null>(null);
  const [payrollSlip, setPayrollSlip] = useState<File | null>(null);
  const [cv, setCV] = useState<File | null>(null);
  const [id, setID] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const router = useRouter();

  async function fetchDepartments() {
    const res = await fetch("/api/departments");
    const data = await res.json();
    setDepartments(data);
  }

  const fetchTeams = React.useCallback(async () => {
    const res = await fetch("/api/teams");
    const data = await res.json();
    setTeams(
      data.filter((team: Team) => team.departmentId === parseInt(departmentId))
    );
  }, [departmentId]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [departmentId, fetchTeams]);

  useEffect(() => {
    setLoading(true);
    const storedEmployee = localStorage.getItem("selectedEmployee");
    if (storedEmployee) {
      const parsedEmployee = JSON.parse(storedEmployee);
      setEmployee(parsedEmployee);
      setFirstName(parsedEmployee.firstName || "");
      setLastName(parsedEmployee.lastName || "");
      setMobileNumber(parsedEmployee.mobileNumber || "");
      setEmailAddress(parsedEmployee.emailAddress || "");
      setDateOfBirth(parsedEmployee.dateOfBirth || "");
      setMaritalStatus(parsedEmployee.maritalStatus || "");
      setGender(parsedEmployee.gender || "");
      setNationality(parsedEmployee.nationality || "");
      setAddress(parsedEmployee.address || "");
      setCity(parsedEmployee.city || "");
      setState(parsedEmployee.state || "");
      setZipCode(parsedEmployee.zipCode || "");
      setDepartmentId(parsedEmployee.departmentId || "");
      setTeamId(parsedEmployee.teamId || "");
      setWorkingDays(parsedEmployee.workingDays || "");
      setStartDate(parsedEmployee.startDate || "");
      setLocation(parsedEmployee.officeLocation || "");
      setImagePreview(parsedEmployee.profilePic || "");
      setImageLink(parsedEmployee.profilePic || "");
      setOfferLetterLink(parsedEmployee.offerLetter || "");
      setPayrollSlipLink(parsedEmployee.payrollSlip || "");
      setIDLink(parsedEmployee.meanOfId || "");
      setCVLink(parsedEmployee.cv || "");
      setLoading(false);
    } else {
      toast.error("Error loading employee details");
    }
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
    setLoading(true);

    const employeeData = {
      id: employee?.id,
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
      zipCode,
      workingDays: parseInt(workingDays),
      startDate: new Date(startDate).toISOString(),
      officeLocation:
        location === "1" ? "Remote" : location === "2" ? "Hybrid" : "On-site",
      offerLetter: offerLetterLink,
      payrollSlip: payrollSlipLink,
      cv: cvLink,
      meansOfId: idLink,
      departmentId: parseInt(departmentId),
    };

    const response = await fetch("/api/employees", {
      method: "PUT",
      body: JSON.stringify(employeeData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      toast.success("Employee updated successfully!");
      router.push("/dashboard/employees");
    } else {
      toast.error(data.error || "Failed to add employee.");
    }
    setLoading(false);
  };

  return (
    <DashContainer>
      <Layout header="Employees" desc="Employee Information">
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
          className="w-full mx-auto p-8 border text-dark border-grey rounded-[10px]"
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
              className="bg-white p-6 rounded-lg"
            >
              <div className="flex items-center mb-6">
                <div>
                  <div className="w-24 h-24 bg-[#A2A2A833] rounded flex items-center justify-center relative">
                    {imagePreview ? (
                      <Image
                        src={imagePreview} // Display the uploaded image preview
                        alt="Uploaded"
                        className="w-full h-full rounded"
                        height={96}
                        width={96}
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
                <CustomInput
                  htmlFor="maritalStatus"
                  id="maritalStatus"
                  label="Marital Status"
                  type="text"
                  placeholder="Enter Marital Status"
                  value={maritalStatus}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setMaritalStatus(e.target.value)
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <CustomInput
                  htmlFor="gender"
                  id="gender"
                  label="Gender"
                  type="text"
                  placeholder="Enter Gender"
                  value={gender}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setGender(e.target.value)
                  }
                  required
                />
                <CustomInput
                  htmlFor="nationality"
                  id="nationality"
                  label="Nationality"
                  type="text"
                  placeholder="Enter Nationality"
                  value={nationality}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNationality(e.target.value)
                  }
                  required
                />
              </div>

              <div className="mb-4">
                <CustomInput
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
              className="bg-white p-6 rounded-lg"
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
                    value={departmentId}
                    options={departments}
                    onChange={(e) => setDepartmentId(e.target.value)}
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
              className="bg-white p-6 rounded-lg"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Upload Offer Letter Section */}
                <div>
                  <h2 className="mb-2">Upload Offer Letter</h2>
                  <div className="border border-dashed border-orange-500 p-6 text-center mb-4">
                    <i className="fas fa-upload text-2xl text-orange-500 mb-2"></i>
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
                          <span className="text-orange-500 underline">
                            {offerLetter?.name}
                          </span>
                        </p>
                      ) : (
                        <p>
                          Drag & Drop or{" "}
                          <span className="text-orange-500 underline">
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
                  <div className="border border-dashed border-orange-500 p-6 text-center mb-4">
                    <i className="fas fa-upload text-2xl text-orange-500 mb-2"></i>
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
                          <span className="text-orange-500 underline">
                            {payrollSlip?.name}
                          </span>
                        </p>
                      ) : (
                        <p>
                          Drag & Drop or{" "}
                          <span className="text-orange-500 underline">
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
                  <div className="border border-dashed border-orange-500 p-6 text-center mb-4">
                    <i className="fas fa-upload text-2xl text-orange-500 mb-2"></i>
                    <input
                      type="file"
                      onChange={(e) =>
                        handleFileChange(e, setCV, () => {}, setCVLink)
                      }
                      className="hidden"
                      id="cv-input"
                    />
                    <label
                      htmlFor="cv-input"
                      className="cursor-pointer"
                      // onClick={() => handleFileUpload(cv, "cv")}
                    >
                      {cv ? (
                        <p>
                          <span className="text-orange-500 underline">
                            {cv?.name}
                          </span>
                        </p>
                      ) : (
                        <p>
                          Drag & Drop or{" "}
                          <span className="text-orange-500 underline">
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
                  <div className="border border-dashed border-orange-500 p-6 text-center mb-4">
                    <i className="fas fa-upload text-2xl text-orange-500 mb-2"></i>
                    <input
                      type="file"
                      onChange={(e) =>
                        handleFileChange(e, setID, () => {}, setIDLink)
                      }
                      className="hidden"
                      id="id-input"
                    />
                    <label
                      htmlFor="id-input"
                      className="cursor-pointer"
                      // onClick={() => handleFileUpload(id, "id")}
                    >
                      {id ? (
                        <p>
                          <span className="text-orange-500 underline">
                            {id?.name}
                          </span>
                        </p>
                      ) : (
                        <p>
                          Drag & Drop or{" "}
                          <span className="text-orange-500 underline">
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
              {loading ? "" : page === 2 ? "Edit" : "Next"}
            </button>
          </div>
        </motion.div>
      </Layout>
    </DashContainer>
  );
}
