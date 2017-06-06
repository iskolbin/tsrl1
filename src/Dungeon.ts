import { Struct, init } from './Struct'
import { List } from 'immutable'
import { Rectangle } from './Rectangle'
import { Tile } from './Tile'
import { Prng } from 'tspersistentprng'

export class Dungeon extends Struct {
	width: number = 1
	height: number = 1
	tiles: List<Tile> = List<Tile>([])
	prng: Prng = new Prng()
	createBlockedTile: () => Tile = () => new Tile()
	createFreeTile: () => Tile = () => new Tile()

	constructor( params?: Partial<Dungeon> ) {
		super()
		init<Dungeon>( this, params )
	}

	clear(): Dungeon {
		let tiles = List<Tile>()
		let i = 0
		for ( let y = 0; y < this.height; y++ ) {
			for ( let x = 0; x < this.width; x++ ) {
				tiles = tiles.set( i++, this.createBlockedTile() )
			}
		}
		return this.set( 'tiles', tiles )
	}

	createRoom( x: number, y: number, w: number, h: number ) {
		return this.updateTiles( x, y, w, h, this.createFreeTile )
	}

	createTunnelH( x0: number, x1: number, y: number ) {
		let tiles = this.tiles
		if ( x0 < x1 ) {
			for ( let x = x0; x < x1; x++ ) {
				tiles = tiles.set( this.getTileIndex( x, y ), this.createFreeTile() )
			}
		} else {
			for ( let x = x1; x < x0; x++ ) {
				tiles = tiles.set( this.getTileIndex( x, y ), this.createFreeTile() )
			}
		}
		return this.set( 'tiles', tiles )
	}

	createTunnelV( y0: number, y1: number, x: number ) {
		let tiles = this.tiles
		if ( y0 < y1 ) {
			for ( let y = y0; y < y1; y++ ) {
				tiles = tiles.set( this.getTileIndex( x, y ), this.createFreeTile() )
			}
		} else {
			for ( let y = y1; y < y0; y++ ) {
				tiles = tiles.set( this.getTileIndex( x, y ), this.createFreeTile() )
			}
		}
		return this.set( 'tiles', tiles )
	}

	with2( o: Partial<this> ) {
		console.log( "OBJ", o )
		const r = this.with( o )
		console.log( r )
		console.log( "BLOCKER", (o as any).createBlockedTile() )
		console.log( (r as any).createBlockedTile() )
		return r
	}

	generate( minSize: number, maxSize: number, count: number ) {
		let current: Dungeon = this
		let prng = this.prng
		let rooms: Rectangle[] = []
		for ( let i = 0; i < count; i++ ) {
			let failed = false
			prng = prng.next()
			const w = prng.random( minSize, maxSize ) | 0
			prng = prng.next()
			const h = prng.random( minSize, maxSize ) | 0
			prng = prng.next()
			const x = prng.random( 0, this.width - w - 1 ) | 0
			prng = prng.next()
			const y = prng.random( 0, this.height - h - 1 ) | 0
			const newRoom: Rectangle = new Rectangle( x, y, w, h )
			for ( const room of rooms ) {
				if ( newRoom.intersect( room )) {
					failed = true
					break
				}
			}

			if ( !failed ) {
				current = current.createRoom( x, y, w, h )
				if ( rooms.length > 0 ) {
					const [prevX,prevY] = rooms[rooms.length-1].center()
					prng = prng.next()
					if ( prng.random() <= 0.5 ) {
						current = current.createTunnelH( prevX, x, y ) 
						current = current.createTunnelV( prevY, y, x )
					} else {
						current = current.createTunnelV( prevY, y, x )
						current = current.createTunnelH( prevX, x, y )
					}
				}
				rooms.push( newRoom )
			}
		}
		console.log( current )
		return current.set( 'prng', prng )
	}

	setTile( x: number, y: number, tile: Tile ) {
		if ( x >= 0 && x < this.width && y >= 0 && y < this.height ) {
			return this.set( 'tiles', this.tiles.set( this.getTileIndex( x, y ), tile ))
		} else {
			return this
		}
	}

	updateTile( x: number, y: number, fTile: (x: number, y: number, t: Tile) => Tile ) {
		if ( x >= 0 && x < this.width && y >= 0 && y < this.height ) {
			return this.set( 'tiles', this.tiles.set( this.getTileIndex( x, y ), fTile( x, y, this.getTile( x, y ))))
		} else {
			return this
		}
	}

	updateTiles( x: number, y: number, w: number, h: number, fTile: (x: number, y: number, t: Tile) => Tile ) {
		const x0 = Math.max( 0, x )
		const x1 = Math.min( this.width, x + w )
		const y0 = Math.max( 0, y )
		const y1 = Math.min( this.height, y + h )
		let tiles = this.tiles
		for ( let x = x0; x < x1; x++ ) {
			for ( let y = y0; y < y1; y++ ) {
				const index = this.getTileIndex( x, y )
				tiles = tiles.set( index, fTile( x, y, this.getTile( x, y )))
			}
		}
		return this.set( 'tiles', tiles ) 
	}

	getTileIndex( x: number, y: number ) {
		return x + y * this.width
	}

	getTileX( id: number ) {
		return id % this.width
	}

	getTileY( id: number ) {
		return ( id / this.width ) | 0
	}

	getTileXy( id: number ): [number,number] {
		return [this.getTileX( id ), this.getTileY( id )]
	}

	getTile( x: number, y: number ) {
		return this.tiles.get( this.getTileIndex( x, y ))
	}

	isInside( x: number, y: number ): boolean {
		return x >= 0 && y >= 0 && x < this.width && y < this.height
	}

	isBlocked( x: number, y: number ): boolean {
		return !this.isInside( x, y ) || this.getTile( x, y ).blocked
	}

	isOpaque( x: number, y: number ): boolean {
		return !this.isInside( x, y ) || this.getTile( x, y ).opaque
	}
}
