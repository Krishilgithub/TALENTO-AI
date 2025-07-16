"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function TechnicalAssessmentPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [difficulty, setDifficulty] = useState("easy");
  const [numQuestions, setNumQuestions] = useState(5);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
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

  const handleStart = () => {
    if (!selectedFile) {
      setError("Please upload your resume (PDF)");
      return;
    }
    setError("");
    // Placeholder for assessment logic
    alert(
      `Resume: ${selectedFile.name}\nDifficulty: ${difficulty}\nQuestions: ${numQuestions}`
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#101113] py-12 px-4">
      <h1 className="text-3xl font-bold mb-2 text-white">Technical Assessment</h1>
      <p className="text-lg text-gray-300 mb-8 text-center max-w-2xl">
        Upload your resume and select your preferences to generate a technical assessment tailored for you.
      </p>
      <div className="bg-[#18191b] rounded-xl shadow-md border border-green-900 p-8 w-full max-w-xl flex flex-col items-center">
        <label className="text-green-400 font-semibold mb-4 w-full text-left text-lg">Upload Resume (PDF)</label>
        <div
          className={`w-full h-40 flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-200 ${
            dragActive ? "border-green-400 bg-green-950/30" : "border-green-700 bg-[#101113]"
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
              <div className="text-gray-500 text-sm">or click to select a file</div>
            </>
          )}
        </div>
        <label className="text-green-400 font-semibold mb-2 w-full text-left">Select Difficulty</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="mb-4 px-3 py-2 rounded bg-[#101113] text-white border border-green-400 w-full"
        >
          <option value="easy">Easy</option>
          <option value="moderate">Moderate</option>
          <option value="hard">Hard</option>
        </select>
        <label className="text-green-400 font-semibold mb-2 w-full text-left">Number of Questions</label>
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
        >
          Start Assessment
        </button>
        {error && <div className="mt-4 text-red-400">{error}</div>}
      </div>
    </div>
  );
} 