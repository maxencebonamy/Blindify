import { searchFromApple } from "#/search/apple/search"
import type { SearchTrack } from "#/search/common"
import { searchFromDeezer } from "#/search/deezer/search"
import type { Provider } from "#/types"

export const searchFromProvider = (provider: Provider, searchQuery: string): Promise<SearchTrack[]> => {
	switch (provider) {
		case "apple":
			return searchFromApple(searchQuery)
		case "deezer":
			return searchFromDeezer(searchQuery)
	}
}
