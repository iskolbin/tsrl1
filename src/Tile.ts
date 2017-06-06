import { Struct, merge } from './Struct'
import { Color } from './Color'

export class Tile extends Struct {
	blocked: boolean = false
	opaque: boolean = false
	ch: string = ' '
	color: Color = '#000000'
	explored: boolean = false
	visible: boolean = false

	constructor( params?: Partial<Tile> ) {
		super()
		merge<Tile>( this, params )
	}
}
