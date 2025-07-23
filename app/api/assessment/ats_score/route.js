import { NextRequest, NextResponse } from "next/server";

export async function POST(request) {
	try {
		const formData = await request.formData();

		// Forward the request to your Python backend
		const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8000";
		const response = await fetch(`${backendUrl}/api/assessment/ats_score/`, {
			method: "POST",
			body: formData,
		});

		const data = await response.json();

		return NextResponse.json(data, { status: response.status });
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to process request" },
			{ status: 500 }
		);
	}
}
