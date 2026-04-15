"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getTable, leaveTable, keepDie, hideRoll, rollTurnDice } from "../../../lib/api"
import { getPlayerIdentity } from "../../../lib/storage"

type Player = {
  id: string
  name: string
  keptDice?: number[]
  remainingDice?: number[]
  score?: number
  lives?: number
  isEliminated?: boolean
  hiddenDice?: number[] | null
  hasFinished?: boolean
}

type Table = {
  id: string
  name: string
  maxPlayers: number
  players: Player[]
  status: string
  currentPlayerIndex?: number
  round?: number
  winnerId?: string
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
  const [loading, setLoading] = useState(true)

  async function handleRoll() {
    if (!me) return

    try {
      const updatedTable = await rollTurnDice(params.tableId, me.id)
      setTable(updatedTable)
    } catch (error) {
      console.error("Failed to roll dice", error)
    }
  }

  async function handleKeep(dieIndex: number) {
    if (!me) return

    try {
      const updatedTable = await keepDie(params.tableId, me.id, dieIndex)
      setTable(updatedTable)
    } catch (error) {
      console.error("Failed to keep die", error)
    }
  }

  async function handleHide() {
    if (!me) return

    try {
      const updatedTable = await hideRoll(params.tableId, me.id)
      setTable(updatedTable)
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
  const activePlayer = isMyTurn
    ? table.players.find((player) => player.id === me?.id)
    : null
  const rolledDice = activePlayer?.remainingDice ?? []
  const keptDiceCount = activePlayer?.keptDice?.length ?? 0
  const canRoll =
    Boolean(isMyTurn) &&
    !activePlayer?.hasFinished &&
    (rolledDice.length === 0 || keptDiceCount > 0)

  const canHide = isMyTurn && rolledDice.length > 0
  const winner = table.winnerId
    ? table.players.find((player) => player.id === table.winnerId)
    : null
  const amIEliminated = Boolean(
    me && table.players.find((player) => player.id === me.id)?.isEliminated
  )

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
              <div style={{ marginTop: "0.35rem", fontSize: "12px" }}>
                Kept: {(player.keptDice ?? []).join(", ") || "-"}
              </div>
              <div style={{ marginTop: "0.25rem", fontSize: "12px" }}>
                Score: {player.score ?? 0}
              </div>
              <div style={{ marginTop: "0.25rem", fontSize: "12px" }}>
                Lives: {player.lives ?? 0} {player.isEliminated ? "💀" : "❤️"}
              </div>
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

      {table.status === "finished" && (
        <p style={{ marginTop: "1rem", fontWeight: "bold" }}>
          🏆 Winner: {winner?.name ?? "Unknown player"}
        </p>
      )}

      {amIEliminated && table.status !== "finished" && (
        <p style={{ marginTop: "1rem" }}>
          You are eliminated and now spectating. You can wait or leave the table.
        </p>
      )}

      {table.status === "playing" && (
  <div style={{ marginTop: "2rem", textAlign: "center" }}>
    {isMyTurn && !amIEliminated ? (
      <>
        <button onClick={handleRoll} disabled={!canRoll}>
          🎲 Roll available dice
        </button>

        {rolledDice.length > 0 && (
          <>
            <div style={{ marginTop: "1rem", fontSize: "2rem" }}>
              {rolledDice.map((d, i) => (
                <button
                  key={`${i}-${d}`}
                  onClick={() => handleKeep(i)}
                  style={{
                    marginRight: "10px",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    borderRadius: "8px",
                    border: "1px solid #333",
                    padding: "0.35rem 0.5rem",
                  }}
                >
                  🎲 {d}
                </button>
              ))}
            </div>

            <p style={{ marginTop: "0.75rem", fontSize: "14px" }}>
              Click dice to keep them. Kept dice are visible to everyone.
            </p>

            <div style={{ marginTop: "0.5rem" }}>
              <button onClick={handleHide} disabled={!canHide} style={{ marginLeft: "1rem" }}>
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
