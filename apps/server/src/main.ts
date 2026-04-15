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

function createTurnPlayer(player: { id: string; name: string }) {
  return {
    ...player,
    keptDice: [] as number[],
    remainingDice: [] as number[],

    hiddenDice: null as number[] | null,
    hasFinished: false,
  }
}

function moveToNextPlayer(table: any) {
  if (!table.players.length) {
    table.currentPlayerIndex = undefined
    return
  }

  const startIndex = table.currentPlayerIndex ?? 0
  for (let i = 1; i <= table.players.length; i++) {
    const nextIndex = (startIndex + i) % table.players.length
    if (!table.players[nextIndex].hasFinished) {
      table.currentPlayerIndex = nextIndex
      return
    }
  }

  table.currentPlayerIndex = undefined
  table.status = "round_finished"
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

  const table = {
    id: Date.now().toString(),
    name,
    maxPlayers,
    players: [createTurnPlayer(player)],
    status: "waiting",
    currentPlayerIndex: undefined,
    round: 1,
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

  // 🎯 auto start spil når fuldt
  if (table.players.length === table.maxPlayers) {
    table.status = "playing"
    table.currentPlayerIndex = Math.floor(Math.random() * table.players.length)
    table.players = table.players.map((p: any) => ({
      ...p,
      keptDice: [],
      remainingDice: [],

      hiddenDice: null,
      hasFinished: false,
    }))

    console.log("Game started on table:", table.id)
    console.log("START PLAYER INDEX:", table.currentPlayerIndex)
  }

  res.json(table)
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
app.post("/tables/:id/leave", (req, res) => {
  const { id } = req.params
  const { playerId } = req.body

  const table = tables.find((t) => t.id === id)

  if (!table) {
    return res.status(404).json({ error: "Table not found" })
  }

  // ❌ fjern spiller
  table.players = table.players.filter((p: any) => p.id !== playerId)

  // 🔄 hvis ingen spillere → slet bord
  if (table.players.length === 0) {
    tables = tables.filter((t) => t.id !== id)
    return res.json({ message: "Table deleted" })
  }

  // 🔄 hvis spil er i gang → reset til waiting
  if (table.players.length < table.maxPlayers) {
    table.status = "waiting"
    table.currentPlayerIndex = undefined
  }

  res.json(table)
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


  if (player.remainingDice.length === 0) {
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


    return res
      .status(400)
      .json({ error: "You must keep at least one die or hide before rolling again" })
  }


  if (availableDice <= 0) {
    return res.status(400).json({ error: "No dice left to roll" })
  }

  player.remainingDice = Array.from(
    { length: availableDice },
    () => Math.floor(Math.random() * 6) + 1
  )

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

  if (!Array.isArray(player.remainingDice) || player.remainingDice.length === 0) {
    return res.status(400).json({ error: "No rolled dice to hide" })
  }

  // gem skjulte terninger og afslut tur
  player.hiddenDice = [...player.remainingDice]
  player.remainingDice = []

  player.hasFinished = true

  // 🔄 næste spiller / afslut runde
  moveToNextPlayer(table)

  res.json(table)
})
