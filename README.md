# SkillChain Backend

REST API + real-time WebSocket backend for the **SkillChain** Web3 freelance marketplace.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | NestJS (TypeScript) |
| Database | Supabase (PostgreSQL) |
| ORM | Prisma 7 |
| Auth | Supabase Auth (Email OTP → JWT) |
| Real-time | Socket.IO (3 gateways: chat, communities, notifications) |
| File Storage | Supabase Storage |
| API Docs | Swagger — `/api/docs` |

## Project Structure

```
src/
├── auth/               # OTP auth, JWT strategy & guard, CurrentUser decorator
├── users/              # Profile CRUD, follow/unfollow, documents
├── posts/              # Social feed, likes, reposts, bookmarks, comments
├── jobs/               # Job board, applications, status management
├── chat/               # 1-on-1 DMs (REST + Socket.IO gateway)
├── communities/        # Group channels (REST + Socket.IO gateway)
├── notifications/      # Real-time push notifications (Socket.IO gateway)
├── reviews/            # Ratings with automatic aggregate update
├── search/             # Cross-entity search (users, jobs, posts)
├── uploads/            # Supabase Storage presigned URL generation
└── prisma/             # PrismaService (global module)
prisma/
└── schema.prisma       # Full DB schema (all entities)
prisma.config.ts        # Prisma 7 datasource config
```

## Getting Started

### 1. Set up environment variables

```bash
cp .env.example .env
```

Fill in your values in `.env`:

- `SUPABASE_URL` — your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — from Supabase → Settings → API
- `SUPABASE_JWT_SECRET` — from Supabase → Settings → API → JWT Secret
- `DATABASE_URL` — Supabase connection string (pooled, port 6543)
- `DIRECT_URL` — Supabase direct connection string (port 5432)

> 💡 Get connection strings from: **Supabase Dashboard → Settings → Database → Connection String**

### 2. Push the schema to Supabase

```bash
npx prisma db push
```

### 3. Set up Supabase Storage buckets

In the Supabase Dashboard → Storage, create these buckets (set to **public**):
- `avatars`
- `documents`
- `portfolio`

### 4. Run the development server

```bash
npm run start:dev
```

API available at: `http://localhost:3001/api/v1`  
Swagger docs at: `http://localhost:3001/api/docs`

## API Overview

| Module | Base Path |
|--------|-----------|
| Auth | `/api/v1/auth` |
| Users | `/api/v1/users` |
| Posts | `/api/v1/posts` |
| Jobs | `/api/v1/jobs` |
| Chat | `/api/v1/chat` |
| Communities | `/api/v1/communities` |
| Notifications | `/api/v1/notifications` |
| Reviews | `/api/v1/reviews` |
| Search | `/api/v1/search` |
| Uploads | `/api/v1/uploads` |

## WebSocket Gateways

| Gateway | Namespace | Events |
|---------|-----------|--------|
| Chat | `/chat` | `joinConversation`, `sendMessage`, `markRead` → emits `newMessage` |
| Communities | `/communities` | `joinGroup`, `sendCommunityMessage` → emits `communityMessage` |
| Notifications | `/notifications` | `register` → emits `notification` |

## Auth Flow

1. **POST** `/api/v1/auth/request-otp` — `{ email, username }` → OTP sent to email via Supabase
2. **POST** `/api/v1/auth/verify-otp` — `{ email, token }` → returns `accessToken` + `refreshToken`
3. Use `Authorization: Bearer <accessToken>` on all protected endpoints
4. **POST** `/api/v1/auth/refresh` — `{ refreshToken }` → new tokens

## File Upload Flow

1. **POST** `/api/v1/uploads/presign` — `{ bucket, fileName }` → returns `{ uploadUrl, path, publicUrl }`
2. Client **PUTs** the file directly to `uploadUrl`
3. Client saves `publicUrl` via **PATCH** `/api/v1/users/me`
