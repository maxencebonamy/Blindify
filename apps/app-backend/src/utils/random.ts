import { v4 as uuidv4 } from "uuid"


export const generateRandomState = (): string => {
	return Math.random().toString(36).substring(2, 15)
}

export const generateUUID = (): string => {
	return uuidv4()
}

export const scrambleArray = <T>(array: T[]): void => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[ array[i], array[j] ] = [ array[j] as T, array[i] as T ]
	}
}
