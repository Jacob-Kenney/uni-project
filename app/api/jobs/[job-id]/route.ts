import { NextRequest, NextResponse } from 'next/server';
import { getJobById, updateJob, deleteJob } from '@/lib/db';

// Get job by ID
export async function GET(request: NextRequest, { params }: { params: { 'job-id': string } }) {
    try {
        const job = await getJobById(params['job-id']);
        return NextResponse.json(job, { status: 200 });
    } catch (error) {
        const err = error as Error;
        return NextResponse.json({ error: `Internal Server Error: ${err.message}` }, { status: 500 });
    }
}

// Update job
// TODO: Protect this API route
export async function PUT(request: NextRequest, { params }: { params: { 'job-id': string } }) {
    try {
        const body = await request.json();
        const updatedJob = await updateJob(params['job-id'], body);
        return NextResponse.json(updatedJob, { status: 200 });
    } catch (error) {
        const err = error as Error;
        return NextResponse.json({ error: `Internal Server Error: ${err.message}` }, { status: 500 });
    }
}

// Delete job
// TODO: Protect this API route
export async function DELETE(request: NextRequest, { params }: { params: { 'job-id': string } }) {
    try {
        await deleteJob(params['job-id']);
        return NextResponse.json({ message: 'Job deleted successfully' }, { status: 200 });
    } catch (error) {
        const err = error as Error;
        return NextResponse.json({ error: `Internal Server Error: ${err.message}` }, { status: 500 });
    }
}