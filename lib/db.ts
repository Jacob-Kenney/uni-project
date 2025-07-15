import { supabase } from "@/utils/supabase/client";
import { job } from "@/types/job";
import { company } from "@/types/company";
import { user } from "@/types/user";

export async function getJobById(id: string) {
    const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data as job;
}

export async function updateJob(id: string, updatedJob: Partial<job>) {
    const { data, error } = await supabase
        .from('jobs')
        .update(updatedJob)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as job;
}

export async function deleteJob(id: string) {
    const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);

    if (error) throw error;
    return true;
}

export async function createJob(newJob: Omit<job, 'id' | 'created_at'>) {
    const { data, error } = await supabase
        .from('jobs')
        .insert([newJob])
        .select()
        .single();

    if (error) throw error;
    return data as job;
}

export async function getJobByQuery(searchQuery?: string, companyName?: string, location?: string) {
    let query = supabase.from('jobs').select('*');
    
    if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    }
    if (companyName) {
        query = query.eq('business_name', companyName);
    }
    if (location) {
        query = query.eq('location', location);
    }
    
    const { data, error } = await query;

    if (error) throw error;
    return data as job[];
}

export async function createCompany(newCompany: company) {
    const { data, error } = await supabase
        .from("companies")
        .insert([newCompany])
        .select()
        .single();

    if (error) throw error;
    return data as company;
}

export async function updateCompany(name: string, updatedCompany: Partial<company>) {
    const { data, error } = await supabase
        .from('companies')
        .update(updatedCompany)
        .eq('name', name)
        .select()
        .single();

    if (error) throw error;
    return data as company;
}

export async function getCompanyByName(name: string) {
    const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('name', name)
        .single();

    if (error) throw error;
    return data as company;
}

export async function getCompanyById(id: string) {
    const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data as company;
}

// Currently gets all jobs for the target job by created_at -- limited to 20
export async function getRecommendationsByUserID(id: string) {
    // Get user's target position
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('target_position')
        .eq('id', id)
        .single();

    if (userError) throw userError;
    if (!userData) throw new Error('User not found');

    // Get matching jobs, ordered by creation date
    const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('position', userData.target_position)
        .order('created_at', { ascending: false })
        .limit(20);

    if (jobsError) throw jobsError;
    return jobs as job[];
}

export async function getUserByID(id: string) {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data as user;
}

export async function updateUser(id: string, updatedUser: Partial<user>) {
    const { data, error } = await supabase
        .from('users')
        .update(updatedUser)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as user;
}

export async function createUser(newUser: user) {
    const { data, error } = await supabase
        .from('users')
        .insert(newUser)
        .select()
        .single();

    if (error) throw error;
    return data as user;
}