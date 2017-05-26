import { Prop } from './Prop'
import { List, Record } from 'immutable'

export type GameStateParams = {
	props: List<Prop>
}

export const DefaultGameStateParams = {
	props: List<Prop>()
}

export class GameState extends Record( DefaultGameStateParams ) {
	constructor( params?: GameStateParams ) {
		params ? super( params ) : super()
	}

	with( values: GameStateParams ) {
		return this.merge( values ) as this
	}
}
