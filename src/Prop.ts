import { Color } from './Color'
import { Record } from 'immutable'

export type PropParams = {
	x?: number
	y?: number
	ch?: string
	color?: Color
}

export const DefaultPropParams = {
	x: 0,
	y: 0,
	ch: ' ',
	color: '#000000'
} 

export class Prop extends Record( DefaultPropParams ) {
	x: number
	y: number
	ch: string
	color: Color

	constructor( params?: PropParams ) {
		params ? super( params ) : super()
	}

	with( values: PropParams ) {
		return this.merge( values ) as this
	}
}
