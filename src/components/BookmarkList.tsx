
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

export default function BookmarkList() {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
    const supabase = createClient()

    useEffect(() => {
        const fetchBookmarks = async () => {
            const { data } = await supabase
                .from('bookmarks')
                .select('*')
                .order('created_at', { ascending: false })
            if (data) setBookmarks(data)
        }

        fetchBookmarks()

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
        return <p className="text-gray-500 text-center py-4">No bookmarks yet. Add one!</p>
    }

    return (
        <ul className="space-y-4">
            {bookmarks.map((bookmark) => (
                <li
                    key={bookmark.id}
                    className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                    <div className="flex flex-col">
                        <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg font-medium text-blue-600 hover:underline"
                        >
                            {bookmark.title}
                        </a>
                        <span className="text-xs text-gray-400">{bookmark.url}</span>
                    </div>
                    <button
                        onClick={() => handleDelete(bookmark.id)}
                        className="ml-4 rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        Delete
                    </button>
                </li>
            ))}
        </ul>
    )
}
