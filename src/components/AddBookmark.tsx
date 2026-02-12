
'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const supabase = createClient()

export default function AddBookmark() {
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

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
            router.refresh()
        }
        setLoading(false)
    }

    return (
        <div className="glass overflow-hidden rounded-2xl p-6 shadow-2xl">
            <h2 className="mb-6 text-xl font-bold text-white">Quick Add</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">Title</label>
                    <input
                        type="text"
                        placeholder="My Favorite Site"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 transition-all focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">URL</label>
                    <input
                        type="url"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                        className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 transition-all focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full transform rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50"
                >
                    {loading ? 'Adding...' : 'Add Bookmark'}
                </button>
            </form>
        </div>
    )
}
