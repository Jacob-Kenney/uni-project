export interface job {
    id: string;
    created_at: string;
    expired_at: string;
    title: string;
    description: string;
    emission_estimate?: number;
    business_name: string;
    location?: string;
    status: "active" | "expired" | "filled" | "draft";
    impact_score: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    green_score: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
}