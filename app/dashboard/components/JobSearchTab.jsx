"use client";

import { useState, useEffect, useRef } from "react";

export default function JobSearchTab() {
	const [query, setQuery] = useState("");
	const [location, setLocation] = useState("");
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
	const [selectedJob, setSelectedJob] = useState(null);
	const [showJobModal, setShowJobModal] = useState(false);
	const [searchHistory, setSearchHistory] = useState([]);
	const [savedJobs, setSavedJobs] = useState([]);
	const [activeJobTab, setActiveJobTab] = useState("search"); // 'search' or 'saved'
	const [categories, setCategories] = useState([]);
	const [selectedCategories, setSelectedCategories] = useState([]); // multi-select
	const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
	const [jobLimit, setJobLimit] = useState(20); // Add missing jobLimit state
	const [jobTypes] = useState([
		{ value: "full_time", label: "Full Time" },
		{ value: "part_time", label: "Part Time" },
		{ value: "contract", label: "Contract" },
		{ value: "freelance", label: "Freelance" },
		{ value: "internship", label: "Internship" },
		{ value: "other", label: "Other" },
	]);
	const [selectedJobTypes, setSelectedJobTypes] = useState([]); // multi-select
	const [showJobTypeDropdown, setShowJobTypeDropdown] = useState(false);
	const categoryDropdownRef = useRef(null);
	const jobTypeDropdownRef = useRef(null);

	// Fetch categories from Remotive API
	useEffect(() => {
		fetch("https://remotive.com/api/remote-jobs/categories")
			.then((res) => res.json())
			.then((data) => setCategories(data.jobs || []))
			.catch(() => setCategories([]));
	}, []);

	// Load search history and saved jobs from localStorage
	useEffect(() => {
		const hist = JSON.parse(localStorage.getItem("jobSearchHistory") || "[]");
		setSearchHistory(hist);
		const saved = JSON.parse(localStorage.getItem("savedJobs") || "[]");
		setSavedJobs(saved);
	}, []);

	// Save search history to localStorage
	useEffect(() => {
		localStorage.setItem("jobSearchHistory", JSON.stringify(searchHistory));
	}, [searchHistory]);

	// Save saved jobs to localStorage
	useEffect(() => {
		localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
	}, [savedJobs]);

	const addToHistory = (q, l, c, t) => {
		if (!q && !l && (!c || c.length === 0) && (!t || t.length === 0)) return;
		const exists = searchHistory.some(
			(h) =>
				h.query === q &&
				h.location === l &&
				JSON.stringify(h.categories) === JSON.stringify(c) &&
				JSON.stringify(h.jobTypes) === JSON.stringify(t)
		);
		if (!exists) {
			const newHist = [
				{ query: q, location: l, categories: c, jobTypes: t },
				...searchHistory,
			].slice(0, 8);
			setSearchHistory(newHist);
		}
	};

	const handleSearch = async (
		e,
		fromHistory = false,
		histQuery = "",
		histLocation = "",
		histCategories = [],
		histJobTypes = []
	) => {
		console.log("handleSearch called with:", {
			query,
			location,
			selectedCategories,
			selectedJobTypes,
		});
		if (e) e.preventDefault();
		const q = fromHistory ? histQuery : query;
		const l = fromHistory ? histLocation : location;
		const c = fromHistory ? histCategories : selectedCategories;
		const t = fromHistory ? histJobTypes : selectedJobTypes;
		setLoading(true);
		setError(null);
		setResults([]);
		addToHistory(q, l, c, t);
		let apiUrl = `/api/jobs?query=${encodeURIComponent(
			q
		)}&location=${encodeURIComponent(l)}&limit=${jobLimit}`;
		if (c && c.length > 0) {
			apiUrl += c.map((cat) => `&category=${encodeURIComponent(cat)}`).join("");
		}

		console.log("Searching with URL:", apiUrl);

		try {
			const res = await fetch(apiUrl);
			console.log("Response status:", res.status);
			const data = await res.json();
			console.log("Response data:", data);

			let jobs = data.results || [];
			if (t && t.length > 0)
				jobs = jobs.filter((j) => t.includes((j.job_type || "").toLowerCase()));
			if (!res.ok || data.error) {
				setError(data.error || "Failed to fetch jobs.");
				setResults([]);
			} else {
				setResults(jobs.map((j) => ({ ...j, fullDescription: j.description })));
			}
		} catch (err) {
			console.error("Search error:", err);
			setError("Failed to connect to server.");
			setResults([]);
		} finally {
			setLoading(false);
		}
	};

	const handleLoadMore = () => {
		setJobLimit((prev) => prev + 20);
		setTimeout(() => handleSearch(), 0);
	};

	const handleSaveJob = (job) => {
		if (!savedJobs.some((j) => j.url === job.url)) {
			setSavedJobs([job, ...savedJobs].slice(0, 30));
		}
	};

	const handleRemoveSavedJob = (jobUrl) => {
		setSavedJobs(savedJobs.filter((j) => j.url !== jobUrl));
	};

	const handleCategoryChange = (slug) => {
		setSelectedCategories((prev) =>
			prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
		);
	};
	const handleJobTypeChange = (value) => {
		setSelectedJobTypes((prev) =>
			prev.includes(value) ? prev.filter((j) => j !== value) : [...prev, value]
		);
	};

	// Close dropdowns on outside click
	useEffect(() => {
		const handleClick = (e) => {
			if (
				categoryDropdownRef.current &&
				!categoryDropdownRef.current.contains(e.target)
			)
				setShowCategoryDropdown(false);
			if (
				jobTypeDropdownRef.current &&
				!jobTypeDropdownRef.current.contains(e.target)
			)
				setShowJobTypeDropdown(false);
		};
		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, []);

	const popularLocations = [
		"Worldwide",
		"Anywhere",
		"United States",
		"Europe",
		"India",
		"Canada",
		"United Kingdom",
		"Australia",
		"Asia",
		"Africa",
		"South America",
		"Remote",
		// Major Indian cities
		"Mumbai",
		"Delhi",
		"Bangalore",
		"Hyderabad",
		"Chennai",
		"Pune",
		"Kolkata",
		"Ahmedabad",
		"Jaipur",
		"Surat",
		"Lucknow",
		"Indore",
		"Bhopal",
		"Nagpur",
		"Patna",
		"Chandigarh",
		"Coimbatore",
		"Kochi",
		"Noida",
		"Gurgaon",
		"Thane",
		"Visakhapatnam",
		"Vadodara",
		"Ludhiana",
		"Agra",
		"Nashik",
		"Faridabad",
		"Meerut",
		"Rajkot",
		"Varanasi",
	];

	const filteredLocationSuggestions = location
		? popularLocations.filter((loc) =>
				loc.toLowerCase().includes(location.toLowerCase())
		  )
		: popularLocations;

	return (
		<div className="space-y-6">
			<h2 className="text-xl font-semibold text-white mb-2 font-sans">
				Job Search
			</h2>
			<p className="text-gray-300 font-sans">
				Find your next opportunity. Search for jobs by title, keyword, or
				location.
			</p>
			<div className="flex gap-4 mb-2">
				<button
					onClick={() => setActiveJobTab("search")}
					className={`px-4 py-2 rounded font-semibold ${
						activeJobTab === "search"
							? "bg-cyan-400 text-black"
							: "bg-[#232323] text-cyan-300"
					}`}
				>
					Search Jobs
				</button>
				<button
					onClick={() => setActiveJobTab("saved")}
					className={`px-4 py-2 rounded font-semibold ${
						activeJobTab === "saved"
							? "bg-cyan-400 text-black"
							: "bg-[#232323] text-cyan-300"
					}`}
				>
					Saved Jobs
				</button>
			</div>
			{activeJobTab === "search" && (
				<>
					<form
						onSubmit={handleSearch}
						className="flex flex-col md:flex-row gap-4 mb-2"
					>
						<input
							type="text"
							placeholder="Job title or keywords"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							className="flex-1 px-4 py-2 rounded border border-cyan-900 bg-cyan-100 text-black font-sans"
						/>
						<div className="relative flex-1">
							<input
								type="text"
								placeholder="Location (optional)"
								value={location}
								onChange={(e) => {
									setLocation(e.target.value);
									setShowLocationSuggestions(true);
								}}
								onFocus={() => setShowLocationSuggestions(true)}
								onBlur={() =>
									setTimeout(() => setShowLocationSuggestions(false), 150)
								}
								className="w-full px-4 py-2 rounded border border-cyan-900 bg-cyan-100 text-black font-sans"
							/>
							{showLocationSuggestions &&
								filteredLocationSuggestions.length > 0 && (
									<ul className="absolute left-0 right-0 bg-white border border-cyan-900 rounded shadow z-10 max-h-40 overflow-y-auto">
										{filteredLocationSuggestions.map((loc, idx) => (
											<li
												key={loc}
												onMouseDown={() => {
													setLocation(loc);
													setShowLocationSuggestions(false);
												}}
												className="px-4 py-2 cursor-pointer hover:bg-cyan-100 text-black"
											>
												{loc}
											</li>
										))}
									</ul>
								)}
						</div>
						{/* Multi-select categories */}
						<div className="relative flex-1" ref={categoryDropdownRef}>
							<button
								type="button"
								onClick={() => setShowCategoryDropdown((v) => !v)}
								className="w-full px-4 py-2 rounded border border-cyan-900 bg-cyan-100 text-black text-left font-sans"
							>
								{selectedCategories.length === 0
									? "All Categories"
									: selectedCategories
											.map(
												(slug) =>
													categories.find((c) => c.slug === slug)?.name || slug
											)
											.join(", ")}
							</button>
							{showCategoryDropdown && (
								<ul className="absolute left-0 right-0 bg-white border border-cyan-900 rounded shadow z-10 max-h-48 overflow-y-auto p-2">
									{categories.map((cat) => (
										<li
											key={cat.slug}
											className="flex items-center gap-2 px-2 py-1 hover:bg-cyan-50 rounded cursor-pointer"
										>
											<input
												type="checkbox"
												checked={selectedCategories.includes(cat.slug)}
												onChange={() => handleCategoryChange(cat.slug)}
											/>
											<span>{cat.name}</span>
										</li>
									))}
								</ul>
							)}
						</div>
						{/* Multi-select job types */}
						<div className="relative flex-1" ref={jobTypeDropdownRef}>
							<button
								type="button"
								onClick={() => setShowJobTypeDropdown((v) => !v)}
								className="w-full px-4 py-2 rounded border border-cyan-900 bg-cyan-100 text-black text-left font-sans"
							>
								{selectedJobTypes.length === 0
									? "All Job Types"
									: selectedJobTypes
											.map(
												(val) =>
													jobTypes.find((j) => j.value === val)?.label || val
											)
											.join(", ")}
							</button>
							{showJobTypeDropdown && (
								<ul className="absolute left-0 right-0 bg-white border border-cyan-900 rounded shadow z-10 max-h-48 overflow-y-auto p-2">
									{jobTypes.map((jt) => (
										<li
											key={jt.value}
											className="flex items-center gap-2 px-2 py-1 hover:bg-cyan-50 rounded cursor-pointer"
										>
											<input
												type="checkbox"
												checked={selectedJobTypes.includes(jt.value)}
												onChange={() => handleJobTypeChange(jt.value)}
											/>
											<span>{jt.label}</span>
										</li>
									))}
								</ul>
							)}
						</div>
						<button
							type="submit"
							className="bg-cyan-400 text-black px-6 py-2 rounded font-semibold hover:bg-cyan-300 transition-colors font-sans"
							disabled={loading}
							onClick={() => console.log("Search button clicked")}
						>
							{loading ? "Searching..." : "Search"}
						</button>
					</form>
					{/* Debug button - remove after testing */}
					<button
						onClick={() => handleSearch(null, false, "", "", [], [])}
						className="mt-2 px-4 py-2 bg-red-500 text-white rounded text-sm"
					>
						Test Search (Debug)
					</button>
					<p className="text-xs text-gray-400 font-sans mb-2">
						Popular locations: Worldwide, Anywhere, United States, Europe,
						India, Remote, Mumbai, Bangalore, etc. (You can also enter a custom
						location)
					</p>
					{/* Search History Chips */}
					{searchHistory.length > 0 && (
						<div className="flex flex-wrap gap-2 mb-4">
							{searchHistory.map((h, idx) => (
								<button
									key={idx}
									onClick={() => {
										setQuery(h.query);
										setLocation(h.location);
										setSelectedCategories(h.categories || []);
										setSelectedJobTypes(h.jobTypes || []);
										handleSearch(
											null,
											true,
											h.query,
											h.location,
											h.categories,
											h.jobTypes
										);
									}}
									className="px-3 py-1 bg-cyan-100 text-cyan-900 rounded-full text-xs hover:bg-cyan-200 border border-cyan-300"
								>
									{h.query || "Any"}
									{h.location ? ` @ ${h.location}` : ""}
									{h.categories && h.categories.length > 0
										? ` | ${h.categories.join(",")}`
										: ""}
									{h.jobTypes && h.jobTypes.length > 0
										? ` | ${h.jobTypes.join(",")}`
										: ""}
								</button>
							))}
						</div>
					)}
					{error && <div className="text-red-400 font-sans">{error}</div>}
					{/* Debug info - remove after testing */}
					<div className="text-xs text-gray-500 mb-2">
						Debug: Query="{query}", Location="{location}", Results=
						{results.length}, Loading={loading.toString()}
					</div>
					<div>
						{loading && (
							<div className="text-cyan-400 font-sans">Loading jobs...</div>
						)}
						{!loading && results.length === 0 && (
							<div className="text-gray-400 font-sans">
								No jobs found. Try searching above.
							</div>
						)}
						{results.length > 0 && (
							<>
								<ul className="space-y-4">
									{results.map((job, idx) => (
										<li
											key={idx}
											className="bg-[#232323] border border-cyan-900 rounded-lg p-4"
										>
											<h3 className="text-lg font-semibold text-white font-sans">
												{job.title}
											</h3>
											<p className="text-gray-300 font-sans">
												{job.company} - {job.location}{" "}
												{job.job_type
													? `| ${job.job_type.replace("_", " ")}`
													: ""}
											</p>
											<p className="text-gray-400 text-sm font-sans mb-2">
												{job.description}
											</p>
											<div className="flex gap-4">
												<a
													href="#"
													onClick={(e) => {
														e.preventDefault();
														setSelectedJob(job);
														setShowJobModal(true);
													}}
													className="text-cyan-400 hover:underline font-sans"
												>
													View & Apply
												</a>
												<button
													onClick={() => handleSaveJob(job)}
													className="ml-2 px-3 py-1 bg-cyan-700 text-white rounded hover:bg-cyan-600 text-xs font-sans"
												>
													Save
												</button>
											</div>
										</li>
									))}
								</ul>
								<button
									onClick={handleLoadMore}
									className="mt-4 px-6 py-2 bg-cyan-400 text-black rounded font-semibold hover:bg-cyan-300"
								>
									Load More
								</button>
							</>
						)}
					</div>
				</>
			)}
			{activeJobTab === "saved" && (
				<div>
					{savedJobs.length === 0 && (
						<div className="text-gray-400 font-sans">No saved jobs yet.</div>
					)}
					{savedJobs.length > 0 && (
						<ul className="space-y-4">
							{savedJobs.map((job, idx) => (
								<li
									key={idx}
									className="bg-[#232323] border border-cyan-900 rounded-lg p-4"
								>
									<h3 className="text-lg font-semibold text-white font-sans">
										{job.title}
									</h3>
									<p className="text-gray-300 font-sans">
										{job.company} - {job.location}
									</p>
									<p className="text-gray-400 text-sm font-sans mb-2">
										{job.description}
									</p>
									<div className="flex gap-4">
										<a
											href="#"
											onClick={(e) => {
												e.preventDefault();
												setSelectedJob(job);
												setShowJobModal(true);
											}}
											className="text-cyan-400 hover:underline font-sans"
										>
											View & Apply
										</a>
										<button
											onClick={() => handleRemoveSavedJob(job.url)}
											className="ml-2 px-3 py-1 bg-red-700 text-white rounded hover:bg-red-600 text-xs font-sans"
										>
											Remove
										</button>
									</div>
								</li>
							))}
						</ul>
					)}
				</div>
			)}
			{/* Job Details Modal */}
			{showJobModal && selectedJob && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
					<div className="bg-[#18191b] rounded-lg shadow-lg max-w-2xl w-full p-6 relative border border-cyan-900">
						<button
							onClick={() => setShowJobModal(false)}
							className="absolute top-2 right-2 text-gray-400 hover:text-cyan-400 text-2xl font-bold"
							aria-label="Close"
						>
							&times;
						</button>
						<h2 className="text-2xl font-bold text-white mb-2 font-sans">
							{selectedJob.title}
						</h2>
						<p className="text-cyan-300 font-semibold mb-1 font-sans">
							{selectedJob.company} - {selectedJob.location}{" "}
							{selectedJob.job_type
								? `| ${selectedJob.job_type.replace("_", " ")}`
								: ""}
						</p>
						<div
							className="text-gray-200 text-sm mb-4 font-sans prose prose-invert max-w-none"
							style={{ maxHeight: "300px", overflowY: "auto" }}
							dangerouslySetInnerHTML={{
								__html: selectedJob.fullDescription || selectedJob.description,
							}}
						/>
						<a
							href={selectedJob.url}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-block bg-cyan-400 text-black px-6 py-2 rounded font-semibold hover:bg-cyan-300 transition-colors font-sans mt-2"
						>
							Apply
						</a>
					</div>
				</div>
			)}
		</div>
	);
} 