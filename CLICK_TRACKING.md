# Click & IP Tracking — How It Works & What Was Wrong

---

## Table of Contents
1. [Feature Overview](#1-feature-overview)
2. [Database Design](#2-database-design)
3. [How a Click Gets Recorded](#3-how-a-click-gets-recorded)
4. [How the Dashboard Shows Click Counts](#4-how-the-dashboard-shows-click-counts)
5. [The Per-Link Analytics Page](#5-the-per-link-analytics-page)
6. [What Was Broken & Why](#6-what-was-broken--why)
7. [All Files Changed](#7-all-files-changed)

---

## 1. Feature Overview

When a user opens a short link (e.g. `http://localhost:3000/myalias`), the app:

1. Looks up the alias in the database
2. Records a **Click row** containing the visitor's IP address, browser (User-Agent), referrer page, and exact timestamp
3. Immediately redirects the visitor to the original long URL

This data is then surfaced in two places:
- **Dashboard** — total click count across all links + a per-link click badge on each row
- **Stats page** (`/dashboard/stats/<id>`) — full click history table with IP, browser, OS, referrer, and time for each visit

---

## 2. Database Design

### Why a separate `Click` table?

Two approaches were possible:

| Approach | Pros | Cons |
|---|---|---|
| Counter column on `shortener` (`clickCount Int`) | Simple, fast | No history, no IP, no metadata |
| Separate `Click` table (one row per visit) | Full history, IP, browser, timestamp | Slightly more storage |

Since the goal is to show **who** clicked, **when**, and **from where**, a separate row per click is required.

### Schema

```prisma
model shortener {
  id       Int     @id @default(autoincrement())
  longUrl  String
  alias    String  @unique
  shortUrl String  @unique
  userId   String?
  user     User?   @relation(fields: [userId], references: [id])
  clicks   Click[]     // ← one link has many clicks
}

model Click {
  id          Int       @id @default(autoincrement())
  shortenerId Int
  shortener   shortener @relation(fields: [shortenerId], references: [id], onDelete: Cascade)
  ip          String?   // visitor IP address
  userAgent   String?   // raw browser string (used to detect Chrome, Firefox, etc.)
  referer     String?   // page the visitor came from
  country     String?   // reserved for future geo-IP lookup
  clickedAt   DateTime  @default(now())
}
```

**`onDelete: Cascade`** — when a short link is deleted, all its Click rows are deleted automatically. No orphaned data.

---

## 3. How a Click Gets Recorded

**File:** `app/[alias]/route.ts`

This is a Next.js Route Handler. Every GET request to `/:alias` (e.g. `/myalias`) is intercepted here.

```ts
export async function GET(req, ctx) {
  // 1. Look up the alias
  const { alias } = await ctx.params;
  const shortenedUrl = await prisma.shortener.findUnique({ where: { alias } });

  if (!shortenedUrl) return new Response("Not found", { status: 404 });

  // 2. Record the click
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim()
            ?? req.headers.get("x-real-ip")
            ?? "unknown";

    await prisma.click.create({
      data: {
        shortenerId: shortenedUrl.id,
        ip,
        userAgent: req.headers.get("user-agent"),
        referer:   req.headers.get("referer"),
      },
    });
  } catch (err) {
    console.error("[click] Failed to record:", err);
    // Error is swallowed — a DB failure should never break the redirect
  }

  // 3. Redirect to the original URL
  return NextResponse.redirect(shortenedUrl.longUrl, { status: 302 });
}
```

### How the IP is extracted

The IP address comes from HTTP request headers:

- **`x-forwarded-for`** — set by proxies and load balancers (Vercel, Nginx, Cloudflare). Contains a comma-separated list like `"203.0.113.1, 10.0.0.1"`. We take only the first value (the real client IP).
- **`x-real-ip`** — fallback header set by some proxies.
- **`"unknown"`** — if neither header is present (e.g. direct local connection).

### Why `try/catch` wraps the click creation

If the database is temporarily unavailable, the visitor should **still be redirected** to their destination. Wrapping click recording in try/catch ensures a DB error never shows as a broken link to the user.

---

## 4. How the Dashboard Shows Click Counts

**File:** `app/api/links/route.ts`

Rather than fetching all Click rows (expensive), Prisma's `_count` aggregate is used — it runs a single SQL `COUNT(*)` per link:

```ts
shorteners: {
  orderBy: { id: 'desc' },
  include: {
    _count: { select: { clicks: true } }  // ← adds { _count: { clicks: 7 } } to each link
  }
}
```

**File:** `app/dashboard/page.tsx`

```ts
// Total Clicks card
links.reduce((sum, l) => sum + (l._count?.clicks ?? 0), 0)

// Per-link badge (shown under each alias)
{link._count?.clicks ?? 0} clicks
```

---

## 5. The Per-Link Analytics Page

**Route:** `/dashboard/stats/<id>`  
**API:** `GET /api/stats/<id>`

The stats API fetches the link plus all its Click rows, ordered newest first:

```ts
const link = await prisma.shortener.findUnique({
  where: { id: linkId },
  include: {
    clicks: { orderBy: { clickedAt: "desc" } },
  },
});
```

**Ownership check** — before returning data, the API verifies `link.userId === user.id` so users can only see their own analytics.

The stats page then displays a table with:

| Column | Source |
|---|---|
| Timestamp | `click.clickedAt` |
| IP Address | `click.ip` |
| Browser | Parsed from `click.userAgent` (e.g. `"Chrome"`) |
| OS | Parsed from `click.userAgent` (e.g. `"Windows"`) |
| Referrer | `click.referer` (or "Direct" if null) |

---

## 6. What Was Broken & Why

Three separate bugs were stacked on top of each other. Here's each one in plain terms.

---

### Bug #1 — The Big One: Links pointed to Vercel, not localhost

**Root cause:**

```
NEXT_PUBLIC_BASE_URL=https://urlshortify.vercel.app/
```

The shorten API builds short URLs like this:
```ts
let shortenedUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${abbreviation}`;
// Result: "https://urlshortify.vercel.app/myalias"
```

So every short link stored in the DB had a **Vercel production URL**. When you clicked a link from the dashboard running at `localhost:3000`, your browser opened `urlshortify.vercel.app/myalias` — Vercel's server, not your local dev server.

Your local `[alias]/route.ts` was **never hit**. The click was either recorded on Vercel (in whatever DB that deployment uses), or not at all.

**Fix:**  
Changed the dashboard link's `href` from `link.shortUrl` (the stored Vercel URL) to `/${link.alias}` (relative path). A relative path always resolves against the current host — so on localhost it becomes `localhost:3000/myalias`, which correctly hits your local route handler. The copy button still copies the full production short URL.

```tsx
// Before (went to Vercel)
<a href={link.shortUrl}>

// After (always hits local route handler)
<a href={`/${link.alias}`}>
```

---

### Bug #2 — `redirect()` from `next/navigation` in a Route Handler

**Root cause:**

`redirect()` from `next/navigation` works by **throwing an internal exception** (`NEXT_REDIRECT`). In a Route Handler, this exception mechanism could race with the `await prisma.click.create(...)` call that comes just before it — potentially interrupting the DB write before it committed.

**Fix:**  
Replaced with `NextResponse.redirect()` from `next/server`, which is the correct API for Route Handlers. It simply returns a Response object — no exception throwing, no race condition.

```ts
// Before (throws internally, races with DB write)
import { redirect } from "next/navigation";
redirect(shortenedUrl.longUrl);

// After (returns a proper HTTP 302 response)
import { NextResponse } from "next/server";
return NextResponse.redirect(shortenedUrl.longUrl, { status: 302 });
```

---

### Bug #3 — Stale Prisma generated client (no `Click` model)

**Root cause:**

The project uses a custom Prisma output directory (`generated/prisma/`). At some point, the `prisma generate` command was run from an older version of `schema.prisma` — one that only had the bare `shortener` model with 4 fields, before `Click` and `User` were added.

The `generated/prisma/schema.prisma` snapshot looked like this:
```prisma
model shortener {
  id       Int    @id @default(autoincrement())
  longUrl  String
  alias    String @unique
  shortUrl String @unique
  // ← No userId, no clicks, no Click model!
}
```

So at runtime, `prisma.click` **did not exist** in the client being used. Every call to `prisma.click.create(...)` would throw an error, which was silently swallowed by the outer try/catch in the route handler.

Also, `lib/prisma.ts` imported `PrismaClient` from `@prisma/client` (stale package) instead of from the custom generated path.

**Fix:**
1. Added `output = "../generated/prisma"` to `prisma/schema.prisma`'s generator block
2. Ran `prisma generate` — rebuilt the client with the full schema (Click + User + shortener with all relations)
3. Updated `lib/prisma.ts` to import from `../generated/prisma` instead of `@prisma/client`
4. Confirmed all 3 migrations are applied to the live DB (`No pending migrations to apply`)

---

## 7. All Files Changed

| File | Change |
|---|---|
| `app/[alias]/route.ts` | Replaced `redirect()` with `NextResponse.redirect()`. Added try/catch around click recording. Added console log. |
| `app/api/links/route.ts` | Added `_count: { select: { clicks: true } }` to Prisma query so each link includes its click count |
| `app/dashboard/page.tsx` | Added `_count.clicks` to `Link` interface. Total Clicks card now sums real data. Per-link click badge added. Link `href` changed to `/${link.alias}` |
| `prisma/schema.prisma` | Added `output = "../generated/prisma"` to generator block |
| `lib/prisma.ts` | Changed import from `@prisma/client` → `../generated/prisma` |
| `CLICK_TRACKING.md` | This document |

---

## Future Improvements

- **Geo-IP** — populate the `country` field using `ip-api.com` during click recording
- **Unique visitors** — deduplicate clicks from the same IP per day
- **Charts** — group `clickedAt` by day/week and render a line chart
- **Bot filtering** — skip recording clicks from known bot User-Agents
