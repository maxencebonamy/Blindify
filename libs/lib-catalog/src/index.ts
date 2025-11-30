import { searchArtists } from "#/deezer/search-artists"
import { getArtist } from "#/deezer/get-artist"
import { getArtistTracks } from "#/deezer/get-artist-tracks"

export const catalog = {
	searchArtists,
	getArtist,
	getArtistTracks
}

export * from "#/types"
