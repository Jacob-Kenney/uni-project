import { NextRequest, NextResponse } from 'next/server';
import { getCompanyByName, updateCompany } from '@/lib/db';

// Get company profile
export async function GET(request: NextRequest, { params }: { params: Promise<{ 'company-name': string }> }) {
    try {
        const { 'company-name': companyName } = await params;
        const company = await getCompanyByName(companyName);
        return NextResponse.json(company);
    } catch (error) {
        const err = error as Error
        return NextResponse.json({ error: `Internal Server Error: ${err.message}` }, { status: 500 });
    }
}

// Change company profile
export async function PUT(request: NextRequest, { params }: { params: Promise<{ 'company-name': string }> }) {
    try {
        const { 'company-name': companyName } = await params;
        const body = await request.json();
        const updatedCompany = await updateCompany(companyName, body);
        return NextResponse.json(updatedCompany);
    } catch (error) {
        const err = error as Error
        return NextResponse.json({ error: `Internal Server Error: ${err.message}` }, { status: 500 });
    }
}