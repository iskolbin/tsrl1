import * as Prop from './Prop'
import * as Dungeon from './Dungeon'
import * as Vector from 'tspersistentvector'
import * as Prng from 'tspersistentprng'
import * as ShadowCasting2D from 'tsshadowcasting2d'
import * as Tile from './Tile'
import * as Struct from './Struct'

export interface Data {
	playerId: number
	prng: Prng.Data
	dungeon: Dungeon.Data
	visible: Vector.Data<[number,number]>
}

const DEFAULT: Data = {
	playerId: -1,
	prng: Prng.make(),
	dungeon: Dungeon.make(),
	visible: Vector.NIL
}

export function make( params?: Partial<Data> ) {
	return Struct.make( DEFAULT, params )
}

function makeShadowCastingParams(): ShadowCasting2D.Params<Data> {
	return {
		getBounds: ( state ) => [0, 0, state.dungeon.width-1, state.dungeon.height-1],

		isBlocked: ( state, x, y ) => (Dungeon.getTile( state.dungeon, x, y ) as Tile.Data).blocked,

		onStart: ( state, _x ,_y ) => {
			Vector.forEach( state.visible, (xy) => {
				state = updateTile( state, xy[0], xy[1], tile => Struct.set( tile, 'visible', false ))
			})
			state = Struct.set( state, 'visible', Vector.NIL )
			return state
		},

		onVisible: ( state, x, y ) => {
			state = Struct.update( state, 'visible', visible => Vector.push<[number,number]>( visible, [x,y] ))
			state = updateTile( state, x, y, tile => Struct.set( tile, 'visible', true ))
			if ( Dungeon.isExplored( state.dungeon, x, y )) {
				return state
			} else {
				return updateTile( state, x, y, tile => Struct.set( tile, 'explored', true ))
			}
		}
	}
}

export function updateTile( state: Data, x: number, y: number, updater: (t: Tile.Data) => Tile.Data ) {
	return Struct.update( state, 'dungeon', dungeon => Dungeon.updateTile( dungeon, x, y, updater ))
}

export function random( state: Data, min: number = 0, max: number = 1 ) {
	return Prng.random( state.prng, min, max )
}

export function nextRandom( state: Data ) {
	return Struct.update( state, 'prng', prng => Prng.next( prng ))
}

export function addProp( state: Data, prop: Prop.Data ) {
	return Struct.update2( state, 'dungeon', 'props', props => Vector.push( props, prop ))
}

function updatePlayerVisibility( state: Data ) {
	const player = getProp( state, state.playerId )
	if ( player ) {
		const {x,y,visibleRange} = player
		return ShadowCasting2D.evaluate( state, x, y, visibleRange, makeShadowCastingParams())
	} else {
		return state
	}
}

export function addPlayer( state: Data, prop: Prop.Data ) {
	state = Struct.set( state, 'playerId', getNextPropId( state ))
	state = Struct.update2( state, 'dungeon', 'props', props => Vector.push( props, prop ))
	return updatePlayerVisibility( state )
}

export function getProp( state: Data, id: number ) {
	return Vector.get( state.dungeon.props, id )
}

export function hasProp( state: Data, id: number ) {
	return id >= 0 && state.dungeon.props.size < id
}

export function updateProp( state: Data, id: number, updater: (prop: Prop.Data) => Prop.Data ) {
	return Struct.update2( state, 'dungeon', 'props', props => Vector.update( props, id, updater ))
}

export function moveProp( state: Data, id: number, dx: number, dy: number ) {
	const prop = getProp( state, id )
	if ( prop !== undefined ) {
		const { x, y } = prop
		if ( !Dungeon.isBlocked( state.dungeon, x + dx, y + dy )) {
			state = updateProp( state, id, prop => Prop.setCoord( prop, prop.x + dx, prop.y + dy )) 
			if ( id === state.playerId ) {
				return updatePlayerVisibility( state )
			} else {
				return state
			}
		} else {
			const collidingProp = Dungeon.getPropAt( state.dungeon, x + dx, y + dy )
			if ( collidingProp ) {
				return Struct.update2( state, 'dungeon', 'props', props => Vector.set( props, collidingProp.id, {...collidingProp,ch:'*',color:'#ff0000',blocked:false}))
			}
		}
	}
	return state
}

export function getNextPropId( state: Data ) {
	return state.dungeon.props.size
}
