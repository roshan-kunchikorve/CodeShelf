# CodeShelf

Save, search and share your code snippets.

CodeShelf is a full-stack web app. Sign in with GitHub, write snippets in a real code editor, tag and search them, and share a link when you want someone else to see one.

## Features

- Sign in with GitHub (Google is optional). No passwords to store.
- Write snippets in the Monaco editor (the editor inside VS Code) with 22 languages.
- Syntax-highlighted cards. Every language gets its own coloured "spine".
- Tags, favorites, search (title, description, code and tags) and filters by language or tag.
- Private by default. Make a snippet public to get a share link (`/s/<id>`).
- "Save to my shelf" copies someone else's public snippet into your own account.
- A raw-code URL for terminals: `curl https://your-site/api/snippets/<id>/raw`.
- Responsive layout, loading skeleton and a custom 404 page.

## Tech stack

| Part | What it uses |
| --- | --- |
| Framework | Next.js 15 (App Router, Server Components, Server Actions) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | MongoDB Atlas, accessed with Prisma |
| Login | Auth.js (NextAuth v5): GitHub and Google OAuth, JWT sessions |
| Validation | Zod |
| Editor and highlighting | Monaco editor, highlight.js (runs on the server) |
| Icons and fonts | lucide-react, Bricolage Grotesque, JetBrains Mono |

## Getting started

You need Node.js 20 or newer, a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account and a GitHub account.

### 1. Install

```bash
npm install
cp .env.example .env
```

On Windows use `copy .env.example .env`. `npm install` also runs `prisma generate`.

### 2. Fill in `.env`

**DATABASE_URL**

1. In Atlas, create a free cluster (M0).
2. Database Access: add a user with a password.
3. Network Access: add your IP address. (For a deployed site, allow `0.0.0.0/0`.)
4. Connect, then Drivers, then copy the connection string.
5. Put it in `.env` and add the database name `codeshelf` before the `?`, like `...mongodb.net/codeshelf?retryWrites=true&w=majority`. If your password has special characters, URL-encode them.

**AUTH_SECRET**

```bash
openssl rand -base64 32
```

Paste the output into `.env`.

**GitHub login**

1. Open <https://github.com/settings/developers>, choose **OAuth Apps**, then **New OAuth App**.
2. Homepage URL: `http://localhost:3000`
3. Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Register the app, then click **Generate a new client secret**.
5. Copy the Client ID into `AUTH_GITHUB_ID` and the secret into `AUTH_GITHUB_SECRET`.

**Google login (optional)**

Create an OAuth client (type: Web application) in the Google Cloud console with the redirect URI `http://localhost:3000/api/auth/callback/google`. Put its values in `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`. The "Continue with Google" button only appears when both are set.

### 3. Create the database tables and run

```bash
npm run db:push
npm run dev
```

Open <http://localhost:3000>.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm start` | Run the production build |
| `npm run lint` | Check the code with ESLint |
| `npm run db:push` | Apply `prisma/schema.prisma` to your database |
| `npm run db:studio` | Open Prisma Studio to look at your data |

## Project structure

```
prisma/schema.prisma          Database tables
src/
  middleware.ts               Runs before pages and protects /dashboard
  routes.ts                   Which URLs are private
  auth.config.ts              Login providers and route rules (safe for the edge)
  auth.ts                     Full login setup (adds the database)
  actions/                    Server actions: everything that changes data
  lib/                        Database client, queries, validation, language list
  components/                 Reusable UI pieces
  app/                        Pages. Each folder is a URL.
    page.tsx                  /            landing page
    login/                    /login
    dashboard/                /dashboard, /dashboard/new, /dashboard/<id>/edit
    s/[id]/                   /s/<id>      public share page
    api/auth/[...nextauth]/   Auth.js endpoints
    api/snippets/[id]/raw/    raw code as plain text
```

## Deploy

CodeShelf is built to deploy on [Vercel](https://vercel.com) with MongoDB Atlas.

1. Push the project to GitHub. Make sure `.env` is **not** committed (it is listed in `.gitignore`).
2. In Vercel, choose **Add New Project** and import the repository.
3. Add these environment variables: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET` (and the Google pair if you use it).
4. In Atlas Network Access, allow `0.0.0.0/0`, because Vercel's IP addresses change.
5. Deploy, then copy your site address (for example `https://codeshelf.vercel.app`).
6. Create a second GitHub OAuth app for production with the callback URL `https://<your-site>/api/auth/callback/github`, and use its keys in Vercel. (A GitHub OAuth app only allows one callback URL, so keep one app for local work and one for production.)

On other hosts (Render, Railway, Docker) the same variables apply. Also set `AUTH_URL` to your site address.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `redirect_uri` error on GitHub | The callback URL in your GitHub OAuth app must exactly match `<your site>/api/auth/callback/github`. |
| `MissingSecret` error | `AUTH_SECRET` is empty. Generate one and restart the server. |
| Cannot connect to the database | Add your IP address in Atlas Network Access and check `DATABASE_URL`. |
| The editor says "Loading..." forever | The editor loads from the jsDelivr CDN. Check your internet connection or ad blocker. |
| Build warning about the "Edge Runtime" and `DecompressionStream` | Harmless. It comes from a library used by the login middleware and the app works normally. |
| `npm warn deprecated eslint@9...` during install | Harmless. ESLint 9 is the version this release of Next.js supports. |
| Changed `schema.prisma` | Run `npm run db:push`, then restart `npm run dev`. |
