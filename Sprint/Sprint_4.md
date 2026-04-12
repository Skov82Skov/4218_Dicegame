# 🎲 4218 – Sprint 4 (Core Gameplay & Hidden Dice)

---

# 🧭 Sprint Goal

Implement the **core gameplay mechanics** and the **hidden-information system**.

Players take turns **one at a time**. During a turn, other players can only see the dice that the active player has **put aside**. The active player may also **hide the final die on the last roll**, so opponents do not know the full result until the round ends.

This sprint makes the game playable and adds the bluffing element.

---

# 🏁 Sprint 4 Deliverable

At the end of Sprint 4:

✅ Players take turns one at a time
✅ Dice rolling works
✅ Keep-dice system works
✅ Player must keep at least 1 die after each roll
✅ Other players only see kept dice
✅ Player can hide the final die on the last roll
✅ Full dice are revealed at end of round
✅ Turn state syncs in realtime

---

# 🧩 User Story

**As a player**,
I want to roll dice privately while only showing the dice I set aside,
so other players must guess what I may still have and think strategically about what they need to win the round.

---

# 🎟️ Sprint 4 Tickets

---

## Ticket 1 — Create turn state model

### Goal

Track the full state of one player's turn.

### Data Structure

* `playerId`
* `rolledDice[]`
* `keptDice[]`
* `hiddenDice[]`
* `remainingDice`
* `rollCount`
* `hasRolled`
* `isFinished`
* `isLastRoll`
* `hiddenLastDie`

### Acceptance Criteria

* Turn state exists for the active player
* Turn state resets correctly when the next turn starts

---

## Ticket 2 — Create private vs public turn view

### Goal

Show different information to the active player and the other players.

### Rules

* Active player sees all their dice
* Other players only see:

  * kept dice
  * number of hidden dice remaining
* Other players do not see currently rolled dice
* Other players do not see the hidden last die

### Acceptance Criteria

* Server can produce:

  * private view for active player
  * public view for all other players

---

## Ticket 3 — Dice rolling logic

### Goal

Roll only the dice that are still in play.

### Tasks

* Create random dice generator (1–6)
* Roll only remaining dice
* Store the result privately for the active player

### Acceptance Criteria

* Rolled dice are valid
* Only unkept dice are rolled
* Rolled result is hidden from other players

---

## Ticket 4 — Create roll action

### Goal

Let the active player roll dice.

### Event

`turn:roll`

### Tasks

* Validate it is the player’s turn
* Roll remaining dice
* Update private turn state
* Broadcast public state to others
* Send private state to active player

### Acceptance Criteria

* Only active player can roll
* Other players do not see the rolled dice values
* Everyone sees updated public turn state correctly

---

## Ticket 5 — Keep dice system

### Goal

Allow player to put dice aside after a roll.

### Tasks

* Active player selects one or more dice to keep
* Move selected dice into `keptDice`
* Reduce number of remaining dice

### Acceptance Criteria

* Kept dice are visible to all players
* Kept dice are not rolled again
* Remaining dice count updates correctly

---

## Ticket 6 — Enforce rule: keep at least 1 die

### Goal

Prevent invalid play.

### Tasks

* Require player to keep at least one die after each roll
* Block future rolls until they do
* Return error message if rule is broken

### Acceptance Criteria

* Player cannot continue without keeping at least one die

---

## Ticket 7 — Public visibility update

### Goal

Update all opponents with only allowed information.

### Other players should see:

* kept dice
* how many dice remain hidden
* whether the turn is finished

### They should NOT see:

* active rolled dice
* hidden dice values
* hidden last die value

### Acceptance Criteria

* Public state does not leak secret information

---

## Ticket 8 — Turn order system

### Goal

Ensure players act one at a time.

### Tasks

* Track turn order
* Track active player index
* Block actions from non-active players
* Move to next player when turn ends

### Acceptance Criteria

* Only one player can act at a time
* Turn rotates correctly across players

---

## Ticket 9 — Add finish turn action

### Goal

Allow player to stop when they want.

### Tasks

* Add `turn:finish` action
* Mark turn as complete
* Save final dice state privately until reveal phase

### Acceptance Criteria

* Active player can finish turn
* Final dice are locked for that player

---

## Ticket 10 — Add hidden last die feature

### Goal

Let the player hide the final die on the last roll.

### Rules

* Only applies on the final roll
* Hidden die remains secret until the reveal phase
* Other players should not know its value

### Tasks

* Add hide-last-die option
* Store hidden last die privately
* Show placeholder publicly

### Acceptance Criteria

* Last die can be hidden correctly
* Other players cannot see the hidden value
* Active player still sees it

---

## Ticket 11 — Represent hidden dice in UI

### Goal

Make hidden information understandable in the interface.

### Tasks

* Show kept dice normally
* Show hidden dice as placeholders, such as `?`
* Show hidden final die differently if needed
* Make it clear whose turn it is

### Acceptance Criteria

* UI clearly separates visible dice from hidden dice

---

## Ticket 12 — Prevent invalid actions

### Goal

Avoid broken gameplay states.

### Tasks

* Prevent rolling after turn is finished
* Prevent keeping dice before rolling
* Prevent hiding last die too early
* Prevent out-of-turn actions

### Acceptance Criteria

* Invalid actions are blocked
* Clear errors are returned

---

## Ticket 13 — Store end-of-turn results securely

### Goal

Prepare for round reveal and Sprint 5 scoring.

### Store

* `playerId`
* `finalDice`
* `keptDice`
* `hiddenDice`
* `hiddenLastDie`
* `isFinished`

### Acceptance Criteria

* Full end-of-turn result is saved for reveal phase

---

## Ticket 14 — Add round reveal phase

### Goal

Reveal all hidden information after all players have finished their turns.

### Flow

1. Player 1 finishes full turn
2. Player 2 finishes full turn
3. Continue until all active players finish
4. Reveal all final dice for all players
5. Send round results to everyone

### Acceptance Criteria

* No full result is revealed early
* All hidden dice are revealed together at round end

---

## Ticket 15 — Create round reveal event

### Goal

Broadcast all final dice when the round is complete.

### Event

`round:reveal`

### Payload example

```ts
{
  players: [
    {
      playerId: "p1",
      finalDice: [4, 2, 6, 6, 3]
    },
    {
      playerId: "p2",
      finalDice: [4, 5, 5, 1, 2]
    }
  ]
}
```

### Acceptance Criteria

* All players receive complete dice results at end of round

---

## Ticket 16 — Frontend dice UI

### Goal

Make dice interactive for the current player.

### Tasks

* Show current player’s full dice
* Allow selecting dice to keep
* Show kept dice separately
* Show hidden placeholders for opponents

### Acceptance Criteria

* Current player can interact with dice
* Opponents only see public information

---

## Ticket 17 — Action buttons UI

### Goal

Allow correct turn actions.

### Buttons

* Roll Dice
* Keep Dice
* Hide Last Die
* Finish Turn

### Acceptance Criteria

* Buttons only work when allowed
* Buttons are disabled for non-active players

---

## Ticket 18 — Realtime turn sync

### Goal

Keep all players synchronized without leaking hidden data.

### Sync:

* active player
* kept dice
* hidden dice count
* turn finished state
* reveal phase

### Acceptance Criteria

* All players stay in sync
* Secret dice stay secret until reveal

---

## Ticket 19 — Handle reconnect during a turn

### Goal

Restore correct state after refresh or reconnect.

### Tasks

* Restore private state for reconnecting active player
* Restore public table view for opponents
* Preserve hidden information correctly

### Acceptance Criteria

* Reconnect does not reveal hidden dice to others

---

## Ticket 20 — Test gameplay flow

### Manual Tests

* [ ] Active player rolls dice
* [ ] Other players do not see rolled dice values
* [ ] Active player keeps one or more dice
* [ ] Kept dice become visible to everyone
* [ ] Active player rolls remaining dice
* [ ] Active player can hide the last die on final roll
* [ ] Other players only see placeholders for hidden dice
* [ ] Turn finishes correctly
* [ ] After all players finish, all dice are revealed
* [ ] Reveal data matches actual stored dice

---

# 📁 New Files for Sprint 4

### Backend

```text
server/src/modules/game/
├─ game-engine.ts
├─ turn-manager.ts
├─ dice.service.ts
├─ public-turn-view.ts
├─ reveal.service.ts
├─ game.types.ts
```

### Frontend

```text
client/src/components/game/
├─ DiceTray.tsx
├─ Die.tsx
├─ TurnPanel.tsx
├─ HiddenDie.tsx
├─ RevealModal.tsx
```

---

# ⚠️ Risks

* Secret dice leaking to other players
* Turn state desync
* Wrong timing for reveal phase
* Hidden last die being shown too early
* Reconnect exposing private data

---

# 🛠️ Notes

Sprint 4 is about:

* turn flow
* hidden information
* reveal phase

Do **not** resolve scoring or life loss here.
That belongs in Sprint 5.

Sprint 4 should end with:

* all players finishing their turns one by one
* all hidden dice revealed
* round data ready for scoring

---

# ✅ Definition of Done

Sprint 4 is complete when:

* players take turns one at a time
* active player can roll and keep dice
* player must keep at least one die after each roll
* opponents only see kept dice
* last die can be hidden on final roll
* all hidden dice are revealed only at end of round
* round state syncs correctly in realtime

---

# 👉 Next Step

Sprint 5 = **Scoring, Lives, Tie-Breakers, and Winner**

* score only after reveal
* compare all finished turns
* loser loses life/lives
* resolve ties
* eliminate players
* detect winner
