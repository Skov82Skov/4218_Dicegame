# 🚀 4218 – Sprint Plan (MVP)

This document outlines the development plan for building the **4218 Multiplayer Dice Game**.

---

# 🧭 Project Goal

Deliver a simple, playable multiplayer game where players:

* Enter a name (no account)
* Join or create a table (2–5 players)
* Play in real time
* Follow full 4218 rules
* Compete until one player remains

---

# 🏁 Sprint Overview

| Sprint   | Focus              | Outcome              |
| -------- | ------------------ | -------------------- |
| Sprint 1 | Setup & Name Entry | Player enters name   |
| Sprint 2 | Tables             | Create & join tables |
| Sprint 3 | Realtime           | Live table updates   |
| Sprint 4 | Gameplay           | Dice & turns         |
| Sprint 5 | Game Rules         | Scoring & lives      |
| Sprint 6 | Polish             | UI & UX improvements |

---

# 🟢 Sprint 1 – Setup & Name Entry

## Goal

Allow players to enter a name and access the game.

## Tasks

* [ ] Setup project (client + server)
* [ ] Create "Enter Name" screen
* [ ] Validate name input
* [ ] Store name in localStorage/session
* [ ] Generate temporary player ID
* [ ] Redirect to lobby

## Deliverable

✅ Player enters name and reaches lobby

---

# 🟡 Sprint 2 – Tables

## Goal

Players can create and join tables.

## Tasks

* [ ] Table model (2–5 players)
* [ ] Create table API
* [ ] Join table API
* [ ] Leave table API
* [ ] Lobby page (list tables)
* [ ] Create table UI (select seats)
* [ ] Table screen with player seats
* [ ] Show player names

## Deliverable

✅ Players can join tables and see others

---

# 🔵 Sprint 3 – Realtime

## Goal

Make the table update live.

## Tasks

* [ ] Setup Socket.IO
* [ ] Handle player join/leave events
* [ ] Sync table state to all players
* [ ] Ready system
* [ ] Start game button
* [ ] Handle reconnect (same name/session)

## Deliverable

✅ Players see live updates instantly

---

# 🟣 Sprint 4 – Gameplay

## Goal

Implement dice and turns.

## Tasks

* [ ] Dice rolling (1–6 random)
* [ ] Keep dice system
* [ ] Enforce rule: keep at least 1 die
* [ ] Turn system (one player at a time)
* [ ] Hide last die feature
* [ ] UI for dice and actions
* [ ] Sync turns in realtime

## Deliverable

✅ Players can play full turns

---

# 🔴 Sprint 5 – Game Rules

## Goal

Implement full game logic.

## Tasks

* [ ] Check for 4 and 2
* [ ] Score = sum of last 3 dice
* [ ] Score = 0 if missing 4 or 2
* [ ] Give each player 6 lives
* [ ] Find lowest score each round
* [ ] Deduct 1 life from loser
* [ ] Special rule: 18 → loser loses 2 lives
* [ ] Tie-breaker system
* [ ] Player elimination
* [ ] Detect winner (last player)

## Deliverable

✅ Full game works correctly

---

# 🟠 Sprint 6 – Polish

## Goal

Improve look and feel.

## Tasks

* [ ] Poker-style table layout
* [ ] Seat positioning (2–5 players)
* [ ] Dice animations
* [ ] Sound effects
* [ ] Game messages (who lost life, etc.)
* [ ] Loading states
* [ ] Restart game option
* [ ] Share table link/code

## Deliverable

✅ Game feels smooth and complete

---

# 📊 Definition of Done

A task is complete when:

* It works correctly
* No major bugs
* UI behaves as expected
* Realtime sync is stable

---

# ⚠️ Risks

* Realtime sync bugs
* Handling reconnects without accounts
* Tie-breaker edge cases
* Game state getting out of sync

---

# 🛠️ Suggested Workflow

* Build simple first (no extra features)
* Focus on gameplay early
* Test rules thoroughly
* Keep backend game logic separate from UI

---

# 📅 Suggested Timeline

| Sprint   | Duration |
| -------- | -------- |
| Sprint 1 | 1–2 days |
| Sprint 2 | 2–3 days |
| Sprint 3 | 3–4 days |
| Sprint 4 | 4–5 days |
| Sprint 5 | 4–5 days |
| Sprint 6 | 2–3 days |

---

# 🎯 Final Result

A simple multiplayer game where:

* No login needed
* No friend system
* Just enter name → join table → play

---

# 👨‍💻 Notes

Keep it simple:

* No accounts
* No friends
* No database complexity (optional)

Focus on:

1. Fun gameplay
2. Stable multiplayer
3. Clean UI
