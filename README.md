# PR Review Dashboard

A local web dashboard that shows open GitHub PRs requesting your review, grouped by repo. Built as a PoC for replacing Slack PR review channels with something easier to scan.

<img width="1505" height="1044" alt="Screenshot 2026-03-31 at 5 00 41 PM" src="https://github.com/user-attachments/assets/e1383144-b20f-4318-b2c0-289beb0f646b" />


## Features

- **Your review queue** — shows all open PRs where you (or a team you belong to) are a requested reviewer
- **Grouped by repo** — organized so you can see where review load is concentrated
- **Review status** — approved / changes requested / commented / awaiting, pulled live from the GitHub reviews API
- **Age badges** — highlights stale PRs (yellow 3+ days, red 7+ days)
- **Comment count** — see how much discussion has already happened
- **Pinned repos** — star repos to keep them at the top, persists across sessions
- **Auto-refresh** — updates every 5 minutes, or manually refresh any time

## Setup

### 1. Clone the repo

```bash
git clone <repo-url>
cd pr-review-dashboard
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Create a GitHub Fine-Grained Token

Go to [github.com/settings/personal-access-tokens/new](https://github.com/settings/personal-access-tokens/new) and configure:

| Setting | Value |
|---|---|
| Token name | `pr-review-dashboard` |
| Expiration | 30 days |
| Resource owner | `fanduel` |
| Repository access | All repositories |
| Repository permissions → Pull requests | Read-only |
| Organization permissions → Members | Read-only |

> **Note:** Classic PATs are being phased out at FanDuel. Fine-grained tokens are the approved method.

### 4. Configure your environment

```bash
cp .env.local.example .env.local
```

Open `.env.local` and paste your token:

```
GITHUB_PAT=github_pat_...
```

### 5. Run

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

## Token expiry

Fine-grained tokens expire after 30 days. When yours expires, generate a new one with the same settings and update `.env.local`.

## Roadmap / known limitations

- [ ] GitHub OAuth login — removes the need for manual token setup and rotation
- [ ] Per-pillar view — currently shows your personal queue; team view blocked by fine-grained token limitations with the Search API
- [ ] Bot comment filtering — comment count includes bot comments
- [ ] Review status for your own reviews — currently shows aggregate across all reviewers
