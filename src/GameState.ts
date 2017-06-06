import { Prop } from './Prop'
import { Dungeon } from './Dungeon'
import { Struct, merge } from './Struct'
import { List } from 'immutable'
import { Prng } from 'tspersistentprng'
import { ShadowCasting2D } from 'tsshadowcasting2d'
import { Tile } from './Tile'

export class GameState extends Struct {
	props: List<Prop> = List<Prop>()
	prng: Prng = new Prng()
	dungeon: Dungeon = new Dungeon()
	lights: ShadowCasting2D<GameState> = new ShadowCasting2D<GameState>(
		( state ) => [0, 0, state.dungeon.width-1, state.dungeon.height-1],
		( state, x, y ) => state.dungeon.getTile( x, y ).blocked,
		( state, x ,y ) => {
			if ( state.dungeon.getTile( x, y ).explored ) {
				return state
			} else {
				return state.update( 'dungeon', dungeon => dungeon.updateTile( x, y, (_x,_y,t) => t.set( 'explored', true ) as Tile ))
			}
		}
	)

	constructor( params?: Partial<GameState> ) {
		super()
		merge( params )
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
}
