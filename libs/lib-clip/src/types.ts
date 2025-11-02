import z from "zod"

export type FindClipParams = {
	title: string
	artist: string
	album: string
}

export const zProvider = z.enum([ "apple", "deezer" ])
export type Provider = z.infer<typeof zProvider>
