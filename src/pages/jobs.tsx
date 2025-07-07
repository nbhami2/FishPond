// src/pages/jobs.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Link from 'next/link'
import Fuse from 'fuse.js'

const JOBS_PER_PAGE = 30

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [filteredJobs, setFilteredJobs] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const [minRate, setMinRate] = useState<number | null>(null)
  const [maxRate, setMaxRate] = useState<number | null>(null)
  const [locationFilter, setLocationFilter] = useState<string>('all')
  const [skillFilter, setSkillFilter] = useState<string[]>([])



  useEffect(() => {
    const fetchJobs = async () => {
      const from = (page - 1) * JOBS_PER_PAGE
      const to = from + JOBS_PER_PAGE - 1

      const { data: jobsData, count, error } = await supabase
        .from('jobs')
        .select('*', { count: 'exact' })  // Enables counting total rows
        .range(from, to)

      if (error) {
        console.error('Error fetching jobs:', error)
        return
      }

      setJobs(jobsData || [])
      setTotalPages(Math.ceil((count || 1) / JOBS_PER_PAGE)) // reset 1 to 0 if breaks
    }

    fetchJobs()
  }, [page])


  useEffect(() => {

    const filteredByCriteria = jobs.filter((job) => {
      const rateOK =
        (minRate === null || job.rate >= minRate) &&
        (maxRate === null || job.rate <= maxRate)

      const locationOK =
        locationFilter === 'all' || job.location_type === locationFilter

      const skillsOK =
        skillFilter.length === 0 ||
        (job.skills || []).some((skill: string) =>
          skillFilter.includes(skill.toLowerCase())
        )

      return rateOK && locationOK && skillsOK
    })

    if (!searchTerm) {
      setFilteredJobs(filteredByCriteria)
      return
    }

    const fuse = new Fuse(filteredByCriteria, {
      keys: ['title', 'description', 'skills'],
      threshold: 0.3,
    })

    const results = fuse.search(searchTerm)
    const matches = results.map(result => result.item)
    const nonMatches = filteredByCriteria.filter(job => !matches.includes(job))

    setFilteredJobs([...matches, ...nonMatches])
  }, [searchTerm, jobs, minRate, maxRate, locationFilter, skillFilter])

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Available Jobs</h1>

      <div className="mb-6 w-full max-w-md flex items-center gap-2">
        {/* Search input field */}
        <div className="relative flex-grow">
        <input
          type="text"
          placeholder="Search jobs by keyword..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              setSearchTerm(searchInput)
            }
          }}
          className="w-full border border-gray-300 pl-2 pr-10 py-2 rounded"
        />

        <button
          type="button"
          onClick={() => setSearchTerm(searchInput)}
          className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
          title="Search"
        >
          🔍
        </button>
        </div>

        {(searchInput || minRate !== null || maxRate !== null || locationFilter !== 'all' || skillFilter.length > 0) && (

          <button
            type="button"
            onClick={() => {
              setSearchInput('')
              setSearchTerm('')
              setMinRate(null)
              setMaxRate(null)
              setLocationFilter('all')
              setSkillFilter([])
            }}
            className="text-gray-500 hover:text-red-600 px-2 py-1"
            title="Clear search"
          >
            ❌
          </button>
        )}
      </div>


      {/* Filter panel */}
      <div className="mb-6 p-4 border rounded bg-gray-900 w-full max-w-7xl mx-auto">
        <h2 className="font-semibold mb-2">Filters</h2>
        <div className="flex flex-wrap gap-4 items-end">
          {/* Hourly Rate */}
          <div>
            <label className="block text-sm font-medium">Hourly Rate</label>
            <div className="flex gap-2">
              <input
                type="number"
                className="border p-1 rounded w-24"
                placeholder="Min"
                onChange={(e) => setMinRate(e.target.value ? parseFloat(e.target.value) : null)}
              />
              <input
                type="number"
                className="border p-1 rounded w-24"
                placeholder="Max"
                onChange={(e) => setMaxRate(e.target.value ? parseFloat(e.target.value) : null)}
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium">Location</label>
            <select
              className="border p-1 rounded"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="remote">Remote</option>
              <option value="onsite">Onsite</option>
            </select>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium">Skill (contains)</label>
            <input
              type="text"
              className="border p-1 rounded"
              placeholder="e.g., react"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  const skill = e.currentTarget.value.trim().toLowerCase()
                  if (skill && !skillFilter.includes(skill)) {
                    setSkillFilter([...skillFilter, skill])
                  }
                  e.currentTarget.value = ''
                }
              }}
            />
            <div className="flex gap-2 mt-1 flex-wrap">
              {skillFilter.map(skill => (
                <span
                  key={skill}
                  className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-full cursor-pointer"
                  onClick={() => setSkillFilter(skillFilter.filter(s => s !== skill))}
                  title="Click to remove"
                >
                  {skill} ✕
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <Link key={job.id} href={`/job/${job.id}`}>
            <div className="border p-4 rounded hover:bg-gray-50 cursor-pointer shadow-sm">
              <h2 className="text-lg font-semibold">{job.title}</h2>
              <p className="text-sm text-gray-700 truncate">{job.description}</p>
              <p className="text-sm text-gray-500 mt-1">${job.rate}/hr — {job.location_type}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-center gap-4">
        <button
          disabled={page === 1}
          className="bg-gray-300 text-gray-700 px-3 py-1 rounded disabled:opacity-50"
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span className="px-2 py-1">Page {page} of {totalPages}</span>
        <button
          disabled={page === totalPages || totalPages === 0}
          className="bg-gray-300 text-gray-700 px-3 py-1 rounded disabled:opacity-50"
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}
