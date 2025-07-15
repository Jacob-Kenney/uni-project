'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { company } from "@/types/company";
import CompanyDetail from "./components/company-detail";

export default function Page() {
  const [company, setCompany] = useState<company | null>(null);
  const params = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Check if this is the current user's profile
  const editable = session?.user?.id === decodeURIComponent(params['company-id'] as string);
  

  useEffect(() => {
    setLoading(true);
    const fetchCompanyData = async () => {
      try {
        // Use API route
        const response = await fetch(`/api/companies/id:${params['company-id']}`);
        const companySearch = await response.json();
        setCompany(companySearch);
        // Check if company account needs onboarding
        if (companySearch?.name === companySearch?.id) {
          // Needs onboarding
          if (editable) {
            router.replace("/companies/create");
          }
        }
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };
    
    fetchCompanyData();
    setLoading(false);
  }, [params]);

  if (!company) return null;

  return (
    <div className="pt-24 container mx-auto py-8 font-body">
      <Suspense fallback={
        <div className="container py-8">
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
            </div>
        </div>
      }>
        {loading? (
          <div className="container mx-auto py-8">
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
            </div>
          </div>
        ) : (
          <CompanyDetail company={company} editable={editable} />
        )}

      </Suspense>
    </div>
  );
}