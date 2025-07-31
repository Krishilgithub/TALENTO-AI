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
	// TODO: Replace with Supabase data fetch
	// const { data: progressData } = await supabase.from('user_progress').select('*');
	// const { data: quizScores } = await supabase.from('quiz_scores').select('*');
	// const { data: difficultyStats } = await supabase.from('difficulty_stats').select('*');
	
	const progressData = {
		skills: [
			{ name: "Communication", progress: 85 },
			{ name: "Problem Solving", progress: 78 },
			{ name: "Technical Skills", progress: 92 },
			{ name: "Leadership", progress: 65 },
			{ name: "Teamwork", progress: 88 },
		],
		goals: [
			{ name: "Complete 20 practice sessions", completed: 12, total: 20 },
			{ name: "Improve communication score to 90%", completed: 85, total: 90 },
			{ name: "Master 3 interview types", completed: 2, total: 3 },
		],
	};

	// TODO: Replace with actual quiz score data from Supabase
	const quizScoreData = {
		labels: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4', 'Quiz 5', 'Quiz 6', 'Quiz 7'],
		datasets: [
			{
				label: 'Quiz Scores',
				data: [65, 72, 78, 85, 82, 88, 92],
				borderColor: 'rgb(34, 197, 214)',
				backgroundColor: 'rgba(34, 197, 214, 0.2)',
				tension: 0.1,
			},
		],
	};

	// TODO: Replace with actual difficulty data from Supabase
	const difficultyData = {
		labels: ['Easy', 'Medium', 'Hard'],
		datasets: [
			{
				label: 'Problems Solved',
				data: [45, 28, 12],
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

	// TODO: Replace with actual skills data from Supabase
	const skillsDistributionData = {
		labels: ['Frontend', 'Backend', 'Database', 'DevOps', 'Testing', 'UI/UX'],
		datasets: [
			{
				data: [25, 20, 15, 18, 12, 10], // Random values that add up to 100
				backgroundColor: [
					'rgba(34, 197, 214, 0.8)',
					'rgba(168, 85, 247, 0.8)',
					'rgba(251, 191, 36, 0.8)',
					'rgba(34, 197, 94, 0.8)',
					'rgba(239, 68, 68, 0.8)',
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

	// TODO: Replace with actual time spent data from Supabase
	const timeSpentData = {
		labels: ['Practice Sessions', 'Mock Interviews', 'Skill Building', 'Reading', 'Video Learning'],
		datasets: [
			{
				data: [35, 22, 18, 15, 10], // Random values representing time spent percentage
				backgroundColor: [
					'rgba(99, 102, 241, 0.8)',
					'rgba(236, 72, 153, 0.8)',
					'rgba(34, 197, 94, 0.8)',
					'rgba(251, 191, 36, 0.8)',
					'rgba(239, 68, 68, 0.8)',
				],
				borderColor: [
					'rgba(99, 102, 241, 1)',
					'rgba(236, 72, 153, 1)',
					'rgba(34, 197, 94, 1)',
					'rgba(251, 191, 36, 1)',
					'rgba(239, 68, 68, 1)',
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
			const total = dataset.data.reduce((a, b) => a + b, 0);
			
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

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-xl font-semibold text-white mb-2 font-sans">
					Your Progress
				</h2>
				<p className="text-gray-300 font-sans">
					Track your improvement across different skills and goals.
				</p>
			</div>

			{/* Quiz Score Progression Graph */}
			<div className="bg-[#232323] rounded-lg p-6">
				<h3 className="text-lg font-semibold text-white mb-4 font-sans">
					Quiz Score Progression
				</h3>
				<div className="h-64">
					<Line data={quizScoreData} options={chartOptions} />
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
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
								onClick: () => {}, // Disable click functionality
								plugins: {
									legend: {
										position: 'bottom',
										onClick: () => {}, // Disable legend click
										labels: {
											color: 'white',
											padding: 15,
											font: {
												size: 11,
												family: 'Arial',
											},
											usePointStyle: true,
											generateLabels: function(chart) {
												const data = chart.data;
												const dataset = data.datasets[0];
												const total = dataset.data.reduce((a, b) => a + b, 0);
												
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
											label: function(context) {
												const label = context.label || '';
												const value = context.parsed;
												const total = context.dataset.data.reduce((a, b) => a + b, 0);
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

				<div className="bg-[#232323] rounded-lg p-6">
					<h3 className="text-lg font-semibold text-white mb-4 font-sans">
						Time Spent Distribution
					</h3>
					<div className="h-64 flex justify-center">
						<Doughnut 
							data={timeSpentData} 
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
								onClick: () => {}, // Disable click functionality
								plugins: {
									legend: {
										position: 'bottom',
										onClick: () => {}, // Disable legend click
										labels: {
											color: 'white',
											padding: 15,
											font: {
												size: 11,
												family: 'Arial',
											},
											usePointStyle: true,
											generateLabels: function(chart) {
												const data = chart.data;
												const dataset = data.datasets[0];
												const total = dataset.data.reduce((a, b) => a + b, 0);
												
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
											label: function(context) {
												const label = context.label || '';
												const value = context.parsed;
												const total = context.dataset.data.reduce((a, b) => a + b, 0);
												const percentage = ((value / total) * 100).toFixed(1);
												return `${label}: ${percentage}% of time`;
											}
										}
									}
								},
							}} 
						/>
					</div>
				</div>
			</div>

			{/* Skills Progress */}
			<div>
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
			</div>

			{/* Goals Progress */}
			<div>
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
			</div>

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
		</div>
	);
} 