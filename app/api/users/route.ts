import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/db';

// Create user profile
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const newUser = await createUser(body);
        return NextResponse.json(newUser);
    } catch (error) {
        const err = error as Error 
        return NextResponse.json({ error: `Internal Server Error: ${err.message}` }, { status: 500 });
    }
}