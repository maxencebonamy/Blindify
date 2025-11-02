import { useEffect } from "react"
import { zGame } from "#/generated/zod.gen"
import { showGameQueryKey } from "#/generated/@tanstack/react-query.gen"
import { useQueryClient } from "@tanstack/react-query"
import type { SubscribeGameEventsData } from "#/generated"
import { buildUrl } from "#/utils/api.util"

export type UseGameEventsProps = {
	gameId: string
}

export const useGameEvents = ({ gameId }: UseGameEventsProps): void => {
	const queryClient = useQueryClient()

	useEffect(() => {
		const url = buildUrl<SubscribeGameEventsData>({ url: "/games/{gameId}/events", path: { gameId } })
		const es = new EventSource(url, { withCredentials: true })

		es.addEventListener("update", event => {
			const data = JSON.parse((event as MessageEvent).data)
			const game = zGame.safeParse(data)
			if (game.success) {
				queryClient.setQueryData(showGameQueryKey({ path: { gameId } }), game.data)
			}
		})

		return () => es.close()
	}, [ gameId ])
}
