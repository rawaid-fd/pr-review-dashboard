import type { Pillar } from "@/types";

// IMPORTANT: Verify teamSlug values at https://github.com/orgs/fanduel/teams
// The slug is the last segment of the team URL, e.g. github.com/orgs/fanduel/teams/<slug>
// A wrong slug returns 0 results silently from the GitHub Search API.
export const PILLARS: Pillar[] = [
  { slug: "tbm",        displayName: "TBM",       teamSlug: "tbm-pillar",        color: "blue"   },
  // { slug: "live",       displayName: "Live",       teamSlug: "live-team",       color: "green"  },
  // { slug: "ebp",        displayName: "EBP",        teamSlug: "sportsbook-ebp-fe", color: "purple" },
  // { slug: "emerging",   displayName: "Emerging",   teamSlug: "emerging-team",   color: "orange" },
  // { slug: "generosity", displayName: "Generosity", teamSlug: "elevate-generosity-pillar", color: "pink"   },
  // { slug: "casino",     displayName: "Casino",     teamSlug: "casino-team",     color: "red"    },
  // { slug: "core",        displayName: "Core",        teamSlug: "core-apps-engineering",        color: "yellow" },
  // { slug: "admins",    displayName: "admins",    teamSlug: "sportsbook-channel-repo-admins",    color: "gray"   },
];
