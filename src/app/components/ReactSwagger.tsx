"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const DynamicSwaggerUI = dynamic(() => import("swagger-ui-react"), {
  ssr: false,
});

type Props = {
  spec: Record<string, unknown>;
};

function ReactSwagger({ spec }: Props) {
  return (
    <div className="w-screen bg-white">
      <DynamicSwaggerUI spec={spec} />;
    </div>
  );
}

export default ReactSwagger;
