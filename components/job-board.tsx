import { MapPin, Calendar, Link } from "lucide-react";
import { Card } from "./ui/card";
import { job } from "@/types/job";

export default function JobBoard({ jobs }: { jobs: job[] }) {
    return (
        <>
        {jobs.length < 0 ? (
            <div className="font-brand text-center py-12">
                <h2 className="text-2xl font-semibold mb-2">No jobs found</h2>
                <p className="text-gray-600">Try adjusting your search criteria or check back later for new opportunities.</p>
            </div>
        ): (
            <div className="space-y-6">
                {jobs.map((job) => (
                    <Card key={job.id} className="border-gray-200 hover:border-gray-300 transition-colors p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-start mb-2">
                                    <div>
                                        <h4 className="text-lg font-medium text-gray-900 mb-1">{job.title}</h4>
                                        <p className="text-gray-600 text-sm">{job.business_name}</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{job.description}</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-6 text-xs text-gray-500">
                                        {job.location ? (
                                            <div className="flex items-center">
                                                <MapPin className="w-3 h-3 mr-1">
                                                    {job.location}
                                                </MapPin>
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
        )}
        </>
    )
}