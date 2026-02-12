
'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'

export default function AddBookmark() {
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || !url) return

        setLoading(true)
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (user) {
            await supabase.from('bookmarks').insert({
                title,
                url,
                user_id: user.id,
            })
            setTitle('')
            setUrl('')
        }
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="mb-8 rounded-lg border bg-gray-50 p-4 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">Add New Bookmark</h2>
            <div className="flex flex-col gap-4 sm:flex-row">
                <input
                    type="text"
                    placeholder="Title (e.g., My Favorite Site)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                    type="url"
                    placeholder="URL (e.g., https://example.com)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {loading ? 'Adding...' : 'Add'}
                </button>
            </div>
        </form>
    )
}
