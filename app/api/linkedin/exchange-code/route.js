import { NextResponse } from "next/server";

export async function POST(req) {
	try {
		console.log("LinkedIn Exchange Code API route called");
		const formData = await req.formData();
		const authorizationCode = formData.get("authorization_code");

		console.log("Authorization Code:", authorizationCode);

		// Call your backend API
		const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8000";
		console.log("Backend URL:", backendUrl);

		const response = await fetch(`${backendUrl}/api/linkedin/exchange-code/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				authorization_code: authorizationCode,
			}),
		});

		console.log("Backend response status:", response.status);

		if (!response.ok) {
			const errorData = await response.json();
			console.error("Backend error:", errorData);
			return NextResponse.json(
				{ error: errorData.error || "Failed to exchange authorization code" },
				{ status: response.status }
			);
		}

		const result = await response.json();
		console.log("Backend result:", result);
		return NextResponse.json(result);
	} catch (error) {
		console.error("LinkedIn exchange code error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
