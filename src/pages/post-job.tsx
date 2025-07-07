import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function PostJob() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [rate, setRate] = useState('')
  const [locationType, setLocationType] = useState('remote')
  const [skillInput, setSkillInput] = useState('')
  const [skills, setSkills] = useState<string[]>([])

  const router = useRouter()

  const handleAddSkill = () => {
  const raw = skillInput.trim()
  if (!raw) return

  const newSkills = raw
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(s => s && !skills.includes(s))

  setSkills([...skills, ...newSkills])
  setSkillInput('')
}


  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill))
  }

  const handlePost = async () => {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) return alert("You must be logged in to post a job.")

    const { error } = await supabase.from('jobs').insert([{
      user_id: user.id,
      title,
      description,
      rate: parseFloat(rate),
      location_type: locationType,
      skills, // include skills array here
    }])

    if (error) alert(error.message)
    else router.push('/dashboard')
  }

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Post a Job</h1>
      <input className="border p-2 mb-2 w-full" placeholder="Job Title" onChange={e => setTitle(e.target.value)} />
      <textarea className="border p-2 mb-2 w-full" placeholder="Job Description" onChange={e => setDescription(e.target.value)} />
      <input className="border p-2 mb-2 w-full" type="number" placeholder="Hourly Rate" onChange={e => setRate(e.target.value)} />
      <select className="border p-2 mb-2 w-full" value={locationType} onChange={e => setLocationType(e.target.value)}>
        <option value="remote">Remote</option>
        <option value="onsite">Onsite</option>
      </select>

      {/* Skills input */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Skills</label>
        <div className="flex gap-2 mb-2">
          <input
            className="border p-2 flex-grow"
            placeholder="Add skills individiually or separated by comma"
            value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddSkill()
              }
            }}
          />
          <button
            className="bg-blue-600 text-white px-3 py-2 rounded"
            onClick={handleAddSkill}
            type="button"
          >
            Add
          </button>
        </div>

        {/* Skill tags */}
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="bg-gray-500 text-sm px-3 py-1 rounded-full cursor-pointer"
              onClick={() => handleRemoveSkill(skill)}
              title="Click to remove"
            >
              {skill} ✕
            </span>
          ))}
        </div>
      </div>

      <button className="bg-green-600 text-white px-4 py-2 rounded w-full" onClick={handlePost}>Post Job</button>
    </div>
  )
}
