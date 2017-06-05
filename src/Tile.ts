import { Record } from 'immutable'
import { Color } from './Color'

export type TileParams = {
	blocked?: boolean	
	opaque?: boolean
	ch?: string,
	color?: Color,
	explored?: boolean,
	visible?: boolean
}

export const DefaultTileParams = {
	blocked: false,
	opaque: false,
	ch: ' ',
	color: '#000000',
	explored: false,
	visible: false
}

export class Tile extends Record( DefaultTileParams ) {
	blocked: boolean	
	opaque: boolean
	ch: string
	color: Color
	explored: boolean
	visible: boolean

	constructor( params?: TileParams ) {
		params ? super( params ) : super()
	}

	with( values: TileParams ) {
		return this.merge( values ) as this
	}
}
