import { NextRequest, NextResponse } from 'next/server';
import { getUserByID, updateUser } from '@/lib/db';

// Get user profile
export async function GET(request: NextRequest, { params }: { params: { 'user-id': string } }) {
    try {
        const userId = params['user-id'];
        const user = await getUserByID(userId);
        return NextResponse.json(user);
    } catch (error) {
        const err = error as Error;
        return NextResponse.json({ error: `Internal Server Error: ${err.message}` }, { status: 500 });
    }
}

// Change user profile
export async function PUT(request: NextRequest, { params }: { params: { 'user-id': string } }) {
    try {
        const userId = params['user-id'];
        const body = await request.json();
        const updatedUser = await updateUser(userId, body);
        return NextResponse.json(updatedUser);
    } catch (error) {
        const err = error as Error 
        return NextResponse.json({ error: `Internal Server Error: ${err.message}` }, { status: 500 });
    }
}