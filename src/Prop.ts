import { Color } from './Color'
import { Struct, init } from './Struct'

export class Prop extends Struct {
	id: number = -1
	x: number = 0
	y: number = 0
	ch: string = ' '
	color: Color = '#000000'
	visibleRange: number = 5
	blocked: boolean = true

	constructor( params?: Partial<Prop> ) {
		super()
		init<Prop>( this, params )
	}
}
