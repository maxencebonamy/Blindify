import { v4 as uuidv4 } from "uuid"


export const generateRandomState = (): string => {
	return Math.random().toString(36).substring(2, 15)
}

export const generateUUID = (): string => {
	return uuidv4()
}
