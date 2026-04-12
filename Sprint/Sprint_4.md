# 🎲 4218 – Sprint 4 (Core Gameplay)

---

# 🧭 Sprint Goal

Implement the **core gameplay mechanics**, so players can:

* Take turns
* Roll dice
* Keep dice between rolls
* Follow the rule: **must keep at least one die each roll**
* Optionally stop early
* Hide the last die
* Finish a turn

This is where the game becomes playable (without full scoring/lives yet).

---

# 🏁 Sprint 4 Deliverable

At the end of Sprint 4:

✅ Players can take turns
✅ Dice rolling works
✅ Keep-dice system works
✅ Turn flow is enforced
✅ Players can finish turns
✅ Turn state syncs in realtime

---

# 🧩 User Story

**As a player**,
I want to roll dice and play my turn,
so I can try to get the best possible result.

---

# 🎟️ Sprint 4 Tickets

---

## Ticket 1 — Create turn state model

### Goal

Track what happens during a player's turn.

### Data Structure

* `playerId`
* `dice[]`
* `keptDice[]`
* `remainingDice`
* `rollCount`
* `hasRolled`
* `isFinished`
* `hiddenLastDie`

### Tasks

* Add turn state to game object
* Reset turn state when new turn starts

### Acceptance Criteria

* Turn state exists and updates correctly

---

## Ticket 2 — Dice rolling logic

### Goal

Simulate rolling dice.

### Tasks

* Create dice generator (1–6)
* Roll only remaining dice
* Update dice values each roll

### Acceptance Criteria

* Dice roll produces valid values
* Only unkept dice are rolled

---

## Ticket 3 — Create roll action (socket)

### Goal

Let player roll dice.

### Event

`turn:roll`

### Tasks

* Validate it is player’s turn
* Roll dice
* Update turn state
* Broadcast updated state

### Acceptance Criteria

* Only current player can roll
* All players see dice update in realtime

---

## Ticket 4 — Keep dice system

### Goal

Allow player to lock dice between rolls.

### Tasks

* Player selects dice to keep
* Move selected dice to `keptDice`
* Reduce remaining dice count

### Acceptance Criteria

* Kept dice are not rolled again
* Remaining dice decrease correctly

---

## Ticket 5 — Enforce rule: keep at least 1 die

### Goal

Prevent invalid gameplay.

### Tasks

* Validate that player selects ≥1 die after each roll
* Block next roll if not satisfied
* Show error message

### Acceptance Criteria

* Player cannot roll again without keeping at least one die

---

## Ticket 6 — Sync dice and kept dice

### Goal

Ensure all players see the same state.

### Tasks

* Broadcast:

  * rolled dice
  * kept dice
* Update UI for all players

### Acceptance Criteria

* All players see same dice state in realtime

---

## Ticket 7 — Add turn order system

### Goal

Control which player acts.

### Tasks

* Store list of players
* Track current player index
* Move to next player when turn ends

### Acceptance Criteria

* Only one player can act at a time
* Turn rotates correctly

---

## Ticket 8 — Highlight current player (UI)

### Goal

Make turns clear.

### Tasks

* Highlight active player
* Disable controls for other players

### Acceptance Criteria

* Only active player can interact
* UI clearly shows whose turn it is

---

## Ticket 9 — Add “Finish Turn” action

### Goal

Allow player to stop rolling.

### Tasks

* Add button to finish turn
* Mark turn as complete
* Store final dice result

### Acceptance Criteria

* Player can end turn early
* Turn result is saved

---

## Ticket 10 — Hide last die feature

### Goal

Implement bluff/hidden mechanic.

### Tasks

* Allow player to hide final die
* Store hidden value separately
* Show hidden state to other players

### Acceptance Criteria

* Last die is hidden from others
* Player still sees their own die

---

## Ticket 11 — Prevent invalid actions

### Goal

Avoid broken gameplay.

### Tasks

* Prevent rolling after finishing turn
* Prevent keeping dice before rolling
* Prevent actions out of turn

### Acceptance Criteria

* Invalid actions are blocked
* Errors handled cleanly

---

## Ticket 12 — End turn and move to next player

### Goal

Complete turn flow.

### Tasks

* After finishing turn:

  * lock state
  * move to next player
* Reset turn state for next player

### Acceptance Criteria

* Turn switches correctly
* Next player starts fresh

---

## Ticket 13 — Add turn timeout (optional)

### Goal

Prevent stalling.

### Tasks

* Add timer per turn (optional)
* Auto-finish turn on timeout

### Acceptance Criteria

* Turn ends automatically if enabled

---

## Ticket 14 — Add game state container

### Goal

Prepare for scoring (Sprint 5).

### Tasks

* Store all players' final turn results
* Store dice outcomes per round

### Acceptance Criteria

* All results are saved for next sprint

---

## Ticket 15 — Frontend dice UI

### Goal

Make dice interactive.

### Tasks

* Display dice visually
* Click to select dice
* Show kept vs active dice

### Acceptance Criteria

* Dice can be selected and kept
* UI updates correctly

---

## Ticket 16 — Action buttons UI

### Goal

Allow player interaction.

### Buttons

* Roll Dice
* Keep Dice
* Finish Turn

### Acceptance Criteria

* Buttons work correctly
* Disabled when not allowed

---

## Ticket 17 — Realtime turn sync

### Goal

Keep all players aligned.

### Tasks

* Sync:

  * current player
  * dice state
  * kept dice
  * turn end

### Acceptance Criteria

* No desync between players

---

## Ticket 18 — Handle reconnect during turn

### Goal

Avoid breaking the game.

### Tasks

* Restore current turn state on reconnect
* Ensure player continues correctly

### Acceptance Criteria

* Reconnecting player sees correct dice state

---

## Ticket 19 — Test gameplay flow

### Manual Tests

* [ ] Player rolls dice
* [ ] Player keeps at least one die
* [ ] Player rolls remaining dice
* [ ] Player finishes turn
* [ ] Turn moves to next player
* [ ] Other players cannot act
* [ ] Dice sync correctly between players
* [ ] Hidden die works

---

# 📁 New Files for Sprint 4

### Backend

```text
server/src/modules/game/
├─ game-engine.ts
├─ turn-manager.ts
├─ dice.service.ts
├─ game.types.ts
```

### Frontend

```text
client/src/components/game/
├─ DiceTray.tsx
├─ Die.tsx
├─ TurnPanel.tsx
```

---

# ⚠️ Risks

* Turn desync between players
* Dice state inconsistencies
* Invalid keep/roll sequences
* Hidden die bugs
* Reconnect issues mid-turn

---

# 🛠️ Notes

Focus ONLY on gameplay flow:

Do NOT implement:

* scoring
* lives
* winner detection

That comes in Sprint 5

---

# ✅ Definition of Done

Sprint 4 is complete when:

* players can take turns
* dice can be rolled and kept
* rules are enforced (keep at least 1 die)
* turn flow works correctly
* UI updates in realtime
* hidden die feature works

---

# 👉 Next Step

Sprint 5 = **Game Rules & Winning**

* scoring system
* lives system
* tie-breakers
* player elimination
* final winner
