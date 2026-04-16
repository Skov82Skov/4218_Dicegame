import express from "express"
import cors from "cors"

const app = express()
const port = 4000

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("4218 server is running")
})

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    app: "4218-server",
    timestamp: new Date().toISOString(),
  })
})

let tables: any[] = []
const TOTAL_DICE = 5
const START_LIVES = 6
const MAX_SCORE_PENALTY_THRESHOLD = 18
const TURN_TIMEOUT_MS = 30_000

function calculateScore(dice: number[]) {
  const values = [...dice]
  const fourIndex = values.indexOf(4)
  const twoIndex = values.indexOf(2)

  if (fourIndex === -1 || twoIndex === -1) {
    return 0
  }

  values.splice(fourIndex, 1)
  const adjustedTwoIndex = values.indexOf(2)
  if (adjustedTwoIndex === -1) {
    return 0
  }
  values.splice(adjustedTwoIndex, 1)

  return values.reduce((sum, value) => sum + value, 0)
}

function createTurnPlayer(player: { id: string; name: string }) {
  return {
    ...player,
    keptDice: [] as number[],
    remainingDice: [] as number[],
    canReroll: false,
    hiddenDice: null as number[] | null,
    hasFinished: false,
    score: 0,
    lives: START_LIVES,
    isEliminated: false,
    isReady: false,
    isHost: false,
  }
}

function resetPlayerForRound(player: any) {
  player.keptDice = []
  player.remainingDice = []
  player.canReroll = false
  player.hiddenDice = null
  player.hasFinished = false
  player.score = 0
}

function getActivePlayers(table: any) {
  return table.players.filter((player: any) => player.lives > 0 && !player.isEliminated)
}

function setTurnDeadline(table: any) {
  if (typeof table.currentPlayerIndex !== "number") {
    table.turnStartedAt = undefined
    table.turnExpiresAt = undefined
    return
  }

  table.turnStartedAt = Date.now()
  table.turnExpiresAt = table.turnStartedAt + TURN_TIMEOUT_MS
}

function resolveLowestLoserByTieBreak(roundLosers: any[]) {
  if (roundLosers.length <= 1) {
    return roundLosers[0]
  }

  let tiedPlayers = [...roundLosers]
  const tieBreakRounds: {
    rolls: { playerId: string; name: string; dice: number[]; score: number }[]
  }[] = []

  while (tiedPlayers.length > 1) {
    const rolls = tiedPlayers.map((player) => ({
      playerId: player.id,
      name: player.name,
      dice: Array.from({ length: TOTAL_DICE }, () => Math.floor(Math.random() * 6) + 1),
    })).map((roll) => ({
      ...roll,
      score: calculateScore(roll.dice),
    }))
    tieBreakRounds.push({ rolls })

    const minRoll = Math.min(...rolls.map((item) => item.score))
    const nextTiedPlayerIds = new Set(
      rolls.filter((item) => item.score === minRoll).map((item) => item.playerId)
    )
    tiedPlayers = tiedPlayers.filter((player) => nextTiedPlayerIds.has(player.id))
  }

  return { loser: tiedPlayers[0], tieBreakRounds }
}

function resolveRound(table: any) {
  const activePlayers = getActivePlayers(table)
  if (activePlayers.length <= 1) {
    return
  }

  // Reveal hidden dice and lock final score for everyone.
  for (const player of activePlayers) {
    const hiddenDice = Array.isArray(player.hiddenDice) ? player.hiddenDice : []
    if (hiddenDice.length > 0) {
      player.keptDice = [...player.keptDice, ...hiddenDice]
      player.hiddenDice = null
    }

    player.score = calculateScore(player.keptDice)
  }

  const roundHighScore = Math.max(...activePlayers.map((player: any) => player.score))
  const roundLowScore = Math.min(...activePlayers.map((player: any) => player.score))
  const roundLosers = activePlayers.filter((player: any) => player.score === roundLowScore)
  const lifePenalty = roundHighScore >= MAX_SCORE_PENALTY_THRESHOLD ? 2 : 1
  const loserResolution = resolveLowestLoserByTieBreak(roundLosers)
  const loser = "loser" in loserResolution ? loserResolution.loser : loserResolution
  const tieBreakRounds = "tieBreakRounds" in loserResolution ? loserResolution.tieBreakRounds : []

  loser.lives = Math.max(0, loser.lives - lifePenalty)
  if (loser.lives === 0) {
    loser.isEliminated = true
  }

  table.lastRoundSummary = {
    round: table.round ?? 1,
    scores: activePlayers.map((player: any) => ({
      playerId: player.id,
      name: player.name,
      score: player.score,
      lives: player.lives,
      isEliminated: Boolean(player.isEliminated),
    })),
    lowScore: roundLowScore,
    loser: {
      playerId: loser.id,
      name: loser.name,
      lifePenalty,
      remainingLives: loser.lives,
      eliminated: Boolean(loser.isEliminated),
    },
    tieBreakRounds,
  }

  const survivors = getActivePlayers(table)
  if (survivors.length <= 1) {
    table.status = "finished"
    table.currentPlayerIndex = undefined
    table.winnerId = survivors[0]?.id
    setTurnDeadline(table)
    return
  }

  for (const player of survivors) {
    resetPlayerForRound(player)
  }

  table.round = (table.round ?? 1) + 1
  table.status = "playing"
  table.currentPlayerIndex = table.players.findIndex((player: any) => player.id === survivors[0].id)
  setTurnDeadline(table)
}

function moveToNextPlayer(table: any) {
  const activePlayers = getActivePlayers(table)
  if (!activePlayers.length) {
    table.currentPlayerIndex = undefined
    return
  }

  const startIndex = table.currentPlayerIndex ?? 0
  for (let i = 1; i <= table.players.length; i++) {
    const nextIndex = (startIndex + i) % table.players.length
    const nextPlayer = table.players[nextIndex]
    if (
      nextPlayer &&
      nextPlayer.lives > 0 &&
      !nextPlayer.isEliminated &&
      !nextPlayer.hasFinished
    ) {
      table.currentPlayerIndex = nextIndex
      setTurnDeadline(table)
      return
    }
  }

  table.currentPlayerIndex = undefined
  setTurnDeadline(table)
  table.status = "round_finished"
  resolveRound(table)
}

function eliminatePlayerOnTimeout(table: any) {
  if (table.status !== "playing" || typeof table.currentPlayerIndex !== "number") {
    return
  }

  const timedOutPlayer = table.players[table.currentPlayerIndex]
  if (!timedOutPlayer) {
    return
  }

  timedOutPlayer.lives = 0
  timedOutPlayer.isEliminated = true
  timedOutPlayer.hasFinished = true
  timedOutPlayer.keptDice = []
  timedOutPlayer.remainingDice = []
  timedOutPlayer.hiddenDice = null
  timedOutPlayer.score = 0

  const survivors = getActivePlayers(table)
  if (survivors.length <= 1) {
    table.status = "finished"
    table.currentPlayerIndex = undefined
    table.winnerId = survivors[0]?.id
    setTurnDeadline(table)
    return
  }

  moveToNextPlayer(table)
}

function removePlayerFromTable(tableId: string, playerId: string) {
  const table = tables.find((t) => t.id === tableId)
  if (!table) {
    return null
  }

  table.players = table.players.filter((p: any) => p.id !== playerId)

  if (table.players.length === 0) {
    tables = tables.filter((t) => t.id !== tableId)
    return { deleted: true }
  }

  if (table.players.length === 1) {
    table.status = "finished"
    table.currentPlayerIndex = undefined
    table.winnerId = table.players[0].id
    setTurnDeadline(table)
    return table
  }

  if (!table.players.some((p: any) => p.isHost)) {
    table.players[0].isHost = true
  }

  if (table.players.length < table.maxPlayers && table.status !== "finished") {
    table.status = "waiting"
    table.currentPlayerIndex = undefined
    setTurnDeadline(table)
    return table
  }

  if (table.status === "playing") {
    if (typeof table.currentPlayerIndex !== "number") {
      table.currentPlayerIndex = 0
    } else if (table.currentPlayerIndex >= table.players.length) {
      table.currentPlayerIndex = 0
    }
    setTurnDeadline(table)
  }

  return table
}

// 🔍 Hent alle borde
app.get("/tables", (req, res) => {
  res.json(tables)
})

// 🔍 Hent ét bord
app.get("/tables/:id", (req, res) => {
  const { id } = req.params
  const table = tables.find((t) => t.id === id)

  if (!table) {
    return res.status(404).json({ error: "Table not found" })
  }

  res.json(table)
})

// ➕ Opret bord
app.post("/tables", (req, res) => {
  const { name, maxPlayers, player } = req.body

  const host = createTurnPlayer(player)
  host.isHost = true
  const table = {
    id: Date.now().toString(),
    name,
    maxPlayers,
    players: [host],
    status: "waiting",
    currentPlayerIndex: undefined,
    round: 1,
    winnerId: undefined as string | undefined,
    turnStartedAt: undefined as number | undefined,
    turnExpiresAt: undefined as number | undefined,
    lastRoundSummary: undefined,
  }

  tables.push(table)

  res.json(table)
})

// 👥 Join bord
app.post("/tables/:id/join", (req, res) => {
  const { id } = req.params
  const { player } = req.body

  const table = tables.find((t) => t.id === id)

  if (!table) {
    return res.status(404).json({ error: "Table not found" })
  }

  const alreadyJoined = table.players.some((p: any) => p.id === player.id)
  if (alreadyJoined) {
    return res.json(table)
  }

  if (table.players.length >= table.maxPlayers) {
    return res.status(400).json({ error: "Table is full" })
  }

  // ✅ tilføj spiller
  table.players.push(createTurnPlayer(player))

  res.json(table)
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

setInterval(() => {
  const now = Date.now()
  for (const table of tables) {
    if (
      table.status === "playing" &&
      typeof table.currentPlayerIndex === "number" &&
      typeof table.turnExpiresAt === "number" &&
      now >= table.turnExpiresAt
    ) {
      const timedOutPlayer = table.players[table.currentPlayerIndex]
      if (timedOutPlayer) {
        console.log(`Player ${timedOutPlayer.name} timed out and is now spectating at table ${table.id}`)
        eliminatePlayerOnTimeout(table)
      }
    }
  }
}, 1000)

app.post("/tables/:id/leave", (req, res) => {
  const { id } = req.params
  const { playerId } = req.body

  const result = removePlayerFromTable(id, playerId)
  if (!result) {
    return res.status(404).json({ error: "Table not found" })
  }
  if ("deleted" in result) {
    return res.json({ message: "Table deleted" })
  }
  res.json(result)
})
app.post("/tables/:id/keep", (req, res) => {
  const { id } = req.params
  const { playerId, dieIndex } = req.body

  const table = tables.find((t) => t.id === id)
  if (!table) return res.status(404).json({ error: "Table not found" })

  if (table.status !== "playing") {
    return res.status(400).json({ error: "Game is not playing" })
  }

  const player = table.players.find((p: any) => p.id === playerId)
  if (!player) return res.status(404).json({ error: "Player not found" })

  if (player.lives <= 0 || player.isEliminated) {
    return res.status(400).json({ error: "Eliminated players cannot keep dice" })
  }

  const currentPlayer = table.players[table.currentPlayerIndex]
  if (!currentPlayer || currentPlayer.id !== playerId) {
    return res.status(400).json({ error: "Not your turn" })
  }

  if (!Array.isArray(player.remainingDice) || player.remainingDice.length === 0) {
    return res.status(400).json({ error: "No rolled dice to keep from" })
  }

  if (
    typeof dieIndex !== "number" ||
    dieIndex < 0 ||
    dieIndex >= player.remainingDice.length
  ) {
    return res.status(400).json({ error: "Invalid die index" })
  }

  const [keptDie] = player.remainingDice.splice(dieIndex, 1)
  player.keptDice.push(keptDie)
  player.canReroll = true
  setTurnDeadline(table)

  if (player.remainingDice.length === 0) {
    player.score = calculateScore(player.keptDice)
    player.hasFinished = true
    moveToNextPlayer(table)
  }

  res.json(table)
})

app.post("/tables/:id/roll", (req, res) => {
  const { id } = req.params
  const { playerId } = req.body

  const table = tables.find((t) => t.id === id)
  if (!table) return res.status(404).json({ error: "Table not found" })

  if (table.status !== "playing") {
    return res.status(400).json({ error: "Game is not playing" })
  }

  const player = table.players.find((p: any) => p.id === playerId)
  if (!player) return res.status(404).json({ error: "Player not found" })

  const currentPlayer = table.players[table.currentPlayerIndex]
  if (!currentPlayer || currentPlayer.id !== playerId) {
    return res.status(400).json({ error: "Not your turn" })
  }

  if (player.hasFinished) {
    return res.status(400).json({ error: "Turn is already finished" })
  }

  if (player.lives <= 0 || player.isEliminated) {
    return res.status(400).json({ error: "Eliminated players cannot roll" })
  }

  const keptDiceCount = Array.isArray(player.keptDice) ? player.keptDice.length : 0
  const hasUnkeptDice = Array.isArray(player.remainingDice) && player.remainingDice.length > 0

  if (hasUnkeptDice && !player.canReroll) {
    return res.status(400).json({ error: "Keep at least one die before rolling again" })
  }

  const availableDice = hasUnkeptDice
    ? player.remainingDice.length
    : TOTAL_DICE - keptDiceCount

  if (availableDice <= 0) {
    return res.status(400).json({ error: "No dice left to roll" })
  }

  player.remainingDice = Array.from(
    { length: availableDice },
    () => Math.floor(Math.random() * 6) + 1
  )
  player.canReroll = false
  setTurnDeadline(table)

  res.json(table)
})
app.post("/tables/:id/hide", (req, res) => {
  const { id } = req.params
  const { playerId } = req.body

  const table = tables.find((t) => t.id === id)
  if (!table) return res.status(404).json({ error: "Table not found" })

  if (table.status !== "playing") {
    return res.status(400).json({ error: "Game is not playing" })
  }

  const player = table.players.find((p: any) => p.id === playerId)
  if (!player) return res.status(404).json({ error: "Player not found" })

  const currentPlayer = table.players[table.currentPlayerIndex]
  if (!currentPlayer || currentPlayer.id !== playerId) {
    return res.status(400).json({ error: "Not your turn" })
  }

  if (player.lives <= 0 || player.isEliminated) {
    return res.status(400).json({ error: "Eliminated players cannot hide" })
  }

  const keptDiceCount = Array.isArray(player.keptDice) ? player.keptDice.length : 0
  const hasUnkeptDice = Array.isArray(player.remainingDice) && player.remainingDice.length > 0

  if (hasUnkeptDice && !player.canReroll) {
    return res.status(400).json({ error: "Keep at least one die before rolling and hiding again" })
  }

  const availableDice = hasUnkeptDice
    ? player.remainingDice.length
    : TOTAL_DICE - keptDiceCount

  if (availableDice <= 0) {
    return res.status(400).json({ error: "No dice left to roll and hide" })
  }

  // Roll all available dice secretly and end turn.
  const hiddenRoll = Array.from(
    { length: availableDice },
    () => Math.floor(Math.random() * 6) + 1
  )
  player.hiddenDice = hiddenRoll
  player.remainingDice = []
  player.canReroll = false
  const finalDice = [...player.keptDice, ...player.hiddenDice]
  player.score = calculateScore(finalDice)

  player.hasFinished = true

  // 🔄 næste spiller / afslut runde
  moveToNextPlayer(table)

  res.json(table)
})

app.post("/tables/:id/ready", (req, res) => {
  const { id } = req.params
  const { playerId, isReady } = req.body

  const table = tables.find((t) => t.id === id)
  if (!table) return res.status(404).json({ error: "Table not found" })

  if (table.status !== "waiting") {
    return res.status(400).json({ error: "Ready status can only be changed while waiting" })
  }

  const player = table.players.find((p: any) => p.id === playerId)
  if (!player) return res.status(404).json({ error: "Player not found" })

  player.isReady = Boolean(isReady)

  const canStart =
    table.players.length === table.maxPlayers &&
    table.players.length >= 2 &&
    table.players.every((p: any) => p.isReady)

  if (canStart) {
    table.status = "playing"
    table.round = 1
    table.winnerId = undefined
    table.lastRoundSummary = undefined
    table.currentPlayerIndex = Math.floor(Math.random() * table.players.length)
    table.players = table.players.map((p: any) => ({
      ...p,
      lives: START_LIVES,
      isEliminated: false,
      isReady: false,
    }))
    table.players.forEach((p: any) => resetPlayerForRound(p))
    setTurnDeadline(table)
  }

  res.json(table)
})

app.post("/tables/:id/play-again", (req, res) => {
  const { id } = req.params
  const { playerId } = req.body

  const table = tables.find((t) => t.id === id)
  if (!table) return res.status(404).json({ error: "Table not found" })

  if (table.status !== "finished") {
    return res.status(400).json({ error: "Game is not finished" })
  }

  const player = table.players.find((p: any) => p.id === playerId)
  if (!player) return res.status(404).json({ error: "Player not found" })

  if (!player.isHost) {
    return res.status(403).json({ error: "Only host can start a new game" })
  }

  if (table.players.length < 2) {
    return res.status(400).json({ error: "Need at least 2 players to play again" })
  }

  table.status = "waiting"
  table.round = 1
  table.winnerId = undefined
  table.lastRoundSummary = undefined
  table.currentPlayerIndex = undefined
  table.players = table.players.map((p: any) => ({
    ...p,
    lives: START_LIVES,
    isEliminated: false,
    isReady: false,
  }))
  table.players.forEach((p: any) => resetPlayerForRound(p))
  setTurnDeadline(table)

  res.json(table)
})
