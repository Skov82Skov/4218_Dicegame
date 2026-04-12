# 🚀 4218 – Sprint 2 (Tables)

---

# 🧭 Sprint Goal

Build the **table system**, so players can:

* See available tables
* Create a table (2–5 players)
* Join a table
* Leave a table
* See other players at the table

---

# 🏁 Sprint 2 Deliverable

At the end of Sprint 2:

✅ Player can create a table
✅ Player can join a table
✅ Player can see other players in real time (basic, no sockets yet required but recommended)
✅ Table has seats (2–5 players)

---

# 🧩 User Story

**As a player**,
I want to create or join a table,
so I can play with other players.

---

# 🎟️ Sprint 2 Tickets

---

## Ticket 1 — Create Table Model (Backend)

### Goal

Define how tables are stored.

### Tasks

* Create table structure:

  * `id`
  * `name`
  * `maxPlayers (2–5)`
  * `players[]`
  * `status` (waiting / playing)
* Use in-memory storage (no DB needed yet)

### Acceptance Criteria

* Tables can be created and stored
* Each table has a unique ID

---

## Ticket 2 — Create Table API

### Goal

Allow frontend to create tables.

### Endpoint

`POST /tables`

### Body

```json
{
  "name": "My Table",
  "maxPlayers": 4,
  "player": { "id": "...", "name": "..." }
}
```

### Tasks

* Validate maxPlayers (2–5)
* Add creator as first player
* Return created table

### Acceptance Criteria

* Table is created successfully
* Creator is added to table

---

## Ticket 3 — Get Tables List API

### Goal

Show all available tables.

### Endpoint

`GET /tables`

### Tasks

* Return all tables
* Only include tables with open seats

### Acceptance Criteria

* Frontend can fetch tables
* Tables update when new ones are created

---

## Ticket 4 — Join Table API

### Goal

Allow players to join existing tables.

### Endpoint

`POST /tables/:id/join`

### Tasks

* Add player to table
* Prevent overfilling
* Prevent duplicate joins

### Acceptance Criteria

* Player joins table successfully
* Table respects max player limit

---

## Ticket 5 — Leave Table API

### Goal

Allow players to leave.

### Endpoint

`POST /tables/:id/leave`

### Tasks

* Remove player from table
* Delete table if empty

### Acceptance Criteria

* Player can leave table
* Empty tables are removed

---

## Ticket 6 — Lobby Page (Frontend)

### Goal

Display available tables.

### Tasks

* Fetch `/tables`
* Show table list:

  * name
  * player count
  * max players
* Add refresh or auto-refresh

### Acceptance Criteria

* Player sees available tables
* List updates correctly

---

## Ticket 7 — Create Table UI

### Goal

Allow player to create a table.

### Tasks

* Add "Create Table" button
* Add modal/form:

  * table name
  * number of players (2–5)
* Call API
* Redirect to table page

### Acceptance Criteria

* Player can create table
* Player enters table after creation

---

## Ticket 8 — Join Table UI

### Goal

Allow joining tables from lobby.

### Tasks

* Add "Join" button to each table
* Call join API
* Redirect to table page

### Acceptance Criteria

* Player joins table and enters it

---

## Ticket 9 — Table Page (Basic)

### Goal

Display table and players.

### Tasks

* Create `/tables/[tableId]`
* Show:

  * table name
  * player list
  * number of seats
* Highlight current player

### Acceptance Criteria

* Table page shows correct players

---

## Ticket 10 — Seat System

### Goal

Represent seats at table.

### Tasks

* Assign seat number to players
* Max 2–5 seats
* Display empty seats

### Acceptance Criteria

* Players are assigned seats
* Empty seats are visible

---

## Ticket 11 — Leave Table UI

### Goal

Allow leaving table.

### Tasks

* Add "Leave Table" button
* Call leave API
* Redirect to lobby

### Acceptance Criteria

* Player leaves table successfully

---

## Ticket 12 — Prevent Invalid Actions

### Goal

Avoid broken states.

### Tasks

* Prevent joining full table
* Prevent joining twice
* Handle missing table

### Acceptance Criteria

* Errors handled cleanly
* No crashes

---

## Ticket 13 — Auto Refresh Tables (Simple)

### Goal

Keep lobby updated.

### Tasks

* Poll `/tables` every few seconds
  OR
* Add manual refresh button

### Acceptance Criteria

* Table list updates

---

## Ticket 14 — Basic State Handling

### Goal

Keep frontend clean.

### Tasks

* Store current table state
* Store player identity
* Handle loading states

### Acceptance Criteria

* UI updates correctly
* No stale data issues

---

## Ticket 15 — Test Table Flow

### Manual Tests

* [ ] Create table
* [ ] Join table from another browser
* [ ] Max players enforced
* [ ] Leave table works
* [ ] Table disappears when empty
* [ ] Multiple tables work correctly

---

# 📁 New Files (Sprint 2)

### Backend

```text
server/src/
├─ modules/tables/
│  ├─ tables.controller.ts
│  ├─ tables.service.ts
│  ├─ tables.routes.ts
│  └─ tables.types.ts
```

### Frontend

```text
client/src/
├─ app/
│  ├─ lobby/page.tsx
│  └─ tables/[tableId]/page.tsx
├─ components/
│  ├─ TableList.tsx
│  ├─ TableCard.tsx
│  └─ CreateTableModal.tsx
```

---

# ⚠️ Risks

* Two players joining at same time (race condition)
* Table state getting out of sync
* Missing validation

---

# 🛠️ Notes

Keep it simple:

* Use **in-memory storage** for tables
* No database yet
* No sockets required (yet)

Realtime will come in Sprint 3

---

# ✅ Definition of Done

Sprint 2 is complete when:

* Player can create table
* Player can join table
* Player can leave table
* Table shows players correctly
* Table respects player limits
* Lobby shows available tables

---

# 👉 Next Step

Sprint 3 = **Realtime (Socket.IO)**
→ live updates, no refresh needed
