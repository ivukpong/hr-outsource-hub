"use client";

import DashContainer from "@/app/components/DashContainer";
import Layout from "@/app/components/Layout";
import React from "react";

function Page() {
  return (
    <DashContainer>
      <Layout header="Settings" desc="User Settings">
        Settings
      </Layout>
    </DashContainer>
  );
}

export default Page;
