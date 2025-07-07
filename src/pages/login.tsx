import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMessage(error.message)
    else router.push('/dashboard')
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <input className="border p-2 mb-2 w-full" type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input className="border p-2 mb-2 w-full" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" onClick={handleLogin}>Login</button>
      {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
    </div>
  )
}
