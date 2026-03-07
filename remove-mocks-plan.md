## Plan: Backend/Frontend Integration TODO List

The FE has ~6 mock data zones, 4 missing/incomplete BE endpoints, and several integration gaps. The BE has solid CRUD for volunteers but is missing PATCH for opportunities/agents and returns mock data for agent profiles. The "suggest" feature's backend already exists (`POST /opportunity-volunteer`) — it just needs FE wiring.

---

### Phase 1: Critical Missing Backend Endpoints

**1.1 — PATCH /opportunity/:id** _(blocks Opportunity Profile editing)_

- **Purpose**: Update opportunity status, contact info, agent/RAC info, accompanying details
- **Benefiting**: Opportunity Profile page (all editable sections)
- **BE work**: Implement PATCH handler in opportunity routes. Accept partial body with nested keys: `statusOpportunity`, `contact`, `agent`, `accompanyingDetails`. Model after the existing volunteer PATCH pattern which handles nested entities (Deal, Profile, M2M relations).
- **FE hooks already built**: `useUpdateOpportunityStatus`, `useUpdateOpportunityContact`, `useUpdateOpportunityAgent`, `useUpdateOpportunityAccompanyingDetails` — all PATCH to `/api/opportunity/{id}`
- **Proposed request schemas**:
  - `{ statusOpportunity: OpportunityStatusType }`
  - `{ contact: { name?, phone?, email?, waysToContact?[] } }`
  - `{ agent: { name?, address?, district?: number } }`
  - `{ accompanyingDetails: { appointmentAddress?, appointmentDate?, appointmentTime?, refugeeNumber?, refugeeName?, languagesToTranslate?[] } }`
- **Challenge**: Opportunity has nested relations (Deal → Location/Time, Agent, Accompanying). Decide whether PATCH resolves relationships implicitly or requires explicit IDs.

**1.2 — PATCH /agent/:id** _(blocks Agent status changes)_

- **Purpose**: Update agent engagement status (and potentially other fields)
- **Benefiting**: Agent Profile page
- **BE work**: Add PATCH handler in agent routes (currently only GET exists)
- **FE hook ready**: `useUpdateAgentStatus` — PATCHes `{ statusEngagement: AgentEngagementStatus }`
- **Challenge**: May need to expand later for trust level, search status, services, etc.

**1.3 — GET /agent/:id — Replace mock with real query**

- **Purpose**: Fetch real agent profile data. Currently returns hardcoded "Hanger 1-3" regardless of ID.
- **Benefiting**: Entire Agent Profile page
- **BE work**: Replace mock response with real DB query joining Agent → Person (representative), Address, District, Opportunities, Comments
- **FE**: No changes — hook already calls correct endpoint

**1.4 — GET /agent/:id/communication — Replace mock with real query**

- **Purpose**: Fetch communications for an agent. Currently returns hardcoded mock array.
- **Benefiting**: Agent Profile → Communication Tracker section
- **BE work**: Replace mock with real DB query, mirroring the existing `GET /volunteer/:id/communication` implementation

---

### Phase 2: Mock Data Replacement (FE+BE coordination)

**2.1 — Volunteer's Opportunities list** _(Volunteer Profile → Opportunities section)_

- **Mock files to delete**: `src/components/Dashboard/Profile/sections/VolunteerOpportunities/mockOpps/` (3 files) + `mockTabAssignment` in `VolunteerOpportunities.tsx`
- **BE endpoint exists**: `GET /volunteer/:id/opportunity`
- **BE consideration**: Response **must include the M2M `status`** (OpportunityVolunteerStatusType) and M2M `id` per opportunity so FE can sort into tabs (Pending/Matched/Active/Past) and reference the record for updates
- **FE work**: Replace mocks with `useGetQuery` call; delete `mockOpps/` directory and `tempTypes.ts`/`tempUtils.ts`

**2.2 — Opportunity's Volunteers list** _(Opportunity Profile → Volunteers section)_

- **Mock file to delete**: `src/components/Dashboard/Profile/sections/OpportunityVolunteers/mockVolunteers.ts`
- **BE endpoint exists**: `GET /opportunity/:id/volunteer-linked`
- **BE consideration**: Response must include M2M `id`, M2M `status`, and full volunteer profile data (languages, activities, skills, availability, locations, engagement status)
- **FE work**: Replace mock with `useGetQuery` call; delete mock file

**2.3 — Agent's Volunteers list** _(VolunteerAgents section)_

- **Mock files to delete**: `src/components/Dashboard/Profile/sections/VolunteerAgents/mockVols/` (2 files)
- **BE endpoint**: **Does not exist yet**. Options: (a) new `GET /agent/:id/volunteer`, or (b) add `agentId` filter param to existing `GET /volunteer`
- **Recommendation**: Add `agentId` filter to `GET /volunteer` for consistency with existing filter pattern
- **FE work**: Replace mock with API call using agent ID filter; delete `mockVols/`

**2.4 — Agent's Opportunities list** _(AgentOpportunities section)_

- **Currently**: Reuses `mockRawOpportunities` from VolunteerOpportunities
- **BE**: Verify if `GET /opportunity` supports `agentId` filter. If not, add it.
- **FE work**: Replace mock import with API call using agent ID filter

**2.5 — Tab status transitions (Match/Not a Match/Active/Past buttons)** _(all accordion sections)_

- **Current state**: Buttons only update local state + show toasts. Status resets on page reload.
- **BE endpoints exist**: `PATCH /opportunity-volunteer/:id` (update status) and `DELETE /opportunity-volunteer/:id` (remove link)
- **FE work**: Wire `onMatch`/`onNotAMatch`/`onActive`/`onPast` callbacks in `OpportunityVolunteers.tsx` and `VolunteerOpportunities.tsx` to call the M2M PATCH/DELETE endpoints. Need the M2M record `id` from the list response.
- **BE consideration**: Confirm list responses include M2M record `id` so FE can reference for updates

---

### Phase 3: Suggest Feature Wiring

**3.1 — Connect Suggest Dialog to POST /opportunity-volunteer**

- **Purpose**: "Suggest" creates a PENDING M2M link between volunteer and opportunity. Bidirectional: Volunteer Profile → Opportunity, and Opportunity Profile → Volunteer.
- **BE endpoint already exists**: `POST /opportunity-volunteer` — body: `{ opportunityId, volunteerId, status }`
- **FE TODO locations**: `useVolunteerProfileSections.tsx` L46-50, `useOpportunityProfileSections.tsx` L49-53
- **FE work**: Create `useSuggestVolunteerOpportunity` hook using `useMutationQuery` → `POST /api/opportunity-volunteer` with body `{ opportunityId, volunteerId, status: "PENDING" }`. Wire into `handleSuggestConfirm` with loading state, error notifications, dialog close, and conditional navigation.
- **BE consideration**: Add unique constraint or duplicate check on (opportunityId, volunteerId) to prevent double-suggesting. Validate both entities exist.

---

### Phase 4: Options/Lists Feature Flag

**4.1 — Enable Options API**

- **Current**: `FF_USE_OPTIONS_LISTS = false` in `useLists.tsx`, uses hardcoded `fallbackLists`
- **BE endpoint exists**: `GET /option/:list?language=de|en`
- **FE work**: Flip flag to `true` after verifying BE returns expected `{ id, title }[]` format matching `fallbackLists` shape
- **BE consideration**: Verify all list types (languages, districts, activities, skills, availability, engagement states, opportunity statuses) are complete and match FE expectations

---

### Phase 5: Auth & User State

**5.1 — Replace hardcoded "OA" username** — `UserProfile.tsx` L26, `NavigationBar.tsx` L117

- FE-only: Use existing `useCurrentUser` hook to derive initials from user's person data

**5.2 — Password Reset / Forgot Password**

- **BE work**: Implement `POST /auth/forgot-password` (send reset email) + `POST /auth/reset-password` (validate token, set new password)
- **FE work**: Create forgot-password and reset-password pages
- **Challenge**: Requires email sending infrastructure

**5.3 — Remember Me** — Login form checkbox exists, no implementation

- **BE consideration**: Decide on token TTL strategy (longer refresh token TTL when checked)

---

### Phase 6: Minor Items

| Item                                  | Location                             | Work                                                 |
| ------------------------------------- | ------------------------------------ | ---------------------------------------------------- |
| Hardcoded profile path `/volunteer/9` | `constants.ts` L16                   | FE: Make dynamic from current user                   |
| EditableField submit on blur/enter    | `EditableField.tsx` L294             | FE: Wire to appropriate mutation                     |
| District dropdown in RAC              | `RefugeeAccommodationCentre.tsx` L69 | FE: Use option list IDs instead of free text         |
| Home Dashboard placeholder            | `Home.tsx`                           | FE+BE: Design content, possibly needs stats endpoint |
| Activity Log placeholder              | Volunteer Profile section            | FE+BE: Needs design + audit/activity endpoint        |
| Hardcoded date `12.02.2025`           | `AccordionVolunteer.tsx` L61         | FE: Use real date from M2M `createdAt`               |

---

### Verification

1. After **PATCH /opportunity/:id**: All 4 FE opportunity edit sections should persist changes across reload
2. After **PATCH /agent/:id**: Agent status dropdown persists
3. After **GET /agent/:id** real data: Agent profile shows real DB data, not "Hanger 1-3"
4. After **mock replacement**: Accordion sections show real linked data with correct tab counts
5. After **suggest wiring**: Suggest dialog creates M2M record, entry appears in PENDING tab
6. After **tab transition wiring**: Match/Not a Match/Active/Past buttons persist via API, survive page reload
7. After **options flag**: Dropdowns populate from API instead of fallback lists

### Decisions

- **Suggest = POST /opportunity-volunteer** (already exists). No new endpoint needed — just FE integration.
- **Agent's volunteers**: Recommend `agentId` filter on `GET /volunteer` (vs. new nested route)
- **Agent's opportunities**: Likely filterable on existing `GET /opportunity` — verify and add `agentId` param if missing

### Further Considerations

1. **M2M IDs in list responses**: Both `GET /volunteer/:id/opportunity` and `GET /opportunity/:id/volunteer-linked` must return the M2M record `id` and `status` — verify this is the case or the entire tab/actions system won't work
2. **Duplicate suggestion guard**: Should `POST /opportunity-volunteer` reject if a record for the same (volunteerId, opportunityId) pair already exists? Recommend yes, with a clear error message
3. **Agent contact update uses `/person/:id`**: The FE hook `useUpdateAgentContact` PATCHes to `/api/person/{id}`, not `/api/agent/{id}` — this is intentional (updating the representative Person entity), but verify the person ID is correctly derived from the agent's representative
