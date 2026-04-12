# 🚀 4218 – Sprint 3 (Realtime)

---

# 🧭 Sprint Goal

Add **realtime multiplayer updates** so players at the lobby and table see changes instantly.

This sprint makes the game feel live.

Players should be able to:

* see players join and leave without refreshing
* see table updates instantly
* mark themselves as ready
* start the game when all players are ready
* stay connected through a live socket session

---

# 🏁 Sprint 3 Deliverable

At the end of Sprint 3:

✅ Lobby updates live
✅ Table updates live
✅ Players join and leave in realtime
✅ Ready state works
✅ Host can start the game
✅ Basic reconnect handling exists

---

# 🧩 User Story

**As a player**,
I want tables and players to update live,
so I do not need to refresh the page while waiting for the game to start.

---

# 🎟️ Sprint 3 Tickets

---

## Ticket 1 — Setup Socket.IO on the backend

### Goal

Enable realtime communication.

### Tasks

* Install Socket.IO on backend
* Create socket server
* Attach socket server to HTTP server
* Add CORS settings for client connection

### Acceptance Criteria

* Client can connect to socket server
* Backend logs successful connections

---

## Ticket 2 — Setup Socket.IO on the frontend

### Goal

Allow the client to connect to the backend in realtime.

### Tasks

* Install Socket.IO client
* Create reusable socket helper
* Connect when player is identified
* Disconnect cleanly when leaving

### Acceptance Criteria

* Frontend connects successfully
* Socket connection can be reused across pages

---

## Ticket 3 — Authenticate socket with temporary player identity

### Goal

Identify players without accounts.

### Tasks

* Send `playerId` and `playerName` in socket handshake or auth payload
* Validate both on server
* Reject invalid connections

### Acceptance Criteria

* Every socket has a valid player identity
* Anonymous invalid connections are blocked

---

## Ticket 4 — Add lobby room subscription

### Goal

Let players in the lobby receive live table updates.

### Tasks

* Create lobby room
* Join player to lobby room when in lobby
* Broadcast table changes to lobby room

### Acceptance Criteria

* Lobby players receive live table changes
* No manual refresh required

---

## Ticket 5 — Add table room subscription

### Goal

Let players at the same table receive live updates.

### Tasks

* Create table-specific socket rooms
* Join socket to table room when opening table page
* Leave room when leaving table page

### Acceptance Criteria

* Only players at the same table receive that table’s events

---

## Ticket 6 — Broadcast table created event

### Goal

Update lobby instantly when a new table is created.

### Tasks

* Emit event after table creation
* Update lobby state on connected clients

### Acceptance Criteria

* New table appears instantly in lobby for all players

---

## Ticket 7 — Broadcast player joined event

### Goal

Update table and lobby instantly when someone joins.

### Tasks

* Emit table update after join
* Emit lobby update after join
* Update player count live

### Acceptance Criteria

* Joining is shown instantly to all connected players

---

## Ticket 8 — Broadcast player left event

### Goal

Keep table state accurate in realtime.

### Tasks

* Emit event when player leaves table
* Remove player from seat view
* Remove table if empty and notify lobby

### Acceptance Criteria

* Leaving is shown instantly
* Empty tables disappear from lobby

---

## Ticket 9 — Add ready state to table model

### Goal

Allow players to signal that they are ready.

### Tasks

* Add `isReady` flag to each player at a table
* Default to `false` when joining
* Reset readiness when table composition changes

### Acceptance Criteria

* Table stores readiness correctly
* New join/leave resets readiness when needed

---

## Ticket 10 — Add ready/unready API or socket event

### Goal

Allow players to toggle readiness.

### Options

* `POST /tables/:id/ready`
  or
* socket event `table:ready`

### Tasks

* Toggle player readiness
* Broadcast updated table state

### Acceptance Criteria

* Players can mark ready
* Other players see ready state instantly

---

## Ticket 11 — Show ready state in frontend UI

### Goal

Display who is ready.

### Tasks

* Add ready badge or icon to each player seat
* Add ready button for current player
* Add unready option if desired

### Acceptance Criteria

* Ready state is visible and updates live

---

## Ticket 12 — Add host logic

### Goal

Decide who can start the game.

### Tasks

* First player at table becomes host
* Show host label in UI
* Reassign host if host leaves

### Acceptance Criteria

* Table always has one host while not empty
* Host is visible to players

---

## Ticket 13 — Add start game condition

### Goal

Only allow starting when valid.

### Rules

* At least 2 players
* All seated players are ready
* Only host can start

### Tasks

* Validate start condition
* Add disabled/enabled start button
* Return clear error if invalid

### Acceptance Criteria

* Invalid game start is blocked
* Valid game start succeeds

---

## Ticket 14 — Add start game event

### Goal

Move table from waiting state to game state.

### Tasks

* Add `status` values such as:

  * `waiting`
  * `playing`
* Emit `game:started`
* Redirect players to game screen or show placeholder state

### Acceptance Criteria

* All players at table see game started instantly

---

## Ticket 15 — Basic reconnect handling

### Goal

Support refresh and temporary disconnects.

### Tasks

* On reconnect, identify player by stored `playerId`
* Restore lobby/table subscription
* Restore current table state if player still belongs to table

### Acceptance Criteria

* Refresh does not lose player immediately
* Reconnected user sees correct table state

---

## Ticket 16 — Handle disconnect state

### Goal

Avoid breaking table state when someone disconnects briefly.

### Tasks

* Mark player as disconnected instead of removing immediately
  OR
* Use simple timeout before removal

### Acceptance Criteria

* Short disconnects do not instantly destroy game setup

---

## Ticket 17 — Add socket event map

### Goal

Keep event names clean and consistent.

### Suggested events

#### Client → Server

* `lobby:join`
* `lobby:leave`
* `table:joinRoom`
* `table:leaveRoom`
* `table:ready`
* `game:start`

#### Server → Client

* `lobby:updated`
* `table:updated`
* `table:playerJoined`
* `table:playerLeft`
* `game:started`
* `error`

### Acceptance Criteria

* Events are centralized and reused

---

## Ticket 18 — Update lobby UI to use socket events

### Goal

Replace refresh-based updates.

### Tasks

* Subscribe to `lobby:updated`
* Update table list in UI
* Remove or reduce polling

### Acceptance Criteria

* Lobby updates instantly from sockets

---

## Ticket 19 — Update table UI to use socket events

### Goal

Make table page fully live.

### Tasks

* Subscribe to `table:updated`
* Update players, seats, host, and ready state live

### Acceptance Criteria

* Table page updates without refresh

---

## Ticket 20 — Test realtime table flow

### Manual Tests

* [ ] Two browser tabs connect
* [ ] One player creates table
* [ ] Other player sees it instantly
* [ ] Other player joins table
* [ ] Both players see update instantly
* [ ] Ready state syncs correctly
* [ ] Host can start game only when all are ready
* [ ] Host leaving reassigns host
* [ ] Refresh reconnects correctly
* [ ] Empty table disappears instantly

---

# 📁 New Files for Sprint 3

### Backend

```text
server/src/
├─ sockets/
│  ├─ socket.server.ts
│  ├─ lobby.gateway.ts
│  ├─ table.gateway.ts
│  └─ socket-auth.ts
```

### Frontend

```text
client/src/
├─ lib/
│  └─ socket.ts
├─ hooks/
│  ├─ useSocket.ts
│  ├─ useLobbySocket.ts
│  └─ useTableSocket.ts
```

---

# ⚠️ Risks

* Duplicate socket connections
* Wrong player identity after refresh
* Race conditions when players join at same time
* Host reassignment bugs
* Reconnect edge cases

---

# 🛠️ Notes

Keep Sprint 3 focused on **waiting-room realtime**, not gameplay yet.

Do not build dice logic here.

Focus on:

* lobby sync
* table sync
* readiness
* starting state

---

# ✅ Definition of Done

Sprint 3 is complete when:

* players receive live lobby updates
* players receive live table updates
* ready state works in realtime
* host is assigned correctly
* start game validation works
* reconnect flow works well enough for MVP

---

# 👉 Next Step

Sprint 4 = **Core Gameplay**

* rolling dice
* keeping dice
* enforcing turns
* hiding the last die
