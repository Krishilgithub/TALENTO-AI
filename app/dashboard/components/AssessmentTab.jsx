"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import createClientForBrowser from '@/utils/supabase/client';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

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

// Helper to store assessment result
async function storeAssessmentResult({ userId, assessmentType, score, level, numQuestions }) {
  const supabase = createClientForBrowser();
  await supabase.from('assessment_results').insert([
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
	const [selectedAssessment, setSelectedAssessment] = useState(null);
	const [loading, setLoading] = useState(false);
	const [showProgress, setShowProgress] = useState(false);
	const [results, setResults] = useState([]);
	const [fetchingResults, setFetchingResults] = useState(false);
	const [filterType, setFilterType] = useState('aptitude');
	const router = useRouter();

	// Register Chart.js components
	ChartJS.register(
		CategoryScale,
		LinearScale,
		PointElement,
		LineElement,
		BarElement,
		Title,
		Tooltip,
		Legend
	);

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { labels: { color: 'white' } },
			tooltip: {
				callbacks: {
					title: (items) => (items?.[0]?.label || ''),
					label: (ctx) => `Value: ${ctx.parsed.y ?? '-'}`,
				},
			},
		},
		elements: { line: { tension: 0.35 }, point: { radius: 4, hoverRadius: 6 } },
		scales: {
			x: { ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' } },
			y: { ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' }, suggestedMin: 0, suggestedMax: 100 },
		},
	};

	// Plugin to overlay empty state when no data
	const emptyStatePlugin = {
		id: 'emptyState',
		beforeDraw: (chart) => {
			const dataset = chart.data?.datasets?.[0]?.data || [];
			const hasData = Array.isArray(dataset) && dataset.some(v => typeof v === 'number' && !Number.isNaN(v) && v !== null);
			if (hasData) return;
			const { ctx, chartArea } = chart;
			const centerX = (chartArea.left + chartArea.right) / 2;
			const centerY = (chartArea.top + chartArea.bottom) / 2;
			ctx.save();
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.font = 'bold 14px Arial';
			ctx.fillStyle = 'rgba(200, 200, 200, 0.9)';
			ctx.fillText('No assessment given yet', centerX, centerY);
			ctx.restore();
		},
	};

	const handleAssessmentSelect = (assessment) => {
		setSelectedAssessment(assessment);
		// Navigate to the assessment page
		router.push(`/assessment/${assessment.key}`);
	};

	async function fetchAssessmentResults() {
		setFetchingResults(true);
		try {
			const supabase = createClientForBrowser();
			const { data: userData } = await supabase.auth.getUser();
			if (!userData?.user) return;
			const { data, error } = await supabase
				.from('assessment_results')
				.select('*')
				.eq('user_id', userData.user.id)
				.order('completed_at', { ascending: true });
			if (!error && data) setResults(data);
		} finally {
			setFetchingResults(false);
		}
	}

	function groupByType(type) {
		const filtered = results.filter(r => r.assessment_type === type);
		const labels = filtered.map((r, i) => `Attempt ${i + 1}`);
		const scores = filtered.map(r => r.score);
		const safeLabels = labels.length > 0 ? labels : ['1', '2', '3', '4', '5'];
		const safeData = scores.length > 0 ? scores : [null, null, null, null, null];
		return {
			labels: safeLabels,
			scores: safeData,
			levels: filtered.map(r => r.level || ''),
			numQuestions: filtered.map(r => r.number_of_questions || null),
		};
	}

	function difficultyStats(type) {
		const filtered = results.filter(r => r.assessment_type === type);
		const normalize = (lvl) => (lvl || '').toString().trim().toLowerCase();
		const canonical = (lvl) => {
			switch (normalize(lvl)) {
				case 'easy': return 'Easy';
				case 'medium': return 'Medium';
				case 'hard': return 'Hard';
				default: return lvl || 'Unknown';
			}
		};
		const labelSet = new Map();
		filtered.forEach(r => labelSet.set(canonical(r.level), true));
		const baseOrder = ['Easy', 'Medium', 'Hard'];
		const other = Array.from(labelSet.keys()).filter(l => !baseOrder.includes(l));
		const labels = [...baseOrder.filter(l => labelSet.has(l)), ...other];
		const counts = labels.map(l => filtered.filter(r => canonical(r.level) === l).length);
		const avgScores = labels.map(l => {
			const group = filtered.filter(r => canonical(r.level) === l).map(r => r.score).filter(n => typeof n === 'number');
			if (group.length === 0) return null;
			return +(group.reduce((a,b)=>a+b,0) / group.length).toFixed(1);
		});
		const safeLabels = labels.length > 0 ? labels : ['Easy','Medium','Hard'];
		const safeCounts = labels.length > 0 ? counts : [0,0,0];
		const safeAvg = labels.length > 0 ? avgScores : [null, null, null];
		return { labels: safeLabels, counts: safeCounts, avgScores: safeAvg };
	}

	function questionsTrend(type) {
		const filtered = results.filter(r => r.assessment_type === type);
		const labels = filtered.map((r, i) => `Attempt ${i + 1}`);
		const values = filtered.map(r => r.number_of_questions ?? null);
		return {
			labels: labels.length > 0 ? labels : ['1','2','3','4','5'],
			values: values.length > 0 ? values : [null, null, null, null, null],
		};
	}

	function QuestionsPerAttemptChart({ type, results, options, plugin }) {
		const q = questionsTrend(type);
		const data = {
			labels: q.labels,
			datasets: [{
				label: 'Questions per Attempt',
				data: q.values,
				borderColor: 'rgb(251, 191, 36)',
				backgroundColor: 'rgba(251, 191, 36, 0.2)',
				spanGaps: true,
			}]
		};
		return <Line data={data} options={options} plugins={[plugin]} />;
	}

	function DifficultyCharts({ type, results, options, plugin }) {
		const diff = difficultyStats(type);
		const countsData = {
			labels: diff.labels,
			datasets: [{
				label: 'Attempts by Difficulty',
				data: diff.counts,
				backgroundColor: 'rgba(168, 85, 247, 0.5)',
				borderColor: 'rgb(168, 85, 247)',
				borderWidth: 1,
			}]
		};
		const avgData = {
			labels: diff.labels,
			datasets: [{
				label: 'Avg Score by Difficulty',
				data: diff.avgScores,
				backgroundColor: 'rgba(34, 197, 94, 0.5)',
				borderColor: 'rgb(34, 197, 94)',
				borderWidth: 1,
			}]
		};
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
				<div className="h-64">
					<Bar data={countsData} options={options} plugins={[plugin]} />
				</div>
				<div className="h-64">
					<Bar data={avgData} options={options} plugins={[plugin]} />
				</div>
			</div>
		);
	}

	return (
		<div className="w-full">
			<div className="text-center mb-8">
				<h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Take Assessment</h2>
				<p className="text-gray-300 text-lg">
					Ready to evaluate your skills? Choose an assessment below to get started. 
					Your results will help guide your learning and career planning.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
				{ASSESSMENTS.map((assessment, index) => (
					<motion.div
						key={assessment.key}
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
					>
						<div 
							className="bg-gradient-to-br from-cyan-900 to-[#18191b] rounded-xl shadow-lg border border-cyan-700 p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
							onClick={() => handleAssessmentSelect(assessment)}
						>
							<div className="flex items-center mb-4">
								<div className="text-3xl mr-3 text-cyan-300">{assessment.icon}</div>
								<h3 className="text-xl font-semibold text-cyan-300">
									{assessment.name}
								</h3>
							</div>
							<p className="text-cyan-200 mb-4">{assessment.description}</p>
							<button 
								className="bg-cyan-400 border border-cyan-700 text-black px-4 py-2 rounded-lg font-medium hover:scale-105 transition-all duration-200"
								onClick={(e) => {
									e.stopPropagation();
									handleAssessmentSelect(assessment);
								}}
							>
								Start Assessment
							</button>
						</div>
					</motion.div>
				))}
			</div>

			{/* Assessment Tips Section */}
			<div className="mt-12 max-w-4xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
					className="bg-[#18191b] rounded-xl p-6 border border-gray-700"
				>
					<h3 className="text-xl font-semibold text-cyan-400 mb-4">Assessment Tips</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<div className="flex items-center text-gray-300">
								<span className="text-cyan-400 mr-2">✓</span>
								Take your time and read questions carefully
							</div>
							<div className="flex items-center text-gray-300">
								<span className="text-cyan-400 mr-2">✓</span>
								Answer honestly - there are no wrong answers
							</div>
							<div className="flex items-center text-gray-300">
								<span className="text-cyan-400 mr-2">✓</span>
								Find a quiet environment to focus
							</div>
						</div>
						<div className="space-y-2">
							<div className="flex items-center text-gray-300">
								<span className="text-cyan-400 mr-2">✓</span>
								Use your results to guide your learning
							</div>
							<div className="flex items-center text-gray-300">
								<span className="text-cyan-400 mr-2">✓</span>
								Retake assessments to track progress
							</div>
							<div className="flex items-center text-gray-300">
								<span className="text-cyan-400 mr-2">✓</span>
								Share results with mentors for guidance
							</div>
						</div>
					</div>
				</motion.div>
			</div>

			{/* Progress Section Trigger */}
			<div className="mt-12 max-w-5xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
					className="bg-[#18191b] rounded-xl p-6 border border-gray-700"
				>
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<h3 className="text-xl font-semibold text-cyan-400">Your Progress</h3>
						<div className="flex items-center gap-3">
							<select
								value={filterType}
								onChange={(e) => setFilterType(e.target.value)}
								className="bg-[#23272f] text-white border border-gray-700 rounded-lg px-3 py-2"
							>
								<option value="aptitude">Aptitude</option>
								<option value="technical">Technical</option>
								<option value="personality">Personality</option>
								<option value="communication">Communication</option>
							</select>
							<button
								onClick={async () => { setShowProgress(true); await fetchAssessmentResults(); }}
								disabled={fetchingResults}
								className="bg-cyan-400 border border-cyan-700 text-black px-4 py-2 rounded-lg font-medium hover:scale-105 transition-all duration-200 disabled:opacity-50"
							>
								{fetchingResults ? 'Loading...' : 'Show Progress'}
							</button>
						</div>
					</div>

					{showProgress && (
						<div className="mt-6 space-y-6">
							{[filterType].map(type => {
								const grouped = groupByType(type);
								const hasData = grouped.scores.some(v => typeof v === 'number');
								const avg = hasData ? (grouped.scores.filter(v => typeof v === 'number').reduce((a,b)=>a+b,0) / grouped.scores.filter(v => typeof v === 'number').length).toFixed(1) : '-';
								const last = hasData ? grouped.scores.filter(v => typeof v === 'number').slice(-1)[0] : '-';
								const data = {
									labels: grouped.labels,
									datasets: [
										{
											label: `${type.charAt(0).toUpperCase() + type.slice(1)} Scores`,
											data: grouped.scores,
											borderColor: 'rgb(34, 197, 214)',
											backgroundColor: 'rgba(34, 197, 214, 0.25)',
											fill: true,
											spanGaps: true,
										},
									],
								};
								return (
									<div key={type} className="bg-[#232323] rounded-lg p-4 border border-gray-700">
										<div className="flex items-center justify-between mb-3">
											<h4 className="text-lg font-semibold text-white capitalize">{type} Analysis</h4>
											<div className="text-xs sm:text-sm text-gray-300">Attempts: {hasData ? grouped.scores.filter(v => typeof v === 'number').length : 0} · Avg: {avg} · Latest: {last}</div>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div className="h-64 bg-[#1b1b1b] rounded p-3 border border-gray-800">
												<Line data={data} options={chartOptions} plugins={[emptyStatePlugin]} />
											</div>
											<div className="h-64 bg-[#1b1b1b] rounded p-3 border border-gray-800">
												<QuestionsPerAttemptChart type={type} results={results} options={chartOptions} plugin={emptyStatePlugin} />
											</div>
											<div className="h-64 bg-[#1b1b1b] rounded p-3 border border-gray-800 md:col-span-2">
												<DifficultyCharts type={type} results={results} options={chartOptions} plugin={emptyStatePlugin} />
											</div>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</motion.div>
			</div>
		</div>
	);
} 