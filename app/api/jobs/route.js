import { NextResponse } from "next/server";

export async function GET(req) {
	const { searchParams } = new URL(req.url);
	const query = searchParams.get("query") || "";
	const location = searchParams.get("location") || "";

	// Remotive API endpoint
	let apiUrl = `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(
		query
	)}`;

	try {
		const response = await fetch(apiUrl);
		const data = await response.json();
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
		// Map to minimal fields for frontend
		const results = jobs.slice(0, 20).map((job) => ({
			title: job.title,
			company: job.company_name,
			location: job.candidate_required_location,
			description:
				job.description.replace(/<[^>]+>/g, "").slice(0, 200) + "...",
			url: job.url,
		}));
		return NextResponse.json({ results });
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to fetch jobs." },
			{ status: 500 }
		);
	}
}
