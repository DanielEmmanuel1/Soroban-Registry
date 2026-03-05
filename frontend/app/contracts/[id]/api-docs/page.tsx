"use client";

import "swagger-ui-react/swagger-ui.css";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Suspense, useMemo } from "react";
import Navbar from "@/components/Navbar";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px] text-muted-foreground">
      Loading API documentation...
    </div>
  ),
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function ApiDocsContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const version = searchParams.get("version") ?? undefined;

  const specUrl = useMemo(() => {
    const url = new URL(`${API_URL}/api/contracts/${id}/openapi.yaml`);
    if (version) url.searchParams.set("version", version);
    return url.toString();
  }, [id, version]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="border-b border-border bg-card px-4 py-3">
        <Link
          href={`/contracts/${id}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to contract
        </Link>
        <h1 className="text-lg font-semibold text-foreground mt-1">
          API Documentation
          {version ? ` (v${version})` : ""}
        </h1>
      </div>
      <div className="swagger-wrapper [&_.swagger-ui]:bg-transparent">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[400px] text-muted-foreground">
              Loading OpenAPI spec...
            </div>
          }
        >
          <SwaggerUI url={specUrl} />
        </Suspense>
      </div>
    </div>
  );
}

export default function ApiDocsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ApiDocsContent />
    </Suspense>
  );
}
