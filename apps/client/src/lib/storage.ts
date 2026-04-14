export type PlayerIdentity = {
  id: string
  name: string
}

const STORAGE_KEY = "player"

export function getPlayerIdentity(): PlayerIdentity | null {
  if (typeof window === "undefined") return null

  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) return null

  try {
    return JSON.parse(data)
  } catch {
    return null
  }
}

export function setPlayerIdentity(player: PlayerIdentity) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(player))
}

export function clearPlayerIdentity() {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}