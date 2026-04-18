"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getPlayerIdentity, setPlayerIdentity } from "../lib/storage"

function generatePlayerId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export default function NameForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const savedPlayer = getPlayerIdentity()
    if (savedPlayer?.name) {
      setName(savedPlayer.name)
    }
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const trimmedName = name.trim()

    if (!trimmedName) {
      setError("Name is required")
      return
    }

    if (trimmedName.length < 2) {
      setError("Name must be at least 2 characters")
      return
    }

    if (trimmedName.length > 20) {
      setError("Name must be at most 20 characters")
      return
    }

    const savedPlayer = getPlayerIdentity()

    setPlayerIdentity({
      id: savedPlayer?.id ?? generatePlayerId(),
      name: trimmedName,
    })

    router.push("/lobby")
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => {
          setName(e.target.value)
          setError("")
        }}
        style={{
          padding: "0.5rem",
          marginRight: "0.5rem",
          minWidth: "220px",
        }}
      />

      <button type="submit">Continue</button>

      <p style={{ color: "#555", marginTop: "0.5rem" }}>
        Your last used name is filled in, but you can change it before continuing.
      </p>

      {error ? (
        <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>
      ) : null}
    </form>
  )
}
