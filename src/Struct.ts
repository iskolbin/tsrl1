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

export class Struct {
	copy(): this {
		return copy( this )
	}

	set<K extends keyof this>( key: K, value: this[K] ): this {
		return set( this, key, value )
	}

	update<K extends keyof this>( key: K, updater: (value: this[K], key: K, obj: this) => this[K] ): this {
		return update( this, key, updater )
	}

	with( kvs: Partial<this> ): this {
		return merge( this, kvs )
	}
}
