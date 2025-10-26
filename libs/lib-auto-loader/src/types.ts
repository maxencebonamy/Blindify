import type {
	FastifySchema, FastifyInstance, FastifyReply, FastifyRequest, RawRequestDefaultExpression, RawServerDefault, RouteGenericInterface,
	RawReplyDefaultExpression,
	ContextConfigDefault,
	setCookieWrapper
} from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import type { CookieSerializeOptions, UnsignResult } from "@fastify/cookie"

type MaybePromise<T> = T | Promise<T>

export type AutoLoaderSchema = FastifySchema

export type AutoLoaderHandler<Schema extends FastifySchema = FastifySchema> = (
	request: FastifyRequest<
		RouteGenericInterface,
		RawServerDefault,
		RawRequestDefaultExpression<RawServerDefault>,
		Schema,
		ZodTypeProvider
	> & {
		cookies: { [cookieName: string]: string | undefined }
	},
	reply: FastifyReply<
		RouteGenericInterface,
		RawServerDefault,
		RawRequestDefaultExpression<RawServerDefault>,
		RawReplyDefaultExpression<RawServerDefault>,
		ContextConfigDefault,
		Schema
	> & {
		setCookie: setCookieWrapper
		cookie(name: string, value: string, options?: CookieSerializeOptions): FastifyReply
		clearCookie(name: string, options?: CookieSerializeOptions): FastifyReply
		unsignCookie(value: string): UnsignResult
	}
) => MaybePromise<void>

export type AutoLoaderTask = (app: FastifyInstance) => MaybePromise<void>
