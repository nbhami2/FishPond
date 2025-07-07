import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    fetchUser()

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null)
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
  }

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">FishPond</Link>
      <Link href="/">Home</Link>
      <Link href="/jobs">Jobs</Link>
      <Link href="/post-job">Post Job</Link>
      <Link href="/dashboard">Dashboard</Link>
      <div className="relative">
        {user ? (
        <div className="relative group">
          <button className="bg-blue-600 px-4 py-2 rounded">Profile ▾</button>

          <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-md z-50
            opacity-0 invisible transform translate-y-2
            group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
            transition-all duration-200 ease-out
            pointer-events-none group-hover:pointer-events-auto"
          >
            <Link
              href="/profile"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              View Profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link href="/login">
            <button className="bg-blue-600 px-4 py-2 rounded">Login</button>
          </Link>
          <Link href="/signup">
            <button className="bg-green-600 px-4 py-2 rounded">Sign Up</button>
          </Link>
        </div>
      )}
      </div>
    </nav>
  )
}


