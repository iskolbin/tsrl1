import { Prop } from './Prop'
import { Dungeon } from './Dungeon'
import { Struct } from './Struct'
import { List } from 'immutable'
import { Prng } from 'tspersistentprng'
import { ShadowCasting2D } from 'tsshadowcasting2d'
import { Tile } from './Tile'

export type GameStateParams = {
	props?: List<Prop>
	prng?: Prng
	dungeon?: Dungeon
	lights?: ShadowCasting2D<GameState>
}
	/*
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
}*/

export class GameState extends Struct {
	props: List<Prop> = List<Prop>()
	prng: Prng = new Prng()
	dungeon: Dungeon = new Dungeon()
	lights: ShadowCasting2D<GameState>

	constructor( params?: GameStateParams ) {
		super()
		this.init( params )
	}

	random( min: number = 0, max: number = 1 ) {
		return this.prng.random( min, max )
	}

	nextRandom() {
		return this.update( 'prng', prng => prng.next())
	}

	getNextPropId() {
		return this.props.size
	}

	initLights() {
		return this.set( 'lights', new ShadowCasting2D<GameState>(
			( state ) => [0, 0, state.dungeon.width-1, state.dungeon.height-1],
			( state, x, y ) => state.dungeon.getTile( x, y ).blocked,
			( state, x ,y ) => {
				if ( state.dungeon.getTile( x, y ).explored ) {
					return state
				} else {
					return state.update( 'dungeon', dungeon => dungeon.updateTile( x, y, (_x,_y,t) => t.set( 'explored', true ) as Tile ))
				}
			}
		))
	}
}
