import { NextRequest, NextResponse } from 'next/server';
import { getCompanyById, getCompanyByName, updateCompany } from '@/lib/db';

// Get company profile
export async function GET(request: NextRequest, { params }: { params: Promise<{ 'company-details': string }> }) {
    try {
        // Get company details
        const details = (await params)['company-details']
        if (!details) {
            return NextResponse.json({ error: 'Company details not provided' }, { status: 400 })
        }
        
        // Split type of detail, from the value
        const seperationIndex = details.indexOf(":")
        if (seperationIndex === -1) {
            return NextResponse.json({ error: 'Invalid company details format' }, { status: 400 })
        }

        // Get the type of detail and it's value
        const detail = details.slice(0, seperationIndex)
        const value = details.slice(seperationIndex + 1)

        if (detail === "id") {
            const company = await getCompanyById(value)
            if (!company) {
                return NextResponse.json({ error: 'Company not found' }, { status: 404 })
            }
            return NextResponse.json(company)
        } else if (detail === "name") {
            const company = await getCompanyByName(value)
            if (!company) {
                return NextResponse.json({ error: 'Company not found' }, { status: 404 })
            }
            return NextResponse.json(company)
        }
    } catch (error) {
        const err = error as Error;
        return NextResponse.json({ error: `Internal Server Error: ${err.message}` }, { status: 500 });
    }
}

// Change company profile
export async function PUT(request: NextRequest, { params }: { params: Promise<{ 'company-details': string }> }) {
    try {
        // Get company details
        const details = (await params)['company-details']
        if (!details) {
            return NextResponse.json({ error: 'Company details not provided' }, { status: 400 })
        }
        
        // Split type of detail, from the value
        const seperationIndex = details.indexOf(":")
        if (seperationIndex === -1) {
            return NextResponse.json({ error: 'Invalid company details format' }, { status: 400 })
        }

        // Get the type of detail and it's value
        const detail = details.slice(0, seperationIndex)
        const value = details.slice(seperationIndex + 1)

        // Get the details of the updated company object
        const body = await request.json();

        // Update company
        if (detail === "id") {
            // Get company name from id
            const company = await getCompanyById(value)
            if (!company.name) {
                return NextResponse.json({ error: 'Company not found' }, { status: 404 })
            }
            // Updated company
            const updatedCompany = await updateCompany(company.name, body);
            return NextResponse.json(updatedCompany);
        } else if (detail === "name") {
            const updatedCompany = await updateCompany(value, body);
            return NextResponse.json(updatedCompany);
        } else {
            return NextResponse.json({ error: 'Invalid company details format' }, { status: 400 })
        }
    } catch (error) {
        const err = error as Error;
        console.error(`Internal Server Error: ${err.message}`)
        return NextResponse.json({ error: `Internal Server Error: ${err.message}` }, { status: 500 });
    }
}