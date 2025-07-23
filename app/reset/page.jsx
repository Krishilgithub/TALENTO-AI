'use client'
import { sendResetPasswordEmail } from '@/utils/actions'
import { useActionState } from 'react'

const Page = () => {
  const [state, formAction, isPending] = useActionState(
    sendResetPasswordEmail,
    {
      error: '',
      success: '',
    },
  )

  const { error, success } = state

  return (
    <div className="min-h-screen bg-[#101113] flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
          <h2 className="text-lg text-gray-300 mb-4">Enter your email to receive a password reset link</h2>
        </div>
        <div className="bg-[#18191b] rounded-2xl shadow-xl p-8 border border-gray-700">
          <form action={formAction} className="space-y-6">
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 bg-[#101113] text-white placeholder-gray-400 border-gray-600"
              placeholder="Enter your email"
              required
            />
            <button type="submit" className="w-full py-3 px-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-60" disabled={isPending}>
              {isPending ? <span className="loading loading-spinner"></span> : 'Reset Password'}
            </button>
            {error && (
              <div role="alert" className="bg-red-900/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div role="alert" className="bg-cyan-900/20 border border-cyan-500/30 text-cyan-400 px-4 py-3 rounded-lg text-sm">
                <span>{success}</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Page
