import type { PaginateFromSourceParams, zPaginateFromSourceParams } from "#/from-source"
import { fromSource } from "#/from-source"
import type { PaginateFromSubsetParams, zPaginateFromSubsetParams } from "#/from-subset"
import { fromSubset } from "#/from-subset"

export const paginate = { fromSource, fromSubset }
export type { PaginateFromSourceParams, zPaginateFromSourceParams, PaginateFromSubsetParams, zPaginateFromSubsetParams }
export type { Page } from "#/page"
export { zPage } from "#/page"
export { PaginationError } from "#/error"
