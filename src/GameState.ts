import { Prop } from './Prop'
import { Dungeon } from './Dungeon'
import { Tile } from './Tile'
import { List, Record } from 'immutable'
import { Prng } from 'tspersistentprng'
import { ShadowCasting2D } from 'tsshadowcasting2d'

export type GameStateParams = {
	width?: number
	height?: number
	props?: List<Prop>
	prng?: Prng
	dungeon?: Dungeon
	lights?: ShadowCasting2D<GameState>
}

export const DefaultGameStateParams = {
	width: 0,
	height: 0,
	props: List<Prop>(),
	prng: new Prng(),
	dungeon: new Dungeon(),
	lights: new ShadowCasting2D<any>(
		( state: any ) => [0,0,state.width,state.height],
		( state: any, x: number, y: number ): boolean => state.dungeon.getTile( x, y ).blocked,
		( state: any, x: number, y: number, power: number ) => {
			if ( power > 0 && !state.dungeon.getTile( x, y ).explored ) {
				return state.update( 'dungeon', state.dungeon.update( 'tiles',
					(tiles: List<Tile>) => tiles.update( state.dungeon.getTileIndex( x, y ), (tile: Tile) => tile.set( 'explored', true))))
			} else {
				return state
			}
		}
	)
}

export class GameState extends Record( DefaultGameStateParams ) {
	width: number
	height: number
	props: List<Prop>
	prng: Prng
	dungeon: Dungeon
	lights: ShadowCasting2D<any>

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
		return this.update( 'prng', prng => prng.next()) as GameState
	}

	getNextPropId() {
		return this.props.size
	}
}
