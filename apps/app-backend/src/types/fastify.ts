import type {
	RouteHandlerMethod, RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression, RouteGenericInterface,
	ContextConfigDefault, FastifySchema, FastifyBaseLogger
} from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"

export type Schema = FastifySchema

export type Handler<Schema extends FastifySchema = FastifySchema> = RouteHandlerMethod<
	RawServerDefault,
	RawRequestDefaultExpression<RawServerDefault>,
	RawReplyDefaultExpression<RawServerDefault>,
	RouteGenericInterface,
	ContextConfigDefault,
	Schema,
	ZodTypeProvider,
	FastifyBaseLogger
>
