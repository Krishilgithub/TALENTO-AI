"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminPage() {
	const [admin, setAdmin] = useState(null);
	const [users, setUsers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const userData = localStorage.getItem("user");
		if (!userData) {
			router.push("/login");
			return;
		}
		const userObj = JSON.parse(userData);
		if (userObj.email !== "admin123@gmail.com" || userObj.role !== "admin") {
			router.push("/login");
			return;
		}
		setAdmin(userObj);
		// Load all users from localStorage (simulate DB)
		const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
		setUsers(allUsers);
		setIsLoading(false);
	}, [router]);

	const handleLogout = () => {
		localStorage.removeItem("user");
		router.push("/");
	};

	const handleDeleteUser = (email) => {
		if (window.confirm("Are you sure you want to delete this user?")) {
			const updatedUsers = users.filter((u) => u.email !== email);
			setUsers(updatedUsers);
			localStorage.setItem("users", JSON.stringify(updatedUsers));
		}
	};

	const handleToggleAdmin = (email) => {
		const updatedUsers = users.map((u) =>
			u.email === email
				? { ...u, role: u.role === "admin" ? "user" : "admin" }
				: u
		);
		setUsers(updatedUsers);
		localStorage.setItem("users", JSON.stringify(updatedUsers));
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-[#101113] flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
			</div>
		);
	}

	if (!admin) return null;

	// Platform stats (demo)
	const totalUsers = users.length;
	const totalAdmins = users.filter((u) => u.role === "admin").length;
	const totalRegular = totalUsers - totalAdmins;

	return (
		<div className="min-h-screen bg-[#101113]">
			{/* Header */}
			<header className="bg-[#18191b] shadow-sm border-b border-gray-800">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-4">
						<div className="flex items-center">
							<Link href="/" className="text-2xl font-bold text-white">
								Admin
							</Link>
						</div>
						<div className="flex items-center space-x-4">
							<div className="text-sm text-gray-300">
								Welcome, <span className="font-semibold text-white">{admin.name}</span>
							</div>
							<button
								onClick={handleLogout}
								className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
							>
								Logout
							</button>
						</div>
					</div>
				</div>
			</header>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Dashboard Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
					<p className="text-gray-400">Manage users and view platform statistics.</p>
				</div>

				{/* Platform Stats */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<div className="bg-[#18191b] rounded-lg p-6 border border-cyan-900">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-400">Total Users</p>
								<p className="text-2xl font-bold text-white">{totalUsers}</p>
							</div>
							<div className="text-2xl">👥</div>
						</div>
					</div>
					<div className="bg-[#18191b] rounded-lg p-6 border border-green-900">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-400">Admins</p>
								<p className="text-2xl font-bold text-white">{totalAdmins}</p>
							</div>
							<div className="text-2xl">🛡️</div>
						</div>
					</div>
					<div className="bg-[#18191b] rounded-lg p-6 border border-yellow-900">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-400">Regular Users</p>
								<p className="text-2xl font-bold text-white">{totalRegular}</p>
							</div>
							<div className="text-2xl">🙋‍♂️</div>
						</div>
					</div>
				</div>

				{/* User Management Table */}
				<div className="bg-[#18191b] rounded-xl shadow-sm border border-gray-800 p-6">
					<h2 className="text-xl font-semibold text-white mb-4">User Management</h2>
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-800">
							<thead className="bg-[#232323]">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
								</tr>
							</thead>
							<tbody className="bg-[#18191b] divide-y divide-gray-800">
								{users.length === 0 ? (
									<tr>
										<td colSpan={4} className="text-center py-6 text-gray-500">No users found.</td>
									</tr>
								) : (
									users.map((user, idx) => (
										<tr key={user.email} className={idx % 2 === 0 ? "bg-[#18191b]" : "bg-[#232323]"}>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.name}</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm">
												<span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === "admin" ? "bg-green-900 text-green-300" : "bg-cyan-900 text-cyan-300"}`}>
													{user.role === "admin" ? "Admin" : "User"}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm flex space-x-2">
												<button
													onClick={() => handleToggleAdmin(user.email)}
													className={`px-3 py-1 rounded-lg font-medium transition-colors duration-200 ${user.role === "admin" ? "bg-cyan-900 text-cyan-300 hover:bg-cyan-800" : "bg-green-900 text-green-300 hover:bg-green-800"}`}
													disabled={user.email === "admin123@gmail.com"}
												>
													{user.role === "admin" ? "Demote" : "Promote"}
												</button>
												<button
													onClick={() => handleDeleteUser(user.email)}
													className="px-3 py-1 rounded-lg font-medium bg-red-900 text-red-300 hover:bg-red-800 transition-colors duration-200"
													disabled={user.email === "admin123@gmail.com"}
												>
													Delete
												</button>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
