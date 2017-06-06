export function init<T, K extends keyof T>( obj: T, kvs: {[key: string]: T[K]} ): void {
	for ( const k in kvs ) {
		(obj as any)[k] = kvs[k]
	}
}

export function copy<T>( obj: T ): T {
	const result = Object.create( Object.getPrototypeOf( obj ))
	for ( const k in obj ) {
		result[k] = obj[k]
	}
	return result
}

export function set<T, K extends keyof T>( obj: T, key: K, value: T[K] ): T {
	const result = copy( obj )
	result[key] = value
	return result
}

export function merge<T, K extends keyof T>( obj: T, kvs: {[key: string]: T[K]} ): T {
	const result = copy( obj )
	init( result, kvs )
	return result
}

export function update<T, K extends keyof T>( obj: T, key: K, updater: (value: T[K], key: K, obj: T) => T[K] ): T {
	return set( obj, key, updater( obj[key], key, obj ))
}

export class Struct {
	init( kvs?: any ) {
		if ( kvs !== undefined ) {
			init( this, kvs )
		}
	}

	copy() {
		return copy( this )
	}

	set<K extends keyof this>( key: K, value: this[K] ) {
		return set( this, key, value )
	}

	update<K extends keyof this>( key: K, updater: (value: this[K], key: K, obj: this) => this[K] ) {
		return update( this, key, updater )
	}

	merge<K extends keyof this>( kvs: any ) {
		return merge<this,K>( this, kvs )
	}
}
