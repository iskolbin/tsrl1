export function init<T extends { [key: string]: any }>( obj: T, kvs?: Partial<T> ): void {
	if ( kvs ) {
		for ( const k in kvs ) {
			if ( kvs.hasOwnProperty( k )) {
				obj[k] = kvs[k]
			}
		}
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


export function merge<T>( obj: T, kvs?: Partial<T> ): T {
	if ( kvs ) {
		const result = copy( obj )
		init( result, kvs )
		return result
	} else {
		return obj
	}
}

export function update<T, K extends keyof T>( obj: T, key: K, updater: (value: T[K], key: K, obj: T) => T[K] ): T {
	return set( obj, key, updater( obj[key], key, obj ))
}

export function update2<T, K1 extends keyof T, K2 extends keyof T[K1]>( obj: T, key1: K1, key2: K2, updater: (value: T[K1][K2], key: K2, obj: T[K1]) => T[K1][K2] ): T {
	return set2<T,K1,K2>( obj, key1, key2, updater( obj[key1][key2], key2, obj[key1] ))
}

export function update3<T, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2]>( obj: T, key1: K1, key2: K2, key3: K3, updater: (value: T[K1][K2][K3], key: K3, obj: T[K1][K2]) => T[K1][K2][K3] ): T {
	return set3<T,K1,K2,K3>( obj, key1, key2, key3, updater( obj[key1][key2][key3], key3, obj[key1][key2] ))
}

export class Struct {
	copy(): this {
		return copy( this )
	}

	set<K extends keyof this>( key: K, value: this[K] ): this {
		return set( this, key, value )
	}

	set2<K1 extends keyof this, K2 extends keyof this[K1]>( key1: K1, key2: K2, value: this[K1][K2] ): this {
		return set2( this, key1, key2, value )
	}
	
	set3<K1 extends keyof this,K2 extends keyof this[K1], K3 extends keyof this[K1][K2]>( key1: K1, key2: K2, key3: K3, value: this[K1][K2][K3] ): this {
		return set3( this, key1, key2, key3, value )
	}

	update<K extends keyof this>( key: K, updater: (value: this[K], key: K, obj: this) => this[K] ): this {
		return update( this, key, updater )
	}
	
	update2<K1 extends keyof this, K2 extends keyof this[K1]>( key1: K1, key2: K2, updater: (value: this[K1][K2], key: K2, obj: this[K1]) => this[K1][K2] ): this {
		return update2( this, key1, key2, updater )
	}
	
	update3<K1 extends keyof this, K2 extends keyof this[K1], K3 extends keyof this[K1][K2]>( key1: K1, key2: K2, key3: K3, updater: (value: this[K1][K2][K3], key: K3, obj: this[K1][K2]) => this[K1][K2][K3] ): this {
		return update3( this, key1, key2, key3, updater )
	}

	with( kvs: Partial<this> ): this {
		return merge( this, kvs )
	}
}
