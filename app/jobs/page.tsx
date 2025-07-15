"use client";

import JobBoard from "@/components/job-board";
import { Input } from "@/components/ui/input";
import { useEffect, useState, Suspense } from "react";
import { job } from "@/types/job";
import { useSearchParams } from "next/navigation";

function JobList() {
    const [pageSearch, setPageSearch] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [jobs, setJobs] = useState<job[]>([]);
    // What user types
    const [inputQuery, setInputQuery] = useState("");
    const [inputCompany, setInputCompany] = useState("");
    const [inputLocation, setInputLocation] = useState("");
    // Search state
    const [searchQuery, setSearchQuery] = useState("");
    const [companySearch, setCompanySearch] = useState("");
    const [locationSearch, setLocationSearch] = useState("");
    // URL search params
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchJobs = async () => {
            if (pageSearch === false) {
                setSearchQuery(searchParams.get('query') || '');
                setCompanySearch(searchParams.get('company') || '');
                setLocationSearch(searchParams.get('location') || '');
                setPageSearch(true)
            }
            setIsLoading(true);
            try {
                const response = await fetch(`/api/jobs?query=${searchQuery}&company=${companySearch}&location=${locationSearch}`);
                const data = await response.json();
                setJobs(data);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobs();
    }, [searchQuery, companySearch, locationSearch, pageSearch, searchParams]);

    const handleSearch = () => {
        setSearchQuery(inputQuery);
        setCompanySearch(inputCompany);
        setLocationSearch(inputLocation);
    };

    return (
            <div className="pt-24 container mx-auto py-8 font-body">
                {/* Search bar */}
                <div className="">
                    <div className="grid grid-cols-1 lg:grid-cols-9 gap-3">
                        <div className="lg:col-span-4">
                            <Input
                                placeholder="Search Jobs"
                                value={inputQuery}
                                onChange={(e) => setInputQuery(e.target.value)}
                                className="border-brand-primary/50 focus:brand-primary focus:ring-0 h-11"
                            />
                        </div>
                        <div className="lg:col-span-2">
                            <Input
                                placeholder="Search Companies"
                                value={inputCompany}
                                onChange={(e) => setInputCompany(e.target.value)}
                                className="border-brand-primary/50 focus:brand-primary focus:ring-0 h-11"
                            />
                        </div>
                        <div className="lg:col-span-2">
                            <Input
                                placeholder="Search Locations"
                                value={inputLocation}
                                onChange={(e) => setInputLocation(e.target.value)}
                                className="border-brand-primary/50 focus:brand-primary focus:ring-0 h-11"
                            />
                        </div>
                        {/* Search submit button */}
                        <button className="text-lg bg-brand-primary hover:bg-brand-primary/70 text-white transition-all duration-300 hover:scale-102 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-11 px-4 py-2" onClick={handleSearch}>
                            Search
                        </button>
                    </div>
                </div>
                {/* Content */}
                {isLoading ? (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
                    </div>
                ) : (
                    <div>
                        <JobBoard jobs={jobs} />
                    </div>
                )}
            </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={
            <div className="container mx-auto py-8">
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
                </div>
            </div>
        }>
            <JobList/>
        </Suspense>
    )
}