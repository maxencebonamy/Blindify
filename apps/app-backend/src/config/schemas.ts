import { zApiError } from "#/types/error.type"
import { zGameSettings, zGameStatus, zGame, zGameMinimal } from "#/types/game.type"
import { zSample, zSampleMinimal } from "#/types/sample.type"
import { zCatalogAlbum, zCatalogArtist, zCatalogTrack } from "lib-catalog"
import { zUser, zArtist, zAlbum, zTrack, zPlaylist, zPlatform } from "lib-platform-connector"
import z from "zod"

export const registerSchemas = (): void => {
	z.globalRegistry.add(zApiError, { id: "ApiError" })
	z.globalRegistry.add(zGameSettings, { id: "GameSettings" })
	z.globalRegistry.add(zGameStatus, { id: "GameStatus" })
	z.globalRegistry.add(zGame, { id: "Game" })
	z.globalRegistry.add(zGameMinimal, { id: "GameMinimal" })
	z.globalRegistry.add(zUser, { id: "User" })
	z.globalRegistry.add(zArtist, { id: "Artist" })
	z.globalRegistry.add(zAlbum, { id: "Album" })
	z.globalRegistry.add(zTrack, { id: "Track" })
	z.globalRegistry.add(zPlaylist, { id: "Playlist" })
	z.globalRegistry.add(zPlatform, { id: "Platform" })
	z.globalRegistry.add(zSample, { id: "Sample" })
	z.globalRegistry.add(zSampleMinimal, { id: "SampleMinimal" })
	z.globalRegistry.add(zCatalogAlbum, { id: "CatalogAlbum" })
	z.globalRegistry.add(zCatalogArtist, { id: "CatalogArtist" })
	z.globalRegistry.add(zCatalogTrack, { id: "CatalogTrack" })
}
