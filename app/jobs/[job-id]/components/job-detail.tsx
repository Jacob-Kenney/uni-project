"use client";
import { job } from "@/types/job";
import { MapPin, Link as LinkIcon, Edit, Send, Trash, Leaf } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { company } from "@/types/company";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

interface JobDetailProps {
    job: job;
}

interface FormErrors {
    [key: string]: string
}

export default function JobDetail({ job }: JobDetailProps) {    
    const [company, setCompany] = useState<company | null>(null)
    const [greenScore, setGreenScore] = useState<number | null>(null);
    const { data: session } = useSession();
    const [editable, setEditable] = useState(false)
    const [editing, setEditing] = useState(false)
    const [formData, setFormData] = useState({
        title: job.title,
        description: job.description,
        location: job.location || "",
        link: job.link || "",
    })
    const [errors, setErrors] = useState<FormErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const fetchCompanyData = async () => {
            const company = await fetch(`/api/companies/name:${job.business_name}`)
            const companyData = await company.json()
            console.log(companyData)
            if(companyData.name) {
                setCompany(companyData)
                setEditable(session?.user?.id === companyData?.id)
            }
        }
        fetchCompanyData()
    }, [job.business_name, session?.user?.id])

    useEffect(() => {
        const fetchGreenScore = async () => {
            if (!job.business_name || !session?.user?.id) return;
            
            try {
                const response = await fetch('/api/green-scores/evaluate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        businessName: job.business_name,
                        title: job.title,
                        description: job.description,
                        location: job.location,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setGreenScore(data.greenScore);
                }
            } catch (error) {
                console.error('Error fetching green score:', error);
            }
        };

        fetchGreenScore();
    }, [job.business_name, job.title, job.description, job.location, session?.user?.id])

    // Validate form for errors
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        if(!formData.title.trim()) newErrors.title = "Job title is required"
        if(!formData.description.trim()) newErrors.description = "Job description is required"
        if(!formData.location.trim()) newErrors.location = "Job location is required"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Handle input changes (update form when users changes form fields)
    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }))
        }
    }

    // Handle form submission
    const handleSubmit = async () => {
        // Check for errors validating the form
        if (!validateForm()) return

        setIsSubmitting(true)

        // Create job object
        const jobInfo = {
            id: job.id,
            created_at: job.created_at,
            expired_at: job.expired_at,
            title: formData.title || job.title,
            description: formData.description || job.description,
            emission_estimate: job.emission_estimate,
            business_name: job.business_name,
            location: formData.location || job.location,
            status: job.status,
            impact_score: job.impact_score,
            green_score: greenScore,
            link: formData.link || job.link,
        }

        // Update job in database
        const updateResponse = await fetch(`/api/jobs/${job.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(jobInfo),
        })
        const updatedJob = await updateResponse.json()

        if (!updatedJob.business_name) {
            console.error("Failed to update job:", updatedJob)
            setIsSubmitting(false)
            return
        }
        setEditing(false)
        setIsSubmitting(false)
    }

    // Handle job deletion
    const handleDelete = async () => {
        const deleteResponse = await fetch(`/api/jobs/${job.id}`, {
            method: "DELETE",
        })
        const deletedJob = await deleteResponse.json()
        if (!deletedJob.business_name) {
            console.error("Failed to delete job:", deletedJob)
            return
        }
        router.push("/jobs")
    }

    return (
        <div className="max-w-3xl container mx-auto px-4 py-12">
            {editing? (
                <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-light text-gray-900">Edit a Job</h1>
                </div>
                
                {/* Job submission form */}
                <Card className="border-brand-primary/50">
                    <CardContent className="p-8">
                        <div className="space-y-6">
                            <div>
                                <h2 className="font-brand text-2xl font-gray-900 mb-2">Job Information</h2>
                                <p className="text-gray-600">Please provide your job&apos;s basic information.</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="title">Job Title *</Label>
                                    <Input id="title" name="title" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} placeholder="Enter your job title" className={errors.title ? "border-red-300" : "border-brand-primary/30 hover:border-brand-primary/50"}/>
                                    {errors.title && <p className="text-red-500">{errors.title}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="description">Job Description *</Label>
                                    <Textarea id="description" rows={4} value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} placeholder="Describe your job" className={errors.description ? "border-red-300" : "border-brand-primary/30 hover:border-brand-primary/50"}/>
                                    {errors.description && <p className="text-red-500">{errors.description}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="location">Location *</Label>
                                    <Input id="location" name="location" value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)} placeholder="Enter your job location" className={errors.location ? "border-red-300" : "border-brand-primary/30 hover:border-brand-primary/50"}/>
                                    {errors.location && <p className="text-red-500">{errors.location}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="link">Job Link</Label>
                                    <Input id="link" name="link" value={formData.link} onChange={(e) => handleInputChange('link', e.target.value)} placeholder="Enter your job link" className={errors.link ? "border-red-300" : "border-brand-primary/30 hover:border-brand-primary/50"}/>
                                    {errors.link && <p className="text-red-500">{errors.link}</p>}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Buttons */}
                <div className={!isSubmitting ? "flex items-end gap-4 justify-between mt-8" : "flex items-end justify-end mt-8"}>
                    {!isSubmitting && (
                        <Button
                            type="submit"
                            className="bg-red-500 hover:bg-red-500/70 text-white"
                            onClick={handleDelete}
                        >
                            <Trash className="w-4 h-4 mr-2" />
                            Delete Job
                        </Button>
                    )}
                    <Button
                        type="submit"
                        className="bg-brand-primary hover:bg-brand-primary/70 text-white"
                        onClick={handleSubmit}
                    >
                        <Send className="w-4 h-4 mr-2" />
                        {isSubmitting ? "Editing..." : "Edit Job"}
                    </Button>
                </div>
            </div>
            ) : (
            <div className="grid grid-cols-1 gap-12">
                {/* Main Content */}
                <div className="space-y-8">
                    {/* Job Header */}
                    <div>
                        <div className="flex items-start space-x-4 mb-6">
                            <div className="flex-1">
                                {editable? (
                                    <div className="flex items-center justify-between mb-2">
                                        <h1 className="text-3xl font-light text-gray-900">{job.title}</h1>
                                        <button onClick={() => setEditing(true)} className="justify-start text-lg bg-brand-primary hover:bg-brand-primary/70 text-white transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2">
                                            <Edit className="w-4 h-4 mr-2"/>
                                            Edit Job
                                        </button>
                                    </div>
                                ) : (
                                    <h1 className="text-3xl font-light text-gray-900 mb-2">{job.title}</h1>
                                )}
                                {company?.id? (
                                    <Link href={`/companies/${company.id}`}>
                                        <div className="flex items-center mb-4">
                                            <LinkIcon className="w-4 h-4 mr-2" />
                                            <p className="text-lg text-gray-600 hover:text-gray-900 transition">
                                                {job.business_name}
                                            </p>
                                        </div>
                                    </Link>
                            ) : (
                                <p className="text-lg text-gray-600 mb-4">{job.business_name}</p>
                            )}
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
                    {/* Green Score Section */}
                    <Card className="border-brand-primary/30">
                        <div className="p-6 space-y-4">
                            <div className="text-center">
                                <div className="flex font-brand font-black text-brand-primary/80 text-sm items-center justify-center mb-2">
                                    <Leaf className="w-4 h-4 mr-2"/>
                                    Green Score
                                </div>
                                <div className="flex font-black text-brand-primary text-2xl items-center justify-center mb-2">
                                    {greenScore || 'N/A'}
                                </div>
                                {greenScore && greenScore > 5 && (
                                    <div className="flex font-black text-brand-primary items-center justify-center text-sm">
                                        Green Job
                                    </div>
                                )}
                                <p className="text-sm text-muted-foreground">
                                    This job&apos;s environmental impact score based on the company and role.
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Apply Section */}
                    <Card className="border-brand-primary/30">
                        <div className="p-6 space-y-4 gap-4">
                            <Button className="w-full bg-brand-primary hover:bg-brand-primary/70 transition-all duration-300 text-white h-12">
                                {job.link ? (
                                    <Link href={job.link}>
                                        Apply for this position    
                                    </Link>
                                ) : (
                                    "Apply for this position"
                                )}
                            </Button>
                            {/*
                            <Button variant="outline" className="w-full border-brand-primary/30 hover:border-brand-primary/50 transition-all duration-300 text-gray-700 h-12">
                                Save job
                            </Button>
                            */}
                        </div>
                    </Card> 
                </div>   
            </div>
        </div>
            )}
        </div>
    )
}