# 🎲 4218 – Multiplayer Dice Game

4218 is an online multiplayer dice game for 2–5 players where luck, strategy, and timing determine who survives. The goal is simple: **be the last player standing**.

---

## 🧩 Game Overview

Each player rolls **5 dice** and must achieve:

* A **4** and a **2** (giving the game its name: *42*)
* The remaining **3 dice** should be as high as possible
  → Maximum score: **18**

---

## 🎯 Objective

* Roll a **4 and a 2**
* Maximize the sum of the remaining dice
* Avoid losing lives
* Be the **last player with lives remaining**

---

## 🎮 Game Rules

### 🎲 Turn Mechanics

* Each turn starts with **5 dice**
* The player must:

  * Roll the dice
  * **Set aside at least one die after each roll**
* The player may:

  * Stop at any time
  * Hide the last die until the round ends

---

### 🧮 Scoring

* ❌ No 4 AND 2 → **0 points**
* ✅ If both are present:

  * Score = sum of the remaining 3 dice
  * Max = **18**

---

### 💀 Lives System

* Each player starts with **6 lives**
* Lowest score loses a life

#### Special Rule:

* If a player rolls **18 (3×6)**:

  * The loser loses **2 lives**

---

### ⚔️ Tie-Breaker

If players tie for lowest score OR fail to roll 4 and 2:

1. Roll all 5 dice once
2. Must still get **4 and 2**
3. If no winner → repeat
4. If multiple succeed → highest score wins

---

## 🏆 Winning

The last player with remaining lives wins the game.

---

## 🌐 Features

* 🔐 User authentication (login/register)
* 🪑 Create and join tables (2–5 players)
* 👥 Invite friends
* 🎲 Real-time dice gameplay (Socket.IO)
* 🃏 Poker-style table UI
* 💬 Chat system (optional)

---

## 🏗️ Tech Stack

* **Frontend:** Next.js (React + TypeScript)
* **Backend:** Node.js (Express / NestJS)
* **Realtime:** Socket.IO
* **Database:** PostgreSQL (Prisma)
* **Monorepo:** pnpm / Turborepo
* **Deployment:** Docker

---

## 📁 Project Structure

```text
4218/
├─ apps/
│  ├─ client/        # Frontend (Next.js)
│  ├─ server/        # Backend (Node.js)
│  └─ shared/        # Shared types/constants
│
├─ docs/             # Documentation
├─ tests/            # Unit, integration, e2e tests
├─ packages/         # Shared configs/components
├─ scripts/          # Dev & setup scripts
├─ docker-compose.yml
├─ .env.example
└─ README.md
```

---

## 🧠 Core Backend Logic

Located in:

```text
apps/server/src/modules/game/
```

Key files:

* `game-engine.ts` → controls game flow
* `game-rules.ts` → validates rules
* `scoring.ts` → calculates score
* `tie-breaker.ts` → handles ties
* `turn-manager.ts` → manages turns

---

## 🎨 Frontend Structure

Main UI parts:

```text
client/src/
├─ app/              # Pages (Next.js routing)
├─ components/
│  ├─ game/          # Dice, table, players
│  ├─ lobby/         # Table list & creation
│  └─ auth/          # Login/register
├─ hooks/            # Custom hooks
├─ store/            # State management
└─ lib/              # API + socket logic
```

---

## 🔌 Realtime Events (Socket.IO)

### Client → Server

```text
table:create
table:join
game:start
turn:roll
turn:keepDice
turn:finish
```

### Server → Client

```text
game:started
turn:started
dice:rolled
turn:finished
round:resolved
player:eliminated
game:ended
```

---

## 🗄️ Database Models (Simplified)

* User
* Friend
* Table
* Game
* GamePlayer
* Turn
* Roll
* Invitation

---

## ⚙️ Setup

### 1. Clone project

```bash
git clone https://github.com/yourusername/4218.git
cd 4218
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Setup environment

```bash
cp .env.example .env
```

---

## ▶️ Run the project

```bash
# Start database + services
docker-compose up -d

# Start dev servers
pnpm dev
```

Frontend: http://localhost:3000
Backend: http://localhost:4000

---

## 🧪 Testing

```bash
pnpm test
```

Includes:

* Unit tests (game logic)
* Integration tests
* End-to-end gameplay tests

---

## 🚀 Roadmap

* [ ] Dice animations
* [ ] Player rankings / leaderboard
* [ ] Mobile support
* [ ] Sound effects
* [ ] AI bots

---

## 📜 License

MIT License

---

## 👨‍💻 Author

Your Name Here
