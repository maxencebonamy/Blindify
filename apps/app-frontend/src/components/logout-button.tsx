import { authLogout } from "@/generated"
import { authMeQueryKey } from "@/generated/@tanstack/react-query.gen"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const LogoutButton = () => {
	const queryClient = useQueryClient()

	const { mutate: logout } = useMutation({
		mutationFn: () => authLogout(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: authMeQueryKey() })
		}
	})

	return (
		<button onClick={() => logout()} className="bg-blue-400 px-4 py-2 rounded text-white hover:bg-blue-500">
			Logout
		</button>
	)
}
