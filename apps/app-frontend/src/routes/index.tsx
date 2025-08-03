import { Profile } from "@/components/profile"
import { checkHealthOptions } from "@/generated/@tanstack/react-query.gen"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
	component: App
})

function App() {
	const { data, isLoading, isError } = useQuery(checkHealthOptions())

	return (
		<div className="">
			<p className="text-2xl font-bold mb-4">Welcome to the App!</p>
			<Profile />
			{isLoading && <p>Loading...</p>}
			{isError && <p>Error loading health status</p>}
			{data && (
				<div>
					<h1>Health Status</h1>
					<pre>{JSON.stringify(data, null, 2)}</pre>
				</div>
			)}
		</div>
	)
}
