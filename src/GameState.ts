import { Tile } from './Tile'
import { Prop } from './Prop'
import { Dungeon } from './Dungeon'
import { List, Record } from 'immutable'
import { Prng } from 'tspersistentprng'

export type GameStateParams = {
	width?: number
	height?: number
	tiles?: List<Tile>
	props?: List<Prop>
	prng?: Prng
	dungeon?: Dungeon
}

export const DefaultGameStateParams = {
	width: 0,
	height: 0,
	tiles: List<Tile>(),
	props: List<Prop>(),
	prng: new Prng(),
	dungeon: new Dungeon()
}

export class GameState extends Record( DefaultGameStateParams ) {
	width: number
	height: number
	tiles: List<Tile>
	props: List<Prop>
	prng: Prng
	dungeon: Dungeon

	constructor( params?: GameStateParams ) {
		params ? super( params ) : super()
	}

	with( values: GameStateParams ) {
		return this.merge( values ) as this
	}

	random( min: number = 0, max: number = 1 ) {
		return this.prng.random( min, max )
	}

	nextRandom() {
		return this.update( 'prng', prng => prng.next()) as GameState
	}

	getNextPropId() {
		return this.props.size
	}
}
