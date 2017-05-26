import { Action } from './Action'
import { Prop } from './Prop'
import { GameState } from './GameState'
import { createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

import { Html5CanvasRenderer } from './backend/html5/Html5CanvasRenderer'
import { Html5WindowController } from './backend/html5/Html5WindowController'

const SCREEN_WIDTH = 80
const SCREEN_HEIGHT = 50

const controller = new Html5WindowController()
const renderer = new Html5CanvasRenderer( "root", SCREEN_WIDTH, SCREEN_HEIGHT, { fontFamily: "monospace", fontSize: 24 } )

function gameReducer( state = new GameState(), action: Action ) {
	switch ( action.type ) {
		case "AddProp":
			const { x, y, ch, color } = action
			return state.update( 'props', props => props.push( new Prop( {x: x, y: y, ch: ch, color: color})))
		case "Move":
			const { dx, dy } = action
			return state.update( 'props',
				props => props.update( 0, (player: Prop) => player
					.update( 'x', (x: number) => x + dx )
					.update( 'y', (y: number) => y + dy )))
		default:
			return state
	}
}

const store = createStore( gameReducer, undefined, composeWithDevTools())

function render() {
	renderer.clear()
	store.getState().props.forEach( ({x, y, ch, color}: Prop ) => {
		renderer.draw( ch, x, y, 1, 1, color )
	})
}

store.subscribe( render )

store.dispatch( { type: "AddProp", x: 0, y: 0, ch: "@", color: "#ff0000" } )

const mapping: {[key:string]: () => any} = {
	W: () => store.dispatch( { type: "Move", dx: 0, dy: -1 } ),
	A: () => store.dispatch( { type: "Move", dx: -1, dy: 0 } ),
	S: () => store.dispatch( { type: "Move", dx: 0, dy: 1 } ),
	D: () => store.dispatch( { type: "Move", dx: 1, dy: 0 } ),
}

controller.installKeyboard( mapping )

render()
