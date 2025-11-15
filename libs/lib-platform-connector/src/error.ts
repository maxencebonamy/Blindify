export class PlatformConnectorError extends Error {

	constructor(message: string) {
		super(message)
		this.name = "PlatformConnectorError"
	}

}
