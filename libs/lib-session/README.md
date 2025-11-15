# lib-session

Manage user sessions with creation, retrieval, and revocation.

## Get started

Install the lib:

```bash
pnpm add --workspace lib-session
```

## Create a session

Generate a new session using a token and a platform.

```ts
import { sessions } from "lib-session"
import type { Token } from "lib-platform-connector"

const token: Token = {
	accessToken: "access-123",
	refreshToken: "refresh-123",
	accessExpiresAt: new Date()
}

const session = await sessions.create(token, "spotify")
```

## Retrieve a session

Get a session by its ID.
If the session is expired, it may automatically refresh or be revoked depending on the token.
If the session does not exist or could not be refreshed, `null` is returned.

```ts
import { sessions } from "lib-session"

const session = await sessions.retrieve("session-id-123")
```

## Revoke a session

Delete a session by its ID.

```ts
import { sessions } from "lib-session"

await sessions.revoke("session-id-123")
```

## Session type

The session object returned by `retrieve` (or stored in the database) has the following fields:

- `id`: the unique identifier of the session
- `accessToken`: the access token for the platform
- `refreshToken`: the refresh token (nullable)
- `accessExpiresAt`: the expiration date of the access token
- `platform`: the platform associated with the session (eg: `spotify`)
- `createdAt`: creation timestamp
- `lastUsedAt`: last usage timestamp
