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
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Check if this is the current user's profile
  const editable = session?.user?.id === decodeURIComponent(params['company-id'] as string);
  

  useEffect(() => {
    if (params?.['company-id']) {
      const fetchCompanyData = async () => {
        try {
          // Use API route
          const response = await fetch(`/api/companies/id:${params['company-id']}`);
          const companySearch = await response.json();
          setCompany(companySearch);
        } catch (error) {
          console.error('Error fetching company data:', error);
        }
      };
      
      fetchCompanyData();
    }
  }, [params]);

  useEffect(() => {
    if (company && editable && router) {
      if (company.name === company.id) {
        router.push('/companies/create');
      }
    }
  }, [company, editable, router]);

  useEffect(() => {
    setLoading(false);
  }, []);

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