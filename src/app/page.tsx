
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

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-12 flex items-center justify-between border-b border-white/10 pb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Smart<span className="text-blue-500">Bookmarks</span>
            </h1>
            <p className="mt-2 text-gray-400">Manage your digital universe in one place.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Personal Account</p>
              <p className="text-sm font-medium text-gray-300">{user.email}</p>
            </div>
            <SignOutButton />
          </div>
        </header>

        <main className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <aside>
            <div className="sticky top-8">
              <AddBookmark />
            </div>
          </aside>
          <section>
            <BookmarkList initialBookmarks={bookmarks || []} />
          </section>
        </main>
      </div>
    </div>
  )
}
