import { playlistsTestOptions } from "#/generated/@tanstack/react-query.gen"
import { useQuery } from "@tanstack/react-query"

export const Playlists = () => {
	const { data: playlists, isLoading, isError } = useQuery(playlistsTestOptions())

	if (isLoading) {
		return <p>Loading playlists...</p>
	}

	if (isError || !playlists) {
		return <p>Error loading playlists</p>
	}

	return (
		<div className="playlists">
			<h1 className="text-2xl font-bold mb-4">Your Playlists</h1>
			<ul>
				{playlists.map(playlist => (
					<li key={playlist.id}>
						<strong>{playlist.name}</strong>
						{" "}
						{playlist.sample
							? (
								<audio controls>
									<source src={playlist.sample} type="audio/mpeg" />
									Your browser does not support the audio element.
								</audio>
							)
							: (
								<span>No sample available</span>
							)}
					</li>
				))}
			</ul>
		</div>
	)
}
