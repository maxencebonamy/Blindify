import type {
	RouteHandlerMethod, RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression, RouteGenericInterface,
	ContextConfigDefault, FastifySchema, FastifyBaseLogger,
	FastifyInstance
} from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"

type MaybePromise<T> = T | Promise<T>

export type AutoLoaderSchema = FastifySchema

export type AutoLoaderHandler<Schema extends FastifySchema = FastifySchema> = RouteHandlerMethod<
	RawServerDefault,
	RawRequestDefaultExpression<RawServerDefault>,
	RawReplyDefaultExpression<RawServerDefault>,
	RouteGenericInterface,
	ContextConfigDefault,
	Schema,
	ZodTypeProvider,
	FastifyBaseLogger
>

export type AutoLoaderTask = (app: FastifyInstance) => MaybePromise<void>
