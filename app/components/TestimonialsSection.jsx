export default function TestimonialsSection() {
	return (
		<section
			id="testimonials"
			className="w-full max-w-4xl mx-auto py-20 px-4 text-center reveal"
		>
			<h2 className="text-3xl sm:text-4xl font-bold mb-8">Testimonials</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
				<div className="bg-[#18191b] rounded-xl shadow p-6 text-left hover:bg-[#232425] transition cursor-pointer">
					<p className="text-lg font-semibold mb-2">
						“Talento AI helped me land my dream job in just 2 months! The
						personalized coaching and instant feedback made all the difference.”
					</p>
					<span className="block text-gray-400 text-sm">
						— Jane Doe, Software Engineer
					</span>
				</div>
				<div className="bg-[#18191b] rounded-xl shadow p-6 text-left hover:bg-[#232425] transition cursor-pointer">
					<p className="text-lg font-semibold mb-2">
						“The real-time coaching and feedback is a game changer. I felt
						confident and prepared for every interview.”
					</p>
					<span className="block text-gray-400 text-sm">
						— John Smith, Product Manager
					</span>
				</div>
			</div>
		</section>
	);
}
