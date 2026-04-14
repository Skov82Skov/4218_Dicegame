"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getPlayerIdentity } from "../lib/storage"
import NameForm from "../components/NameForm"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const player = getPlayerIdentity()
    if (player) {
      router.replace("/lobby")
    }
  }, [router])

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>4218</h1>
      <p>Enter your name to continue.</p>
      <NameForm />
    </main>
  )
}