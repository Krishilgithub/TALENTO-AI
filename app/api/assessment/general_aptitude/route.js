import { NextResponse } from "next/server";

export async function POST(req) {
	try {
		const formData = await req.formData();
		const jobRole = formData.get("job_role") || "Software Engineer";
		const numQuestions = formData.get("num_questions") || 10;

		// Call your backend API
		const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8000";
		const response = await fetch(`${backendUrl}/api/assessment/general_aptitude/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				job_role: jobRole,
				num_questions: numQuestions,
			}),
		});

		if (!response.ok) {
			const errorData = await response.json();
			return NextResponse.json(
				{ error: errorData.error || "Failed to generate aptitude questions" },
				{ status: response.status }
			);
		}

		const result = await response.json();
		return NextResponse.json(result);
	} catch (error) {
		console.error("Aptitude assessment error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
} 