import * as Struct from './Struct'
import * as Rectangle from './Rectangle'
import * as Tile from './Tile'
import * as Prng from 'tspersistentprng'
import * as Vector from 'tspersistentvector'

export interface Data {
	kind: 'Data'
	width: number
	height: number
	tiles: Vector.Data<Tile>
	prng: Prng.Data
}

export interface TileBrush {
	createFreeTile: () => Tile.Data
	createBlockedTile: () => Tile.Data
}

const DEFAULT: Data = {
	kind: 'Data',
	width: 1,
	height: 1,
	tiles: Vector.NIL,
	prng: Prng.make()
}

export function make( params?: Partial<Data> ): Data {
	return Struct.make( DEFAULT, params )
}

export function clear( dungeon: Data, brush: TileBrush ): Data {
	let tiles = Vector.NIL
	let i = 0
	for ( let y = 0; y < dungeon.height; y++ ) {
		for ( let x = 0; x < dungeon.width; x++ ) {
			tiles = Vector.set( tiles, i++, brush.createBlockedTile() )
		}
	}
	return Struct.set( dungeon, 'tiles', tiles )
}

export function createRoom( dungeon: Data, x: number, y: number, w: number, h: number, brush: TileBrush ) {
	return updateTileRect( dungeon, x, y, w, h, brush.createFreeTile )
}

export function createTunnelH( dungeon: Data, x0: number, x1: number, y: number, brush: TileBrush ) {
	let {tiles} = dungeon
	if ( x0 < x1 ) {
		for ( let x = x0; x < x1; x++ ) {
			tiles = Vector.set( tiles, getTileIndex( dungeon, x, y ), brush.createFreeTile() )
		}
	} else {
		for ( let x = x1; x < x0; x++ ) {
			tiles = Vector.set( tiles, getTileIndex( dungeon, x, y ), brush.createFreeTile() )
		}
	}
	return Struct.set( dungeon, 'tiles', tiles )
}

export function createTunnelV( dungeon: Data, y0: number, y1: number, x: number, brush: TileBrush ) {
	let {tiles} = dungeon
	if ( y0 < y1 ) {
		for ( let y = y0; y < y1; y++ ) {
			tiles = Vector.set( tiles, getTileIndex( dungeon, x, y ), brush.createFreeTile() )
		}
	} else {
		for ( let y = y1; y < y0; y++ ) {
			tiles = Vector.set( tiles, getTileIndex( dungeon, x, y ), brush.createFreeTile() )
		}
	}
	return Struct.set( dungeon, 'tiles', tiles )
}

export function generate( dungeon: Data, minSize: number, maxSize: number, count: number, brush: TileBrush ) {
	let current: Data = dungeon
	let {width, height, prng} = dungeon
	let rooms: Rectangle.Data[] = []
	for ( let i = 0; i < count; i++ ) {
		let failed = false
		prng = Prng.next( prng )
		const w = Prng.random( prng, minSize, maxSize ) | 0
		prng = Prng.next( prng )
		const h = Prng.random( prng, minSize, maxSize ) | 0
		prng = Prng.next( prng )
		const x = Prng.random( prng, 0, width - w - 1 ) | 0
		prng = Prng.next( prng )
		const y = Prng.random( prng, 0, height - h - 1 ) | 0
		const newRoom: Rectangle.Data = Rectangle.make( {x, y, w, h} )
		for ( const room of rooms ) {
			if ( Rectangle.intersect( newRoom, room )) {
				failed = true
				break
			}
		}
		if ( !failed ) {
			current = createRoom( current, x, y, w, h, brush )
			if ( rooms.length > 0 ) {
				const [prevX,prevY] = Rectangle.center( rooms[rooms.length-1] )
				prng = Prng.next( prng )
				if ( Prng.random( prng ) <= 0.5 ) {
					current = createTunnelH( current, prevX, x, y, brush ) 
					current = createTunnelV( current, prevY, y, x, brush )
				} else {
					current = createTunnelV( current, prevY, y, x, brush )
					current = createTunnelH( current, prevX, x, y, brush )
				}
			}
			rooms.push( newRoom )
		}
	}
	return Struct.set( current, 'prng', prng )
}

export function setTile( dungeon: Data, x: number, y: number, tile: Tile.Data ) {
	return updateTile( dungeon, x, y, _ => tile )
}

export function updateTile( dungeon: Data, x: number, y: number, updater: (tile: Tile.Data) => Tile.Data ) {
	if ( x >= 0 && x < dungeon.width && y >= 0 && y < dungeon.height ) {
		return Struct.update( dungeon, 'tiles', tiles => Vector.update( tiles, getTileIndex( dungeon, x, y ), updater ))
		//	return this.set( 'tiles', this.tiles.set( this.getTileIndex( x, y ), fTile( x, y, this.getTile( x, y ))))
	} else {
		return dungeon
	}
}

export function updateTileRect( dungeon: Data, x: number, y: number, w: number, h: number, updater: (tile: Tile.Data) => Tile.Data ) {
	if ( w <= 0 || h <= 0 || x + w < 0 || y + h < 0 || x >= dungeon.width || y >= dungeon.height ) {
		return dungeon
	} else {
		const x0 = Math.max( 0, x )
		const x1 = Math.min( dungeon.width, x + w )
		const y0 = Math.max( 0, y )
		const y1 = Math.min( dungeon.height, y + h )

		let {tiles} = dungeon
		for ( let x = x0; x < x1; x++ ) {
			for ( let y = y0; y < y1; y++ ) {
				tiles = Vector.update( tiles, getTileIndex( dungeon, x, y ), updater )
			}
		}
		return Struct.set( dungeon, 'tiles', tiles ) 
	}
}

export function getTileIndex( dungeon: Data, x: number, y: number ) {
	return x + y * dungeon.width
}

export function getTileX( dungeon: Data, id: number ) {
	return id % dungeon.width
}

export function getTileY( dungeon: Data, id: number ) {
	return ( id / dungeon.width ) | 0
}

export function getTileXy( dungeon: Data, id: number ): [number,number] {
	return [getTileX( dungeon, id ), getTileY( dungeon, id )]
}

export function getTile( dungeon: Data, x: number, y: number ) {
	return Vector.get( dungeon.tiles, getTileIndex( dungeon, x, y ))
}

export function isInside( dungeon: Data, x: number, y: number ): boolean {
	return x >= 0 && y >= 0 && x < dungeon.width && y < dungeon.height
}

export function isBlocked( dungeon: Data, x: number, y: number ): boolean {
	return !isInside( dungeon, x, y ) || getTile( dungeon, x, y ).blocked
}

export function isOpaque( dungeon: Data, x: number, y: number ): boolean {
	return !isInside( dungeon, x, y ) || getTile( dungeon, x, y ).opaque
}
