// src/pages/index.tsx
import Link from 'next/link'

export default function Home() {
  return (
    <div className="p-8 max-w-2xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to FishPond</h1>
      <p className="text-lg text-gray-600 mb-6">
        A smarter way to find freelance and contract work—or hire talent.
      </p>

      <div className="flex justifyz-center gap-4">
        <Link href="/jobs">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Browse Jobs</button>
        </Link>
        <Link href="/post-job">
          <button className="bg-green-600 text-white px-4 py-2 rounded">Post a Job</button>
        </Link>
      </div>

      <p className="text-sm text-gray-500 mt-6">
        Already have an account? <Link className="text-blue-600 underline" href="/login">Login here</Link>
      </p>
    </div>
  )
}
