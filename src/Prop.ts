import * as Struct from './Struct'

export interface Prop {
	x: number
	y: number
	ch: string
	color: string
}

const DEFAULT: Prop = {
	x: 0,
	y: 0,
	ch: '',
	color: '#000000'
}

export function make( params?: Partial<Prop> ): Prop {
	return Struct.make( DEFAULT, params )
}
