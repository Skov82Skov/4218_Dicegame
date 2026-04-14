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
    players: [player],
    status: "waiting",
    currentPlayerIndex: undefined, // 👈 vigtigt
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
table.players.push({
  ...player,
  visibleRolls: [],
  hiddenRoll: null,
  hasFinished: false,
})

  // 🎯 auto start spil når fuldt
  if (table.players.length === table.maxPlayers) {
    table.status = "playing"
    table.currentPlayerIndex = Math.floor(
      Math.random() * table.players.length
    )

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
  const { playerId, dice } = req.body

  const table = tables.find((t) => t.id === id)
  if (!table) return res.status(404).json({ error: "Table not found" })

  const player = table.players.find((p: any) => p.id === playerId)
  if (!player) return res.status(404).json({ error: "Player not found" })

  // gem hele kastet som synligt
  player.visibleRolls.push(dice)

  res.json(table)
})
app.post("/tables/:id/hide", (req, res) => {
  const { id } = req.params
  const { playerId, dice } = req.body

  const table = tables.find((t) => t.id === id)
  if (!table) return res.status(404).json({ error: "Table not found" })

  const player = table.players.find((p: any) => p.id === playerId)
  if (!player) return res.status(404).json({ error: "Player not found" })

  // gem skjult kast
  player.hiddenRoll = dice
  player.hasFinished = true

  // 🔄 næste spiller
  table.currentPlayerIndex =
    (table.currentPlayerIndex + 1) % table.players.length

  res.json(table)
})
