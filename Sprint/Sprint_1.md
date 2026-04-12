# 🎟️ 4218 – Sprint 1 Implementation Tickets

These tickets break Sprint 1 into small, buildable tasks.

---

# Ticket 1 — Create project structure

## Goal

Set up the base folders for client and server.

## Tasks

* Create `apps/client`
* Create `apps/server`
* Create `README.md`
* Create `SPRINT-1.md`
* Create `.env.example`

## Acceptance Criteria

* Project has separate client and server folders
* File structure is clean and ready for development

## Priority

High

---

# Ticket 2 — Setup frontend app

## Goal

Create the frontend application.

## Tasks

* Initialize Next.js app with TypeScript
* Add basic global styles
* Confirm app runs locally
* Create base layout

## Acceptance Criteria

* Frontend starts without errors
* Default page renders in browser

## Priority

High

---

# Ticket 3 — Setup backend app

## Goal

Create the backend application.

## Tasks

* Initialize Node.js backend
* Add TypeScript
* Add Express
* Create app entry point
* Add CORS
* Add JSON middleware

## Acceptance Criteria

* Backend starts without errors
* Server listens on configured port

## Priority

High

---

# Ticket 4 — Add backend health route

## Goal

Verify backend is reachable.

## Tasks

* Create `/health` endpoint
* Return status response like:

  * `ok: true`
  * app name
  * timestamp

## Acceptance Criteria

* Visiting `/health` returns valid JSON
* Frontend can call endpoint later

## Priority

High

---

# Ticket 5 — Add environment configuration

## Goal

Prepare local configuration.

## Tasks

* Add `.env.example`
* Add client URL
* Add server port
* Add frontend API URL
* Load env values in backend

## Acceptance Criteria

* App can run using environment values
* No hardcoded ports in main config

## Priority

Medium

---

# Ticket 6 — Create landing page

## Goal

Build the first page the player sees.

## Tasks

* Create homepage
* Add game title: `4218`
* Add short text
* Add button or form area for entering name

## Acceptance Criteria

* Homepage loads correctly
* Player clearly understands where to enter name

## Priority

High

---

# Ticket 7 — Build name entry form

## Goal

Allow player to enter a name.

## Tasks

* Create `NameForm` component
* Add text input
* Add continue button
* Add submit handler

## Acceptance Criteria

* Player can type a name
* Form can be submitted

## Priority

High

---

# Ticket 8 — Add name validation

## Goal

Prevent invalid player names.

## Rules

* Required
* Minimum 2 characters
* Maximum 20 characters
* Trim whitespace
* Reject empty spaces only

## Tasks

* Validate input on submit
* Show error message under input
* Prevent navigation if invalid

## Acceptance Criteria

* Invalid names show error
* Valid names continue to next step

## Priority

High

---

# Ticket 9 — Generate temporary player ID

## Goal

Create a local player identity without accounts.

## Tasks

* Generate random player ID
* Use UUID or similar
* Create helper function in `lib/player.ts`

## Acceptance Criteria

* New player gets unique ID
* ID can be reused after refresh

## Priority

High

---

# Ticket 10 — Save player identity locally

## Goal

Store player name and ID in browser storage.

## Tasks

* Save `playerId`
* Save `playerName`
* Add storage helpers
* Use `localStorage` or `sessionStorage`

## Acceptance Criteria

* Submitted name is saved locally
* Generated ID is saved locally

## Priority

High

---

# Ticket 11 — Redirect to lobby after submit

## Goal

Move valid players into the app.

## Tasks

* After valid submit:

  * save identity
  * redirect to `/lobby`

## Acceptance Criteria

* Valid player is sent to lobby
* Invalid player stays on landing page

## Priority

High

---

# Ticket 12 — Create lobby placeholder page

## Goal

Create the first post-entry screen.

## Tasks

* Create `/lobby` page
* Display welcome message
* Show player name
* Add placeholder buttons:

  * `Create Table`
  * `Join Table`

## Acceptance Criteria

* Lobby page loads
* Saved player name is shown

## Priority

High

---

# Ticket 13 — Protect lobby from unnamed access

## Goal

Stop users from reaching lobby without a name.

## Tasks

* On lobby load:

  * check local storage for player identity
* If no name or ID:

  * redirect to homepage

## Acceptance Criteria

* Unidentified users cannot stay in lobby
* Identified users enter normally

## Priority

High

---

# Ticket 14 — Reuse saved name on refresh

## Goal

Keep the player session simple.

## Tasks

* Load stored identity on app start
* Keep player in lobby after refresh
* Keep same player ID

## Acceptance Criteria

* Refresh does not erase name
* Player does not need to re-enter name

## Priority

High

---

# Ticket 15 — Add “Change Name” action

## Goal

Let player reset identity.

## Tasks

* Add button in lobby
* Clear saved player name and ID
* Redirect back to homepage

## Acceptance Criteria

* Player can remove stored identity
* Enter-name screen is shown again

## Priority

Medium

---

# Ticket 16 — Create shared player type

## Goal

Keep player data consistent.

## Tasks

* Create `PlayerIdentity` type
* Include:

  * `id`
  * `name`

## Acceptance Criteria

* Frontend uses one consistent type for player identity

## Priority

Medium

---

# Ticket 17 — Add reusable UI components

## Goal

Keep UI clean and reusable.

## Tasks

* Create `Button` component
* Create `Input` component
* Apply simple consistent styling

## Acceptance Criteria

* Name form uses reusable components
* Styling is consistent

## Priority

Medium

---

# Ticket 18 — Add basic frontend utility files

## Goal

Organize core logic.

## Tasks

Create:

* `lib/storage.ts`
* `lib/player.ts`
* `lib/api.ts`

## Acceptance Criteria

* Storage logic is not mixed into page code
* Player helper functions are reusable

## Priority

Medium

---

# Ticket 19 — Test the full player entry flow

## Goal

Verify Sprint 1 works end to end.

## Manual Test Cases

* Open app
* Enter valid name
* Submit and reach lobby
* Refresh lobby
* Name still exists
* Change name
* Return to entry page
* Enter invalid names and verify errors

## Acceptance Criteria

* Main flow works without blocking bugs

## Priority

High

---

# Ticket 20 — Clean up and document Sprint 1

## Goal

Finish Sprint 1 in a maintainable way.

## Tasks

* Remove unused starter code
* Clean folder structure
* Update README with run instructions
* Confirm `.env.example` is correct

## Acceptance Criteria

* Project is clean
* Another developer can run it locally

## Priority

Medium

---

# Suggested build order

1. Ticket 1 — Create project structure
2. Ticket 2 — Setup frontend app
3. Ticket 3 — Setup backend app
4. Ticket 4 — Add backend health route
5. Ticket 5 — Add environment configuration
6. Ticket 6 — Create landing page
7. Ticket 7 — Build name entry form
8. Ticket 8 — Add name validation
9. Ticket 9 — Generate temporary player ID
10. Ticket 10 — Save player identity locally
11. Ticket 11 — Redirect to lobby after submit
12. Ticket 12 — Create lobby placeholder page
13. Ticket 13 — Protect lobby from unnamed access
14. Ticket 14 — Reuse saved name on refresh
15. Ticket 15 — Add “Change Name” action
16. Ticket 16 — Create shared player type
17. Ticket 17 — Add reusable UI components
18. Ticket 18 — Add basic frontend utility files
19. Ticket 19 — Test the full player entry flow
20. Ticket 20 — Clean up and document Sprint 1

---

# Sprint 1 done checklist

* [ ] Frontend runs
* [ ] Backend runs
* [ ] Health route works
* [ ] Player can enter name
* [ ] Name validation works
* [ ] Player ID is generated
* [ ] Player identity is saved
* [ ] Lobby redirect works
* [ ] Refresh keeps identity
* [ ] Change name works
* [ ] README updated
