"use client";

import Button from "@/app/components/Button";
import DashContainer from "@/app/components/DashContainer";
import EmployeeEmails from "@/app/components/EmployeeEmails";
import CustomInput from "@/app/components/Input";
import Layout from "@/app/components/Layout";
import Modal from "@/app/components/Modal";
import ResponseItem from "@/app/components/ResponseItem";
import CustomSelect from "@/app/components/Select";
import StatCard from "@/app/components/StatCard";
import SurveyChart from "@/app/components/SurveyChart";
import SurveyItem from "@/app/components/SurveyItem";
import { questionMapping } from "@/app/data";
import {
  faCommentDots,
  faEye,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  Employee,
  Survey,
  SurveyCategory,
  SurveyResponse,
} from "@prisma/client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [surveys, setSurveys] = useState<{
    surveys: Survey[];
    totalSentEmails: number;
    totalCompletedSurveys: number;
    totalSeenSurveys: number;
  }>();
  const [responses, setResponses] =
    useState<
      ({ employee: Employee } & { survey: Survey } & SurveyResponse)[]
    >();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<SurveyCategory | "">("");
  const [sentToEmails, setSentToEmails] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchSurveys() {
    const res = await fetch("/api/surveys");
    const data = await res.json();
    console.log(data);
    setSurveys(data);
  }

  async function fetchResponses() {
    const res = await fetch("/api/surveys/responses");
    const data = await res.json();
    console.log(data);
    setResponses(data);
  }

  useEffect(() => {
    fetchSurveys();
    fetchResponses();
  }, []);
  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    setLoading(true);

    try {
      const surveyData = {
        title,
        description,
        sentToEmails,
        category,
      };
      const response = await fetch("/api/surveys", {
        method: "POST", // Use POST method for creating a new survey
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
        body: JSON.stringify(surveyData), // Convert surveyData to JSON string
      });

      if (!response.ok) {
        // Check if the response is not OK (status not in the range 200-299)
        toast.error("Failed to create survey");
        throw Error("Failed to create survey");
      }

      const data = await response.json(); // Parse the JSON response
      setTitle("");
      setDescription("");
      setSentToEmails("");
      setCategory("");
      handleCloseModal();
      setLoading(false);
      toast.success(data.message);
      return data; // Return the created survey data or handle it as needed
    } catch (error) {
      setLoading(false);
      console.error("Error creating survey:", error); // Log the error
      throw error; // Propagate error if needed
    }
  }

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  async function fetchEmployees() {
    const res = await fetch("/api/employees");
    const data = await res.json();
    setEmployees(data);
  }

  useEffect(() => {
    fetchEmployees();
  }, []);

  const statsData = [
    {
      id: 1,
      icon: faFileAlt,
      title: "Surveys created",
      stat: "4.5%",
      trend: "up",
      value: surveys?.surveys.length,
      trendText: "vs last month",
      color: "text-green-500",
    },
    {
      id: 2,
      icon: faCommentDots,
      title: "Survey responses",
      stat: "1.2%",
      trend: "down",
      value: surveys?.totalCompletedSurveys,
      trendText: "vs last month",
      color: "text-red-500",
    },
    {
      id: 3,
      icon: faEye,
      title: "Question views",
      stat: "1.2%",
      trend: "down",
      value: surveys?.totalSeenSurveys,
      trendText: "vs last month",
      color: "text-red-500",
    },
  ];
  return (
    <DashContainer>
      <Layout header="Survey" desc="Feedback Survey">
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <div className="w-full max-w-lg">
            <h2 className="text-dark dark:text-white text-xl font-semibold mb-4">
              Survey Form
            </h2>
            <form onSubmit={handleSubmit}>
              <CustomInput
                htmlFor="surveyTitle"
                label="Survey Title"
                id="surveyTitle"
                type="text"
                placeholder="Enter Title"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTitle(e.target.value)
                }
                required
              />
              <CustomInput
                htmlFor="surveyDescription"
                label="Survey Description"
                id="surveyDescription"
                type="text"
                placeholder="Enter Description"
                value={description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDescription(e.target.value)
                }
                required
              />
              <EmployeeEmails
                htmlFor="senttoEmails"
                label="Select Emails"
                options={employees}
                onChange={(e) => setSentToEmails(e)}
                required
              />

              <CustomSelect
                htmlFor="category"
                label="Select Category"
                id="category"
                value={category}
                options={Object.values(SurveyCategory).map((category) => ({
                  id: category,
                  name: category.replace(/_/g, " "),
                }))}
                onChange={(e) => setCategory(e.target.value as SurveyCategory)}
                required
              />
              <label className="block text-gray-700 dark:text-white text-sm font-bold mb-2">
                Questions
              </label>
              {category &&
                questionMapping[category] &&
                questionMapping[category].map((question, index) => (
                  <div key={index} className="flex w-full items-start my-1">
                    <p className="mr-2 w-4 h-full">{index + 1}</p>
                    <p className="mr-2">{question.text}</p>
                  </div>
                ))}
              <div className="flex justify-between mt-5 gap-5">
                <div className="w-full">
                  <Button
                    text="Cancel"
                    type="button"
                    outline
                    click={handleCloseModal}
                  />
                </div>
                <div className="w-full">
                  <Button text="Create" loading={loading} type="submit" />
                </div>
              </div>
            </form>
          </div>
        </Modal>
        <div className="flex-1 p-6">
          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <div className="grid lg:grid-cols-3 gap-6">
                {statsData.map((item) => (
                  <StatCard item={item} key={item.id} />
                ))}
              </div>
              <div className="bg-white dark:bg-gray-800 py-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Surveys</h2>
                  <div className="flex items-center">
                    <span className="text-gray-500  dark:text-white mr-2">
                      This Year
                    </span>
                    <i className="fas fa-chevron-down text-gray-500  dark:text-white"></i>
                  </div>
                </div>
                <SurveyChart />
              </div>
              <div className="bg-white dark:bg-gray-800 pt-6 rounded-lg">
                <h2 className="text-lg font-semibold mb-4">Responses</h2>
                {responses?.map((response, index) => (
                  <ResponseItem response={response} key={index} />
                ))}
              </div>
            </div>
            <div className="lg:col-span-2 w-full">
              <div className="bg-white dark:bg-gray-800 lg:ml-6 mb-6 !w-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Recent Surveys</h2>
                  <span className="text-gray-500  dark:text-white cursor-pointer">
                    See all
                  </span>
                </div>
                {surveys?.surveys.map((survey, index) => (
                  <SurveyItem key={index} survey={survey} />
                ))}
              </div>
              <div className="bg-white dark:bg-gray-800 py-6 rounded-lg shadow dark:shadow-slate-400 lg:ml-6 !w-full">
                <div className="flex flex-col justify-between items-center mb-4">
                  <div className="w-[50%] h-3 bg-gray-100 rounded-lg mb-4"></div>
                  <div className="w-[70%] h-3 bg-gray-100 rounded-lg mb-4"></div>
                </div>
                <div className="text-center">
                  <p className="font-semibold mb-2">Have a Question?</p>
                  <p className="text-gray-500  dark:text-white mb-4">
                    Start Your Survey Today!
                  </p>
                  <button
                    className="bg-black text-white px-4 py-2 rounded-lg"
                    onClick={handleOpenModal}
                  >
                    + Create Survey
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </DashContainer>
  );
}
export default Page;
