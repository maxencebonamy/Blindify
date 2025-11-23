import { useRouter } from "@tanstack/react-router"

export const useNavigateBack = (): () => void => {
	const router = useRouter()

	return () => {
		if (!router.history.canGoBack()) {
			return router.navigate({ to: "/" })
		}

		return router.history.back()
	}
}
