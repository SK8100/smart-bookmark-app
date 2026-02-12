
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AddBookmark from '@/components/AddBookmark'
import BookmarkList from '@/components/BookmarkList'
import SignOutButton from '@/components/SignOutButton'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">My Bookmarks</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">{user.email}</span>
            <SignOutButton />
          </div>
        </div>
        <AddBookmark />
        <BookmarkList />
      </div>
    </div>
  )
}
