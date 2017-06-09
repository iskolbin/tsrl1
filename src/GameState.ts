import { Prop } from './Prop'
import { Dungeon } from './Dungeon'
import { Struct, init } from './Struct'
import { List } from 'immutable'
import { Prng } from 'tspersistentprng'
import { ShadowCasting2D } from 'tsshadowcasting2d'
import { Tile } from './Tile'

export class GameState extends Struct {
	playerId: number = -1
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

	addProp( prop: Prop ) {
		return this.update2( 'dungeon', 'props', props => props.push( prop ))
	}

	addPlayer( prop: Prop ) {
		const newState = this
			.update2( 'dungeon', 'props', props => props.push( prop ))
			.set( 'playerId', this.getNextPropId() )
		return newState.lights.illuminate( newState, prop.x, prop.y, prop.visibleRange )
	}

	getProp( id: number ) {
		return this.dungeon.props.get( id )
	}

	updateProp( id: number, updater: (prop: Prop) => Prop ) {
		return this.update2( 'dungeon', 'props', props => props.set( id, updater( this.getProp( id ))))
	}

	moveProp( id: number, dx: number, dy: number ) {
		const prop = this.getProp( id )
		if ( prop !== undefined ) {
			const { x, y } = prop
			if ( !this.dungeon.isBlocked( x + dx, y + dy )) {
				let newState = this.updateProp( id, (prop: Prop) => prop	
					.update( 'x', (x: number) => x + dx )
					.update( 'y', (y: number) => y + dy ))
				if ( id === this.playerId ) {
					return newState.lights.illuminate( newState, x + dx, y + dy, prop.visibleRange )
				} else {
					return newState
				}
			} else {
				const collidingProp = this.dungeon.getProp( x + dx, y + dy )
				if ( collidingProp ) {
					return this.update2( 'dungeon', 'props', props => props.set( collidingProp.id, new Prop( {...collidingProp,ch:'*',color:'#ff0000',blocked:false})))
				}
			}
		}
		return this
	}

	getNextPropId() {
		return this.dungeon.props.size
	}
}
