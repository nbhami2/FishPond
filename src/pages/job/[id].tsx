import { GetServerSideProps } from 'next'
import { supabase } from '../../lib/supabaseClient'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string }
  const { data, error } = await supabase.from('jobs').select('*').eq('id', id).single()
  return { props: { job: data || null, error: error?.message || null } }
}

export default function JobDetail({ job, error }: { job: any, error: string | null }) {
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>
  if (!job) return <div className="p-8">Job not found.</div>

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">{job.title}</h1>
      <p className="mt-2 text-gray-700">{job.description}</p>
      <p className="mt-4 text-sm text-gray-500">Rate: ${job.rate}/hr</p>
      <p className="text-sm text-gray-500">Location: {job.location_type}</p>
    </div>
  )
}
