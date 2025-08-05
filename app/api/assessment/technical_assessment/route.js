import { NextResponse } from "next/server";

export async function POST(req) {
	try {
		const formData = await req.formData();
		const jobRole = formData.get("job_role") || "Software Engineer";
		const numQuestions = formData.get("num_questions") || 10;
		const difficulty = formData.get("difficulty") || "moderate";

		// Call your backend API
		const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8000";
		const response = await fetch(`${backendUrl}/api/assessment/technical_assessment/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				job_role: jobRole,
				num_questions: numQuestions,
				difficulty: difficulty,
			}),
		});

		if (!response.ok) {
			const errorData = await response.json();
			return NextResponse.json(
				{ error: errorData.error || "Failed to generate technical questions" },
				{ status: response.status }
			);
		}

		const result = await response.json();
		return NextResponse.json(result);
	} catch (error) {
		console.error("Technical assessment error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
} 