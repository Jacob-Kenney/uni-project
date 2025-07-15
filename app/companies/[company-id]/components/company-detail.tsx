import { company } from "@/types/company";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Save, Mail, MapPin, Edit, BarChart, Check, Link } from "lucide-react";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import JobBoard from "@/components/job-board";
import { job } from "@/types/job";

interface CompanyDetailProps {
    company: company;
    editable: boolean;
}

export default function CompanyDetail({ company, editable }: CompanyDetailProps) {
    const [editing, setEditing] = useState<boolean>(false)
    const [jobs, setJobs] = useState<job[]>([])
    const [tempData, setTempData] = useState<any>({})

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch(`/api/jobs?company=${company?.name}`);
                const data = await response.json();
                setJobs(data);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        };
        fetchJobs();
    }, [company?.name]);
  
    async function handleSave() {
        if (company?.name) {
            try {
                const updatedCompany = {
                    name: tempData.name || company?.name,
                    description: tempData.description || company?.description,
                    industry: tempData.industry || company?.industry,
                    location: tempData.location || company?.location,
                    website: tempData.website || company?.website,
                    company_size: tempData.companySize || company?.company_size,
                    ESG_score: tempData.ESGScore || company?.ESG_score,
                    B_corp: tempData.BCorp || company?.B_corp,
                    contact_email: tempData.contactEmail || company?.contact_email,
                };
                
                // Use API route instead of direct database call
                const response = await fetch(`/api/companies/id:${company.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedCompany),
                });
                
                if (!response.ok) {
                    // Get the actual error message from the API
                    const errorData = await response.json();
                    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
                }
                
                setEditing(false);
                setTempData({});
                // Refresh the page or update the data
                window.location.reload();
            } catch (error) {
                console.error('Error updating company:', error);
                // Show user-friendly error message
                alert(`Error updating company: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
    }

    return (
        <>
            <Card className="border-brand-primary/50 p-6 mt-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        {editing ? (
                            <div className="space-y-4">
                                {/* Name and email */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Name */}
                                    <div>
                                        <Label htmlFor="name">Name</Label>
                                        <Input 
                                            id="name"
                                            className="border-brand-primary/30 hover:border-brand-primary/50"
                                            value={tempData.name || company?.name || ''}
                                            onChange={(e) => setTempData({ ...tempData, name: e.target.value})}
                                        />
                                    </div>
                                    {/* Email */}
                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            className="border-brand-primary/30 hover:border-brand-primary/50"
                                            value={tempData.contactEmail || company?.contact_email || ''}
                                            onChange={(e) => setTempData({ ...tempData, contactEmail: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        rows={4}
                                        className="border-brand-primary/30 hover:border-brand-primary/50"
                                        value={tempData.description || company?.description || ''}
                                        onChange={(e) => setTempData({ ...tempData, description: e.target.value })}
                                    />
                                </div>

                                {/* Green information header */}
                                <hr className="my-4 border-t border-gray-300" />
                                <p className="text-sm text-gray-500">
                                    The following information is self-submitted and has not been verified by us.
                                </p>

                                {/* Location and Industry */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Location */}
                                    <div>
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            className="border-brand-primary/30 hover:border-brand-primary/50"
                                            value={tempData.location || company?.location || ''}
                                            onChange={(e) => setTempData({ ...tempData, location: e.target.value })}
                                        />
                                    </div>
                                    {/* Industry */}
                                    <div>
                                        <Label htmlFor="industry">Industry *</Label>
                                        <Select value={tempData.industry} onValueChange={(value) => setTempData({ ...tempData, industry: value })}>
                                            <SelectTrigger className="border-brand-primary/30 hover:border-brand-primary/50">
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
                                    </div>
                                </div>

                                {/* Website and company size */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="website">Website</Label>
                                        <Input
                                            id="website"
                                            type="url"
                                            className="border-brand-primary/30 hover:border-brand-primary/50"
                                            value={tempData.website || company?.website || ''}
                                            onChange={(e) => setTempData({ ...tempData, website: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="company_size">Company Size</Label>
                                        <Select value={tempData.companySize || company?.company_size || ''} onValueChange={(value) => setTempData({ ...tempData, companySize: value })}>
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
                                </div>

                                {/* ESG score */}
                                <div>
                                    <Label htmlFor="ESG_score">ESG Score</Label>
                                    <Input
                                        id="ESG_score"
                                        type="number"
                                        className="border-brand-primary/30 hover:border-brand-primary/50"
                                        value={tempData.ESG_score || company?.ESG_score || ''}
                                        onChange={(e) => setTempData({ ...tempData, ESG_score: e.target.value })}
                                    />
                                </div>
                                {/* B Corp */}
                                <div className="flex items-center space-x-3">
                                    <Label htmlFor="B_corp">B Corp</Label>
                                    <Checkbox
                                        id="B_corp"
                                        className="border-brand-primary/30 hover:border-brand-primary/50"
                                        checked={tempData.B_corp || company?.B_corp || false}
                                        onCheckedChange={(checked) => setTempData({ ...tempData, B_corp: checked })}
                                    />
                                </div>
                                

                                {/* Edit buttons */}
                                <div className="flex space-x-2">
                                    <button onClick={handleSave} className="justify-start text-lg bg-brand-primary hover:bg-brand-primary/70 text-white transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2">
                                        <Save className="w-4 h-4 mr-2"/>
                                        Save Changes    
                                    </button>
                                    <button onClick={() => setEditing(false)} className="justify-start text-lg text-brand-primary hover:bg-brand-primary/30 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2">
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                                    <div>
                                        <h1 className="text-3xl font-brand font-light text-gray-900 mb-2">
                                            {company?.name || "Anonymous"}
                                        </h1>
                                        <p className="text-lg text-gray-600 mb-2">
                                            {company?.description || "Company description..."}
                                        </p>
                                        {/* ESG score and B corp */}
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                                            {/* ESG score, if user has score */}
                                            {company?.ESG_score ? (
                                                <div className="flex items-center">
                                                    <span className="mr-2">
                                                        ESG Score:
                                                    </span>
                                                    <BarChart className="w-4 h-4 mr-2" />
                                                    {company?.ESG_score}
                                                </div>
                                            ) : (
                                                <></>
                                            )}
                                            {/* B corp, if user has B corp status */}
                                            {company?.B_corp ? (
                                                <div className="flex items-center">
                                                    <Check className="w-4 h-4 mr-2" />
                                                    Certified B Corp
                                                </div>
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                        {/* Email and location */}
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                                            {/* Email, if user has email */}
                                            {company?.contact_email ? (
                                                <div className="flex items-center">
                                                    <Mail className="w-4 h-4 mr-2" />
                                                    {company?.contact_email}
                                                </div>
                                            ): (
                                                <></>
                                            )}
                                            {/* Location, if user has location */}
                                            {company?.location ? (
                                                <div className="flex items-center">
                                                    <MapPin className="w-4 h-4 mr-2" />
                                                    {company?.location}
                                                </div>
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                        {/* Industry and company size */}
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                                            {/* Industry, if user has industry */}
                                            {company?.industry ? (
                                                <div className="flex items-center">
                                                    <span className="mr-2">
                                                        Industry:
                                                    </span>
                                                    {company?.industry}
                                                </div>
                                            ) : (
                                                <></>
                                            )}
                                            {/* Company size, if user has company size */}
                                            {company?.company_size ? (
                                                <div className="flex items-center">
                                                    <span className="mr-2">
                                                        Company Size:
                                                    </span>
                                                    {company?.company_size}
                                                </div>
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                        {/* Website */}
                                        {company?.website ? (
                                            <div className="flex items-center text-gray-600">
                                                <Link className="w-4 h-4 mr-2" />
                                                <a href={company?.website} target="_blank" rel="noopener noreferrer">
                                                    {company?.website}
                                                </a>
                                            </div>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                    {editable && (
                                        <button onClick={() => setEditing(true)} className="justify-start text-lg bg-brand-primary hover:bg-brand-primary/70 text-white transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2">
                                            <Edit className="w-4 h-4 mr-2"/>
                                            Edit Profile
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
            {/* Job board */}
            {!editing && (
                <JobBoard jobs={jobs} />
            )}
        </>
    )
}