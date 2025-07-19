"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function TechnicalAssessmentPage() {
	const [selectedFile, setSelectedFile] = useState(null);
	const [difficulty, setDifficulty] = useState("easy");
	const [numQuestions, setNumQuestions] = useState(5);
	const [error, setError] = useState("");
	const [dragActive, setDragActive] = useState(false);
	const [loading, setLoading] = useState(false);
	const fileInputRef = useRef();
	const router = useRouter();

	const handleFileChange = (e) => {
		setSelectedFile(e.target.files[0]);
		setError("");
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			setSelectedFile(e.dataTransfer.files[0]);
			setError("");
		}
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(true);
	};

	const handleDragLeave = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
	};

	const handleClickDropzone = () => {
		fileInputRef.current.click();
	};

	const handleStart = async () => {
		if (!selectedFile) {
			setError("Please upload your resume (PDF)");
			return;
		}
		setError("");
		setLoading(true);
		try {
			const formData = new FormData();
			formData.append("file", selectedFile);
			formData.append("num_questions", numQuestions); // Pass number of questions
			// You can add difficulty to the backend if supported
			const res = await fetch(
				"http://localhost:8000/api/assessment/upload_resume/",
				{
					method: "POST",
					body: formData,
				}
			);
			if (!res.ok) throw new Error("Failed to generate assessment");
			const data = await res.json();
			setLoading(false);
			if (data.questions && data.questions.length > 0) {
				// Pass data to the attempt page using sessionStorage
				sessionStorage.setItem("techAssessmentData", JSON.stringify(data));
				router.push("/assessment/technical/attempt");
			} else {
				setError(
					data.error ||
						"No questions generated. Please try again or upload a different resume."
				);
			}
		} catch (err) {
			setError(err.message || "Something went wrong");
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-[#101113] py-12 px-4">
			<h1 className="text-3xl font-bold mb-2 text-white">
				Technical Assessment
			</h1>
			<p className="text-lg text-gray-300 mb-8 text-center max-w-2xl">
				Upload your resume and select your preferences to generate a technical
				assessment tailored for you.
			</p>
			<div className="bg-[#18191b] rounded-xl shadow-md border border-green-900 p-8 w-full max-w-xl flex flex-col items-center">
				<label className="text-green-400 font-semibold mb-4 w-full text-left text-lg">
					Upload Resume (PDF)
				</label>
				<div
					className={`w-full h-40 flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-200 ${
						dragActive
							? "border-green-400 bg-green-950/30"
							: "border-green-700 bg-[#101113]"
					} mb-6`}
					onClick={handleClickDropzone}
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
				>
					<input
						type="file"
						accept="application/pdf"
						onChange={handleFileChange}
						ref={fileInputRef}
						className="hidden"
					/>
					{selectedFile ? (
						<div className="text-green-300 text-lg font-medium text-center">
							{selectedFile.name}
						</div>
					) : (
						<>
							<div className="text-gray-400 text-lg font-medium mb-2 text-center">
								Drag & drop your PDF resume here
							</div>
							<div className="text-gray-500 text-sm">
								or click to select a file
							</div>
						</>
					)}
				</div>
				<label className="text-green-400 font-semibold mb-2 w-full text-left">
					Select Difficulty
				</label>
				<select
					value={difficulty}
					onChange={(e) => setDifficulty(e.target.value)}
					className="mb-4 px-3 py-2 rounded bg-[#101113] text-white border border-green-400 w-full"
				>
					<option value="easy">Easy</option>
					<option value="moderate">Moderate</option>
					<option value="hard">Hard</option>
				</select>
				<label className="text-green-400 font-semibold mb-2 w-full text-left">
					Number of Questions
				</label>
				<input
					type="number"
					min={1}
					max={50}
					value={numQuestions}
					onChange={(e) => setNumQuestions(Number(e.target.value))}
					className="mb-6 px-3 py-2 rounded bg-[#101113] text-white border border-green-400 w-full"
				/>
				<button
					onClick={handleStart}
					className="bg-green-400 text-black px-6 py-2 rounded hover:bg-green-300 transition-colors duration-200 w-full font-semibold"
					disabled={loading}
				>
					{loading ? "Generating..." : "Start Assessment"}
				</button>
				{error && <div className="mt-4 text-red-400">{error}</div>}
			</div>
			{/* Loading screen overlay */}
			{loading && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
					<div className="bg-[#18191b] p-8 rounded-xl shadow-xl flex flex-col items-center">
						<div
							className="loader mb-4"
							style={{
								width: 48,
								height: 48,
								border: "6px solid #22d3ee",
								borderTop: "6px solid transparent",
								borderRadius: "50%",
								animation: "spin 1s linear infinite",
							}}
						/>
						<div className="text-cyan-300 text-lg font-semibold">
							Generating your assessment...
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

// Add this to your global CSS or in a style tag for the loader animation
// @keyframes spin { 100% { transform: rotate(360deg); } }
