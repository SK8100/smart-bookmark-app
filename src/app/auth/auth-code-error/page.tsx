
'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function ErrorContent() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <div className="w-full max-w-md rounded-lg border bg-white p-8 shadow-md">
                <h1 className="mb-4 text-center text-xl font-bold text-red-600">
                    Authentication Error
                </h1>
                <p className="mb-6 text-center text-gray-600">
                    {error
                        ? `Error: ${error}`
                        : 'There was a problem signing you in. Please try again.'}
                </p>
                <div className="text-center">
                    <p className="mb-4 text-sm text-gray-500">
                        Common causes:
                        <ul className="list-disc text-left pl-8 mt-2">
                            <li>Google OAuth not enabled in Supabase</li>
                            <li>Redirect URL not added to Supabase Allow list</li>
                            <li>Incorrect Supabase URL or Anon Key</li>
                        </ul>
                    </p>
                    <Link
                        href="/login"
                        className="inline-block rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default function AuthErrorPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
            <ErrorContent />
        </Suspense>
    )
}
