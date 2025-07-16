import { MapPin, Calendar, Leaf } from "lucide-react";
import { Card } from "./ui/card";
import { job } from "@/types/job";
import Link from "next/link"

export default function JobBoard({ jobs }: { jobs: job[] }) {
    return (
        <div className="py-8">
        {jobs.length < 0 ? (
            <div className="text-center py-12">
                <h2 className="text-2xl font-semibold mb-2">No jobs found</h2>
                <p className="text-gray-600">Try adjusting your search criteria or check back later for new opportunities.</p>
            </div>
        ): (
            <div>
                <h3 className="font-brand text-sm font-black text-brand-primary mb-6 uppercase tracking-wide">all jobs</h3>
                <div className="space-y-6">
                    {jobs.map((job) => (
                        <Card key={job.id} className="border-brand-primary/30 hover:border-brand-primary/50 transition-colors p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h4 className="text-lg font-medium text-gray-900 mb-1">{job.title}</h4>
                                            <p className="text-gray-600 text-sm">{job.business_name}</p>
                                        </div>
                                        <div>
                                            <div className="flex font-brand font-black text-brand-primary/80 text-sm items-center">
                                                <Leaf className="w-3 h-3 mr-1"/>
                                                Green score
                                            </div>
                                            <div className="flex font-black text-brand-primary items-center justify-center">
                                                {job.green_score}
                                            </div>
                                            {job.green_score > 5 ? (
                                                <div className="flex font-black text-brand-primary items-center justify-center">
                                                    Green job
                                                </div>
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                        {job.description.length > 200 
                                            ? `${job.description.slice(0, 200)}...` 
                                            : job.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-6 text-xs text-gray-500">
                                            {job.location ? (
                                                <div className="flex items-center">
                                                    <MapPin className="w-3 h-3 mr-1"/>
                                                    {job.location}
                                                </div>
                                            ) : (
                                                <></>
                                            )}
                                            <div className="flex items-center">
                                                <Calendar className="w-3 h-3 mr-1"/>
                                                {new Date(job.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                        <Link href={`/jobs/${job.id}`}>
                                                <button className="text-lg bg-brand-primary hover:bg-brand-primary/70 text-white transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2">
                                                    Apply
                                                </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        )}
        </div>
    )
}