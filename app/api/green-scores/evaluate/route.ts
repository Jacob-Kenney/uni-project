// For evaluating jobs based on how "Green they are":

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, description, business_name, location } = body;
        if (!title || !description || !business_name) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }
        
        // TODO, green scoring:
        // ESG scores:  >70 (+1), 50-69 (0), <50 (-1) -- no data? (-1)
        // B-Corporation status: yes (+1), no (0)
        // Estimated emissions of the role (AI): clean (+1), neutral (0), negative (-1)
        // Job sector: clean (+1), neutral (0), negative (-1)
        // Flexibility: remote (+1), flexible job (0), always in office (-1)
        const score = 5; // Placeholder default score

        return NextResponse.json({score});

    } catch (error) {
        const err = error as Error;
        return NextResponse.json({ error: `Internal Server Error: ${err.message}` }, { status: 500 });
    }
}