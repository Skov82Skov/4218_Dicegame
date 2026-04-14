export function createPlayerId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `player_${Math.random().toString(36).slice(2, 10)}`;
}

export function validatePlayerName(rawName: string): string | null {
  const name = rawName.trim();

  if (!name) return 'Name is required.';
  if (name.length < 2) return 'Name must be at least 2 characters.';
  if (name.length > 20) return 'Name must be 20 characters or less.';
  if (!/^[a-zA-Z0-9 _-]+$/.test(name)) {
    return 'Name can only use letters, numbers, spaces, hyphens, and underscores.';
  }

  return null;
}
