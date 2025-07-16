"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@radix-ui/react-label"
import { Send } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

const initialFormData =  {
    title: "",
    description: "",
    location: "",
    link: "",
}

interface FormErrors {
    [key: string]: string
}

export default function CreateJobPage() {
    const [formData, setFormData] = useState(initialFormData)
    const [isSubmitting, setIsSubmitting] = useState(false) 
    const [errors, setErrors] = useState<FormErrors>({})
    const { data: session } = useSession()
    const router = useRouter()

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

        // Get company information
        const companyId = session?.user?.id
        const company = await fetch(`/api/companies/id:${companyId}`)
        const companyData = await company.json()
        if (!companyData.name) {
            console.error("Failed to get company information:", companyData)
            setIsSubmitting(false)
            return
        }

        // Get green score
        const greenScoreResponse = await fetch(`/api/green-scores/evaluate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ businessName: companyData.name, title: formData.title, description: formData.description, location: formData.location }),
        })
        const greenScore = await greenScoreResponse.json()
        if (!greenScore.score) {
            console.error("Failed to get green score:", greenScore)
            setIsSubmitting(false)
            return
        }

        // Create job object
        const jobInfo = {
            business_name: companyData.name,
            title: formData.title,
            description: formData.description,
            location: formData.location || '',
            status: "active",
            green_score: greenScore.score,
        }

        // Create job in database
        const response = await fetch(`/api/jobs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(jobInfo),
        })
        const creationResponse = await response.json()

        if (!creationResponse.business_name) {
            console.error("Failed to create job:", creationResponse)
            setIsSubmitting(false)
            return
        }
        
        // After submission, redirect to job page.
        router.replace(`/jobs/${creationResponse.id}`)
    }

    return (
        <div className="pt-24 container mx-auto py-8 font-body">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-light text-gray-900">Create a Job</h1>
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
                                    <p className="text-sm text-muted-foreground">
                                        Tell candidates about the role&apos;s responsibilities and requirements.
                                    </p>
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

                {/* Submit button */}
                <div className="flex items-end justify-end mt-8">
                    <Button
                        type="submit"
                        className="bg-brand-primary hover:bg-brand-primary/70 text-white"
                        onClick={handleSubmit}
                    >
                        <Send className="w-4 h-4 mr-2" />
                        {isSubmitting ? "Creating..." : "Create Job"}
                    </Button>
                </div>
            </div>
        </div>
    )
}