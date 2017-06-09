import { Prop } from './Prop'
import { Dungeon } from './Dungeon'
import { Struct, init } from './Struct'
import { List } from 'immutable'
import { Prng } from 'tspersistentprng'
import { ShadowCasting2D } from 'tsshadowcasting2d'
import { Tile } from './Tile'

export class GameState extends Struct {
	props: List<Prop> = List<Prop>()
	prng: Prng = new Prng()
	dungeon: Dungeon = new Dungeon()
	visible: List<[number,number]> = List<[number,number]>()
	lights: ShadowCasting2D<GameState> = new ShadowCasting2D<GameState>(
		( state ) => [0, 0, state.dungeon.width-1, state.dungeon.height-1],
		( state, x, y ) => state.dungeon.getTile( x, y ).blocked,
		{
			onStart: ( state, _x ,_y ) => {
				let newState = state
				state.visible.forEach( (xy) => {
					if ( xy ) {
						newState = newState.updateTile( xy[0], xy[1], (_x,_y,t) => t.set( 'visible', false ))
					}	
				})
				newState = newState.update( 'visible', visible => visible.clear())
				return newState
			},
			onVisible: ( state, x, y ) => {
				const newState = state.update( 'visible', visible => visible.push([x,y])).updateTile( x, y, (_x,_y,t) => t.set('visible',true))
				if ( newState.dungeon.getTile( x, y ).explored ) {
					return newState
				} else {
					return newState.updateTile( x, y, (_x,_y,t) => t.set('explored', true))
				}
			},
		},
	)

	constructor( params?: Partial<GameState> ) {
		super()
		init<GameState>( this, params )
	}

	updateTile( x: number, y: number, updater: (x: number, y: number, t: Tile) => Tile ) {
		return this.update( 'dungeon', dungeon => dungeon.updateTile( x, y, updater ))
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
