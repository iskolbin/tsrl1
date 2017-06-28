export function make<T>( defaultObj: T, kvs?: Partial<T> ): T {
	if ( kvs ) {
		const result = Object.create( Object.getPrototypeOf( defaultObj ))
		for ( const k in defaultObj ) { 
			if ( kvs.hasOwnProperty( k )) {
				result[k] = kvs[k]
			} else {
				result[k] = defaultObj[k]
			}
		}
	} else {
		return defaultObj
	}
}

export function copy<T>( obj: T ): T {
	const result = Object.create( Object.getPrototypeOf( obj ))
	for ( const k in obj ) {
		if ( obj.hasOwnProperty( k )) {
			result[k] = obj[k]
		}
	}
	return result
}

export function set<T, K extends keyof T>( obj: T, key: K, value: T[K] ): T {
	const result = copy( obj )
	result[key] = value
	return result
}

export function merge<T>( obj: T, kvs?: Partial<T> ): T {
	if ( kvs ) {
		const result = copy( obj )
		for ( const k in kvs ) {
			if ( kvs.hasOwnProperty( k )) {
				obj[k] = kvs[k]
			}
		}
		return result
	} else {
		return obj
	}
}

export function update<T, K extends keyof T>( obj: T, key: K, updater: (value: T[K], key: K, obj: T) => T[K] ): T {
	return set( obj, key, updater( obj[key], key, obj ))
}
