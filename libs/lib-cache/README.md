# lib-cache

A simple caching library backed by Redis with type-safe retrieval.


## Get started

Install the lib:

```bash
pnpm i lib-cache --workspace
```


## Usage

Import the cache functions and use them to get, set, delete, or check cached values.

### `get(key, schema?)`

Retrieve a cached value by key.

* **Parameters:**

  * `key` (string): The cache key.
  * `schema` (optional, Zod schema): A Zod schema to validate and parse the cached value.

* **Returns:** The cached value, typed if schema is provided.

* **Behavior:**

  * Throws an error if the key does not exist in the cache.
  * If a schema is provided, the cached value is validated against it; throws if validation fails.
  * If no schema is provided, returns the raw decoded value.

```ts
const userSchema = z.object({ id: z.string(), name: z.string() })

const user = await get("user:123", userSchema) // typed as { id: string; name: string }
const rawValue = await get<string>("someKey") // typed as string
```

### `set(key, value, ttl?)`

Store a value in cache under the specified key.

* **Parameters:**

  * `key` (string): The cache key.
  * `value` (unknown): The value to cache.
  * `ttl` (optional, number): Time-to-live in seconds. If omitted, the default TTL from env (`CACHE_TTL`) is used.

```ts
import { set } from "lib-cache"

await set("user:123", { id: "123", name: "Alice" }, 3600) // cache for 1 hour
await set("session:abc", "some data") // cache with default TTL
```

### `del(key)`

Delete a cache entry by key.

* Throws an error if the key did not exist or deletion failed.

```ts
import { del } from "lib-cache"

await del("user:123")
```

### `has(key)`

Check if a key exists in the cache.

* Returns `true` if the key exists, otherwise `false`.

```ts
import { has } from "lib-cache"

const exists = await has("user:123")
```


## Environment Variables

| Name       | Description                  | Values/Format              |
| ---------- | ---------------------------- | -------------------------- |
| CACHE_TTL  | Default cache TTL in seconds | Number (e.g., 3600)        |
| REDIS_HOST | Redis server hostname        | String (e.g., "localhost") |
| REDIS_PORT | Redis server port            | Number (e.g., 6379)        |
