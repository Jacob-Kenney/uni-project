import { NextRequest, NextResponse } from 'next/server';
import { getRecommendationsByUserID } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ 'user-id': string }> }) {
    try {
        const { 'user-id': userId } = await params;
        const recommendations = await getRecommendationsByUserID(userId);
        return NextResponse.json(recommendations, { status: 200 });
    } catch (error) {
        const err = error as Error;
        return NextResponse.json({ error: `Internal Server Error: ${err.message}` }, { status: 500 });
    }
}