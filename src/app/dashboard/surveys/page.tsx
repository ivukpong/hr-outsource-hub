"use client";

import DashContainer from "@/app/components/DashContainer";
import Layout from "@/app/components/Layout";
import React from "react";

function Page() {
  return (
    <DashContainer>
      <Layout header="Survey" desc="Employee Information">
        Surveys
      </Layout>
    </DashContainer>
  );
}

export default Page;
