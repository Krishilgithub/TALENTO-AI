import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");
        const analysisType = formData.get("analysisType") || "resume_optimize";
        const jobRole = formData.get("jobRole") || "Software Engineer";

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Get FastAPI backend URL from environment
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        
        // Prepare form data for FastAPI backend
        const fastApiFormData = new FormData();
        fastApiFormData.append('file', file);
        fastApiFormData.append('job_role', jobRole);

        // Determine which FastAPI endpoint to use based on analysis type
        const endpoints = {
            'resume_optimize': `${apiUrl}/api/assessment/resume_optimize/`,
            'ats_score': `${apiUrl}/api/assessment/ats_score/`,
            'domain_questions': `${apiUrl}/api/assessment/domain_questions/`
        };

        const endpoint = endpoints[analysisType] || endpoints['resume_optimize'];

        // Forward the request to FastAPI backend
        const response = await fetch(endpoint, {
            method: 'POST',
            body: fastApiFormData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ 
                error: `FastAPI Error: ${errorData.error || 'Unknown error'}` 
            }, { status: response.status });
        }

        const result = await response.json();

        // Return the FastAPI response with additional metadata
        return NextResponse.json({
            success: true,
            analysisType: analysisType,
            jobRole: jobRole,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            result: result,
            processedBy: 'FastAPI Backend',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ 
            error: `Failed to process resume: ${error.message}` 
        }, { status: 500 });
    }
}
