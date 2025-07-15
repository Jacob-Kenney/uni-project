"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import UserProfile from "@/components/user-profile";
import { useSession } from "next-auth/react";
import { user } from "@/types/user";

export default function UserPage() {
    const [user, setUser] = useState<user | null>(null);
    const params = useParams();
    const { data: session, status } = useSession();
    
    // Check if this is the current user's profile
    const editable = session?.user?.id === decodeURIComponent(params['user-id'] as string);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Use API route
                const response = await fetch(`/api/users/${params['user-id']}`);
                const userSearch = await response.json();
                setUser(userSearch);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [params])

    return (
        <div className="pt-24 container mx-auto py-8 font-body">
            <UserProfile content={user} editable={editable}/>
        </div>
    )
}