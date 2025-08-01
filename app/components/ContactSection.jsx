"use client";

import { useState } from 'react';

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

	const handleSubmit = async (e) => {
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
	};

	return (
		<section
			id="contact"
			className="w-full max-w-4xl mx-auto py-16 px-4 text-center reveal"
		>
			<h2 className="text-3xl sm:text-4xl font-bold mb-4">Contact & Support</h2>
			<p className="text-gray-400 mb-8 text-lg max-w-xl mx-auto">
				Have any Questions? Contact us below.
			</p>
			
			{message && (
				<div className={`max-w-xl mx-auto mb-6 p-4 rounded-lg ${
					messageType === 'success' 
						? 'bg-green-900 border border-green-700 text-green-300' 
						: 'bg-red-900 border border-red-700 text-red-300'
				}`}>
					{message}
				</div>
			)}

			<form onSubmit={handleSubmit} className="max-w-xl mx-auto flex flex-col gap-4 bg-[#18191b] p-8 rounded-xl shadow-lg">
				<input
					type="text"
					name="name"
					value={formData.name}
					onChange={handleChange}
					placeholder="Your Name *"
					required
					className="px-4 py-3 rounded bg-[#232425] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
				/>
				<input
					type="email"
					name="email"
					value={formData.email}
					onChange={handleChange}
					placeholder="Your Email *"
					required
					className="px-4 py-3 rounded bg-[#232425] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
				/>
				<textarea
					name="description"
					value={formData.description}
					onChange={handleChange}
					placeholder="How can we help you? *"
					required
					className="px-4 py-3 rounded bg-[#232425] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
					rows={4}
				></textarea>
				<button
					type="submit"
					disabled={isSubmitting}
					className={`px-6 py-3 rounded-full font-bold transition text-lg ${
						isSubmitting
							? 'bg-gray-600 text-gray-300 cursor-not-allowed'
							: 'bg-cyan-400 text-black hover:bg-cyan-300'
					}`}
				>
					{isSubmitting ? 'Sending...' : 'Send Message'}
				</button>
			</form>
		</section>
	);
}
