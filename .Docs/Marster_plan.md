# 🎲 4218 – Master Plan (MVP)

---

# 🧭 Project Overview

**4218** is a multiplayer dice game for 2–5 players where:

* Players take turns **one at a time**
* Players must roll a **4 and a 2** to score
* Other dice determine the score (max 18)
* Dice are **partially hidden during turns**
* Final dice are revealed at the end of each round
* Players lose lives until only one remains

---

# 🎯 Final Goal

Deliver a fully playable MVP where players can:

* Enter a name (no account)
* Create/join tables
* Play in real time
* Use hidden dice mechanics
* Compete until one player wins
* Restart or leave after game ends

---

# 🧩 Core Game Rules

## 🎲 Turn Rules

* Each player has **5 dice**
* Player rolls dice and must:

  * **Keep at least 1 die per roll**
* Player may stop at any time
* Player may hide the last die

---

## 👀 Visibility Rules

* Other players only see:

  * Dice that are **set aside**
* Other players cannot see:

  * Rolled dice
  * Hidden dice
  * Final hidden die

---

## 🔓 Reveal Phase

* After all players finish their turns:

  * All dice are revealed
  * Scores are calculated

---

## 🧮 Scoring Rules

* Must have **one 4 and one 2**
* If not → score = **0**
* If yes → sum remaining 3 dice
* Max score = **18**

---

## 💀 Lives

* Each player starts with **6 lives**
* Lowest score loses:

  * **1 life normally**
  * **2 lives if someone scored 18**

---

## ⚔️ Tie-Breaker

* Tied lowest players:

  * Roll 5 dice once
  * Must still get 4 and 2
* Repeat until one loser is found

---

## 🏆 Winning

* Last player with lives remaining wins

---

# 🏗️ Development Plan (Sprints)

---

# 🟢 Sprint 1 — Name Entry & Setup

## Goal

Player can enter a name and reach lobby

## Features

* No login system
* Name input
* Validation
* Local storage of player identity
* Lobby placeholder

---

# 🟡 Sprint 2 — Tables

## Goal

Players can create and join tables

## Features

* Create table (2–5 players)
* Join/leave table
* Lobby shows available tables
* Seat system

---

# 🔵 Sprint 3 — Realtime

## Goal

Make tables update live

## Features

* Socket.IO setup
* Live lobby updates
* Live table updates
* Ready system
* Host system
* Start game

---

# 🟣 Sprint 4 — Core Gameplay

## Goal

Implement turns + hidden dice system

## Features

* Turn-based gameplay
* Dice rolling
* Keep dice rule
* Hidden dice system
* Hidden last die
* Private vs public dice view
* Round reveal phase

---

# 🔴 Sprint 5 — Game Rules

## Goal

Make the game complete

## Features

* Scoring system
* Lives system
* Lowest score detection
* 18 rule (lose 2 lives)
* Tie-breakers
* Player elimination
* Winner detection

---

# 🟠 Sprint 6 — Polish & UX

## Goal

Make the game feel finished

## Features

* Poker-style table UI
* Clear turn indicators
* Hidden dice visuals
* Reveal animations
* Round result modal
* Winner screen
* Play again flow
* Mobile support

---

# 🧱 Architecture Overview

## Frontend (Client)

* Next.js / React
* Handles UI and interaction
* Displays:

  * table
  * dice
  * players
  * results

---

## Backend (Server)

* Node.js + Socket.IO
* Handles:

  * game state
  * turn logic
  * scoring
  * realtime sync

---

## Realtime

* Socket.IO
* Rooms:

  * lobby
  * table
  * game

---

## Storage

* MVP: in-memory
* Optional: PostgreSQL later

---

# 🔌 Core Systems

---

## 🎲 Game Engine

Controls:

* turns
* dice
* state transitions
* round progression

---

## 🧮 Scoring System

* Validates 4 + 2
* Calculates score
* Handles edge cases

---

## ⚔️ Tie-Breaker System

* Handles tied lowest players
* Runs until one loser is found

---

## 💀 Lives System

* Tracks player lives
* Applies penalties
* Handles elimination

---

## 🔄 Realtime Sync

* Sends:

  * public game state
  * private player state
* Keeps all players in sync

---

# 🎨 UI Structure

## Main Screens

* Name Entry
* Lobby
* Table
* Game View

---

## Game Table

* Center: dice area
* Around table: player seats
* Side panel:

  * actions
  * messages
  * game log

---

## Player Seat

Shows:

* name
* lives
* turn highlight
* ready status
* eliminated state

---

# ⚠️ Key Risks

* Hidden dice leaking to other players
* Turn desync
* Tie-break infinite loops
* Reconnect issues
* UI confusion with hidden info

---

# 🛠️ Development Priorities

1. Game logic correctness
2. Realtime stability
3. Clear UI feedback
4. Smooth gameplay flow

---

# ✅ Definition of MVP Done

The project is complete when:

* player enters name and joins game
* tables work
* realtime works
* turns work
* hidden dice works correctly
* reveal works correctly
* scoring is accurate
* lives update correctly
* tie-breakers work
* players are eliminated
* winner is detected
* UI is clear and usable

---

# 🚀 Future Improvements

* Friend system
* Leaderboard
* Match history
* AI bots
* Custom rules
* Animations and effects
* Mobile-first design

---

# 👨‍💻 Final Notes

Keep it simple:

* No accounts
* No unnecessary features
* Focus on gameplay first

The strength of 4218 is:
👉 hidden information
👉 tension between players
👉 simple but strategic rules

---

**Goal: A fast, fun, strategic multiplayer dice game**
