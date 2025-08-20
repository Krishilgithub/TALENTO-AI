import { NextResponse } from "next/server";

export async function GET() {
	try {
		console.log("LinkedIn Auth URL API route called");

		// Call your backend API
		const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8000";
		console.log("Backend URL:", backendUrl);

		const response = await fetch(`${backendUrl}/api/linkedin/auth-url/`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		console.log("Backend response status:", response.status);

		if (!response.ok) {
			const errorData = await response.json();
			console.error("Backend error:", errorData);
			return NextResponse.json(
				{ error: errorData.error || "Failed to get LinkedIn auth URL" },
				{ status: response.status }
			);
		}

		const result = await response.json();
		console.log("Backend result:", result);
		return NextResponse.json(result);
	} catch (error) {
		console.error("LinkedIn auth URL error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
