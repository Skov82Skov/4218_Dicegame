"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getTable, leaveTable, keepRoll, hideRoll } from "../../../lib/api"
import { getPlayerIdentity } from "../../../lib/storage"

type Player = {
  id: string
  name: string
  visibleRolls?: number[][]
  hiddenRoll?: number[] | null
  hasFinished?: boolean
}

type Table = {
  id: string
  name: string
  maxPlayers: number
  players: Player[]
  status: string
  currentPlayerIndex?: number
}

type Props = {
  params: {
    tableId: string
  }
}

export default function TablePage({ params }: Props) {
  const router = useRouter()

  const [table, setTable] = useState<Table | null>(null)
  const [me, setMe] = useState<{ id: string; name: string } | null>(null)
  const [dice, setDice] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  function rollDice() {
  const newDice = Array.from({ length: 5 }, () =>
    Math.floor(Math.random() * 6) + 1
  )

  setDice(newDice)
}
async function handleKeep() {
  if (!me || dice.length === 0) return

  try {
    await keepRoll(params.tableId, me.id, dice)
    setDice([])
  } catch (error) {
    console.error("Failed to keep roll", error)
  }
}

async function handleHide() {
  if (!me || dice.length === 0) return

  try {
    await hideRoll(params.tableId, me.id, dice)
    setDice([])
  } catch (error) {
    console.error("Failed to hide roll", error)
  }
}



  async function handleLeave() {
    if (!me) return

    try {
      await leaveTable(params.tableId, me.id)
      router.push("/lobby")
    } catch (error) {
      console.error("Failed to leave table", error)
    }
  }

  useEffect(() => {
    setMe(getPlayerIdentity())
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout

    async function loadTable() {
      try {
        const data = await getTable(params.tableId)
        setTable(data ?? null)
      } catch (error) {
        console.error("Failed to load table", error)
      } finally {
        setLoading(false)
      }
    }

    loadTable()
    interval = setInterval(loadTable, 2000)

    return () => clearInterval(interval)
  }, [params.tableId])

  useEffect(() => {
    if (table?.status === "playing") {
      console.log("GAME STARTED")
    }
  }, [table])

  if (loading) {
    return (
      <main style={{ padding: "2rem" }}>
        <p>Loading table...</p>
      </main>
    )
  }

  if (!table) {
    return (
      <main style={{ padding: "2rem" }}>
        <p>Table not found</p>
        <p>Table ID: {params.tableId}</p>
      </main>
    )
  }

  const isMyTurn =
    me &&
    table.currentPlayerIndex !== undefined &&
    table.players[table.currentPlayerIndex]?.id === me.id

  return (
    <main
      style={{
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>{table.name}</h1>
      <h2>Status: {table.status}</h2>

      <div
        style={{
          width: "500px",
          height: "300px",
          backgroundColor: "#7e2424",
          borderRadius: "50%",
          position: "relative",
          marginTop: "2rem",
          boxShadow: "inset 0 0 20px rgba(0,0,0,0.4)",
        }}
      >
        {table.players.map((player, index) => {
          const angle = (index / table.players.length) * 2 * Math.PI
          const x = 200 + 150 * Math.cos(angle)
          const y = 120 + 100 * Math.sin(angle)

          const isCurrent = index === table.currentPlayerIndex

          return (
            <div
              key={player.id}
              style={{
                position: "absolute",
                left: x,
                top: y,
                transform: "translate(-50%, -50%)",
                background: isCurrent ? "#ffd700" : "#e3cfcf",
                color: "black",
                padding: "0.5rem 1rem",
                borderRadius: "10px",
                fontSize: "14px",
                border: "1px solid #222",
                minWidth: "80px",
                textAlign: "center",
              }}
            >
              {player.name} {isCurrent && "🎯"}
            </div>
          )
        })}
      </div>

      <p style={{ marginTop: "1rem" }}>
        Players: {table.players.length} / {table.maxPlayers}
      </p>

      {table.currentPlayerIndex !== undefined && (
        <p>
          Current player: {table.players[table.currentPlayerIndex]?.name}
        </p>
      )}

      {table.status === "playing" && (
  <div style={{ marginTop: "2rem", textAlign: "center" }}>
    {isMyTurn ? (
      <>
        <button onClick={rollDice}>🎲 Roll</button>

        {dice.length > 0 && (
          <>
            <div style={{ marginTop: "1rem", fontSize: "2rem" }}>
              {dice.map((d, i) => (
                <span key={i} style={{ marginRight: "10px" }}>
                  🎲 {d}
                </span>
              ))}
            </div>

            <div style={{ marginTop: "1rem" }}>
              <button onClick={handleKeep}>✅ KEEP</button>
              <button onClick={handleHide} style={{ marginLeft: "1rem" }}>
                🙈 HIDE
              </button>
            </div>
          </>
        )}
      </>
    ) : (
      <p>⏳ Waiting for other player...</p>
    )}
  </div>
)}

      <div style={{ marginTop: "2rem" }}>
        <button onClick={handleLeave}>🚪 Leave Table</button>
      </div>
    </main>
  )
}
