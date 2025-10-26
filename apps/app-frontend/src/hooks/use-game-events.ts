import { useEffect } from "react"
import { env } from "#/env"
import { zGame } from "#/generated/zod.gen"
import { showGameQueryKey } from "#/generated/@tanstack/react-query.gen"
import { useQueryClient } from "@tanstack/react-query"

export type UseGameEventsProps = {
	gameId: string
}

export const useGameEvents = ({ gameId }: UseGameEventsProps): void => {
	const queryClient = useQueryClient()

	useEffect(() => {
		const es = new EventSource(`${env.VITE_BACKEND_URL}/games/${gameId}/events`, { withCredentials: true })

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
