"use client";

import { useState } from 'react';
import { withLoadingCursor } from '../../utils/profileUtils';

export default function ContactSection() {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		description: ''
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [message, setMessage] = useState('');
	const [messageType, setMessageType] = useState(''); // 'success' or 'error'

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = withLoadingCursor(async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setMessage('');

		// Validate required fields
		if (!formData.name || !formData.email || !formData.description) {
			setMessage('Please fill in all required fields.');
			setMessageType('error');
			setIsSubmitting(false);
			return;
		}

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			const result = await response.json();

			if (response.ok) {
				setMessage('Thank you! Your message has been sent successfully. We\'ll get back to you soon.');
				setMessageType('success');
				setFormData({ name: '', email: '', description: '' }); // Reset form
			} else {
				setMessage(result.error || 'Failed to send message. Please try again.');
				setMessageType('error');
			}
		} catch (error) {
			setMessage('Network error. Please check your connection and try again.');
			setMessageType('error');
		} finally {
			setIsSubmitting(false);
		}
	});

	return (
		<section
			id="contact"
			className="w-full bg-gray-50 dark:bg-[#0f0f0f] py-24 px-4"
		>
			<div className="max-w-4xl mx-auto text-center">
				<h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Contact & Support</h2>
				<p className="text-gray-600 dark:text-gray-400 mb-12 text-lg max-w-2xl mx-auto">
					Have any Questions? Contact us below and we'll get back to you as soon as possible.
				</p>

				{message && (
					<div className={`max-w-2xl mx-auto mb-8 p-4 rounded-lg ${messageType === 'success'
						? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-400'
						: 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-400'
						}`}>
						{message}
					</div>
				)}

				<div className="max-w-2xl mx-auto">
					<form onSubmit={handleSubmit} className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 p-8 md:p-12 rounded-2xl shadow-lg">
						<div className="space-y-6">
							<div>
								<input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleChange}
									placeholder="Your Name *"
									required
									className="w-full px-4 py-4 rounded-lg bg-gray-50 dark:bg-[#232425] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
								/>
							</div>
							<div>
								<input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									placeholder="Your Email *"
									required
									className="w-full px-4 py-4 rounded-lg bg-gray-50 dark:bg-[#232425] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
								/>
							</div>
							<div>
								<textarea
									name="description"
									value={formData.description}
									onChange={handleChange}
									placeholder="How can we help you? *"
									required
									className="w-full px-4 py-4 rounded-lg bg-gray-50 dark:bg-[#232425] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 resize-vertical min-h-[120px]"
									rows={5}
								></textarea>
							</div>
							<div>
								<button
									type="submit"
									disabled={isSubmitting}
									className={`w-full px-6 py-4 rounded-lg font-semibold transition-all duration-200 text-lg ${isSubmitting
										? 'bg-gray-300 text-gray-500 cursor-not-allowed'
										: 'bg-cyan-400 text-black hover:bg-cyan-500 transform hover:scale-[1.02] shadow-lg hover:shadow-xl'
										}`}
								>
									{isSubmitting ? 'Sending...' : 'Send Message'}
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</section>
	);
}
