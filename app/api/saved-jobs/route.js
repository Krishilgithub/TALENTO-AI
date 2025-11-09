import { NextResponse } from 'next/server';
import { createClientForServer } from '../../../utils/supabase/server';

export async function POST(request) {
    try {
        const supabase = await createClientForServer();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { job_data, search_params } = await request.json();

        if (!job_data) {
            return NextResponse.json({ error: 'Job data is required' }, { status: 400 });
        }

        // Check if job already exists
        const { data: existing } = await supabase
            .from('saved_jobs')
            .select('id')
            .eq('user_id', user.id)
            .eq('job_data->>url', job_data.url)
            .maybeSingle();

        if (existing) {
            return NextResponse.json({ error: 'Job already saved' }, { status: 409 });
        }

        // Save the job
        const { data, error } = await supabase
            .from('saved_jobs')
            .insert({
                user_id: user.id,
                job_data: job_data,
                search_params: search_params || {}
            })
            .select()
            .single();

        if (error) {
            console.error('Error saving job:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const supabase = await createClientForServer();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { data, error } = await supabase
            .from('saved_jobs')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching saved jobs:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const supabase = await createClientForServer();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const body = await request.json();
        const { jobUrl } = body;

        if (!jobUrl) {
            return NextResponse.json({ error: 'Job URL is required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('saved_jobs')
            .delete()
            .eq('user_id', user.id)
            .eq('job_data->>url', jobUrl);

        if (error) {
            console.error('Error deleting job:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}