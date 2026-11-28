# User Roles

Every account has exactly one role, defined as `UserRole` in `need4deed-sdk`. The role decides what a person sees and what they can change.

## The roles at a glance

| Role          | Who they are                                                               | In one line                          |
| ------------- | -------------------------------------------------------------------------- | ------------------------------------ |
| `admin`       | Need4Deed staff                                                            | Coordinator, plus a few extra powers |
| `coordinator` | Need4Deed staff: the matching team                                         | Runs the platform day to day         |
| `agent`       | Staff at a partner organization (a shelter, counseling center, project, …) | Manages their own organization       |
| `volunteer`   | A registered volunteer                                                     | Finds and takes on opportunities     |
| `user`        | Undefined: an account without a working role                               | Not used in practice                 |

> **Watch the word "coordinator".** The `coordinator` _role_ is Need4Deed staff. A "volunteer coordinator" _job title_ belongs to someone at a partner organization, and that person logs in as an `agent`.

## Vocabulary

Names differ between the screen and the code:

| On screen    | In the code / SDK | What it is                                           |
| ------------ | ----------------- | ---------------------------------------------------- |
| Organization | `Agent`           | One site: a shelter, counseling center or project    |
| Operator     | `Organization`    | The group that runs one or more sites. A label only. |
| Opportunity  | `Opportunity`     | A task an organization needs help with               |
| Event        | `EventN4D`        | A Need4Deed community event (party or workshop)      |

## What each role can do

| Area              | Admin | Coordinator | Agent                | Volunteer |
| ----------------- | :---: | :---------: | -------------------- | --------- |
| Dashboard         |   ✓   |      ✓      | ✓                    | ✓         |
| Volunteers        |   ✓   |      ✓      | ✓ own + shared       | —         |
| Opportunities     |   ✓   |      ✓      | ✓ creates their own  | ✓ browses |
| Organizations     |   ✓   |      ✓      | Own page only        | —         |
| Discussions       |   ✓   |      ✓      | ✓                    | —         |
| Calendar (events) |   ✓   |      ✓      | —                    | —         |
| Account / profile |   ✓   |      ✓      | ✓ their organization | ✓ own     |

### Admin and Coordinator

The Need4Deed team. They see everything and can edit everything:

- Create, edit and delete organizations and opportunities
- Approve or reject people asking to join an organization
- Move an opportunity to a different organization
- Edit or delete anyone's post or reply
- Publish events to the public `/event-page` through the Calendar
- Read and write internal coordinator comments

**Only an admin** can change which organization a volunteer belongs to.

### Agent

A person working at one or more partner organizations.

- Edits their own organization's profile (found under Account)
- Creates and manages their organization's opportunities
- Sees their organization's volunteers, plus volunteers shared by other organizations
- Suggests volunteers for their opportunities
- Posts and replies in Discussions, the shared message board, and edits their own posts
- Cannot open the organizations list or any other organization's page

### Volunteer

- Sees their dashboard, browses opportunities, and edits their own profile
- Has no access to Volunteers, Organizations, Discussions or Calendar

### User

The role exists in the SDK, but the app gives it no dashboard and no permissions. After login it is sent to the public home page. Treat it as unassigned until its purpose is decided.

## How they relate

```
Need4Deed staff (admin, coordinator)
  │  approves memberships, matches volunteers, moderates
  ▼
Operator (Träger)                 a label, nothing more
  └── Organization (site)         e.g. a shelter
        ├── Agents                its staff, via approved membership
        ├── Opportunities         tasks it needs help with
        └── Volunteers            the ones it "owns"
```

**Agent ↔ organization.** An agent joins an organization through a _membership_ with a job title (social worker, manager, …). If the organization already exists, the membership stays _pending_ until Need4Deed staff approve it. One agent can belong to several organizations, and one organization can have several agents.

**Volunteer ↔ organization.** Each volunteer is owned by one organization, or by Need4Deed itself if no organization owns them. Volunteers are matched to opportunities, which is how they connect to other organizations.

**Organization ↔ organization.** Organizations are not linked to each other, apart from three loose connections:

1. **Shared volunteers.** An organization that turns on _Shares volunteers_ can see, and suggest, the volunteers of every other organization that has it on too. This works across operators.
2. **Same operator.** Sites run by the same _Träger_ share a label and nothing else.
3. **Discussions.** Organizations can tag each other on the shared message board.

**Staff ↔ everyone.** Coordinators and admins sit above the whole structure. They don't belong to any organization, and they can act on all of them.

## Where this lives in the code

- Role checks: [`useAuth`](../src/hooks/useAuth.ts)
- Route protection: [`middleware.ts`](../src/middleware.ts)
- Sidebar links per role: [`Navigation.tsx`](../src/components/navigation/AppNavigation/Sidebar/Navigation/Navigation.tsx)
- Dashboard per role: [`HomeContentController.tsx`](../src/components/Dashboard/Home/HomeContentController.tsx)

The backend enforces the real permissions. This page describes what the frontend shows.
