export interface company {
    name: string;
    description?: string;
    ESG_score?: number;
    industry?: string;
    location?: string;
    website?: string;
    contact_email?: string;
    B_corp?: boolean | undefined;
    company_size?: 'micro' | 'small' | 'medium' | 'large' | undefined;
    id?: string;
}