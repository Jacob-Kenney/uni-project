"use client";

import { user } from "@/types/user";
import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { X, Save, Mail, MapPin, Edit, Linkedin } from "lucide-react";


interface UserProfileProps {
    content: user | null;
    editable: boolean;
}

export default function UserProfile({ content, editable }: UserProfileProps) {
    const [editing, setEditing] = useState<boolean>(false)
    const [tempData, setTempData] = useState<any>({})

    async function handleSave() {
        if (content?.id) {
            try {
                const updatedUser = {
                    name: tempData.name || content?.name,
                    email: tempData.email || content?.email,
                    current_position: tempData.currentPosition || content?.current_position,
                    target_position: tempData.targetPosition || content?.target_position,
                    location: tempData.location || content?.location,
                    summary: tempData.summary || content?.summary,
                    linkedin: tempData.linkedin || content?.linkedin,
                };
                
                // Use API route
                const response = await fetch(`/api/users/${content.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedUser),
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
                console.error('Error updating user:', error);
                // Show user-friendly error message
                alert(`Error updating profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
    }

    return (
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
                                        value={tempData.name || content?.name || ''}
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
                                        value={tempData.email || content?.email || ''}
                                        onChange={(e) => setTempData({ ...tempData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            
                            {/* Current position */}
                            <div>
                                <Label htmlFor="currentPosition">Current Job Title</Label>
                                <Input
                                    id="currentPosition"
                                    className="border-brand-primary/30 hover:border-brand-primary/50"
                                    value={tempData.currentPosition || content?.current_position || ''}
                                    onChange={(e) => setTempData({ ...tempData, currentPosition: e.target.value })}
                                />
                            </div>
                            {/* Target position */}
                            <div>
                                <Label htmlFor="targetPosition">Target Job Title</Label>
                                <Input
                                    id="targetPosition"
                                    className="border-brand-primary/30 hover:border-brand-primary/50"
                                    value={tempData.targetPosition || content?.target_position || ''}
                                    onChange={(e) => setTempData({ ...tempData, targetPosition: e.target.value })}
                                />
                            </div>

                            {/* Summary */}
                            <div>
                                <Label htmlFor="summary">Professional Summary</Label>
                                <Textarea
                                    id="summary"
                                    rows={4}
                                    className="border-brand-primary/30 hover:border-brand-primary/50"
                                    value={tempData.summary || content?.summary || ''}
                                    onChange={(e) => setTempData({ ...tempData, summary: e.target.value })}
                                />
                            </div>

                            {/* Location and LinkedIn */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Location */}
                                <div>
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        className="border-brand-primary/30 hover:border-brand-primary/50"
                                        value={tempData.location || content?.location || ''}
                                        onChange={(e) => setTempData({ ...tempData, location: e.target.value })}
                                    />
                                </div>
                                {/* LinkedIn */}
                                <div>
                                    <Label htmlFor="linkedin">LinkedIn</Label>
                                    <Input
                                        id="linkedin"
                                        className="border-brand-primary/30 hover:border-brand-primary/50"
                                        value={tempData.linkedin || content?.linkedin || ''}
                                        onChange={(e) => setTempData({ ...tempData, linkedin: e.target.value })}
                                    />
                                </div>
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
                                        {content?.name || "Anonymous"}
                                    </h1>
                                    <p className="text-lg text-gray-600 mb-2">
                                        {content?.target_position || "Target Position..."}
                                    </p>
                                    <p className="text-md text-gray-600 mb-3">
                                        Currently: {content?.current_position || "Current Position..."}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                                        {/* Email, if user has email */}
                                        {content?.email ? (
                                            <div className="flex items-center">
                                                <Mail className="w-4 h-4 mr-2" />
                                                {content?.email}
                                            </div>
                                        ): (
                                            <></>
                                        )}
                                        {/* Location, if user has location */}
                                        {content?.location ? (
                                            <div className="flex items-center">
                                                <MapPin className="w-4 h-4 mr-2" />
                                                {content?.location}
                                            </div>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </div>
                                {editable && (
                                    <button onClick={() => setEditing(true)} className="justify-start text-lg bg-brand-primary hover:bg-brand-primary/70 text-white transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2">
                                        <Edit className="w-4 h-4 mr-2"/>
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                            
                            <p className="text-gray-600 leading-relaxed mb-6">
                                {content?.summary || "No summary yet..."}
                            </p>
                            
                            <div className="flex flex-wrap gap-3">
                                {content?.linkedin ? (
                                    <a 
                                        href={content?.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                                    >
                                        <Linkedin className="w-4 h-4 mr-1"/>
                                    </a>
                                ): (
                                    <></>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    )
}