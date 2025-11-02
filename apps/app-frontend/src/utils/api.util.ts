import { client } from "#/generated/client.gen"

type BuildUrlFn = typeof client.buildUrl

export const buildUrl: BuildUrlFn = params => {
	return client.buildUrl({ baseUrl: client.getConfig().baseUrl, ...params })
}
