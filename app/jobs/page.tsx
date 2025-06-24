"use client";
import JobBoard from "@/components/job-board";
import { useEffect, useState } from "react";
import { job } from "@/types/job";
import { useSearchParams } from "next/navigation";

export default function Page() {
    const [isLoading, setIsLoading] = useState(true);
    const [jobs, setJobs] = useState<job[]>([]);
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true);
            try {
                const query = searchParams.get('query') || '';
                const company = searchParams.get('company') || '';
                const location = searchParams.get('location') || '';

                const response = await fetch(`/api/jobs?query=${query}&company=${company}&location=${location}`);
                const data = await response.json();
                setJobs(data);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobs();
    }, [searchParams]);

    return (
        // TODO: Search bar here
        <div className="container mx-auto py-8">
            {isLoading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
                </div>
            ) : (
                // Search bar here 
                <JobBoard jobs={jobs} />
            )}
        </div>
    );
}