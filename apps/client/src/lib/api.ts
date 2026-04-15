const API_BASE_URL = "http://localhost:4000"

async function handleResponse(response: Response) {
  const text = await response.text()

  try {
    return text ? JSON.parse(text) : null
  } catch {
    return null
  }
}

// 🔍 Health check
export async function getHealth() {
  const response = await fetch(`${API_BASE_URL}/health`)
  return handleResponse(response)
}

// 📋 Hent alle tables
export async function getTables() {
  const response = await fetch(`${API_BASE_URL}/tables`)

  if (!response.ok) {
    throw new Error("Failed to fetch tables")
  }

  return handleResponse(response)
}

// 📋 Hent ét table
export async function getTable(tableId: string) {
  const response = await fetch(`${API_BASE_URL}/tables/${tableId}`)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error("Failed to fetch table")
  }

  return handleResponse(response)
}

// ➕ Opret table
export async function createTable(data: {
  name: string
  maxPlayers: number
  player: {
    id: string
    name: string
  }
}) {
  const response = await fetch(`${API_BASE_URL}/tables`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to create table")
  }

  return handleResponse(response)
}

// 👥 Join table
export async function joinTable(
  tableId: string,
  player: { id: string; name: string }
) {
  const response = await fetch(`${API_BASE_URL}/tables/${tableId}/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ player }),
  })

  if (response.status === 404) {
    throw new Error("Table not found")
  }

  if (response.status === 400) {
    throw new Error("Table is full")
  }

  if (!response.ok) {
    throw new Error("Failed to join table")
  }

  return handleResponse(response)
}

// 🚪 Leave table
export async function leaveTable(tableId: string, playerId: string) {
  const response = await fetch(`${API_BASE_URL}/tables/${tableId}/leave`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ playerId }),
  })

  if (!response.ok) {
    throw new Error("Failed to leave table")
  }

  return handleResponse(response)
}

// 🔄 Next turn
export async function nextTurn(tableId: string) {
  const response = await fetch(`${API_BASE_URL}/tables/${tableId}/next-turn`, {
    method: "POST",
  })

  if (!response.ok) {
    throw new Error("Failed to go to next turn")
  }

  return handleResponse(response)
}
export async function keepDie(
  tableId: string,
  playerId: string,
  dieIndex: number
) {
  const response = await fetch(`${API_BASE_URL}/tables/${tableId}/keep`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ playerId, dieIndex }),
  })

  if (!response.ok) {
    throw new Error("Failed to keep die")
  }

  return handleResponse(response)
}

export async function rollTurnDice(tableId: string, playerId: string) {
  const response = await fetch(`${API_BASE_URL}/tables/${tableId}/roll`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ playerId }),
  })

  if (!response.ok) {
    throw new Error("Failed to roll dice")
  }

  return handleResponse(response)
}

export async function hideRoll(tableId: string, playerId: string) {
  const response = await fetch(`${API_BASE_URL}/tables/${tableId}/hide`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ playerId }),
  })

  if (!response.ok) {
    throw new Error("Failed to hide roll")
  }

  return handleResponse(response)
}
