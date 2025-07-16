// For evaluating jobs based on how "Green they are":

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        // businessName, title, description, location
        const { businessName, title, description, location } = body;
        if (!businessName || !title || !description || !location) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Get company information
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const companyResponse = await fetch(`${baseUrl}/api/companies/name:${businessName}`);
        const company = await companyResponse.json();
        if (!company.name) {
            return NextResponse.json(
                { error: "Company not found" },
                { status: 404 }
            )
        }

        // Initialise score
        let score = 5;

        // ESG scores:  >70 (+1), 50-69 (0), <50 (-1) -- no data? (-1)
        if (company.ESG_score) {
            if (company.ESG_score > 70) {
                score += 1;
            } else if (company.ESG_score >= 50 && company.ESG_score <= 69) {
                score += 0;
            } else if (company.ESG_score < 50) {
                score += -1;
            }
        }
        // B-Corporation status: yes (+1),  no (0)
        if (company.B_corp) {
            score += 1;
        }
        
        // Estimated emissions of the role (AI): clean (+1), neutral (0), negative (-1)
        const response = await openai.responses.create({
            model: "gpt-4.1-nano",
            instructions: "You are a green jobs expert. You will recieve the job description and title. You will return '1' if you consider the job to be green, or have a positive impact on the environment, '0' if you consider the job to be neutral, or have no impact on the environment, and '-1' if you consider the job to be negative, or have a negative impact on the environment. You will only reply with '1', '0', or '-1', nothing else.",
            input: `Title: ${title}\nDescription: ${description}`
        })
        const emissionScore = response.output_text.trim();
        if (emissionScore === "1") {
            score += 1;
        } else if (emissionScore === "0") {
            score += 0;
        } else if (emissionScore === "-1") {
            score += -1;
        }

        // Job sector: clean (+1), neutral (0), negative (-1)
        if (company.industry === "agriculture" || company.industry === "manufacturing" || company.industry === "energy" || company.industry === "transportation") {
            score += -1;
        } else if (company.industry === "technology" || company.industry === "healthcare" || company.industry === "retail" || company.industry === "financial" || company.industry === "other") {
            score += 0;
        } else {
            score += 1;
        }

        // Flexibility: remote (+1), flexible job (0), always in office (-1)
        if (description.includes("remote") || location === "remote") {
            score += 1;
        } else if (description.includes("hybrid") || location === "hybrid") {
            score += 0;
        } else {
            score += -1;
        }

        return NextResponse.json({score});

    } catch (error) {
        const err = error as Error;
        return NextResponse.json({ error: `Internal Server Error: ${err.message}` }, { status: 500 });
    }
}