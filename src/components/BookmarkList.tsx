
'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

interface Bookmark {
    id: string
    title: string
    url: string
    user_id: string
    created_at: string
}

const supabase = createClient()

export default function BookmarkList({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)

    useEffect(() => {
        setBookmarks(initialBookmarks)
    }, [initialBookmarks])

    useEffect(() => {


        const channel = supabase
            .channel('realtime bookmarks')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'bookmarks' },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        const newBookmark = payload.new as Bookmark
                        setBookmarks((current) => [newBookmark, ...current])
                    } else if (payload.eventType === 'DELETE') {
                        const oldBookmark = payload.old as { id: string }
                        setBookmarks((current) =>
                            current.filter((b) => b.id !== oldBookmark.id)
                        )
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase])

    const handleDelete = async (id: string) => {
        await supabase.from('bookmarks').delete().match({ id })
    }

    if (bookmarks.length === 0) {
        return (
            <div className="glass flex flex-col items-center justify-center rounded-2xl py-20 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-white">No bookmarks yet</h3>
                <p className="mt-2 text-gray-400">Your digital collection starts here.</p>
            </div>
        )
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2">
            {bookmarks.map((bookmark) => (
                <div
                    key={bookmark.id}
                    className="glass group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10"
                >
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                            <span className="text-sm font-bold uppercase">{bookmark.title.charAt(0)}</span>
                        </div>
                        <button
                            onClick={() => handleDelete(bookmark.id)}
                            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-500/10 hover:text-red-500 focus:outline-none"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                    <h3 className="mb-1 text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                        {bookmark.title}
                    </h3>
                    <p className="truncate text-sm text-gray-500 transition-colors group-hover:text-gray-400">
                        {bookmark.url}
                    </p>
                    <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-500 transition-all hover:gap-3"
                    >
                        Visit Website
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </div>
            ))}
        </div>
    )
}
