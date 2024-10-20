"use client";

import DashContainer from "@/app/components/DashContainer";
import Layout from "@/app/components/Layout";
import ResponseItem from "@/app/components/ResponseItem";
import StatCard from "@/app/components/StatCard";
import SurveyChart from "@/app/components/SurveyChart";
import SurveyItem from "@/app/components/SurveyItem";
import { responses, surveys, statsData } from "@/app/data";
import React from "react";

function Page() {
  return (
    <DashContainer>
      <Layout header="Survey" desc="Feedback Survey">
        <div className="flex-1 p-6">
          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-3">
              <div className="grid md:grid-cols-3 gap-6">
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
                {responses.map((response, index) => (
                  <ResponseItem response={response} key={index} />
                ))}
              </div>
            </div>
            <div className="md:col-span-2 w-full">
              <div className="bg-white dark:bg-gray-800 md:pl-6 mb-6 !w-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Recent Surveys</h2>
                  <span className="text-gray-500  dark:text-white cursor-pointer">
                    See all
                  </span>
                </div>
                {surveys.map((survey, index) => (
                  <SurveyItem key={index} survey={survey} />
                ))}
              </div>
              <div className="bg-white dark:bg-gray-800 py-6 rounded-lg shadow dark:shadow-slate-400 md:ml-6 !w-full">
                <div className="flex flex-col justify-between items-center mb-4">
                  <div className="w-[50%] h-3 bg-gray-100 rounded-lg mb-4"></div>
                  <div className="w-[70%] h-3 bg-gray-100 rounded-lg mb-4"></div>
                </div>
                <div className="text-center">
                  <p className="font-semibold mb-2">Have a Question?</p>
                  <p className="text-gray-500  dark:text-white mb-4">
                    Start Your Survey Today!
                  </p>
                  <button className="bg-black text-white px-4 py-2 rounded-lg">
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
