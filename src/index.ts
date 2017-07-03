import * as Prng from 'tspersistentprng'
import * as Vector from 'tspersistentvector'
import { createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

import { Action } from './Action'
import * as Struct from './Struct'
import * as Tile from './Tile'
import * as Prop from './Prop'
import * as GameState from './GameState'
import * as Dungeon from './Dungeon'
import { Tiles } from './data/Tiles'

import { Html5CanvasRenderer } from './backend/html5/Html5CanvasRenderer'
import { Html5WindowController } from './backend/html5/Html5WindowController'

const SCREEN_WIDTH = 40
const SCREEN_HEIGHT = 30

const controller = new Html5WindowController()
const renderer = new Html5CanvasRenderer( 'root', SCREEN_WIDTH, SCREEN_HEIGHT, { fontFamily: 'monospace', fontSize: 24 } )

function gameReducer( state = GameState.make(), action: Action ) {
	switch ( action.type ) {
		case 'Init': {
			const { width, height } = action
			const brush = {
				createBlockedTile: (x: number, y: number) => Tile.makeAt( x, y, Tiles.DungeonWall ),
				createFreeTile: (x: number, y: number) => Tile.makeAt( x, y, Tiles.DungeonFloor ),
			}
			let dungeon = Dungeon.make( {width,height, prng: Prng.make( 123 )} )
			dungeon = Dungeon.clear( dungeon, brush )
			dungeon = Dungeon.generate( dungeon, 4, 6, 3, brush )
			return Struct.set( state, 'dungeon', dungeon )
		}

		case 'SetTile': {
			const { x, y, params } = action
			return Struct.update( state, 'dungeon', dungeon => Dungeon.setTile( dungeon, x, y, Tile.make( params )))
		}

		case 'AddProp': {
			return GameState.addProp( state, Prop.make( action.params ))
		}

		case 'AddPlayer': {
			const params = {...action.params, ch: '@'}
			return GameState.addPlayer( state, Prop.make( params ))
		}

		case 'MoveProp': {
			const { id, dx, dy } = action
			return GameState.moveProp( state, id, dx, dy )
		}

		case 'NextRandom': {
			return GameState.nextRandom( state )
		}

		default: {
			return state
		}
	}
}

const store = createStore( gameReducer, undefined, composeWithDevTools())

function getCurrentState(): GameState.Data {
	return store.getState() as GameState.Data
}

function render() {
	const state = getCurrentState()
	renderer.clear()
	let i = 0
	Vector.forEach( state.dungeon.tiles, ({ch, color, explored,visible}) => {
		const [x,y] = Dungeon.getTileXy( state.dungeon, i++ )
		if ( visible ) {
			renderer.draw( ch, x, y, 1, 1, color )
		} else {
			renderer.draw( explored ? ch : '?', x, y, 1, 1, '#000' )
		}
	})
	Vector.forEach( state.dungeon.props, ({x, y, ch, color}) => {
		if ( Dungeon.isVisible( state.dungeon, x, y )) {
			renderer.draw( ch, x, y, 1, 1, color )
		}	
	})
}

store.subscribe( render )

store.dispatch( { type: 'Init', width: SCREEN_WIDTH, height: SCREEN_HEIGHT } )
store.dispatch( { type: 'AddPlayer', params: {x: 3, y: 6, color: '#ff0000' }} )

const mapping: {[key:string]: () => any} = {
	W: () => store.dispatch( { type: 'MoveProp', id: getCurrentState().playerId, dx: 0, dy: -1 } ),
	A: () => store.dispatch( { type: 'MoveProp', id: getCurrentState().playerId, dx: -1, dy: 0 } ),
	S: () => store.dispatch( { type: 'MoveProp', id: getCurrentState().playerId, dx: 0, dy: 1 } ),
	D: () => store.dispatch( { type: 'MoveProp', id: getCurrentState().playerId, dx: 1, dy: 0 } ),
}

controller.installKeyboard( mapping )

render()
