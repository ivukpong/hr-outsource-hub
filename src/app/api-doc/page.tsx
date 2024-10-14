// File: app/api-doc/page.tsx
import { getApiDocs } from "@/utils/swagger";
import { Metadata } from "next";
import ReactSwagger from "../components/ReactSwagger";

export const metadata: Metadata = {
  title: "API Docs",
  description: "API Documentation with Swagger for Next.js",
};
export default async function ApiDocPage() {
  const spec = await getApiDocs();

  return (
    <section className="!w-screen bg-white">
      <ReactSwagger spec={spec} />
    </section>
  );
}
