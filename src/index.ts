import { Action } from './Action'
import { Tile } from './Tile'
import { Prop } from './Prop'
import { GameState } from './GameState'
import { Prng } from 'tspersistentprng'
import { createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { List } from 'immutable'

import { Html5CanvasRenderer } from './backend/html5/Html5CanvasRenderer'
import { Html5WindowController } from './backend/html5/Html5WindowController'

const SCREEN_WIDTH = 40
const SCREEN_HEIGHT = 30

const controller = new Html5WindowController()
const renderer = new Html5CanvasRenderer( 'root', SCREEN_WIDTH, SCREEN_HEIGHT, { fontFamily: 'monospace', fontSize: 24 } )

function gameReducer( state = new GameState(), action: Action ) {
	switch ( action.type ) {
		case 'Init': {
			const { width, height } = action
			return state.update( 'dungeon', dungeon => dungeon.with( {
				width,
				height,
				prng: new Prng( 123 ),
				createBlockedTile: () => new Tile({ch: '#', color: '#101010', blocked: true, opaque: true }),
				createFreeTile: () => new Tile({ch: '.', color: '#a0a0a0', blocked: false, opaque: false })
			}).clear().generate( 5, 3, 20 ))
		}

		case 'SetTile': {
			//const { x, y, w, h, ch, color, blocked, opaque } = action
			//return state.setTile( x, y, w, h, () => new Tile( { ch, color, blocked, opaque } ))
			return state
		}

		case 'AddProp': {
			const { x, y, ch, color } = action
			return state.update( 'props', (props: List<Prop>) => props.push( new Prop( {x: x, y: y, ch: ch, color: color})))
		}

		case 'MoveProp': {
			const { id, dx, dy } = action
			const prop = state.props.get( id )
			if ( prop !== undefined ) {
				const { x, y } = prop
				if ( !state.dungeon.isBlocked( x + dx, y + dy )) {
					return state.update( 'props',
						props => props.update( id, (prop: Prop) => prop
							.update( 'x', (x: number) => x + dx )
							.update( 'y', (y: number) => y + dy )))
				} else {
					return state
				}
			} else {
				return state
			}
		}

		case 'NextRandom': {
			return state.nextRandom()
		}

		default: {
			return state
		}
	}
}

const store = createStore( gameReducer, undefined, composeWithDevTools())

function render() {
	const state = store.getState()
	renderer.clear()
	let i = 0
	state.dungeon.tiles.forEach( ({ch, color}: Tile ) => {
		const [x,y] = state.dungeon.getTileXy( i++ )
		renderer.draw( ch, x, y, 1, 1, color )
	})
	state.props.forEach( ({x, y, ch, color}: Prop ) => {
		renderer.draw( ch, x, y, 1, 1, color )
	})
}

store.subscribe( render )

store.dispatch( { type: 'Init', width: SCREEN_WIDTH, height: SCREEN_HEIGHT } )
const playerId = store.getState().getNextPropId()
store.dispatch( { type: 'AddProp', x: 9, y: 9, ch: '@', color: '#ff0000' } )

const mapping: {[key:string]: () => any} = {
	W: () => store.dispatch( { type: 'MoveProp', id: playerId, dx: 0, dy: -1 } ),
	A: () => store.dispatch( { type: 'MoveProp', id: playerId, dx: -1, dy: 0 } ),
	S: () => store.dispatch( { type: 'MoveProp', id: playerId, dx: 0, dy: 1 } ),
	D: () => store.dispatch( { type: 'MoveProp', id: playerId, dx: 1, dy: 0 } ),
	X: () => {
		store.dispatch( { type: 'NextRandom' } )
		const dx = store.getState().random() <= 0.5 ? -1 : 1
		store.dispatch( { type: 'NextRandom' } )
		const dy = store.getState().random() <= 0.5 ? -1 : 1
		store.dispatch( { type: 'MoveProp', id: playerId, dx: dx, dy: dy })
	}
}

controller.installKeyboard( mapping )

render()
