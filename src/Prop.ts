import { Color } from './Color'
import { Struct, init } from './Struct'

export class Prop extends Struct {
	x: number = 0
	y: number = 0
	ch: string = ' '
	color: Color = '#000000'

	constructor( params?: Partial<Prop> ) {
		super()
		init<Prop>( this, params )
	}
}
