# 🏆 4218 – Sprint 5 (Scoring, Lives, Tie-Breakers, and Winner)

---

# 🧭 Sprint Goal

Implement the full **round resolution** after all players have finished their turns.

In Sprint 4, players:

* played **one at a time**
* kept some dice visible
* hid the rest
* revealed all dice at the end of the round

In Sprint 5, the game must now:

* score every player after reveal
* find the losing player
* remove life or lives
* handle tie-breakers
* eliminate players
* detect the winner
* start the next round

---

# 🏁 Sprint 5 Deliverable

At the end of Sprint 5:

✅ Scores are calculated only **after all dice are revealed**
✅ A player only scores if they have a **4 and a 2**
✅ Score = sum of the other 3 dice
✅ All players start with **6 lives**
✅ Lowest score loses life
✅ If any player gets the maximum score, the loser loses **2 lives**
✅ Tie-breakers work
✅ Eliminated players are removed from the game
✅ Last player standing wins

---

# 🧩 Important Round Rule

Players still play **one at a time**.

A round works like this:

1. Player 1 finishes full turn
2. Player 2 finishes full turn
3. Continue until all active players have finished
4. Reveal all hidden dice
5. Score all players
6. Find the lowest score
7. Run tie-breaker if needed
8. Remove life or lives from the loser
9. Eliminate players at 0 lives
10. Check if one player remains
11. Start next round if the game continues

---

# 🎟️ Sprint 5 Tickets

---

## Ticket 1 — Create scoring function

### Goal

Calculate score from the player's revealed final dice.

### Rules

* A player must have at least one **4** and one **2**
* If not, score = **0**
* If yes:

  * remove one 4
  * remove one 2
  * add the remaining 3 dice

### Acceptance Criteria

* Score is correct for valid and invalid dice sets
* Scoring only uses revealed final dice

---

## Ticket 2 — Handle duplicate dice correctly

### Goal

Make sure scoring works when there are repeated values.

### Examples

* `4,2,6,6,6` → score **18**
* `4,4,2,6,1` → score **11**
* `1,2,3,4,5` → score **9**
* `4,6,6,6,6` → score **0**
* `2,6,6,6,6` → score **0**

### Acceptance Criteria

* Only one 4 and one 2 are used
* Remaining 3 dice are scored correctly

---

## Ticket 3 — Store revealed round results

### Goal

Save the final revealed result for every active player.

### Store

* `playerId`
* `finalDice`
* `has42`
* `score`
* `livesBefore`
* `livesAfter`
* `isEliminated`

### Acceptance Criteria

* Every active player has a round result after reveal

---

## Ticket 4 — Add lives to players

### Goal

Track how many lives each player has left.

### Rules

* Every player starts with **6 lives**

### Acceptance Criteria

* Game setup gives 6 lives to each player
* Lives persist between rounds

---

## Ticket 5 — Resolve round only after all turns are complete

### Goal

Prevent early scoring.

### Tasks

* Track all completed turns in the round
* Wait until all active players are finished
* Only then reveal all dice and score

### Acceptance Criteria

* No player is scored before the full round is finished

---

## Ticket 6 — Detect lowest score

### Goal

Find the losing score after all players are scored.

### Rules

* Lowest score loses
* Score 0 counts as lowest if player did not get 4 and 2

### Acceptance Criteria

* Lowest score is found correctly
* 0-point players are included

---

## Ticket 7 — Detect tied lowest players

### Goal

Find whether more than one player shares the lowest score.

### Tasks

* Build list of players tied for lowest
* Trigger tie-breaker when needed

### Acceptance Criteria

* Tie-breaker starts only when two or more players share the lowest score

---

## Ticket 8 — Apply normal life loss

### Goal

Remove 1 life from the round loser.

### Rules

* If there is one clear loser, they lose **1 life**

### Acceptance Criteria

* Losing player’s life count decreases by 1

---

## Ticket 9 — Apply special max-score rule

### Goal

Handle the rule where a very strong round punishes the loser more.

### Rules

* If any player gets the **maximum possible score**
* The loser loses **2 lives** instead of 1

### Acceptance Criteria

* Loser loses 2 lives when the round contains a max score
* Otherwise loser loses 1 life

---

## Ticket 10 — Build tie-breaker round

### Goal

Resolve ties for the lowest score.

### Rules

* Only tied lowest players join tie-breaker
* Each tied player gets **one roll with 5 dice**
* They still need a **4 and a 2**
* If nobody breaks the tie, repeat tie-breaker round
* Continue until one final loser is found

### Acceptance Criteria

* Tie-breaker only includes tied lowest players
* Tie-breaker ends with one loser

---

## Ticket 11 — Score tie-breaker using same scoring rules

### Goal

Keep tie-breaker logic consistent with the main game.

### Rules

* Need 4 and 2
* Otherwise score 0
* If valid, score is the sum of the remaining 3 dice

### Acceptance Criteria

* Tie-breaker scoring matches normal scoring rules

---

## Ticket 12 — Repeat tie-breaker until resolved

### Goal

Avoid unresolved ties.

### Tasks

* If tie-breaker still ends in shared lowest score
* Start another tie-breaker round automatically

### Acceptance Criteria

* Tie-breaker never ends without a final loser

---

## Ticket 13 — Reveal tie-breaker dice to all players

### Goal

Make tie-breaker results visible and fair.

### Tasks

* Show tie-breaker rolls to all players
* Show tie-breaker scores
* Announce final loser

### Acceptance Criteria

* Players can see how the tie-breaker was resolved

---

## Ticket 14 — Eliminate players at 0 lives

### Goal

Remove players who are out of the game.

### Rules

* A player with **0 lives** is eliminated

### Acceptance Criteria

* Eliminated players are marked correctly
* Eliminated players do not enter future rounds

---

## Ticket 15 — Update turn order after elimination

### Goal

Prepare the next round correctly.

### Tasks

* Remove eliminated players from active turn order
* Rebuild round order if needed

### Acceptance Criteria

* New round only includes active players

---

## Ticket 16 — Detect winner

### Goal

End the game when only one player remains.

### Rules

* Last player with lives remaining wins

### Acceptance Criteria

* Game ends automatically when only one active player remains

---

## Ticket 17 — Lock finished game

### Goal

Stop extra actions after game over.

### Tasks

* Set game status to `finished`
* Store winner ID
* Block future rolls and turns

### Acceptance Criteria

* No more gameplay actions are allowed after game over

---

## Ticket 18 — Create round resolution flow

### Goal

Handle the whole end-of-round process in one clean sequence.

### Flow

1. All active players finish turns
2. Reveal all dice
3. Score all players
4. Find lowest score
5. Resolve tie-breaker if needed
6. Remove life/lives
7. Eliminate players with 0 lives
8. Check winner
9. Start next round if needed

### Acceptance Criteria

* Round resolution works from end of turns to next round start

---

## Ticket 19 — Create round result event

### Goal

Send one clear result payload to the frontend.

### Payload should include

* revealed dice for all players
* scores for all players
* loser
* lives lost
* eliminated players
* next round or winner

### Acceptance Criteria

* Frontend gets one complete round summary event

---

## Ticket 20 — Frontend scoreboard UI

### Goal

Show the current standing after each round.

### Show

* player names
* revealed dice
* score
* remaining lives
* eliminated state

### Acceptance Criteria

* Players can clearly understand the result of the round

---

## Ticket 21 — Show life loss, elimination, and winner in UI

### Goal

Make the round result easy to read.

### Show messages for

* lost 1 life
* lost 2 lives
* eliminated
* winner

### Acceptance Criteria

* Result messages are clear and easy to understand

---

## Ticket 22 — Test scoring examples

### Manual Tests

* [ ] `4,2,6,6,6` = 18
* [ ] `4,2,1,1,1` = 3
* [ ] `4,4,2,6,1` = 11
* [ ] `1,2,3,4,5` = 9
* [ ] `4,6,6,6,6` = 0
* [ ] `2,6,6,6,6` = 0

### Acceptance Criteria

* All scoring examples return the correct result

---

## Ticket 23 — Test loser logic

### Manual Tests

* [ ] One clear lowest score loses 1 life
* [ ] A round with max score makes loser lose 2 lives
* [ ] Two players tie for lowest → tie-breaker starts
* [ ] Two players with 0 score → tie-breaker starts
* [ ] Tie-breaker repeats until loser is found

### Acceptance Criteria

* Loser logic works in all edge cases

---

## Ticket 24 — Test full game flow

### Manual Tests

* [ ] 2-player game completes correctly
* [ ] 3-player game eliminates a player correctly
* [ ] Eliminated player does not take a turn in next round
* [ ] Final winner is detected correctly
* [ ] Game stops after winner is declared

### Acceptance Criteria

* Full match works from first round to final winner

---

# 📁 New Files for Sprint 5

### Backend

```text
server/src/modules/game/
├─ scoring.ts
├─ round-resolver.ts
├─ tie-breaker.ts
├─ lives.service.ts
├─ winner.service.ts
```

### Frontend

```text
client/src/components/game/
├─ ScoreBoard.tsx
├─ RoundResultModal.tsx
├─ LifeCounter.tsx
├─ WinnerModal.tsx
```

---

# ⚠️ Risks

* Wrong score calculation when duplicate dice exist
* Tie-breaker loop not ending correctly
* Wrong player losing life
* Eliminated players still appearing in turn order
* Round resolving before all players have finished

---

# 🛠️ Notes

Keep the logic split clearly:

* `scoring.ts` → calculates score only
* `tie-breaker.ts` → resolves tied lowest players
* `round-resolver.ts` → handles end-of-round logic
* `lives.service.ts` → updates life loss and elimination
* `winner.service.ts` → decides whether the game has ended

This will make the game much easier to test.

---

# ✅ Definition of Done

Sprint 5 is complete when:

* scoring happens only after round reveal
* 4 and 2 rule is enforced
* lowest score loses correctly
* max-score punishment rule works
* tie-breakers work correctly
* lives update correctly
* players are eliminated at 0 lives
* winner is detected
* next round starts correctly unless the game is finished

---

# 👉 Next Step

Sprint 6 = **Polish and UX**

* poker-style table layout
* better seat visuals
* dice animations
* result messages
* sounds
* restart / play again flow
