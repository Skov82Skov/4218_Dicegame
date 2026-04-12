# ✨ 4218 – Sprint 6 (Polish, UX, and Final Game Feel)

---

# 🧭 Sprint Goal

Improve the overall experience so the game feels finished, clear, and fun to play.

Sprint 6 is about:

* better table visuals
* clearer turn feedback
* nicer reveal flow
* better result messages
* smoother player experience
* restart / play again flow

The core game should already work before this sprint begins.

---

# 🏁 Sprint 6 Deliverable

At the end of Sprint 6:

✅ The table looks like a real multiplayer game
✅ Players clearly understand whose turn it is
✅ Hidden dice and reveal moments feel exciting
✅ Round results are easy to understand
✅ Eliminations and winner are shown clearly
✅ Players can start a new game after one ends
✅ The game feels complete enough for MVP release

---

# 🧩 User Story

**As a player**,
I want the game to feel smooth, clear, and exciting,
so it is fun to play and easy to understand even when information is hidden.

---

# 🎟️ Sprint 6 Tickets

---

## Ticket 1 — Build poker-style table layout

### Goal

Make the game table visually match the game idea.

### Tasks

* Create round table / poker-table inspired layout
* Place player seats around the table
* Support 2 to 5 players
* Keep center area for dice and round events

### Acceptance Criteria

* Table layout looks good for 2, 3, 4, and 5 players
* Players are positioned clearly around the table

---

## Ticket 2 — Improve seat UI

### Goal

Make each player seat easy to read.

### Show at each seat

* player name
* lives
* host badge if relevant
* ready status if in waiting state
* eliminated state
* active turn highlight

### Acceptance Criteria

* Each seat clearly shows important player info
* Active player is obvious

---

## Ticket 3 — Add turn-status messaging

### Goal

Help players understand what is happening.

### Example messages

* `It is Andreas's turn`
* `Choose at least 1 die to keep`
* `Last die can be hidden`
* `Waiting for other player...`

### Acceptance Criteria

* Players always know the current step in the turn flow

---

## Ticket 4 — Improve hidden dice display

### Goal

Make hidden information understandable but secret.

### Tasks

* Show visible kept dice normally
* Show hidden dice as placeholders
* Show hidden last die with special indicator if needed
* Make public vs private dice views visually different

### Acceptance Criteria

* Hidden information is clear
* Secret dice are never shown too early

---

## Ticket 5 — Add reveal animation / reveal flow

### Goal

Make end-of-round reveal feel exciting.

### Tasks

* Animate reveal of hidden dice
* Show all final dice for all players
* Delay score display slightly for dramatic effect

### Acceptance Criteria

* Reveal phase feels clear and satisfying
* Players can follow what was hidden and what was revealed

---

## Ticket 6 — Improve round result modal

### Goal

Summarize the round clearly.

### Show

* all players
* final dice
* score
* loser
* lives lost
* eliminated players
* whether next round starts or game is over

### Acceptance Criteria

* Round result is easy to understand in one screen

---

## Ticket 7 — Add life-loss feedback

### Goal

Make penalties obvious.

### Tasks

* Show message when player loses 1 life
* Show stronger message when player loses 2 lives
* Animate or highlight life counter change

### Acceptance Criteria

* Players immediately understand who lost life and how many

---

## Ticket 8 — Add elimination feedback

### Goal

Make knockout moments clear.

### Tasks

* Show elimination banner or message
* Update player seat visual to eliminated state
* Remove eliminated player from future rounds clearly

### Acceptance Criteria

* Eliminated players are visually obvious

---

## Ticket 9 — Add winner screen

### Goal

Celebrate the final winner.

### Show

* winner name
* winning seat/player
* option to play again
* option to return to lobby

### Acceptance Criteria

* End of game feels complete
* Players know the match is over

---

## Ticket 10 — Add play again flow

### Goal

Let players quickly start a new match.

### Tasks

* Add `Play Again` button after game ends
* Reset lives
* Reset round state
* Keep same table and players if they want

### Acceptance Criteria

* Players can restart a new game without rebuilding the table manually

---

## Ticket 11 — Add leave game / return to lobby flow

### Goal

Give players a clean exit.

### Tasks

* Add button to leave finished match
* Return to lobby safely
* Clean up game state

### Acceptance Criteria

* Leaving game works without broken state

---

## Ticket 12 — Improve loading and waiting states

### Goal

Avoid confusing blank screens.

### Tasks

* Add loading indicators
* Add waiting-for-players messages
* Add waiting-for-turn messages
* Add reconnecting message if socket reconnects

### Acceptance Criteria

* UI never feels broken or empty during transitions

---

## Ticket 13 — Improve error messages

### Goal

Make invalid actions understandable.

### Example errors

* `You must keep at least 1 die`
* `It is not your turn`
* `This table is full`
* `Game already finished`

### Acceptance Criteria

* Errors are clear and shown in the UI

---

## Ticket 14 — Add sound effects (optional but recommended)

### Goal

Make game actions feel better.

### Sounds

* dice roll
* reveal
* life lost
* elimination
* winner

### Acceptance Criteria

* Sounds improve feedback without becoming annoying
* Sound can be muted if added

---

## Ticket 15 — Improve mobile/tablet layout

### Goal

Make the game usable on smaller screens.

### Tasks

* Adjust seat layout for narrow screens
* Keep dice controls usable
* Keep result modal readable

### Acceptance Criteria

* Game remains playable on tablet/mobile sizes

---

## Ticket 16 — Add table code / share table link

### Goal

Make it easier for other players to join.

### Tasks

* Show table code or shareable URL
* Add copy button
* Show simple join instructions

### Acceptance Criteria

* Another player can join easily with a code or link

---

## Ticket 17 — Add game event log

### Goal

Help players follow the match history.

### Show entries like

* `Andreas kept 4 and 2`
* `Mikkel finished turn`
* `Round 3 revealed`
* `Jonas lost 2 lives`
* `Sara was eliminated`

### Acceptance Criteria

* Event log helps players understand match flow

---

## Ticket 18 — Improve reconnect UX

### Goal

Handle temporary disconnects better.

### Tasks

* Show reconnecting message
* Restore state smoothly
* Avoid flashing wrong data

### Acceptance Criteria

* Reconnect feels stable and understandable

---

## Ticket 19 — Visual polish pass

### Goal

Make UI consistent.

### Tasks

* Improve spacing
* Improve typography
* Improve button styles
* Make colors consistent
* Improve dice visuals

### Acceptance Criteria

* UI feels coherent and polished

---

## Ticket 20 — Final MVP test pass

### Manual Tests

* [ ] Table looks correct with 2 players
* [ ] Table looks correct with 3 players
* [ ] Table looks correct with 4 players
* [ ] Table looks correct with 5 players
* [ ] Active turn is clearly shown
* [ ] Hidden dice stay hidden until reveal
* [ ] Reveal flow is clear
* [ ] Life loss is clearly shown
* [ ] Elimination is clearly shown
* [ ] Winner screen works
* [ ] Play again works
* [ ] Return to lobby works
* [ ] Mobile layout is usable
* [ ] Error messages are readable

### Acceptance Criteria

* Game feels complete and understandable for MVP

---

# 📁 New Files for Sprint 6

### Frontend

```text
client/src/components/game/
├─ PokerTable.tsx
├─ PlayerSeat.tsx
├─ WinnerModal.tsx
├─ EventLog.tsx
├─ HiddenDiceDisplay.tsx
├─ ReconnectBanner.tsx
```

### Styles / Utilities

```text
client/src/utils/
├─ seatPosition.ts
├─ gameMessages.ts
```

---

# ⚠️ Risks

* Too much animation making the game feel slow
* Hidden information accidentally shown in UI
* Table layout breaking at 5 players
* Mobile layout becoming cramped
* Replay flow not fully resetting game state

---

# 🛠️ Notes

Sprint 6 should not change the game rules.
It should improve how the game feels and how clearly the rules are shown.

Focus on:

* clarity
* excitement
* readability
* flow

---

# ✅ Definition of Done

Sprint 6 is complete when:

* the table layout feels polished
* player seats are clear
* turn flow is easy to understand
* hidden dice are displayed correctly
* reveal flow feels good
* round results are readable
* elimination and winner states are clear
* players can play again or leave cleanly
* the game feels MVP-ready

---

# 🎯 Final Result After Sprint 6

At this point, the MVP should support:

* name entry
* table creation and joining
* realtime lobby/table updates
* turn-based hidden dice gameplay
* scoring and life loss
* elimination and winner detection
* polished UI and replay flow
