"use client";
import { job } from "@/types/job";
import { Link, MapPin } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface JobDetailProps {
    job: job;
}

export function JobDetail({ job }: JobDetailProps) {
    return (
        <div className="max-w-3xl container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 gap-12">
                {/* Main Content */}
                <div className="space-y-8">
                    {/* Job Header */}
                    <div>
                        <div className="flex items-start space-x-4 mb-6">
                            <div className="flex-1">
                            <h1 className="text-3xl font-light text-gray-900 mb-2">{job.title}</h1>
                            <p className="text-lg text-gray-600 mb-4">{job.business_name}</p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                {job.location? (
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        <p>{job.location}</p>
                                    </div>
                                ) : (<></>)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Job Description */}
                <Card className="border-brand-primary/30 hover:border-brand-primary/50 transition-colors p-2">
                    <CardHeader>
                        <p className="text-lg font-medium text-gray-900 leading-none tracking-tight">About this job</p>
                    </CardHeader>
                    <div className="flex flex-col px-6">
                        <p className="text-gray-600 leading-relaxed pb-4">
                            {job.description}
                        </p>
                    </div>
                </Card>    

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Apply Section */}
                    <Card className="border-brand-primary/30">
                        <div className="p-6 space-y-4">
                            <Button className="w-full bg-brand-primary hover:bg-brand-primary/70 transition-all duration-300 text-white h-12">
                                <Link href={job.link}>
                                    Apply for this position
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full border-brand-primary/30 hover:border-brand-primary/50 transition-all duration-300 text-gray-700 h-12">
                                Save job
                            </Button>
                        </div>
                    </Card> 
                </div>   
            </div>
        </div>
    </div>
    )
}