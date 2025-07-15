"use client";

import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useSession } from "next-auth/react";

interface FormData {
    // Basic information
    name: string,
    description: string,
    industry: string,
    location?: string,
    website?: string,
    company_size?: 'micro' | 'small' | 'medium' | 'large' | undefined, // Micro: 1-9 employees, Small: 10-49 employees, Medium: 50-249 employees, Large: 250+ employees
    ESG_score?: number | undefined,
    B_corp?: boolean | undefined,
    contact_email?: string,
}

const initialFormData: FormData = {
    name: '',
    description: '',
    industry: '',
    location: '',
    website: '',
    company_size: undefined,
    ESG_score: undefined,
    B_corp: undefined,
    contact_email: '',
}

interface FormErrors {
    [key: string]: string
}

export default function Page() {
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState(initialFormData)
    const [isSubmitting, setIsSubmitting] = useState(false) 
    const [errors, setErrors] = useState<FormErrors>({})
    const { data: session, status } = useSession()
    const router = useRouter()

    // Number of steps in the form
    const totalSteps = 2
    const progress = (currentStep / totalSteps) * 100

    // Validate each step of the form
    const validateStep = (step: number): boolean => {
        const newErrors: FormErrors  = {}
        
        switch (step) {
            case 1: // Company information
                if(!formData.name.trim()) newErrors.name = "Company name is required"
                if(!formData.description.trim()) newErrors.description = "Company description is required"
                break
            case 2: // Green details
                if(!formData.industry.trim()) newErrors.industry = "Company industry is required"
                break
        }
        
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

    // Defensive next step (max: totalSteps)
    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
        }
    }

    // Defensive previous step (min: 1)
    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1))
    }

    const handleSubmit = async () => {
        // Check for errors validating the current form step
        if (!validateStep(currentStep)) return
    
        setIsSubmitting(true)
    
        try {
            // Get company id
            const companyId = session?.user?.id
            // Check if company with this session exists
            const getCompanyResponse = await fetch(`/api/companies/id:${companyId}`)
            const company = await getCompanyResponse.json()
            // Complete onboarding by completing company object
            let response
            if (company) {
                // Company exists, update it
                response = await fetch(`/api/companies/id:${companyId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                })
                const updatedCompany = await response.json()
                if (!updatedCompany) {
                    throw new Error("Failed to update company")
                }
            } else {
                // Company doesn't exit, cannot complete onboarding
                throw new Error("Company doesn't exist for onboarding")
            }
            
            toast({
                title: "Company created successfully!",
                description: "Welcome to our platform. You can now start posting jobs.",
            })
    
            // Redirect to company page
            router.replace(`/companies/${companyId}`)
        } catch (error) {
            toast({
                title: "Error creating company",
                description: "Please try again or contact support if the problem persists.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    // The actual react components for steps of the form
    const stepContent = () => {
        switch(currentStep) {
            case 1:
                // Company Information (name, description, location, website, email)
                return (
                    <div className="space-y-6">
                        <div>
                            <h2 className="font-brand text-2xl font-gray-900 mb-2">Company Information</h2>
                            <p className="text-gray-600">Please provide your company's basic information.</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name">Company Name *</Label>
                                <Input id="name" name="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Enter your company name" className={errors.name ? "border-red-300" : "border-brand-primary/30 hover:border-brand-primary/50"}/>
                                {errors.name && <p className="text-red-500">{errors.name}</p>}
                            </div>
                            <div>
                                <Label htmlFor="description">Company Description *</Label>
                                <Textarea id="description" rows={4} value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} placeholder="Describe your company" className={errors.description ? "border-red-300" : "border-brand-primary/30 hover:border-brand-primary/50"}/>
                                {errors.description && <p className="text-red-500">{errors.description}</p>}
                            </div>
                            <div>
                                <Label htmlFor="location">Location</Label>
                                <Input id="location" type="text" name="location" value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)} placeholder="Enter your company location" className="border-brand-primary/30 hover:border-brand-primary/50"/>
                            </div>
                            <div>
                                <Label htmlFor="website">Website</Label>
                                <Input id="website" type="url" name="website" value={formData.website} onChange={(e) => handleInputChange('website', e.target.value)} placeholder="Enter your company website" className="border-brand-primary/30 hover:border-brand-primary/50"/>
                            </div>
                            <div>
                                <Label htmlFor="contact_email">Contact Email</Label>
                                <Input id="contact_email" type="email" name="contact_email" value={formData.contact_email} onChange={(e) => handleInputChange('contact_email', e.target.value)} placeholder="Enter your company contact email" className="border-brand-primary/30 hover:border-brand-primary/50"/>
                            </div>
                        </div>
                    </div>
                )
            case 2:
                // Green scoring information (industry, company_size, ESG_score, B_corp status)
                return (
                    <div className="space-y-6">
                        <div>
                            <h2 className="font-brand text-2xl font-gray-900 mb-2">Environmental Disclosure</h2>
                            <p className="text-gray-600">Please provide your company's green scoring information.</p>
                        </div>
                        <div>
                            <Label htmlFor="industry">Industry *</Label>
                            <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                                <SelectTrigger className={errors.industry ? "border-red-300" : "border-brand-primary/30 hover:border-brand-primary/50"}>
                                    <SelectValue placeholder="Select an industry" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="agriculture">Agriculture</SelectItem>
                                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                    <SelectItem value="energy">Energy</SelectItem>
                                    <SelectItem value="technology">Technology</SelectItem>
                                    <SelectItem value="healthcare">Healthcare</SelectItem>
                                    <SelectItem value="education">Education</SelectItem>
                                    <SelectItem value="retail">Retail</SelectItem>
                                    <SelectItem value="financial">Financial</SelectItem>
                                    <SelectItem value="transportation">Transportation</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.industry && <p className="text-red-500">{errors.industry}</p>}
                        </div>
                        <div>
                            <Label htmlFor="company_size">Company Size</Label>
                            <Select value={formData.company_size} onValueChange={(value) => handleInputChange('company_size', value)}>
                                <SelectTrigger className="border-brand-primary/30 hover:border-brand-primary/50">
                                    <SelectValue placeholder="Select a company size" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="micro">Micro (1-9 employees)</SelectItem>
                                    <SelectItem value="small">Small (10-49 employees)</SelectItem>
                                    <SelectItem value="medium">Medium (50-249 employees)</SelectItem>
                                    <SelectItem value="large">Large (250+ employees)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="ESG_score">ESG Score</Label>
                            <Input id="ESG_score" type="number" name="ESG_score" value={formData.ESG_score} onChange={(e) => handleInputChange('ESG_score', e.target.value)} placeholder="Enter your company's ESG score" className="border-brand-primary/30 hover:border-brand-primary/50"/>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Checkbox id="B_corp" checked={formData.B_corp} onCheckedChange={(checked) => handleInputChange("B_corp", checked as boolean)}/>
                            <Label htmlFor="B_corp" className="text-sm font-light">Certified B Corporation</Label>
                        </div>
                    </div>
                )
        }
    }

    return (
        <div className="pt-24 container mx-auto py-8 font-body">
            <div className="max-w-2xl mx-auto">
                {/* Progress bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-3xl font-light text-gray-900">Company Onboarding</h1>
                        <span className="text-sm text-gray-500">
                            Step {currentStep} of {totalSteps}
                        </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                {/* Form content */}
                <Card className="border-brand-primary/50">
                    <CardContent className="p-8">{stepContent()}</CardContent>
                </Card>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8">
                    <Button
                        variant="outline"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className="border-brand-primary/50 hover:border-brand-primary/30 text-brand-primary hover:text-brand-primary/80 bg-transparent"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                    </Button>

                    {currentStep < totalSteps ? (
                        <Button onClick={nextStep} className="bg-brand-primary hover:bg-brand-primary/70 text-white">
                            Continue
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-brand-primary hover:bg-brand-primary/70 text-white"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    <Check className="w-4 h-4 mr-2" />
                                    Create Account
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}