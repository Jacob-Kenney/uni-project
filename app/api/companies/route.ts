import { NextRequest, NextResponse } from 'next/server';
import { createCompany } from '@/lib/db';

// Create company profile
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const newCompany = await createCompany(body);
        return NextResponse.json(newCompany);
    } catch (error) {
        const err = error as Error
        return NextResponse.json({ error: `Internal Server Error: ${err.message}` }, { status: 500 });
    }
}