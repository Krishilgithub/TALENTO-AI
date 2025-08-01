import { NextResponse } from "next/server";

export async function POST(req) {
	try {
		const formData = await req.formData();
		const file = formData.get("file");
		const jobRole = formData.get("job_role") || "Software Engineer";

		if (!file) {
			return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
		}

		// Call your backend API directly with the original FormData
		const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8000";
		const response = await fetch(`${backendUrl}/api/assessment/ats_score/`, {
			method: "POST",
			body: formData, // Pass the original FormData directly
		});

		if (!response.ok) {
			const errorData = await response.json();
			return NextResponse.json(
				{ error: errorData.error || "Failed to calculate ATS score" },
				{ status: response.status }
			);
		}

		const result = await response.json();
		return NextResponse.json(result);
	} catch (error) {
		console.error("ATS scoring error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
