"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { clearPlayerIdentity, getPlayerIdentity } from "../../lib/storage"
import { createTable, getTables, joinTable } from "../../lib/api"

type Player = {
  id: string
  name: string
}

type Table = {
  id: string
  name: string
  maxPlayers: number
  players: Player[]
  status: string
}

export default function LobbyPage() {
  const router = useRouter()
  const [player, setPlayer] = useState<Player | null>(null)
  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(true)
  const [tableName, setTableName] = useState("")
  const [maxPlayers, setMaxPlayers] = useState(2)

  useEffect(() => {
    const savedPlayer = getPlayerIdentity()

    if (!savedPlayer) {
      router.push("/")
      return
    }

    setPlayer(savedPlayer)

    async function loadTables() {
      try {
        const data = await getTables()
        setTables(data)
      } catch (error) {
        console.error("Failed to load tables", error)
      } finally {
        setLoading(false)
      }
    }

    loadTables()
  }, [router])

  async function handleCreateTable() {
    if (!player) return
    if (!tableName.trim()) return

    try {
      const newTable = await createTable({
        name: tableName.trim(),
        maxPlayers,
        player,
      })

      router.push(`/tables/${newTable.id}`)
    } catch (error) {
      console.error("Failed to create table", error)
    }
  }

  async function handleJoinTable(tableId: string) {
    if (!player) return

    try {
      await joinTable(tableId, player)
      router.push(`/tables/${tableId}`)
    } catch (error) {
      console.error("Failed to join table", error)
    }
  }

  function handleChangeName() {
    clearPlayerIdentity()
    router.push("/")
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Lobby</h1>

      {player && <p>Welcome, {player.name}</p>}

      <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
        <h2>Create Table</h2>

        <input
          type="text"
          placeholder="Table name"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          style={{ padding: "0.5rem", marginRight: "1rem" }}
        />

        <select
          value={maxPlayers}
          onChange={(e) => setMaxPlayers(Number(e.target.value))}
          style={{ padding: "0.5rem", marginRight: "1rem" }}
        >
          <option value={2}>2 players</option>
          <option value={3}>3 players</option>
          <option value={4}>4 players</option>
          <option value={5}>5 players</option>
        </select>

        <button onClick={handleCreateTable}>Create Table</button>
      </div>

      <div>
        <h2>Available Tables</h2>

        {loading ? (
          <p>Loading tables...</p>
        ) : tables.length === 0 ? (
          <p>No tables yet</p>
        ) : (
          <ul>
            {tables.map((table) => (
              <li key={table.id} style={{ marginBottom: "1rem" }}>
                <strong>{table.name}</strong> — {table.players.length}/{table.maxPlayers}
                <button
                  style={{ marginLeft: "1rem" }}
                  onClick={() => handleJoinTable(table.id)}
                >
                  Join
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <button onClick={handleChangeName}>Change Name</button>
      </div>
    </main>
  )
}