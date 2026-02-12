
'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLogin = async () => {
        setLoading(true)
        const supabase = createClient()
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (error) {
            console.error(error)
            setError(error.message)
        }
        setLoading(false)
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <div className="w-full max-w-sm rounded-lg border bg-white p-8 shadow-md">
                <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
                    Smart Bookmarks
                </h1>
                <p className="mb-6 text-center text-gray-500">
                    Sign in to manage your bookmarks
                </p>

                {error && (
                    <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )
                }

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {loading ? 'Redirecting...' : 'Sign in with Google'}
                </button>
            </div>
        </div>
    )
}
