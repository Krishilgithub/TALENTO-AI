"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { BriefcaseIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import { useRequestCache, useDebounce } from "../../hooks/useCache";
import { useRouter } from "next/navigation";

export default function JobSearchTab() {
	const { user, supabase } = useAuth();
	const { cachedFetch, invalidateCache } = useRequestCache();
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
	const [savedJobsCache, setSavedJobsCache] = useState(null); // Cache for saved jobs
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
	const [supabaseLoading, setSupabaseLoading] = useState(false);
	const [supabaseError, setSupabaseError] = useState("");
	const [supabaseSuccess, setSupabaseSuccess] = useState("");

	// Debounce search query to prevent excessive API calls
	const debouncedQuery = useDebounce(query, 500);
	const debouncedLocation = useDebounce(location, 500);

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

	// Fetch saved jobs from API with caching
	const fetchSavedJobs = useCallback(async () => {
		if (!user) {
			setSupabaseError("You must be logged in to view saved jobs.");
			return;
		}

		// Use cached data if available
		if (savedJobsCache && Date.now() - savedJobsCache.timestamp < 2 * 60 * 1000) { // 2 minutes cache
			setSavedJobs(savedJobsCache.data);
			return;
		}

		setSupabaseLoading(true);
		setSupabaseError("");

		try {
			const response = await fetch('/api/saved-jobs');
			const result = await response.json();

			if (!response.ok) {
				setSupabaseError(result.error || "Failed to fetch saved jobs.");
				return;
			}

			const jobsData = result.data || [];
			setSavedJobs(jobsData);
			setSavedJobsCache({
				data: jobsData,
				timestamp: Date.now()
			});
		} catch (error) {
			console.error("Fetch saved jobs error:", error);
			setSupabaseError("Failed to fetch saved jobs.");
		} finally {
			setSupabaseLoading(false);
		}
	}, [user, savedJobsCache]);

	useEffect(() => {
		if (activeJobTab === "saved") {
			fetchSavedJobs();
		}
	}, [activeJobTab]);

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

	const handleSearch = useCallback(async (
		e,
		fromHistory = false,
		histQuery = "",
		histLocation = "",
		histCategories = [],
		histJobTypes = []
	) => {
		if (e) e.preventDefault();
		const q = fromHistory ? histQuery : query;
		const l = fromHistory ? histLocation : location;
		const c = fromHistory ? histCategories : selectedCategories;
		const t = fromHistory ? histJobTypes : selectedJobTypes;

		// Don't search if no query and no location
		if (!q.trim() && !l.trim()) return;

		setLoading(true);
		setError(null);
		setResults([]);
		setSupabaseError(""); // Clear any previous save errors
		setSupabaseSuccess(""); // Clear any previous save success messages
		addToHistory(q, l, c, t);

		let apiUrl = `/api/jobs?query=${encodeURIComponent(
			q
		)}&location=${encodeURIComponent(l)}&limit=${jobLimit}`;
		if (c && c.length > 0) {
			apiUrl += c.map((cat) => `&category=${encodeURIComponent(cat)}`).join("");
		}

		// Create cache parameters
		const searchParams = { q, l, c, t, limit: jobLimit };

		try {
			const { response, data } = await cachedFetch(apiUrl, {}, searchParams);

			let jobs = data.results || [];
			if (t && t.length > 0)
				jobs = jobs.filter((j) => t.includes((j.job_type || "").toLowerCase()));

			if (!response.ok || data.error) {
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
	}, [query, location, selectedCategories, selectedJobTypes, jobLimit, cachedFetch]);

	const handleLoadMore = () => {
		setJobLimit((prev) => prev + 20);
		setTimeout(() => handleSearch(), 0);
	};

	const handleSaveJob = async (job) => {
		if (!user) {
			setSupabaseError("You must be logged in to save jobs.");
			return;
		}

		setSupabaseError("");
		setSupabaseSuccess("");
		setSupabaseLoading(true);

		try {
			const searchParams = {
				query,
				location,
				categories: selectedCategories,
				jobTypes: selectedJobTypes,
			};

			const response = await fetch('/api/saved-jobs', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					job_data: job,
					search_params: searchParams,
				}),
			});

			const result = await response.json();

			if (!response.ok) {
				setSupabaseError(result.error || 'Failed to save job');
			} else {
				// Invalidate cache and refresh saved jobs
				setSavedJobsCache(null);
				setSupabaseSuccess("Job saved successfully!");
				// Auto-clear success message after 3 seconds
				setTimeout(() => setSupabaseSuccess(""), 3000);
			}
		} catch (error) {
			console.error("Save job error:", error);
			setSupabaseError(`Failed to save job: ${error.message}`);
		} finally {
			setSupabaseLoading(false);
		}
	};

	const handleRemoveSavedJob = async (jobUrl) => {
		if (!user) {
			setSupabaseError("You must be logged in.");
			return;
		}

		setSupabaseError("");
		setSupabaseLoading(true);

		try {
			const response = await fetch('/api/saved-jobs', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ jobUrl }),
			});

			const result = await response.json();

			if (!response.ok) {
				setSupabaseError(result.error || "Failed to remove job.");
			} else {
				// Invalidate cache and refresh saved jobs
				setSavedJobsCache(null);
				fetchSavedJobs();
			}
		} catch (error) {
			console.error('Error removing job:', error);
			setSupabaseError("Failed to remove job.");
		} finally {
			setSupabaseLoading(false);
		}
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
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
			<div className="container mx-auto px-6 py-8 space-y-8 max-w-7xl">
				{/* Animated background */}
				<div className="fixed inset-0 overflow-hidden pointer-events-none">
					<div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
					<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
				</div>

				{/* Header */}
				<div className="relative z-10 bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300">
					<div className="flex items-center space-x-4">
						<div className="p-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl">
							<BriefcaseIcon className="h-8 w-8 text-white" />
						</div>
						<div>
							<h2 className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent tracking-tight">Job Search</h2>
							<p className="text-gray-400 text-lg font-medium">Find your next opportunity. Search for jobs by title, keyword, or location.</p>
						</div>
					</div>
				</div>

				<div className="relative z-10 flex gap-6 mb-8">
					<button
						onClick={() => setActiveJobTab("search")}
						className={`group px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg ${activeJobTab === "search"
							? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
							: "bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 text-gray-300 hover:bg-gray-700/40 hover:text-white hover:shadow-cyan-500/10"
							}`}
					>
						Search Jobs
					</button>
					<button
						onClick={() => setActiveJobTab("saved")}
						className={`group px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg ${activeJobTab === "saved"
							? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
							: "bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 text-gray-300 hover:bg-gray-700/40 hover:text-white hover:shadow-cyan-500/10"
							}`}
					>
						Saved Jobs
					</button>
				</div>
				{activeJobTab === "search" && (
					<>
						<div className="relative z-10 bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300">
							<form
								onSubmit={handleSearch}
								className="flex flex-col md:flex-row gap-6 mb-6"
							>
								<input
									type="text"
									placeholder="Job title or keywords"
									value={query}
									onChange={(e) => setQuery(e.target.value)}
									className="flex-1 px-6 py-4 rounded-xl border border-gray-600/30 bg-gray-700/30 backdrop-blur-sm text-white placeholder-gray-400 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
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
										className="w-full px-6 py-4 rounded-xl border border-gray-600/30 bg-gray-700/30 backdrop-blur-sm text-white placeholder-gray-400 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
									/>
									{showLocationSuggestions &&
										filteredLocationSuggestions.length > 0 && (
											<ul className="absolute left-0 right-0 bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-xl z-10 max-h-40 overflow-y-auto">
												{filteredLocationSuggestions.map((loc, idx) => (
													<li
														key={loc}
														onMouseDown={() => {
															setLocation(loc);
															setShowLocationSuggestions(false);
														}}
														className="px-4 py-2 cursor-pointer hover:bg-cyan-900/50 text-white"
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
									className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
									disabled={loading}
								>
									{loading ? "Searching..." : "Search"}
								</button>
							</form>
						</div>


						{error && <div className="text-red-400 font-sans mb-4">{error}</div>}
						{supabaseError && <div className="text-red-400 font-sans mb-4">{supabaseError}</div>}
						{supabaseSuccess && <div className="text-green-400 font-sans mb-4">{supabaseSuccess}</div>}
						<div>
							{loading && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="flex items-center justify-center py-12"
								>
									<div className="flex flex-col items-center gap-4">
										<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
										<p className="text-cyan-400 font-medium">Searching for opportunities...</p>
									</div>
								</motion.div>
							)}
							{!loading && results.length === 0 && (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									className="text-center py-16"
								>
									<BriefcaseIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
									<p className="text-gray-400 text-lg font-medium mb-2">No jobs found</p>
									<p className="text-gray-500">Try adjusting your search terms or location</p>
								</motion.div>
							)}
							{results.length > 0 && (
								<>
									<ul className="space-y-4">
										{results.map((job, idx) => (
											<motion.li
												key={idx}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{
													duration: 0.4,
													delay: idx * 0.05,
													type: "spring",
													damping: 25,
													stiffness: 120
												}}
												className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-600/40 rounded-2xl p-6 hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-500/5 transition-all duration-500 cursor-pointer overflow-hidden"
											>
												{/* Subtle background gradient on hover */}
												<div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

												<div className="relative z-10">
													<div className="flex items-start justify-between mb-4">
														<div className="flex-1">
															<h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300">
																{job.title}
															</h3>
															<div className="flex items-center gap-2 text-gray-400 mb-2">
																<span className="font-semibold text-gray-300">{job.company}</span>
																<span>•</span>
																<span className="text-cyan-400">{job.location}</span>
																{job.job_type && (
																	<>
																		<span>•</span>
																		<span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">
																			{job.job_type.replace("_", " ").toUpperCase()}
																		</span>
																	</>
																)}
															</div>
														</div>

														<button
															onClick={(e) => {
																e.stopPropagation();
																handleSaveJob(job);
															}}
															disabled={supabaseLoading}
															className="px-4 py-2 bg-gray-700/50 hover:bg-cyan-600/80 text-gray-300 hover:text-white rounded-lg transition-all duration-300 text-sm font-medium hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
														>
															{supabaseLoading ? "Saving..." : "Save Job"}
														</button>
													</div>

													<p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
														{job.description}
													</p>

													<div className="flex items-center justify-between">
														<button
															onClick={(e) => {
																e.preventDefault();
																setSelectedJob(job);
																setShowJobModal(true);
															}}
															className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
														>
															View Details & Apply
														</button>

														{job.salary && (
															<div className="text-right">
																<span className="text-green-400 font-bold text-lg">{job.salary}</span>
																<div className="text-xs text-gray-500">Salary</div>
															</div>
														)}
													</div>
												</div>
											</motion.li>
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
						{supabaseLoading && (
							<div className="text-cyan-400 font-sans">Loading saved jobs...</div>
						)}
						{supabaseError && (
							<div className="text-red-400 font-sans mb-2">{supabaseError}</div>
						)}
						{!supabaseLoading && savedJobs.length === 0 && !supabaseError && (
							<div className="text-gray-400 font-sans">No saved jobs yet.</div>
						)}
						{!supabaseLoading && savedJobs.length > 0 && (
							<ul className="space-y-4">
								{savedJobs.map((row, idx) => (
									<li
										key={row.id || idx}
										className="group bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-700/40 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 cursor-pointer"
									>
										<h3 className="text-lg font-semibold text-white">
											{row.job_data?.title}
										</h3>
										<p className="text-gray-300">
											{row.job_data?.company} - {row.job_data?.location}
										</p>
										<p className="text-gray-400 text-sm mb-2">
											{row.job_data?.description}
										</p>
										<div className="text-xs text-cyan-300 mb-2">
											<span className="font-semibold">Search Params:</span>{" "}
											{row.search_params?.query &&
												`Keyword: ${row.search_params.query}, `}{" "}
											{row.search_params?.location &&
												`Location: ${row.search_params.location}, `}{" "}
											{row.search_params?.categories?.length > 0 &&
												`Categories: ${row.search_params.categories.join(
													", "
												)}, `}{" "}
											{row.search_params?.jobTypes?.length > 0 &&
												`Job Types: ${row.search_params.jobTypes.join(", ")}`}
										</div>
										<div className="flex gap-4">
											<a
												href="#"
												onClick={(e) => {
													e.preventDefault();
													setSelectedJob(row.job_data);
													setShowJobModal(true);
												}}
												className="text-cyan-400 hover:underline font-sans"
											>
												View & Apply
											</a>
											<button
												onClick={() => handleRemoveSavedJob(row.job_data?.url)}
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
						<div className="bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg max-w-2xl w-full p-6 relative border border-gray-600/50">
							<button
								onClick={() => setShowJobModal(false)}
								className="absolute top-2 right-2 text-gray-400 hover:text-cyan-400 text-2xl font-bold"
								aria-label="Close"
							>
								&times;
							</button>
							<h2 className="text-2xl font-bold text-white mb-2">
								{selectedJob.title}
							</h2>
							<p className="text-cyan-300 font-semibold mb-1">
								{selectedJob.company} - {selectedJob.location}{" "}
								{selectedJob.job_type
									? `| ${selectedJob.job_type.replace("_", " ")}`
									: ""}
							</p>
							<div
								className="text-gray-200 text-sm mb-4 prose prose-invert max-w-none"
								style={{ maxHeight: "300px", overflowY: "auto" }}
								dangerouslySetInnerHTML={{
									__html: selectedJob.fullDescription || selectedJob.description,
								}}
							/>
							<a
								href={selectedJob.url}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-block bg-cyan-400 text-black px-6 py-2 rounded font-semibold hover:bg-cyan-300 transition-colors mt-2"
							>
								Apply
							</a>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
