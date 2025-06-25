"use client";

import { useEffect, useState } from "react";
import { Suspense } from "react"
import { useParams } from "next/navigation";
import { JobDetail } from "./components/job-detail"
import { job } from "@/types/job";

export default function JobPage() {
  const [jobData, setJobData] = useState<job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const jobId = params['job-id'] as string;
        
        if (!jobId) {
          setError("Job ID not found");
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/jobs/${jobId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch job: ${response.statusText}`);
        }

        const data = await response.json();
        setJobData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch job data");
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [params]);

  if (error) {
    return (
      <main className="min-h-screen pt-24">
        <div className="container mx-auto py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24">
      <Suspense fallback={
            <div className="container mx-auto py-8">
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
                </div>
            </div>
      }>
        {loading ? (
          <div className="container mx-auto py-8">
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
            </div>
          </div>
        ) : jobData ? (
          <JobDetail job={jobData}/>
        ) : null}
      </Suspense>
    </main>
  )
}
