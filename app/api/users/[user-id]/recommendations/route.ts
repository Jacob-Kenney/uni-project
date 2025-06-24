import { NextRequest, NextResponse } from 'next/server';
import { getRecommendationsByUserID } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { 'user-id': string } }) {
    try {
        const recommendations = await getRecommendationsByUserID(params['user-id']);
        return NextResponse.json(recommendations, { status: 200 });
    } catch (error) {
        const err = error as Error;
        return NextResponse.json({ error: `Internal Server Error: ${err.message}` }, { status: 500 });
    }
}