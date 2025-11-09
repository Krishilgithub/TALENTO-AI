"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import createClientForBrowser from "@/utils/supabase/client";

const ASSESSMENTS = [
	{
		key: "aptitude",
		name: "General Aptitude Test",
		description: "Evaluate your logical, quantitative, and verbal reasoning skills.",
		icon: "🧠"
	},
	{
		key: "technical",
		name: "Technical Assessment",
		description: "Test your technical knowledge in programming, engineering, or your chosen field.",
		icon: "💻"
	},
	{
		key: "personality",
		name: "Personality Assessment",
		description: "Discover your strengths, work style, and ideal career environments.",
		icon: "🎭"
	},
	{
		key: "communication",
		name: "Communication Skills Test",
		description: "Assess your written and verbal communication abilities.",
		icon: "💬"
	},
];

// Helper to store assessment result - now uses assessment_history table
async function storeAssessmentResult({ userId, assessmentType, score, level, numQuestions }) {
	const supabase = createClientForBrowser();
	await supabase.from('assessment_history').insert([
		{
			user_id: userId,
			assessment_type: assessmentType,
			score,
			level,
			number_of_questions: numQuestions,
			completed_at: new Date().toISOString(),
		},
	]);
}

export default function AssessmentTab() {
	const { user, supabase } = useAuth();
	const [selectedAssessment, setSelectedAssessment] = useState(null);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleAssessmentSelect = (assessment) => {
		setSelectedAssessment(assessment);
		setLoading(true);
		// Faster redirect - reduced delay from 1000ms to 300ms
		setTimeout(() => {
			setLoading(false);
			router.push(`/assessment/${assessment.key}`);
		}, 300);
	};



	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-8">
						<h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Take Assessment</h2>
						<p className="text-gray-300 text-lg">
							Ready to evaluate your skills? Choose an assessment below to get started.
							Your results will help guide your learning and career planning.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
						{ASSESSMENTS.map((assessment, index) => (
							<motion.div
								key={assessment.key}
								initial={{ opacity: 0, y: 40 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.3 }}
								transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
							>
								<div
									className="bg-gray-800/30 border border-gray-600/50 backdrop-blur-sm rounded-lg p-6 hover:border-cyan-400/50 hover:scale-105 transition-all duration-300 cursor-pointer"
									onClick={() => handleAssessmentSelect(assessment)}
								>
									<div className="flex items-center mb-4">
										<div className="text-3xl mr-3 text-cyan-300">{assessment.icon}</div>
										<div>
											<h3 className="text-xl font-semibold text-white">{assessment.name}</h3>
										</div>
									</div>
									<p className="text-gray-300 mb-4">{assessment.description}</p>
									<button
										className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
										disabled={loading && selectedAssessment?.key === assessment.key}
									>
										{loading && selectedAssessment?.key === assessment.key ? (
											<>
												<div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
												Loading...
											</>
										) : (
											'Start Assessment'
										)}
									</button>
								</div>
							</motion.div>
						))}
					</div>


				</div>
			</div>
		</div>
	);
}