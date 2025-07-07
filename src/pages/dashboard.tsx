import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Dashboard() {
  const [jobs, setJobs] = useState<any[]>([])
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const loadJobs = async () => {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) return
      setUserId(user.id)

      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('user_id', user.id)

      if (error) console.error(error)
      else setJobs(data)
    }

    loadJobs()
  }, [])

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Job Posts</h1>
      {jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        jobs.map((job) => (
          <div key={job.id} className="border p-4 mb-4 rounded">
            <h2 className="text-lg font-semibold">{job.title}</h2>
            <p className="text-sm text-gray-700">{job.description}</p>
            <p className="text-sm text-gray-500 mt-1">Rate: ${job.rate}/hr – {job.location_type}</p>
          </div>
        ))
      )}
    </div>
  )
}
