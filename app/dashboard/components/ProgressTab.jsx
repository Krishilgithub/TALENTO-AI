"use client";

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	ArcElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import createClientForBrowser from '@/utils/supabase/client';
import { EnhancedProgressCharts } from './EnhancedProgressCharts';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	ArcElement,
	Title,
	Tooltip,
	Legend
);

export default function ProgressTab() {
	const [assessmentResults, setAssessmentResults] = useState([]);
	const [loading, setLoading] = useState(true);
	const [userId, setUserId] = useState(null);
	const [refreshKey, setRefreshKey] = useState(0);

	useEffect(() => {
		async function fetchResults() {
			const supabase = createClientForBrowser();
			const { data: userData } = await supabase.auth.getUser();
			if (!userData?.user) return;
			setUserId(userData.user.id);

			// Fetch from simple assessment_results table
			const { data: resultsData, error: resultsError } = await supabase
				.from('assessment_results')
				.select('*')
				.eq('user_id', userData.user.id)
				.order('completed_at', { ascending: true });

			// Also fetch progress data
			const { data: progressData, error: progressError } = await supabase
				.from('user_progress')
				.select('*')
				.eq('user_id', userData.user.id)
				.order('updated_at', { ascending: true });

			// Debug logging
			console.log('Progress Tab Data Fetch:');
			console.log('Results Data:', resultsData);
			console.log('Progress Data:', progressData);
			console.log('Results Error:', resultsError);
			console.log('Progress Error:', progressError);

			// Use results data with proper validation
			let combinedData = [];
			if (!resultsError && resultsData) {
				console.log('Raw assessment results data:', resultsData);
				combinedData = resultsData.map(item => ({
					...item,
					// Ensure scores are clamped to 0-100 range
					score: Math.min(Math.max(item.score || 0, 0), 100),
					// Use actual question counts, default to 5 for new assessments
					number_of_questions: item.number_of_questions || 5,
					correct_answers: item.correct_answers || 0
				}));
			}

			console.log('Progress Tab - Final combined data:', combinedData);
			setAssessmentResults(combinedData);
			setLoading(false);
		}
		fetchResults();

		// Set up real-time listener for new assessments
		const supabase = createClientForBrowser();
		const channel = supabase
			.channel('assessment_updates')
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'assessment_results'
				},
				(payload) => {
					console.log('New assessment completed:', payload);
					setRefreshKey(prev => prev + 1);
					setTimeout(() => fetchResults(), 1000); // Refresh data when new assessment is completed
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, []);

	// Group and transform data for charts
	const getChartData = (type) => {
		const filtered = (assessmentResults || []).filter(r => r?.assessment_type === type);
		const colorMap = {
			aptitude: 'rgb(34, 197, 214)',
			technical: 'rgb(168, 85, 247)',
			personality: 'rgb(34, 197, 94)',
			communication: 'rgb(251, 191, 36)'
		};

		return {
			labels: filtered.map((r, i) => {
				const date = new Date(r.completed_at || r.created_at);
				return `${date.getMonth() + 1}/${date.getDate()}`;
			}),
			datasets: [
				{
					label: `${type.charAt(0).toUpperCase() + type.slice(1)} Scores`,
					data: filtered.map(r => {
						// Score is already percentage in assessment_results table
						const score = typeof r.score === 'number' ? r.score : parseFloat(r.score) || 0;
						// Clamp to 0-100 range for proper display
						return Math.min(Math.max(score, 0), 100);
					}),
					borderColor: colorMap[type] || 'rgb(34, 197, 214)',
					backgroundColor: (colorMap[type] || 'rgb(34, 197, 214)').replace('rgb', 'rgba').replace(')', ', 0.2)'),
					tension: 0.1,
					fill: true,
					pointBackgroundColor: colorMap[type] || 'rgb(34, 197, 214)',
					pointBorderColor: '#fff',
					pointBorderWidth: 2,
					pointRadius: 5,
				},
			],
		};
	};

	// Real assessment data from database
	const generalAptitudeData = getChartData('aptitude');
	const technicalAssessmentData = getChartData('technical');
	const personalityAssessmentData = getChartData('personality');
	const communicationSkillData = getChartData('communication');

	// Calculate real progress statistics
	const calculateProgress = (type) => {
		const filtered = (assessmentResults || []).filter(r => r?.assessment_type === type);
		if (filtered.length === 0) return 0;

		const latestScore = filtered[filtered.length - 1]?.score || 0;
		const score = typeof latestScore === 'number' ? latestScore : parseFloat(latestScore) || 0;

		// Scores are already stored as percentages (0-100) in the database
		// Just clamp to 0-100 range to avoid any edge cases
		return Math.min(Math.max(Math.round(score), 0), 100);
	};

	// Update progress data with real statistics
	const progressData = {
		skills: [
			{ name: "Communication", progress: calculateProgress('communication') },
			{ name: "Problem Solving", progress: calculateProgress('aptitude') },
			{ name: "Technical Skills", progress: calculateProgress('technical') },
			{ name: "Leadership", progress: calculateProgress('personality') },
			{
				name: "Overall Average", progress: Math.round((assessmentResults || []).reduce((acc, r) => {
					const score = typeof r?.score === 'number' ? r.score : parseFloat(r?.score) || 0;
					// Scores are already percentages, just add them up
					return acc + Math.min(Math.max(score, 0), 100);
				}, 0) / Math.max((assessmentResults || []).length, 1))
			},
		],
		goals: [
			{
				name: "Complete 10 assessments",
				completed: (assessmentResults || []).length,
				total: 10
			},
			{
				name: "Achieve 80% average score",
				completed: Math.round((assessmentResults || []).reduce((acc, r) => {
					const score = typeof r?.score === 'number' ? r.score : parseFloat(r?.score) || 0;
					// Scores are already percentages
					return acc + Math.min(Math.max(score, 0), 100);
				}, 0) / Math.max((assessmentResults || []).length, 1)),
				total: 80
			},
			{
				name: "Try all assessment types",
				completed: [...new Set((assessmentResults || []).map(r => r?.assessment_type).filter(Boolean))].length,
				total: 4
			},
		],
	};

	// Real difficulty data from assessments
	const getDifficultyStats = () => {
		const easy = (assessmentResults || []).filter(r => r?.difficulty_level === 'easy').length;
		const medium = (assessmentResults || []).filter(r => r?.difficulty_level === 'medium' || r?.difficulty_level === 'moderate' || !r?.difficulty_level).length;
		const hard = (assessmentResults || []).filter(r => r?.difficulty_level === 'hard').length;
		return [easy, medium, hard];
	};

	const difficultyData = {
		labels: ['Easy', 'Medium', 'Hard'],
		datasets: [
			{
				label: 'Assessments Completed',
				data: getDifficultyStats(),
				backgroundColor: [
					'rgba(34, 197, 94, 0.8)',
					'rgba(251, 191, 36, 0.8)',
					'rgba(239, 68, 68, 0.8)',
				],
				borderColor: [
					'rgba(34, 197, 94, 1)',
					'rgba(251, 191, 36, 1)',
					'rgba(239, 68, 68, 1)',
				],
				borderWidth: 1,
			},
		],
	};

	// Real skills data from assessments
	const getSkillsDistribution = () => {
		const aptitudeCount = (assessmentResults || []).filter(r => r?.assessment_type === 'aptitude').length;
		const technicalCount = (assessmentResults || []).filter(r => r?.assessment_type === 'technical').length;
		const communicationCount = (assessmentResults || []).filter(r => r?.assessment_type === 'communication').length;
		const personalityCount = (assessmentResults || []).filter(r => r?.assessment_type === 'personality').length;

		const total = aptitudeCount + technicalCount + communicationCount + personalityCount;
		if (total === 0) return [0, 0, 0, 0];

		return [
			Math.round((aptitudeCount / total) * 100),
			Math.round((technicalCount / total) * 100),
			Math.round((communicationCount / total) * 100),
			Math.round((personalityCount / total) * 100)
		];
	};

	const skillsDistributionData = {
		labels: ['Aptitude', 'Technical', 'Communication', 'Personality'],
		datasets: [
			{
				data: getSkillsDistribution(),
				backgroundColor: [
					'rgba(34, 197, 214, 0.8)',
					'rgba(168, 85, 247, 0.8)',
					'rgba(251, 191, 36, 0.8)',
					'rgba(34, 197, 94, 0.8)',
					'rgba(249, 115, 22, 0.8)',
				],
				borderColor: [
					'rgba(34, 197, 214, 1)',
					'rgba(168, 85, 247, 1)',
					'rgba(251, 191, 36, 1)',
					'rgba(34, 197, 94, 1)',
					'rgba(239, 68, 68, 1)',
					'rgba(249, 115, 22, 1)',
				],
				borderWidth: 2,
			},
		],
	};

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				labels: {
					color: 'white',
				},
			},
		},
		scales: {
			x: {
				ticks: {
					color: 'white',
				},
				grid: {
					color: 'rgba(255, 255, 255, 0.1)',
				},
			},
			y: {
				ticks: {
					color: 'white',
				},
				grid: {
					color: 'rgba(255, 255, 255, 0.1)',
				},
			},
		},
	};

	// Custom plugin to display percentages on pie chart
	const doughnutLabelPlugin = {
		id: 'doughnutLabel',
		afterDatasetsDraw(chart, args, pluginOptions) {
			const { ctx, data } = chart;
			ctx.save();

			const dataset = data.datasets[0];
			const total = (dataset?.data || []).reduce((a, b) => (a || 0) + (b || 0), 0);

			chart.getDatasetMeta(0).data.forEach((datapoint, index) => {
				const { x, y } = datapoint.getCenterPoint();
				const percentage = ((dataset.data[index] / total) * 100).toFixed(1);

				// Create text with outline for better visibility
				ctx.font = 'bold 14px Arial';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';

				// Only show percentage if slice is large enough
				if (dataset.data[index] / total > 0.05) { // 5% threshold
					// Draw text outline/shadow for better visibility
					ctx.strokeStyle = 'black';
					ctx.lineWidth = 3;
					ctx.strokeText(`${percentage}%`, x, y);

					// Draw white text on top
					ctx.fillStyle = 'white';
					ctx.fillText(`${percentage}%`, x, y);
				}
			});

			ctx.restore();
		}
	};

	if (loading) return <div className="text-white">Loading progress...</div>;

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-7xl mx-auto space-y-8">
					<div className="mb-8">
						<h2 className="text-3xl font-bold text-white mb-4">
							Your Progress
						</h2>
						<p className="text-gray-300 text-lg">
							Track your improvement across different skills and goals.
						</p>
					</div>

					{/* General Aptitude Test Progression */}
					<div className="bg-gray-800/30 border border-gray-600/50 backdrop-blur-sm rounded-lg p-6">
						<h3 className="text-lg font-semibold text-white mb-4 font-sans">
							General Aptitude Test Progression
						</h3>
						<div className="h-64">
							<Line data={getChartData('aptitude')} options={chartOptions} />
						</div>
					</div>

					{/* Technical Assessment Progression */}
					<div className="bg-[#232323] rounded-lg p-6">
						<h3 className="text-lg font-semibold text-white mb-4 font-sans">
							Technical Assessment Progression
						</h3>
						<div className="h-64">
							<Line data={getChartData('technical')} options={chartOptions} />
						</div>
					</div>

					{/* Personality Assessment Progression */}
					<div className="bg-[#232323] rounded-lg p-6">
						<h3 className="text-lg font-semibold text-white mb-4 font-sans">
							Personality Assessment Progression
						</h3>
						<div className="h-64">
							<Line data={getChartData('personality')} options={chartOptions} />
						</div>
					</div>

					{/* Communication Skill Test Progression */}
					<div className="bg-[#232323] rounded-lg p-6">
						<h3 className="text-lg font-semibold text-white mb-4 font-sans">
							Communication Skill Test Progression
						</h3>
						<div className="h-64">
							<Line data={getChartData('communication')} options={chartOptions} />
						</div>
					</div>

					{/* Difficulty Level Statistics */}
					<div className="bg-[#232323] rounded-lg p-6">
						<h3 className="text-lg font-semibold text-white mb-4 font-sans">
							Problems Solved by Difficulty
						</h3>
						<div className="h-64">
							<Bar data={difficultyData} options={chartOptions} />
						</div>
					</div>

					{/* Skills Distribution Chart */}
					<div className="bg-[#232323] rounded-lg p-6">
						<h3 className="text-lg font-semibold text-white mb-4 font-sans">
							Skills Distribution
						</h3>
						<div className="h-64 flex justify-center">
							<Doughnut
								data={skillsDistributionData}
								plugins={[doughnutLabelPlugin]}
								options={{
									responsive: true,
									maintainAspectRatio: false,
									interaction: {
										intersect: false,
									},
									onHover: (event, activeElements) => {
										event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
									},
									onClick: () => { }, // Disable click functionality
									plugins: {
										legend: {
											position: 'bottom',
											onClick: () => { }, // Disable legend click
											labels: {
												color: 'white',
												padding: 15,
												font: {
													size: 11,
													family: 'Arial',
												},
												usePointStyle: true,
												generateLabels: function (chart) {
													const data = chart.data;
													const dataset = data.datasets[0];
													const total = (dataset?.data || []).reduce((a, b) => (a || 0) + (b || 0), 0);

													return data.labels.map((label, index) => {
														const percentage = ((dataset.data[index] / total) * 100).toFixed(1);
														return {
															text: `${label} (${percentage}%)`,
															fillStyle: dataset.backgroundColor[index],
															strokeStyle: dataset.borderColor[index],
															lineWidth: dataset.borderWidth,
															hidden: false,
															index: index,
															fontColor: 'white' // Explicitly set font color to white
														};
													});
												}
											},
										},
										tooltip: {
											callbacks: {
												label: function (context) {
													const label = context.label || '';
													const value = context.parsed;
													const total = (context.dataset?.data || []).reduce((a, b) => (a || 0) + (b || 0), 0);
													const percentage = ((value / total) * 100).toFixed(1);
													return `${label}: ${value} (${percentage}%)`;
												}
											}
										}
									},
								}}
							/>
						</div>
					</div>

					{/* Skills Progress */}
					{/* <div>
				<h3 className="text-lg font-semibold text-white mb-4 font-sans">
					Skills Development
				</h3>
				<div className="space-y-4">
					{progressData.skills.map((skill, idx) => (
						<motion.div
							key={skill.name}
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
						>
							<div className="flex justify-between items-center mb-2">
								<span className="text-sm font-medium text-gray-300 font-sans">
									{skill.name}
								</span>
								<span className="text-sm font-semibold text-white font-sans">
									{skill.progress}%
								</span>
							</div>
							<div className="w-full bg-[#232323] rounded-full h-2">
								<div
									className="bg-cyan-400 h-2 rounded-full transition-all duration-300"
									style={{ width: `${skill.progress}%` }}
								></div>
							</div>
						</motion.div>
					))}
				</div>
			</div> */}

					{/* Goals Progress */}
					{/* <div>
				<h3 className="text-lg font-semibold text-white mb-4 font-sans">
					Goals Progress
				</h3>
				<div className="space-y-4">
					{progressData.goals.map((goal, idx) => (
						<motion.div
							key={goal.name}
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
							className="bg-[#232323] rounded-lg p-4"
						>
							<div className="flex justify-between items-center mb-2">
								<span className="font-medium text-white font-sans">
									{goal.name}
								</span>
								<span className="text-sm font-semibold text-gray-300 font-sans">
									{goal.completed}/{goal.total}
								</span>
							</div>
							<div className="w-full bg-[#18191b] rounded-full h-2">
								<div
									className="bg-green-400 h-2 rounded-full transition-all duration-300"
									style={{ width: `${(goal.completed / goal.total) * 100}%` }}
								></div>
							</div>
						</motion.div>
					))}
				</div>
			</div> */}

					{/* Achievements */}
					{/* <div>
				<h3 className="text-lg font-semibold text-white mb-4 font-sans">
					Recent Achievements
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{[
						{
							title: "First Practice",
							description: "Completed your first practice session",
							icon: "🎯",
						},
						{
							title: "Skill Master",
							description: "Improved a skill by 20%",
							icon: "🚀",
						},
						{
							title: "Consistent Learner",
							description: "Practiced for 7 days in a row",
							icon: "🔥",
						},
					].map((achievement, index) => (
						<div
							key={index}
							className="bg-[#232323] border border-yellow-900 rounded-lg p-4 text-center"
						>
							<div className="text-3xl mb-2">{achievement.icon}</div>
							<h4 className="font-semibold text-yellow-300 mb-1 font-sans">
								{achievement.title}
							</h4>
							<p className="text-sm text-gray-400 font-sans">
								{achievement.description}
							</p>
						</div>
					))}
				</div>
			</div> */}

					{/* Enhanced Progress Analytics */}
					{userId && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3 }}
						>
							<div className="bg-gray-800/30 border border-gray-600/50 backdrop-blur-sm rounded-lg p-6">
								<h3 className="text-2xl font-bold text-white mb-6">
									📊 Enhanced Analytics & Insights
								</h3>
								<p className="text-gray-300 mb-6">
									Detailed tracking of your assessment performance, job role progress, and skill development over time.
								</p>
								<EnhancedProgressCharts userId={userId} />
							</div>
						</motion.div>
					)}
				</div>
			</div>
		</div>
	);
} 