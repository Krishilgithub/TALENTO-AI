"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
	ShieldCheckIcon, 
	LockClosedIcon,
	ArrowLeftIcon,
	CheckCircleIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function PaymentPage() {
	const [isProcessing, setIsProcessing] = useState(false);
	const [paymentSuccess, setPaymentSuccess] = useState(false);

	useEffect(() => {
		// Load Razorpay script
		const script = document.createElement('script');
		script.src = 'https://checkout.razorpay.com/v1/checkout.js';
		script.async = true;
		document.body.appendChild(script);

		return () => {
			document.body.removeChild(script);
		};
	}, []);

	const handlePayment = async () => {
		setIsProcessing(true);
		
		try {
			// Create order first
			const orderResponse = await fetch('/api/payment/create-order', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					amount: 139900, // Amount in paise (₹1399.00)
					currency: 'INR'
				}),
			});

			const orderData = await orderResponse.json();
			
			if (!orderData.success) {
				throw new Error('Failed to create order');
			}

			// Razorpay configuration
			const options = {
				key: 'rzp_test_R800nyYb6EHdmN', // Your Razorpay Key ID
				amount: orderData.amount,
				currency: orderData.currency,
				name: 'Talento AI',
				description: 'Pro Plan Subscription',
				image: '/logo.svg',
				order_id: orderData.order_id,
				handler: async function (response) {
					// Handle successful payment
					console.log('Payment successful:', response);
					
					try {
						// Verify the payment
						const verifyResponse = await fetch('/api/payment/verify', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								razorpay_order_id: response.razorpay_order_id,
								razorpay_payment_id: response.razorpay_payment_id,
								razorpay_signature: response.razorpay_signature
							}),
						});

						const verifyData = await verifyResponse.json();
						
						if (verifyData.success) {
							setPaymentSuccess(true);
						} else {
							console.error('Payment verification failed:', verifyData.error);
							alert('Payment verification failed. Please contact support.');
						}
					} catch (error) {
						console.error('Verification error:', error);
						alert('Payment verification failed. Please contact support.');
					}
					
					setIsProcessing(false);
				},
				prefill: {
					name: '',
					email: '',
					contact: ''
				},
				notes: {
					address: 'Talento AI Office'
				},
				theme: {
					color: '#0891b2' // Cyan color matching your theme
				},
				modal: {
					ondismiss: function() {
						setIsProcessing(false);
					}
				}
			};

			// Create Razorpay instance and open checkout
			const rzp = new window.Razorpay(options);
			rzp.open();
		} catch (error) {
			console.error('Payment error:', error);
			setIsProcessing(false);
		}
	};

	if (paymentSuccess) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-[#101113] via-[#18191b] to-[#23272f] flex items-center justify-center">
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					className="bg-[#18191b] rounded-2xl p-8 max-w-md w-full mx-4 border border-gray-700 text-center"
				>
					<CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
					<h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
					<p className="text-gray-300 mb-6">
						Your Pro subscription has been activated. Welcome to Talento AI Pro!
					</p>
					<Link
						href="/dashboard"
						className="inline-block px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors"
					>
						Go to Dashboard
					</Link>
				</motion.div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#101113] via-[#18191b] to-[#23272f] py-12 px-4">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center mb-8"
				>
					<Link
						href="/dashboard"
						className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-4"
					>
						<ArrowLeftIcon className="w-4 h-4 mr-2" />
						Back to Dashboard
					</Link>
					<h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
						Complete Your Subscription
					</h1>
					<p className="text-gray-300 text-lg">
						Secure payment powered by Razorpay
					</p>
				</motion.div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Payment Form */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						className="bg-[#18191b] rounded-2xl p-8 border border-gray-700"
					>
						<h2 className="text-2xl font-bold text-white mb-6">Secure Payment</h2>
						
						<div className="text-center space-y-6">
							<div className="bg-cyan-900/20 rounded-xl p-6 border border-cyan-700">
								<h3 className="text-xl font-semibold text-cyan-300 mb-2">Pro Plan Subscription</h3>
								<p className="text-gray-300 mb-4">
									Unlock unlimited access to all features and priority support
								</p>
								<div className="text-3xl font-bold text-cyan-400 mb-4">₹1,399/month</div>
							</div>

							<div className="space-y-4">
								<div className="flex items-center justify-center space-x-2 text-gray-300">
									<ShieldCheckIcon className="w-5 h-5 text-green-400" />
									<span>256-bit SSL encryption</span>
								</div>
								<div className="flex items-center justify-center space-x-2 text-gray-300">
									<LockClosedIcon className="w-5 h-5 text-green-400" />
									<span>PCI DSS compliant</span>
								</div>
							</div>

							<button
								onClick={handlePayment}
								disabled={isProcessing}
								className="w-full py-4 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
							>
								{isProcessing ? (
									<>
										<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
										Processing Payment...
									</>
								) : (
									<>
										<LockClosedIcon className="w-5 h-5 mr-2" />
										Pay ₹1,399 with Razorpay
									</>
								)}
							</button>
							
							<p className="text-xs text-gray-500">
								You will be redirected to Razorpay's secure payment gateway
							</p>
						</div>
					</motion.div>

					{/* Order Summary */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						className="space-y-6"
					>
						<div className="bg-[#18191b] rounded-2xl p-8 border border-gray-700">
							<h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>
							
							<div className="space-y-4">
								<div className="flex justify-between items-center">
									<span className="text-gray-300">Pro Plan</span>
									<span className="text-white font-semibold">₹1,399</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-gray-300">Tax</span>
									<span className="text-white font-semibold">₹0</span>
								</div>
								<hr className="border-gray-600" />
								<div className="flex justify-between items-center text-lg">
									<span className="text-white font-bold">Total</span>
									<span className="text-cyan-400 font-bold">₹1,399</span>
								</div>
							</div>

							<div className="mt-6 p-4 bg-cyan-900 rounded-lg border border-cyan-700">
								<h4 className="text-cyan-300 font-semibold mb-2">What's Included:</h4>
								<ul className="text-gray-300 text-sm space-y-1">
									<li>• Unlimited AI Copilot sessions</li>
									<li>• Advanced resume builder & optimization</li>
									<li>• Coding & system design practice</li>
									<li>• Priority email support</li>
									<li>• Access to premium content</li>
								</ul>
							</div>
						</div>

						<div className="bg-[#18191b] rounded-2xl p-6 border border-gray-700">
							<div className="flex items-center space-x-3 mb-4">
								<ShieldCheckIcon className="w-6 h-6 text-green-400" />
								<h4 className="text-white font-semibold">Razorpay Security</h4>
							</div>
							<p className="text-gray-300 text-sm">
								Your payment is processed securely through Razorpay, a PCI DSS compliant payment gateway trusted by millions of businesses worldwide.
							</p>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
} 