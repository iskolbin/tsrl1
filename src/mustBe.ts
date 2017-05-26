export function mustBe<T>( item: T | undefined | null, message?: string ): T {
	if ( item === undefined || item === null ) {
		throw new Error( message )
	} else {
		return item
	}
}
