export default function ContactSection() {
	return (
		<section
			id="contact"
			className="w-full max-w-4xl mx-auto py-16 px-4 text-center reveal"
		>
			<h2 className="text-3xl sm:text-4xl font-bold mb-4">Contact & Support</h2>
			<p className="text-gray-400 mb-8 text-lg max-w-xl mx-auto">
				Have any Questions? Contact us below.
			</p>
			<form className="max-w-xl mx-auto flex flex-col gap-4 bg-[#18191b] p-8 rounded-xl shadow-lg">
				<input
					type="text"
					placeholder="Your Name"
					className="px-4 py-3 rounded bg-[#232425] text-white placeholder-gray-400 focus:outline-none"
				/>
				<input
					type="email"
					placeholder="Your Email"
					className="px-4 py-3 rounded bg-[#232425] text-white placeholder-gray-400 focus:outline-none"
				/>
				<textarea
					placeholder="How can we help you?"
					className="px-4 py-3 rounded bg-[#232425] text-white placeholder-gray-400 focus:outline-none"
					rows={4}
				></textarea>
				<button
					type="submit"
					className="px-6 py-3 rounded-full bg-cyan-400 text-black font-bold hover:bg-cyan-300 transition text-lg"
				>
					Send Message
				</button>
			</form>
		</section>
	);
}
