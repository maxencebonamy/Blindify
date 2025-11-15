# lib-pagination

Paginate an array.

## Get started

Install the lib:

```bash
pnpm add --workspace lib-pagination
```

## Paginate from source

When you only have the complete array of data.

```ts
import { paginate } from "lib-pagination"

const page = paginate.fromSource(array, { currentPage: 1, pageSize: 20 })
```

## Paginate from subset

When you already have the page subset of data.

```ts
import { paginate } from "lib-pagination"

const page = paginate.fromSubset(array, { currentPage: 1, pageSize: 20, totalItems: 150 })
```

## Page

The page object that results from a pagination has the following fields:
- `currentPage`: the index of the current page (starts from 1)
- `lastPage`: the index of the last page (null if the current page is the first one)
- `nextPage`: the index of the next page (null if the current page is the last one)
- `totalPages`: the total of pages (minimum 1 because empty page is allowed)
- `totalItems`: the total of items in all the pages
- `pageSize`: the number of items in a single page (the last page may have less items than the page size)
- `items`: the items subset of the page

Since several fields of that object depend on each other, a validation is performed to ensure all fields are consistent.
