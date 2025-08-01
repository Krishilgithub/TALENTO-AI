import { NextResponse } from "next/server";

export async function POST(req) {
	try {
		console.log("LinkedIn Post Generator API route called");
		const formData = await req.formData();
		const postType = formData.get("post_type") || "Professional Insight";
		const topic = formData.get("topic") || "Career Development";
		const postDescription = formData.get("post_description") || "Share insights about career growth and professional development";

		console.log("Post Type:", postType);
		console.log("Topic:", topic);
		console.log("Post Description:", postDescription);

		// Call your backend API
		const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8000";
		console.log("Backend URL:", backendUrl);

		const response = await fetch(
			`${backendUrl}/api/assessment/linkedin_post/`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams({
					post_type: postType,
					topic: topic,
					post_description: postDescription,
				}),
			}
		);

		console.log("Backend response status:", response.status);

		if (!response.ok) {
			const errorData = await response.json();
			console.error("Backend error:", errorData);
			return NextResponse.json(
				{ error: errorData.error || "Failed to generate LinkedIn post" },
				{ status: response.status }
			);
		}

		const result = await response.json();
		console.log("Backend result:", result);
		return NextResponse.json(result);
	} catch (error) {
		console.error("LinkedIn post generator error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
