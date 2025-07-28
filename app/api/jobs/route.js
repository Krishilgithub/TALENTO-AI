import { NextResponse } from "next/server";

export async function GET(req) {
	const { searchParams } = new URL(req.url);
	const query = searchParams.get("query") || "";
	const location = searchParams.get("location") || "";
	const limit = searchParams.get("limit") || 20; // Default limit
	const categories = searchParams.getAll("category"); // Get all category params

	// Remotive API endpoint
	let apiUrl = `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(
		query
	)}&limit=${limit}`;
	
	// Add categories if provided
	if (categories && categories.length > 0) {
		apiUrl += categories.map(cat => `&category=${encodeURIComponent(cat)}`).join('');
	}

	console.log("Fetching from:", apiUrl);

	try {
		const response = await fetch(apiUrl);
		
		if (!response.ok) {
			console.error("Remotive API error:", response.status, response.statusText);
			return NextResponse.json(
				{ error: `API request failed: ${response.status}` },
				{ status: response.status }
			);
		}
		
		const data = await response.json();
		console.log("Remotive API response:", { 
			jobsCount: data.jobs?.length || 0,
			hasJobs: !!data.jobs 
		});
		
		let jobs = data.jobs || [];
		
		// Only filter by location if provided and not empty
		if (location && location.trim() !== "") {
			const loc = location.trim().toLowerCase();
			jobs = jobs.filter(
				(job) =>
					job.candidate_required_location &&
					job.candidate_required_location.toLowerCase().includes(loc)
			);
		}
		
		console.log("Filtered jobs count:", jobs.length);
		
		// Map to minimal fields for frontend
		const results = jobs.map((job) => ({
			title: job.title,
			company: job.company_name,
			location: job.candidate_required_location,
			description: job.description.replace(/<[^>]+>/g, "").slice(0, 200) + "...",
			url: job.url,
			job_type: job.job_type, // Include job_type for filtering
		}));
		
		return NextResponse.json({ results });
	} catch (error) {
		console.error("API Error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch jobs." },
			{ status: 500 }
		);
	}
}
