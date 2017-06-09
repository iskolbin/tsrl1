import { Action } from './Action'
import { Tile } from './Tile'
import { Prop } from './Prop'
import { GameState } from './GameState'
import { Prng } from 'tspersistentprng'
import { createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { Dungeon } from './Dungeon'
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
			return state.set( 'dungeon', new Dungeon( { width, height,
				prng: new Prng( 123 ),
				createBlockedTile: () => new Tile({ch: '#', color: '#101010', blocked: true, opaque: true }),
				createFreeTile: () => new Tile({ch: '.', color: '#a0a0a0', blocked: false, opaque: false })
			}).clear().generate( 5, 3, 20 ))
		}

		case 'SetTile': {
			const { x, y, params } = action
			return state.update( 'dungeon', dungeon => dungeon.setTile( x, y, new Tile( params )))
		}

		case 'AddProp': {
			return state.addProp( new Prop( action.params ))
		}

		case 'AddPlayer': {
			const params = {...action.params, ch: '@'}	
			return state.addPlayer( new Prop( params ))
		}

		case 'MoveProp': {
			const { id, dx, dy } = action
			return state.moveProp( id, dx, dy )
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
	const state: GameState = store.getState()
	renderer.clear()
	let i = 0
	state.dungeon.tiles.forEach( ({ch, color, explored,visible}: Tile ) => {
		const [x,y] = state.dungeon.getTileXy( i++ )
		if ( visible ) {
			renderer.draw( ch, x, y, 1, 1, color )
		} else {
			renderer.draw( explored ? ch : '?', x, y, 1, 1, '#000' )
		}
	})
	state.dungeon.props.forEach( ({x, y, ch, color}: Prop ) => {
		const {visible} = state.dungeon.getTile( x, y )
		if ( visible ) {
			renderer.draw( ch, x, y, 1, 1, color )
		}	
	})
}

store.subscribe( render )

store.dispatch( { type: 'Init', width: SCREEN_WIDTH, height: SCREEN_HEIGHT } )
store.dispatch( { type: 'AddPlayer', params: {x: 9, y: 9, color: '#ff0000' }} )

const mapping: {[key:string]: () => any} = {
	W: () => store.dispatch( { type: 'MoveProp', id: store.getState().playerId, dx: 0, dy: -1 } ),
	A: () => store.dispatch( { type: 'MoveProp', id: store.getState().playerId, dx: -1, dy: 0 } ),
	S: () => store.dispatch( { type: 'MoveProp', id: store.getState().playerId, dx: 0, dy: 1 } ),
	D: () => store.dispatch( { type: 'MoveProp', id: store.getState().playerId, dx: 1, dy: 0 } ),
}

controller.installKeyboard( mapping )

render()
