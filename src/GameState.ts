import { Tile } from './Tile'
import { Prop } from './Prop'
import { List, Record } from 'immutable'
import { Prng } from 'tspersistentprng'

export type GameStateParams = {
	width?: number
	height?: number
	tiles?: List<Tile>
	props?: List<Prop>
	prng?: Prng
}

export const DefaultGameStateParams = {
	width: 0,
	height: 0,
	tiles: List<Tile>(),
	props: List<Prop>(),
	prng: new Prng()
}

export class GameState extends Record( DefaultGameStateParams ) {
	width: number
	height: number
	tiles: List<Tile>
	props: List<Prop>
	prng: Prng

	constructor( params?: GameStateParams ) {
		params ? super( params ) : super()
	}

	with( values: GameStateParams ) {
		return this.merge( values ) as this
	}

	random( min: number = 0, max: number = 1 ) {
		return this.prng.random( min, max )
	}

	nextRandom() {
		return this.update( 'prng', prng => prng.next())
	}

	setTile( x: number, y: number, tile: Tile ) {
		return this.isInside( x, y ) ? 
			this.update( 'tiles', tiles => 
				tiles.set( this.getTileIndex( x, y ), tile )) :
			this
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

	getNextPropId() {
		return this.props.size
	}
}
