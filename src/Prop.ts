import { Color } from './Color'
import { Struct } from './Struct'
	
export type PropParams = {
	x?: number
	y?: number
	ch?: string
	color?: Color
}

export class Prop extends Struct {
	x: number = 0
	y: number = 0
	ch: string = ' '
	color: Color = '#000000'

	constructor( params?: PropParams ) {
		super()
		this.init( params )
	}
}
