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
		return result
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

export function set2<T, K1 extends keyof T, K2 extends keyof T[K1]>( obj: T, key1: K1, key2: K2, value: T[K1][K2] ): T {
	const result = copy( obj )
	result[key1] = copy( obj[key1] )
	result[key1][key2] = value
	return result
}

export function set3<T, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2]>( obj: T, key1: K1, key2: K2, key3: K3, value: T[K1][K2][K3] ): T {
	const result = copy( obj )
	result[key1] = copy( obj[key1] )
	result[key1][key2] = copy( obj[key1][key2] )
	result[key1][key2][key3] = value
	return result
}

	/*
export function merge<T>( obj: T, kvs?: Partial<T> ): T {
	if ( kvs ) {
		const result = copy( obj )
		for ( const k in kvs ) {
			if ( kvs.hasOwnProperty( k ) && kvs[k] !== undefined ) {
				result[k] = kvs[k]
			}
		}
		return result
	} else {
		return obj
	}
}
	 */

export function update<T, K extends keyof T>( obj: T, key: K, updater: (value: T[K], key: K, obj: T) => T[K] ): T {
	return set( obj, key, updater( obj[key], key, obj ))
}

export function update2<T, K1 extends keyof T, K2 extends keyof T[K1]>( obj: T, key1: K1, key2: K2, updater: (value: T[K1][K2], key: K2, obj: T[K1]) => T[K1][K2] ): T {
	return set2<T,K1,K2>( obj, key1, key2, updater( obj[key1][key2], key2, obj[key1] ))
}

export function update3<T, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2]>( obj: T, key1: K1, key2: K2, key3: K3, updater: (value: T[K1][K2][K3], key: K3, obj: T[K1][K2]) => T[K1][K2][K3] ): T {
	return set3<T,K1,K2,K3>( obj, key1, key2, key3, updater( obj[key1][key2][key3], key3, obj[key1][key2] ))
}
