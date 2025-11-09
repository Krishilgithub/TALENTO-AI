import Link from 'next/link';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#0f0f0f] py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/"
                    className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-8 transition-colors duration-200"
                >
                    ← Back to Home
                </Link>

                <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
                    <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>

                    <div className="prose prose-lg max-w-none text-gray-300">
                        <p className="text-xl mb-8 text-gray-400">
                            At TalentoAI, we are committed to protecting your privacy and ensuring the security of your personal information.
                        </p>

                        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Information We Collect</h2>
                        <p className="mb-4">We collect information you provide directly to us, such as:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-400">
                            <li>Personal details (name, email address) when you create an account</li>
                            <li>Assessment responses and career-related information</li>
                            <li>Communication preferences and feedback</li>
                            <li>Technical information about your device and usage patterns</li>
                        </ul>                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">How We Use Your Information</h2>
                        <p className="mb-4">We use the information we collect to:</p>
                        <ul className="list-disc pl-6 mb-6">
                            <li>Provide personalized career assessments and recommendations</li>
                            <li>Improve our AI models and assessment accuracy</li>
                            <li>Communicate with you about your account and our services</li>
                            <li>Ensure the security and integrity of our platform</li>
                            <li>Comply with legal obligations</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Information Sharing</h2>
                        <p className="mb-6">
                            We do not sell, trade, or otherwise transfer your personal information to third parties without your consent,
                            except as described in this policy. We may share information with trusted partners who assist us in
                            operating our platform, conducting our business, or serving our users.
                        </p>

                        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Data Security</h2>
                        <p className="mb-6">
                            We implement appropriate security measures to protect your personal information against unauthorized access,
                            alteration, disclosure, or destruction. Your data is encrypted and stored securely using industry-standard practices.
                        </p>

                        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Your Rights</h2>
                        <p className="mb-4">You have the right to:</p>
                        <ul className="list-disc pl-6 mb-6">
                            <li>Access and update your personal information</li>
                            <li>Request deletion of your account and associated data</li>
                            <li>Opt-out of certain communications</li>
                            <li>Request a copy of your data</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Cookies and Tracking</h2>
                        <p className="mb-6">
                            We use cookies and similar tracking technologies to enhance your experience on our platform.
                            You can control cookie settings through your browser preferences.
                        </p>

                        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Changes to This Policy</h2>
                        <p className="mb-6">
                            We may update this privacy policy from time to time. We will notify you of any changes by posting
                            the new policy on this page and updating the "Last Updated" date.
                        </p>

                        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Contact Us</h2>
                        <p className="mb-4">
                            If you have any questions about this Privacy Policy or our data practices, please contact us:
                        </p>
                        <div className="bg-[#232425] border border-gray-700 p-6 rounded-lg">
                            <p className="mb-2 text-gray-300"><strong className="text-white">Email:</strong> privacy@talentoai.com</p>
                            <p className="mb-2 text-gray-300"><strong className="text-white">Address:</strong> TalentoAI Privacy Team</p>
                            <p className="text-gray-300"><strong className="text-white">Last Updated:</strong> <span suppressHydrationWarning>{new Date().toLocaleDateString()}</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}