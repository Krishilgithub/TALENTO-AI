import Image from "next/image";

export default function TestimonialsSection() {
	return (
		<section
			id="testimonials"
			className="w-full max-w-4xl mx-auto py-20 px-4 text-center reveal"
		>
			<h2 className="text-3xl sm:text-4xl font-bold mb-8">Testimonials</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
				<div className="bg-[#18191b] rounded-xl shadow p-6 text-left hover:bg-[#232425] transition cursor-pointer flex items-center justify-between">
					<div className="flex-1">
						<p className="text-lg font-semibold mb-2">
							“Talento AI helped me land my dream job in just 2 months! The
							personalized coaching and instant feedback made all the difference.”
						</p>
						<span className="block text-gray-400 text-sm">
							— Priya Patel, Data Analyst
						</span>
					</div>
					<Image src="/avatar1.jpg" alt="Jane Doe" width={56} height={56} className="rounded-full ml-4" />
				</div>
				<div className="bg-[#18191b] rounded-xl shadow p-6 text-left hover:bg-[#232425] transition cursor-pointer flex items-center justify-between">
					<div className="flex-1">
						<p className="text-lg font-semibold mb-2">
							“The real-time coaching and feedback is a game changer. I felt
							confident and prepared for every interview.”
						</p>
						<span className="block text-gray-400 text-sm">
							— Leena Rodrigues, Product Manager
						</span>
					</div>
					<Image src="/avatar2.jpg" alt="John Smith" width={56} height={56} className="rounded-full ml-4" />
				</div>
				<div className="bg-[#18191b] rounded-xl shadow p-6 text-left hover:bg-[#232425] transition cursor-pointer flex items-center justify-between">
					<div className="flex-1">
						<p className="text-lg font-semibold mb-2">
							“I loved the resume builder and mock assessments. It made my job search so much easier and less stressful!”
						</p>
						<span className="block text-gray-400 text-sm">
							— Jane Doe, Software Engineer
						</span>
					</div>
					<Image src="/avatar3.jpg" alt="Priya Patel" width={56} height={56} className="rounded-full ml-4" />
				</div>
				<div className="bg-[#18191b] rounded-xl shadow p-6 text-left hover:bg-[#232425] transition cursor-pointer flex items-center justify-between">
					<div className="flex-1">
						<p className="text-lg font-semibold mb-2">
							“The technical question prep was spot on. I felt ready for every round, thanks to Talento AI!”
						</p>
						<span className="block text-gray-400 text-sm">
							— Alex Lee, Frontend Developer
						</span>
					</div>
					<Image src="/avatar4.jpg" alt="Alex Lee" width={56} height={56} className="rounded-full ml-4" />
				</div>
			</div>
		</section>
	);
}
