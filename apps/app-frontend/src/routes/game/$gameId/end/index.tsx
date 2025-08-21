import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/game/$gameId/end/")({
	component: RouteComponent
})

function RouteComponent() {
	return <div>Hello "/game/$gameId/end/"!</div>
}
