## Plan: Backend/Frontend Integration TODO List

The BE has solid CRUD for volunteers but is missing PATCH for opportunities/agents and returns mock data for agent profiles.

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

### Phase 2: Remaining Mock Data Replacement (needs BE)

**2.3 — Agent's Volunteers list** _(VolunteerAgents section)_

- **Current state**: FE shows empty state (mock data removed). Types and utils moved to `VolunteerAgents/types.ts`.
- **BE endpoint**: **Does not exist yet** (`GET /agent/:id/volunteer-linked` returns 404). Options: (a) new `GET /agent/:id/volunteer-linked`, or (b) add `agentId` filter param to existing `GET /volunteer`
- **Recommendation**: Add `agentId` filter to `GET /volunteer` for consistency with existing filter pattern
- **FE work when BE ready**: Wire `useGetQuery` in `VolunteerAgents.tsx` with agent ID, reuse existing `AccordionVolunteer` and `VolunteerDetail` components

**2.4 — Agent's Opportunities list** _(AgentOpportunities section)_

- **Current state**: FE shows empty state (mock imports removed).
- **BE**: Verify if `GET /opportunity` supports `agentId` filter. If not, add it.
- **FE work when BE ready**: Wire `useGetQuery` in `AgentOpportunities.tsx` with agent ID filter

---

### Phase 4: Options/Lists Feature Flag

**4.1 — Enable Options API**

- **Current**: `FF_USE_OPTIONS_LISTS = false` in `useLists.tsx`, uses hardcoded `fallbackLists`
- **BE endpoint**: `GET /option/:list` currently returns **500 Internal Server Error**
- **FE work**: Flip flag to `true` after BE fix, verify expected `{ id, title }[]` format matching `fallbackLists` shape
- **BE consideration**: Fix the 500 error. Verify all list types (languages, districts, activities, skills, availability, engagement states, opportunity statuses) are complete and match FE expectations

---

### Phase 5: Auth & User State

**5.2 — Password Reset / Forgot Password**

- **BE work**: Implement `POST /auth/forgot-password` (send reset email) + `POST /auth/reset-password` (validate token, set new password)
- **FE work**: Create forgot-password and reset-password pages
- **Challenge**: Requires email sending infrastructure

**5.3 — Remember Me** — Login form checkbox exists, no implementation

- **BE consideration**: Decide on token TTL strategy (longer refresh token TTL when checked)

---

### Phase 6: Minor Items

| Item                       | Location                             | Work                                                 |
| -------------------------- | ------------------------------------ | ---------------------------------------------------- |
| District dropdown in RAC   | `RefugeeAccommodationCentre.tsx` L69 | FE: Use option list IDs instead of free text         |
| Home Dashboard placeholder | `Home.tsx`                           | FE+BE: Design content, possibly needs stats endpoint |
| Activity Log placeholder   | Volunteer Profile section            | FE+BE: Needs design + audit/activity endpoint        |

---

### Verification

1. After **PATCH /opportunity/:id**: All 4 FE opportunity edit sections should persist changes across reload
2. After **PATCH /agent/:id**: Agent status dropdown persists
3. After **GET /agent/:id** real data: Agent profile shows real DB data, not "Hanger 1-3"
4. After **options flag fix**: Dropdowns populate from API instead of fallback lists

### Decisions

- **Agent's volunteers**: Recommend `agentId` filter on `GET /volunteer` (vs. new nested route)
- **Agent's opportunities**: Likely filterable on existing `GET /opportunity` — verify and add `agentId` param if missing

### Further Considerations

1. **Agent contact update uses `/person/:id`**: The FE hook `useUpdateAgentContact` PATCHes to `/api/person/{id}`, not `/api/agent/{id}` — this is intentional (updating the representative Person entity), but verify the person ID is correctly derived from the agent's representative

---

### Manual Testing Checklist

**Login**: `sarah.doe@need4deed.org` / `no_password` → dashboard at `http://localhost:3000/en/dashboard/home`

**Volunteer Profile** (e.g. `/en/dashboard/volunteers/10`):

- [ ] Opportunities section loads from API (tabs show real counts)
- [ ] "Find Opportunity" opens suggest dialog
- [ ] Suggest dialog submits and creates PENDING link
- [ ] Tab transitions (Match/Not a Match/Active/Past) persist via API
- [ ] Accordion shows opportunity title and applied date from API

**Opportunity Profile** (e.g. `/en/dashboard/opportunities/7`):

- [ ] Volunteers section loads from API (tabs show real counts)
- [ ] "Find volunteers" opens suggest dialog
- [ ] Suggest dialog submits and creates PENDING link
- [ ] Tab transitions persist via API
- [ ] Accordion shows volunteer name, engagement/type badges, and applied date from API
- [ ] "Go to Profile" navigates to correct volunteer profile

**Agent Profile** (e.g. `/en/dashboard/agents/2`):

- [ ] Volunteers section shows empty state with tabs (all counts 0)
- [ ] Opportunities section shows empty state with tabs (all counts 0)

**Header**:

- [ ] User initials "SC" displayed (not hardcoded "OA")
- [ ] Sidebar profile shows "SC" initials
