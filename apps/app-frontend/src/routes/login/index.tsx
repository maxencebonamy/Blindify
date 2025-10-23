import { createFileRoute } from "@tanstack/react-router"
import { LoginScreen } from "#/components/templates/login-screen"

export const Route = createFileRoute("/login/")({
	component: RouteComponent
})

function RouteComponent() {
	return (
		<LoginScreen />
	)
}
