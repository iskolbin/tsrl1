import * as Struct from './Struct'
import * as Rectangle from './Rectangle'
import * as Tile from './Tile'
import * as Prop from './Prop'
import * as Prng from 'tspersistentprng'
import * as Vector from 'tspersistentvector'

export interface Data {
	width: number
	height: number
	tiles: Vector.Data<Tile.Data>
	rooms: Vector.Data<Rectangle.Data>
	props: Vector.Data<Prop.Data>
	prng: Prng.Data
}

export interface TileBrush {
	createFreeTile: (x: number, y: number) => Tile.Data
	createBlockedTile: (x: number, y: number) => Tile.Data
}

const DEFAULT: Data = {
	width: 1,
	height: 1,
	tiles: Vector.NIL,
	rooms: Vector.NIL,
	props: Vector.NIL,
	prng: Prng.make()
}

export function make( params?: Partial<Data> ): Data {
	return Struct.make( DEFAULT, params )
}

export function clear( dungeon: Data, brush: TileBrush ): Data {
	let tiles: Vector.Data<Tile.Data> = Vector.NIL
	for ( let y = 0; y < dungeon.height; y++ ) {
		for ( let x = 0; x < dungeon.width; x++ ) {
			tiles = Vector.push( tiles, brush.createBlockedTile( x, y ))
		}
	}
	return Struct.set( dungeon, 'tiles', tiles )
}

export function createRoom( dungeon: Data, x0: number, y0: number, width: number, height: number, brush: TileBrush ) {
	let {tiles} = dungeon
	for ( let x = x0; x < x0 + width; x++ ) {
		for ( let y = y0; y < y0 + height; y++ ) {
			tiles = Vector.set( tiles, getTileIndex( dungeon, x, y ), brush.createFreeTile(x,y) )
		}
	}
	return Struct.set( dungeon, 'tiles', tiles )
}

export function createTunnelH( dungeon: Data, x0: number, x1: number, y: number, brush: TileBrush ) {
	let {tiles} = dungeon
	if ( x0 < x1 ) {
		for ( let x = x0; x <= x1; x++ ) {
			tiles = Vector.set( tiles, getTileIndex( dungeon, x, y ), brush.createFreeTile(x,y) )
		}
	} else {
		for ( let x = x1; x <= x0; x++ ) {
			tiles = Vector.set( tiles, getTileIndex( dungeon, x, y ), brush.createFreeTile(x,y) )
		}
	}
	return Struct.set( dungeon, 'tiles', tiles )
}

export function createTunnelV( dungeon: Data, y0: number, y1: number, x: number, brush: TileBrush ) {
	let {tiles} = dungeon
	if ( y0 < y1 ) {
		for ( let y = y0; y <= y1; y++ ) {
			tiles = Vector.set( tiles, getTileIndex( dungeon, x, y ), brush.createFreeTile(x,y) )
		}
	} else {
		for ( let y = y1; y <= y0; y++ ) {
			tiles = Vector.set( tiles, getTileIndex( dungeon, x, y ), brush.createFreeTile(x,y) )
		}
	}
	return Struct.set( dungeon, 'tiles', tiles )
}

export function generate( dungeon: Data, minSize: number, maxSize: number, count: number, brush: TileBrush ) {
	let current: Data = dungeon
	let {width, height, prng} = dungeon
	let rooms: Rectangle.Data[] = []
	count = 10
	for ( let i = 0; i < count; i++ ) {
		let failed = false
		prng = Prng.next( prng )
		const w = Prng.random( prng, minSize, maxSize ) | 0
		prng = Prng.next( prng )
		const h = Prng.random( prng, minSize, maxSize ) | 0
		prng = Prng.next( prng )
		const x = Prng.random( prng, 1, width - w - 1 ) | 0
		prng = Prng.next( prng )
		const y = Prng.random( prng, 1, height - h - 1 ) | 0
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
				const [cx,cy] = Rectangle.center( newRoom )
				const [prevX,prevY] = Rectangle.center( rooms[rooms.length-1] )
				prng = Prng.next( prng )
				if ( Prng.random( prng ) <= 0.5 ) {
					current = createTunnelH( current, prevX, cx, cy, brush ) 
					current = createTunnelV( current, prevY, cy, prevX, brush )
				} else {
					current = createTunnelV( current, prevY, cy, cx, brush )
					current = createTunnelH( current, prevX, cx, prevY, brush )
				}
			}
			rooms.push( newRoom )
			current = Struct.set( current, 'rooms', Vector.push( current.rooms, newRoom ))
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
	return !isInside( dungeon, x, y ) || (getTile( dungeon, x, y ) as Tile.Data).blocked
}

export function isOpaque( dungeon: Data, x: number, y: number ): boolean {
	return !isInside( dungeon, x, y ) || (getTile( dungeon, x, y ) as Tile.Data).opaque
}

export function isVisible( dungeon: Data, x: number, y: number ): boolean {
	return isInside( dungeon, x, y ) && (getTile( dungeon, x, y ) as Tile.Data).visible
}

export function getPropAt( dungeon: Data, x0: number, y0: number ): Prop.Data | undefined {
	return Vector.find( dungeon.props, ({x,y}) => x === x0 && y === y0 )
}

export function isExplored( dungeon: Data, x: number, y: number ): boolean {
	const tile = getTile( dungeon, x, y )
	return tile ? tile.explored : false
}
