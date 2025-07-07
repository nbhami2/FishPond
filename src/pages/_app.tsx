// src/pages/_app.tsx
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Navbar from '../components/Navbar'  // ✅ adjust this path if needed

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  )
}
