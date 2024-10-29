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
import { CircularProgress } from "@mui/material";
import {
  Employee,
  QuestionType,
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
  const [surveyData, setSurveyData] = useState<Survey[]>();
  const [responses, setResponses] =
    useState<
      ({ employee: Employee } & { survey: Survey } & SurveyResponse)[]
    >();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<SurveyCategory | "">("");
  const [sentToEmails, setSentToEmails] = useState<(string | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [seeResponses, setSeeResponses] = useState(false);
  const [filteredResponses, setFilteredResponses] =
    useState<
      ({ employee: Employee } & { survey: Survey } & SurveyResponse)[]
    >();
  const [seeSurveys, setSeeSurveys] = useState(false);
  const [filteredSurveys, setFilteredSurveys] = useState<Survey[]>();
  const [questions, setQuestions] = useState<
    { text: string; type: QuestionType; options: string[] }[]
  >([{ text: "", type: "TEXT", options: [] }]);

  // Function to add a new question
  const addQuestion = () => {
    setQuestions([...questions, { text: "", type: "TEXT", options: [] }]);
  };

  useEffect(() => {
    // Prefill questions when a new category is selected
    if (
      category &&
      category !== "CUSTOM" &&
      questionMapping[category as keyof typeof questionMapping]
    ) {
      setQuestions(
        questionMapping[category as keyof typeof questionMapping].map((q) => ({
          text: q.text,
          type: q.type,
          options: q.options || [],
        }))
      );
    }
  }, [category]); // Function to handle question updates

  const updateQuestion = (
    index: number,
    field: "text" | "type" | "options",
    value: string | string[] | QuestionType
  ) => {
    const updatedQuestions = [...questions];
    if (field === "options") {
      updatedQuestions[index][field] = value as string[];
    } else if (field === "type") {
      updatedQuestions[index][field] = value as QuestionType;
    } else {
      updatedQuestions[index][field] = value as string;
    }
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const surveyData = {
      title,
      description,
      category,
      sentToEmails,
      questions,
    };

    try {
      const response = await fetch("/api/surveys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(surveyData),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(`Survey created successfully!`);
        handleCloseModal();
        fetchSurveys();
        fetchResponses();
      } else {
        toast.error(`Error creating survey: ${data.error}`);
      }
    } catch (error) {
      console.error("Error creating survey:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const filterResponses = () => {
      setFilteredResponses(
        seeResponses ? responses : filteredResponses?.slice(0, 3)
      );
    };
    filterResponses();
  }, [seeResponses]);

  useEffect(() => {
    const filterSurveys = () => {
      setFilteredSurveys(
        seeSurveys ? surveyData : filteredSurveys?.slice(0, 5)
      );
    };
    filterSurveys();
  }, [seeSurveys]);

  async function fetchSurveys() {
    const res = await fetch("/api/surveys");
    const data = await res.json();
    setSurveys(data);
    setSurveyData(data.surveys);
    setFilteredSurveys(data.surveys);
  }

  async function fetchResponses() {
    const res = await fetch("/api/surveys/responses");
    const data = await res.json();

    setResponses(data.reverse());
    setFilteredResponses(data.slice(0, 3).reverse());
    setFetching(false);
  }

  useEffect(() => {
    fetchSurveys();
    fetchResponses();
  }, []);

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
      value: surveys?.surveys?.length ?? 0,
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
          {/* <form onSubmit={handleSubmit}>
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
            </form> */}
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

              {/* <EmployeeEmails
                htmlFor="senttoEmails"
                label="Select Emails"
                options={employees}
                onChange={(e) => setSentToEmails(e)}
                required
              /> */}
              <EmployeeEmails
                htmlFor="senttoEmails"
                label="Select Emails"
                options={employees}
                onChange={(selectedEmails) => setSentToEmails(selectedEmails)}
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
              {questions.map((question, index) => (
                <div key={index} className="mb-4">
                  <CustomInput
                    label={`Question ${index + 1}`}
                    type="text"
                    placeholder="Enter question text"
                    value={question.text}
                    onChange={(e) =>
                      updateQuestion(index, "text", e.target.value)
                    }
                    required
                  />
                  <CustomSelect
                    label="Question Type"
                    value={question.type}
                    options={[
                      { id: "TEXT", name: "Text" },
                      { id: "RADIO", name: "Radio" },
                      { id: "CHECKBOX", name: "Checkbox" },
                      { id: "SCALE", name: "Scale" },
                    ]}
                    onChange={(e) =>
                      updateQuestion(index, "type", e.target.value)
                    }
                    required
                  />
                  {question.type !== "TEXT" && (
                    <CustomInput
                      label="Options (comma-separated)"
                      type="text"
                      placeholder="Option1, Option2, ..."
                      value={question.options.join(", ")}
                      onChange={(e) =>
                        updateQuestion(
                          index,
                          "options",
                          e.target.value.split(",").map((opt) => opt.trim())
                        )
                      }
                    />
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      setQuestions(questions.filter((_, i) => i !== index))
                    }
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <Button text="Add Question" type="button" click={addQuestion} />

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
        {fetching ? (
          <div className="flex h-full w-full items-center justify-center text-primary">
            <CircularProgress color="inherit" />
          </div>
        ) : (
          <div className="flex-1 p-6">
            <div className="grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3">
                <div className="grid sm:grid-cols-3 gap-6">
                  {statsData.map((item) => (
                    <StatCard item={item} key={item.id} />
                  ))}
                </div>
                <SurveyChart />
                <div className="bg-white dark:bg-gray-800 py-6 rounded-lg mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Responses</h2>
                    <div className="flex items-center">
                      <span
                        className="text-gray-500  dark:text-white mr-2 cursor-pointer"
                        onClick={() => setSeeResponses(!seeResponses)}
                      >
                        {seeResponses ? "Hide all" : "See all"}
                      </span>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {filteredResponses?.map((response) => (
                      <ResponseItem response={response} key={response.id} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 md:py-0 py-6 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Surveys</h2>
                    <div className="flex items-center">
                      <span
                        className="text-gray-500  dark:text-white mr-2 cursor-pointer"
                        onClick={() => setSeeSurveys(!seeSurveys)}
                      >
                        {seeSurveys ? "Hide all" : "See all"}
                      </span>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {filteredSurveys?.map((survey) => (
                      <SurveyItem survey={survey} key={survey.id} />
                    ))}
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 py-6 rounded-lg shadow dark:shadow-slate-400 !w-full">
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
        )}
      </Layout>
    </DashContainer>
  );
}

export default Page;
