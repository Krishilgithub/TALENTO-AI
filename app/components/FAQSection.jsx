export default function FAQSection() {
	return (
		<section
			id="faq"
			className="w-full max-w-4xl mx-auto py-20 px-4 text-center reveal"
		>
			<h2 className="text-3xl sm:text-4xl font-bold mb-8">FAQ</h2>
			<div className="space-y-6 text-left">
				<div className="bg-[#18191b] rounded-xl shadow p-6 hover:bg-[#232425] transition cursor-pointer">
					<h3 className="text-lg font-bold mb-2">
						How does the AI Copilot work?
					</h3>
					<p className="text-gray-400 text-sm">
						Our AI Copilot uses advanced language models to simulate real
						interview scenarios and provide instant feedback. Talento AI adapts
						to your needs and helps you improve with every session.
					</p>
				</div>
				<div className="bg-[#18191b] rounded-xl shadow p-6 hover:bg-[#232425] transition cursor-pointer">
					<h3 className="text-lg font-bold mb-2">
						Can I use the platform for free?
					</h3>
					<p className="text-gray-400 text-sm">
						Yes, you can start with a 7-day free trial and upgrade to Pro
						anytime. Talento AI is committed to making career growth accessible
						to everyone.
					</p>
				</div>
				<div className="bg-[#18191b] rounded-xl shadow p-6 hover:bg-[#232425] transition cursor-pointer">
					<h3 className="text-lg font-bold mb-2">Is my data secure?</h3>
					<p className="text-gray-400 text-sm">
						Absolutely. We use industry-standard encryption and never share your
						data with third parties. Your privacy and security are our top
						priorities.
					</p>
				</div>
				<div className="bg-[#18191b] rounded-xl shadow p-6 hover:bg-[#232425] transition cursor-pointer">
					<h3 className="text-lg font-bold mb-2">
						Can I get a demo for my team or company?
					</h3>
					<p className="text-gray-400 text-sm">
						Yes! Our Enterprise plan includes custom demos, onboarding, and team
						management features. Contact us for more details.
					</p>
				</div>
				<div className="bg-[#18191b] rounded-xl shadow p-6 hover:bg-[#232425] transition cursor-pointer">
					<h3 className="text-lg font-bold mb-2">
						What payment methods do you accept?
					</h3>
					<p className="text-gray-400 text-sm">
						We accept all major credit/debit cards, PayPal, and bank transfers
						for Enterprise clients.
					</p>
				</div>
			</div>
		</section>
	);
}
