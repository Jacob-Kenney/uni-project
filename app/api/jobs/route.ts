import { NextRequest, NextResponse } from 'next/server';
import { getJobByQuery, createJob } from '@/lib/db';

// Get / search jobs
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const searchQuery = searchParams.get('query') || undefined;
        const companyName = searchParams.get('company') || undefined;
        const location = searchParams.get('location') || undefined;

        const jobs = await getJobByQuery(searchQuery, companyName, location);
        return NextResponse.json(jobs);
    } catch (error) {
        const err = error as Error;
        return NextResponse.json({ error: `Internal Server Error: ${err.message}` }, { status: 500 });
    }
}

// Create job
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const newJob = await createJob(body);
        return NextResponse.json(newJob);
    } catch (error) {
        const err = error as Error;
        return NextResponse.json({ error: `Internal Server Error: ${err.message}` }, { status: 500 });
    }
}