import { NextResponse } from "next/server";

export async function POST(req) {
	try {
		console.log("Personality Assessment API route called");
		const formData = await req.formData();
		const numQuestions = formData.get("num_questions") || 10;
		const assessmentFocus = formData.get("assessment_focus") || "Work Style";
		const jobRole = formData.get("job_role") || "Professional";

		console.log("Num Questions:", numQuestions);
		console.log("Assessment Focus:", assessmentFocus);
		console.log("Job Role:", jobRole);

		// Call your backend API
		const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8000";
		console.log("Backend URL:", backendUrl);

		const response = await fetch(
			`${backendUrl}/api/assessment/personality_assessment/`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams({
					num_questions: numQuestions,
					assessment_focus: assessmentFocus,
					job_role: jobRole,
				}),
			}
		);

		console.log("Backend response status:", response.status);

		if (!response.ok) {
			const errorData = await response.json();
			console.error("Backend error:", errorData);
			return NextResponse.json(
				{ error: errorData.error || "Failed to generate personality assessment" },
				{ status: response.status }
			);
		}

		const result = await response.json();
		console.log("Backend result:", result);
		return NextResponse.json(result);
	} catch (error) {
		console.error("Personality assessment error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
} 