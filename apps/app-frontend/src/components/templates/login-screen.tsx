import { Col } from "#/components/atoms/col"
import { GameTitle } from "#/components/atoms/game-title"
import { Icon } from "#/components/atoms/icon"
import { Button } from "#/components/molecules/button"
import { env } from "#/env"
import type { AuthLoginData } from "#/generated"
import { buildUrl } from "#/utils/api.util"
import { cn } from "#/utils/tailwind.util"
import { SiSpotifyHex, SiSpotify } from "@icons-pack/react-simple-icons"
import { useRouter } from "@tanstack/react-router"

export const LoginScreen = () => {
	const tailwind = cn(
		// Layout
		"h-screen flex flex-col",
		// Appearance
		"bg-background",
		// Interaction
		""
	)

	const router = useRouter()

	const login = () => router.navigate({
		href: buildUrl<AuthLoginData>({ url: "/auth/login", query: { redirectUri: env.VITE_APP_REDIRECT_URL } }),
		reloadDocument: true
	})

	return (
		<div className={tailwind}>
			<Col className="items-center justify-end pb-16 bg-secondary border-b-4 border-foreground flex-1">
				<GameTitle className="w-1/3" />
			</Col>
			<Col className="items-center justify-start pt-24 bg-primary flex-1">
				<Button onClick={login} style={{ backgroundColor: SiSpotifyHex }}>
					<Icon icon={SiSpotify} />
					Login with Spotify
				</Button>
			</Col>
		</div>
	)
}
