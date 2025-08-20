import { NextResponse } from "next/server";

export async function POST(req) {
	try {
		console.log("Aptitude API route called");
		const formData = await req.formData();
		const jobRole = formData.get("job_role") || "Software Engineer";
		const numQuestions = formData.get("num_questions") || 10;
		const difficulty = formData.get("difficulty") || "moderate";

		console.log("Job Role:", jobRole);
		console.log("Num Questions:", numQuestions);
		console.log("Difficulty:", difficulty);

		// Call your backend API
		const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8000";
		console.log("Backend URL:", backendUrl);

		const response = await fetch(
			`${backendUrl}/api/assessment/general_aptitude/`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams({
					job_role: jobRole,
					num_questions: numQuestions,
					difficulty: difficulty,
				}),
			}
		);

		console.log("Backend response status:", response.status);

		if (!response.ok) {
			const errorData = await response.json();
			console.error("Backend error:", errorData);
			return NextResponse.json(
				{ error: errorData.error || "Failed to generate aptitude questions" },
				{ status: response.status }
			);
		}

		const result = await response.json();
		console.log("Backend result:", result);
		return NextResponse.json(result);
	} catch (error) {
		console.error("Aptitude assessment error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
