import type {
	RouteHandlerMethod, RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression, RouteGenericInterface,
	ContextConfigDefault, FastifySchema, FastifyTypeProviderDefault, FastifyBaseLogger
} from "fastify"

export type Schema = FastifySchema

export type Handler = RouteHandlerMethod<
	RawServerDefault,
	RawRequestDefaultExpression<RawServerDefault>,
	RawReplyDefaultExpression<RawServerDefault>,
	RouteGenericInterface,
	ContextConfigDefault,
	FastifySchema,
	FastifyTypeProviderDefault,
	FastifyBaseLogger
>
