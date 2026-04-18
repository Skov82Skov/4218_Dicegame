"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  getTable,
  leaveTable,
  keepDie,
  hideRoll,
  rollTurnDice,
  playAgain,
  setReady,
} from "../../../lib/api"
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
  isHost?: boolean
  isReady?: boolean
}

type RoundHistoryEntry = {
  round: number
  loserName: string
  lifePenalty: number
  hadTieBreak: boolean
  scores: {
    playerId: string
    name: string
    score: number
    isLoser: boolean
    isWinner: boolean
  }[]
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
  turnExpiresAt?: number
  roundHistory?: RoundHistoryEntry[]
}

type Props = {
  params: {
    tableId: string
  }
}

const TOTAL_DICE = 5

const pipPositions: Record<number, Array<{ row: number; column: number }>> = {
  1: [{ row: 2, column: 2 }],
  2: [
    { row: 1, column: 1 },
    { row: 3, column: 3 },
  ],
  3: [
    { row: 1, column: 1 },
    { row: 2, column: 2 },
    { row: 3, column: 3 },
  ],
  4: [
    { row: 1, column: 1 },
    { row: 1, column: 3 },
    { row: 3, column: 1 },
    { row: 3, column: 3 },
  ],
  5: [
    { row: 1, column: 1 },
    { row: 1, column: 3 },
    { row: 2, column: 2 },
    { row: 3, column: 1 },
    { row: 3, column: 3 },
  ],
  6: [
    { row: 1, column: 1 },
    { row: 2, column: 1 },
    { row: 3, column: 1 },
    { row: 1, column: 3 },
    { row: 2, column: 3 },
    { row: 3, column: 3 },
  ],
}

function DieFace({
  value,
  size = 52,
  tone = "light",
}: {
  value: number
  size?: number
  tone?: "light" | "dark"
}) {
  const background = tone === "dark" ? "#f4d35e" : "#ffffff"
  const pipColor = tone === "dark" ? "#7e2424" : "#111111"
  const borderColor = tone === "dark" ? "#8b6b0f" : "#d1d5db"
  const pipSize = Math.max(5, Math.round(size * 0.12))

  return (
    <div
      aria-label={`Die showing ${value}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${Math.round(size * 0.18)}px`,
        background,
        border: `2px solid ${borderColor}`,
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "repeat(3, 1fr)",
        padding: `${Math.round(size * 0.12)}px`,
        boxShadow: "0 6px 14px rgba(0,0,0,0.18)",
      }}
    >
      {Array.from({ length: 9 }, (_, index) => {
        const row = Math.floor(index / 3) + 1
        const column = (index % 3) + 1
        const hasPip = (pipPositions[value] ?? []).some(
          (pip) => pip.row === row && pip.column === column
        )

        return (
          <div
            key={`${row}-${column}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                width: `${pipSize}px`,
                height: `${pipSize}px`,
                borderRadius: "999px",
                background: hasPip ? pipColor : "transparent",
                display: "block",
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

function AnimatedDieFace({
  value,
  size = 52,
  tone = "light",
  rolling = false,
  delayMs = 0,
}: {
  value: number
  size?: number
  tone?: "light" | "dark"
  rolling?: boolean
  delayMs?: number
}) {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    if (!rolling) {
      setDisplayValue(value)
      return
    }

    let tickCount = 0
    let intervalId: number | undefined
    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        tickCount += 1
        if (tickCount >= 8) {
          if (intervalId) {
            window.clearInterval(intervalId)
          }
          setDisplayValue(value)
          return
        }

        setDisplayValue(Math.floor(Math.random() * 6) + 1)
      }, 80)
    }, delayMs)

    return () => {
      window.clearTimeout(timeoutId)
      if (intervalId) {
        window.clearInterval(intervalId)
      }
    }
  }, [delayMs, rolling, value])

  return <DieFace value={displayValue} size={size} tone={tone} />
}

function getSeatPosition(index: number, totalPlayers: number) {
  const angle = (-Math.PI / 2) + (index / totalPlayers) * 2 * Math.PI
  const x = 50 + 41 * Math.cos(angle)
  const y = 50 + 34 * Math.sin(angle)

  return { left: `${x}%`, top: `${y}%` }
}

export default function TablePage({ params }: Props) {
  const router = useRouter()

  const [table, setTable] = useState<Table | null>(null)
  const [me, setMe] = useState<{ id: string; name: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [now, setNow] = useState(Date.now())
  const [rollingDiceKeys, setRollingDiceKeys] = useState<string[]>([])
  const [newKeptDiceKeys, setNewKeptDiceKeys] = useState<string[]>([])
  const [pendingKeepIndex, setPendingKeepIndex] = useState<number | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const wasMyTurnRef = useRef(false)
  const previousTableRef = useRef<Table | null>(null)

  function setFavicon(iconHref: string) {
    if (typeof document === "undefined") {
      return
    }

    let link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null
    if (!link) {
      link = document.createElement("link")
      link.rel = "icon"
      document.head.appendChild(link)
    }

    link.href = iconHref
  }

  function createSvgIcon(background: string, text: string) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${background}"/><text x="32" y="42" font-size="34" text-anchor="middle" fill="#ffffff">${text}</text></svg>`
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
  }

  function playTurnSound() {
    if (typeof window === "undefined") {
      return
    }

    const AudioCtor = window.AudioContext || (window as typeof window & {
      webkitAudioContext?: typeof AudioContext
    }).webkitAudioContext

    if (!AudioCtor) {
      return
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioCtor()
    }

    const audioContext = audioContextRef.current
    if (audioContext.state !== "running") {
      return
    }

    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()
    oscillator.type = "sine"
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(660, audioContext.currentTime + 0.22)
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.12, audioContext.currentTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.25)
    oscillator.connect(gain)
    gain.connect(audioContext.destination)
    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.26)
  }

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
      setPendingKeepIndex(dieIndex)
      await new Promise((resolve) => window.setTimeout(resolve, 160))
      const updatedTable = await keepDie(params.tableId, me.id, dieIndex)
      setTable(updatedTable)
    } catch (error) {
      console.error("Failed to keep die", error)
    } finally {
      setPendingKeepIndex(null)
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

  async function handleToggleReady() {
    if (!me || !table || table.status !== "waiting") return
    const meAtTable = table.players.find((player) => player.id === me.id)
    const currentReady = Boolean(meAtTable?.isReady)

    try {
      const updatedTable = await setReady(params.tableId, me.id, !currentReady)
      setTable(updatedTable)
    } catch (error) {
      console.error("Failed to update ready status", error)
    }
  }

  async function handlePlayAgain() {
    if (!me) return

    try {
      const updatedTable = await playAgain(params.tableId, me.id)
      setTable(updatedTable)
    } catch (error) {
      console.error("Failed to start new game", error)
    }
  }

  useEffect(() => {
    setMe(getPlayerIdentity())
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const AudioCtor = window.AudioContext || (window as typeof window & {
      webkitAudioContext?: typeof AudioContext
    }).webkitAudioContext

    if (!AudioCtor) {
      return
    }

    const unlockAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtor()
      }

      if (audioContextRef.current.state !== "running") {
        void audioContextRef.current.resume()
      }
    }

    window.addEventListener("pointerdown", unlockAudio)
    window.addEventListener("keydown", unlockAudio)

    return () => {
      window.removeEventListener("pointerdown", unlockAudio)
      window.removeEventListener("keydown", unlockAudio)
    }
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
    const ticker = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(ticker)
  }, [])

  useEffect(() => {
    if (!table) {
      previousTableRef.current = table
      return
    }

    const previousTable = previousTableRef.current
    if (!previousTable) {
      previousTableRef.current = table
      return
    }

    const nextRollingKeys: string[] = []
    const nextKeptKeys: string[] = []

    for (const player of table.players) {
      const previousPlayer = previousTable.players.find((item) => item.id === player.id)
      const previousRemaining = previousPlayer?.remainingDice ?? []
      const currentRemaining = player.remainingDice ?? []
      if (
        currentRemaining.length > 0 &&
        currentRemaining.join("-") !== previousRemaining.join("-")
      ) {
        currentRemaining.forEach((_, index) => {
          nextRollingKeys.push(`${player.id}-rolled-${index}`)
        })
      }

      const previousKept = previousPlayer?.keptDice ?? []
      const currentKept = player.keptDice ?? []
      if (currentKept.length > previousKept.length) {
        for (let index = previousKept.length; index < currentKept.length; index += 1) {
          nextKeptKeys.push(`${player.id}-kept-${index}`)
        }
      }
    }

    if (nextRollingKeys.length > 0) {
      setRollingDiceKeys(nextRollingKeys)
      window.setTimeout(() => setRollingDiceKeys([]), 950)
    }

    if (nextKeptKeys.length > 0) {
      setNewKeptDiceKeys(nextKeptKeys)
      window.setTimeout(() => setNewKeptDiceKeys([]), 750)
    }

    previousTableRef.current = table
  }, [table])

  useEffect(() => {
    if (!table) {
      return
    }

    const defaultTitle = `${table.name} | 4218`

    if (!me || table.status !== "playing") {
      document.title = defaultTitle
      return
    }

    const myTurn =
      table.currentPlayerIndex !== undefined &&
      table.players[table.currentPlayerIndex]?.id === me.id

    if (!myTurn) {
      document.title = defaultTitle
      setFavicon(createSvgIcon("#7e2424", "🎲"))
      return
    }

    let showAlertTitle = true
    let showAlertIcon = true
    document.title = `🔴 Your turn | ${table.name}`
    setFavicon(createSvgIcon("#c62828", "!"))

    const titleInterval = window.setInterval(() => {
      document.title = showAlertTitle
        ? `🔴 Your turn | ${table.name}`
        : `⚪ ${table.name} | 4218`
      setFavicon(showAlertIcon ? createSvgIcon("#c62828", "!") : createSvgIcon("#7e2424", "🎲"))
      showAlertTitle = !showAlertTitle
      showAlertIcon = !showAlertIcon
    }, 1000)

    return () => {
      window.clearInterval(titleInterval)
      document.title = defaultTitle
      setFavicon(createSvgIcon("#7e2424", "🎲"))
    }
  }, [me, table])

  useEffect(() => {
    const myTurn =
      Boolean(me) &&
      table?.currentPlayerIndex !== undefined &&
      table.players[table.currentPlayerIndex]?.id === me?.id

    if (!myTurn || !table || typeof window === "undefined" || !("Notification" in window)) {
      return
    }

    if (Notification.permission === "granted") {
      const notification = new Notification("Det er din tur", {
        body: `Bord: ${table.name}`,
        tag: `turn-${table.id}`,
      })

      window.setTimeout(() => notification.close(), 4000)
      return
    }

    if (Notification.permission === "default") {
      void Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          const notification = new Notification("Det er din tur", {
            body: `Bord: ${table.name}`,
            tag: `turn-${table.id}`,
          })

          window.setTimeout(() => notification.close(), 4000)
        }
      })
    }
  }, [me, table])

  useEffect(() => {
    const myTurn =
      Boolean(me) &&
      table?.status === "playing" &&
      table.currentPlayerIndex !== undefined &&
      table.players[table.currentPlayerIndex]?.id === me?.id

    if (myTurn && !wasMyTurnRef.current) {
      playTurnSound()
    }

    wasMyTurnRef.current = myTurn
  }, [me, table])

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
    Boolean(me) &&
    table.currentPlayerIndex !== undefined &&
    table.players[table.currentPlayerIndex]?.id === me?.id
  const activePlayer = isMyTurn
    ? table.players.find((player) => player.id === me?.id)
    : null
  const keptDice = activePlayer?.keptDice ?? []
  const keptDiceCount = activePlayer?.keptDice?.length ?? 0
  const diceLeftToResolve = TOTAL_DICE - keptDiceCount
  const canRoll =
    Boolean(isMyTurn) &&
    !activePlayer?.hasFinished &&
    ((activePlayer?.remainingDice?.length ?? 0) === 0 || keptDiceCount > 0)
  const canHide =
    Boolean(isMyTurn) &&
    !activePlayer?.hasFinished &&
    ((activePlayer?.remainingDice?.length ?? 0) === 0 || keptDiceCount > 0)
  const winner = table.winnerId
    ? table.players.find((player) => player.id === table.winnerId)
    : null
  const amIEliminated = Boolean(
    me && table.players.find((player) => player.id === me.id)?.isEliminated
  )
  const countdownSeconds =
    typeof table.turnExpiresAt === "number"
      ? Math.max(0, Math.ceil((table.turnExpiresAt - now) / 1000))
      : null
  const meAtTable = me ? table.players.find((player) => player.id === me.id) : null
  const roundHistory = Array.isArray(table.roundHistory) ? [...table.roundHistory].reverse() : []
  const activePlayersCount = table.players.filter((player) => !player.isEliminated).length
  const currentTurnPlayer =
    table.currentPlayerIndex !== undefined ? table.players[table.currentPlayerIndex] : null
  const visibleTableDice =
    isMyTurn && currentTurnPlayer?.id === me?.id
      ? currentTurnPlayer?.remainingDice ?? []
      : []

  return (
    <main className="table-room">
      <div className="table-layout">
        <aside className="history-prompt">
          <div className="history-prompt__label">Round History</div>
          {roundHistory.length > 0 ? (
            roundHistory.map((entry) => (
              <div className="history-prompt__line" key={`round-history-${entry.round}`}>
                Round {entry.round}:{" "}
                {entry.scores.map((scoreEntry, index) => (
                  <span key={`${entry.round}-${scoreEntry.playerId}`}>
                    <span
                      style={{
                        color: scoreEntry.isLoser
                          ? "#ef4444"
                          : scoreEntry.isWinner
                            ? "#22c55e"
                            : "#e2e8f0",
                      }}
                    >
                      {scoreEntry.name}
                    </span>{" "}
                    {scoreEntry.score}
                    {index < entry.scores.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            ))
          ) : (
            <div className="history-prompt__line">No rounds played yet.</div>
          )}
        </aside>

        <section className="table-stage">
          <div className="table-heading">
            <h1>{table.name}</h1>
            <p>
              {table.status === "playing"
                ? `Round ${table.round ?? 1} in progress`
                : `Status: ${table.status}`}
            </p>
          </div>

          <div className="game-board">
            <div className="game-board__felt">
              <div className="game-board__inner-ring" />

              {table.players.map((player, index) => {
                const isCurrent = index === table.currentPlayerIndex
                const seatPosition = getSeatPosition(index, table.players.length)

                return (
                  <div
                    key={player.id}
                    className={`seat-card${isCurrent ? " seat-card--current" : ""}`}
                    style={seatPosition}
                  >
                    <div className="seat-card__name">{player.name}</div>
                    <div className="seat-card__meta">
                      <div>Score {player.score ?? 0}</div>
                      <div>Lives {player.lives ?? 0} {player.isEliminated ? "💀" : "❤️"}</div>
                      <div
                        style={{
                          display: "flex",
                          gap: "4px",
                          flexWrap: "wrap",
                          minHeight: "20px",
                          marginTop: "2px",
                        }}
                      >
                        {(player.keptDice ?? []).length > 0 ? (
                          (player.keptDice ?? []).map((die, dieIndex) => (
                            <div
                              className={
                                newKeptDiceKeys.includes(`${player.id}-kept-${dieIndex}`)
                                  ? "kept-die--new"
                                  : undefined
                              }
                              key={`${player.id}-kept-${dieIndex}`}
                            >
                              <DieFace
                                value={die}
                                size={10}
                                tone={isCurrent ? "dark" : "light"}
                              />
                            </div>
                          ))
                        ) : (
                          <span>-</span>
                        )}
                      </div>
                    </div>

                    {isCurrent && table.status === "playing" ? (
                      <div className="seat-card__badge seat-card__badge--turn">
                        {countdownSeconds ?? 0}s
                      </div>
                    ) : player.isHost ? (
                      <div className="seat-card__badge seat-card__badge--host">Host</div>
                    ) : table.status === "waiting" ? (
                      <div
                        className={`seat-card__badge ${
                          player.isReady ? "seat-card__badge--ready" : "seat-card__badge--waiting"
                        }`}
                      >
                        {player.isReady ? "Ready" : "Waiting"}
                      </div>
                    ) : null}
                  </div>
                )
              })}

              <div className="felt-center">
                <div className="felt-center__pot">{table.players.length} Players</div>
                <div className="felt-center__round">
                  {table.status === "playing"
                    ? `${activePlayersCount} still in the round`
                    : `Current player: ${table.currentPlayerIndex !== undefined
                      ? table.players[table.currentPlayerIndex]?.name
                      : "None"}`}
                </div>
                {table.status === "playing" ? (
                  <>
                    <div className="felt-center__dice-label">
                      {currentTurnPlayer?.id === me?.id
                        ? "Your dice on the felt"
                        : currentTurnPlayer
                          ? `${currentTurnPlayer.name} is rolling in secret`
                          : "Dice in play"}
                    </div>
                    <div className="felt-center__dice">
                      {visibleTableDice.length > 0 ? (
                        visibleTableDice.map((die, index) => {
                          const animationKey = `${currentTurnPlayer?.id ?? "table"}-rolled-${index}`
                          return (
                            <button
                              className={`felt-die felt-die-button${
                                rollingDiceKeys.includes(animationKey) ? " felt-die--rolling" : ""
                              }${
                                pendingKeepIndex === index ? " felt-die-button--selected" : ""
                              }`}
                              key={animationKey}
                              onClick={() => handleKeep(index)}
                              disabled={pendingKeepIndex !== null}
                            >
                              <AnimatedDieFace
                                value={die}
                                size={28}
                                rolling={rollingDiceKeys.includes(animationKey)}
                                delayMs={index * 65}
                              />
                            </button>
                          )
                        })
                      ) : currentTurnPlayer?.id !== me?.id && table.status === "playing" ? (
                        <span className="action-panel__muted">
                          Other players only see dice that have been kept.
                        </span>
                      ) : (
                        <span className="action-panel__muted">No dice on the felt right now.</span>
                      )}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>

          {table.status === "finished" && (
            <div className="action-panel">
              <div className="action-panel__top">
                <div>
                  <div className="action-panel__title">Winner</div>
                  <div className="action-panel__muted">
                    {winner?.name ?? "Unknown player"} took the table.
                  </div>
                </div>
                {meAtTable?.isHost ? (
                  <button className="action-button action-button--primary" onClick={handlePlayAgain}>
                    Play Again
                  </button>
                ) : (
                  <div className="action-panel__muted">Only the host can start a new game.</div>
                )}
              </div>
            </div>
          )}

          {table.status === "waiting" && meAtTable && (
            <div className="action-panel">
              <div className="action-panel__top">
                <div>
                  <div className="action-panel__title">Table Lobby</div>
                  <div className="action-panel__muted">
                    Game starts automatically when the table is full and everyone is ready.
                  </div>
                </div>
                <button className="action-button action-button--primary" onClick={handleToggleReady}>
                  {meAtTable.isReady ? "Unready" : "Ready Up"}
                </button>
              </div>
            </div>
          )}

          {table.status === "playing" && (
            <div className="action-panel">
              {isMyTurn && !amIEliminated ? (
                <>
                  <div className="action-panel__top">
                    <div>
                      <div className="action-panel__title">Your Turn</div>
                      <div className="action-panel__muted">
                        {diceLeftToResolve} dice left to resolve this turn.
                      </div>
                    </div>

                    <div className="action-panel__controls">
                      <button
                        className="action-button action-button--primary"
                        onClick={handleRoll}
                        disabled={!canRoll || pendingKeepIndex !== null}
                      >
                        Roll Dice
                      </button>
                      <button
                        className="action-button action-button--secondary"
                        onClick={handleHide}
                        disabled={!canHide || pendingKeepIndex !== null}
                      >
                        Roll And Hide
                      </button>
                    </div>
                  </div>

                  <div className="action-panel__kept">
                    <div className="action-panel__tray">
                      <div className="action-panel__tray-label">Kept Dice</div>
                      <div className="action-panel__tray-dice">
                        {keptDice.length > 0 ? (
                          keptDice.map((die, index) => (
                            <div
                              className={
                                newKeptDiceKeys.includes(`${me?.id ?? "me"}-kept-${index}`)
                                  ? "kept-die--new"
                                  : undefined
                              }
                              key={`kept-${index}`}
                            >
                              <DieFace value={die} size={24} />
                              
                            </div>
                          ))
                        ) : (
                          <span className="action-panel__muted">No kept dice yet.</span>
                        )}
                      </div>
                    </div>

                    <div className="action-panel__tray">
                      <div className="action-panel__tray-label">Rolled Dice</div>
                      <div className="action-panel__tray-dice">
                        <span className="action-panel__muted">
                          Roll to place your dice on the felt, then click them there to keep them.
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="action-panel__top">
                  <div>
                    <div className="action-panel__title">Table Flow</div>
                    <div className="action-panel__muted">
                      {amIEliminated
                        ? "You are out of the game and now spectating."
                        : "Waiting for the active player to finish their move."}
                    </div>
                  </div>
                  <div className="action-panel__muted">
                    Current player:{" "}
                    {table.currentPlayerIndex !== undefined
                      ? table.players[table.currentPlayerIndex]?.name
                      : "None"}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="table-footer-actions">
            <button className="secondary-link-button" onClick={handleLeave}>
              Leave Table
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}
