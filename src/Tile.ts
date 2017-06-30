import * as Struct from './Struct'

export interface Data {
	x: number
	y: number
	ch: string
	color: string
	blocked: boolean
	opaque: boolean
	explored: boolean
	visible: boolean
}

const DEFAULT: Data = {
	x: 0,
	y: 0,
	blocked: false,
	opaque: false,
	ch: ' ',
	color: '#000000',
	explored: false,
	visible: false
}

export function make( params?: Partial<Data> ): Data {
	return Struct.make( DEFAULT, params )
}

export function makeAt( x: number, y: number, params?: Partial<Data> ): Data {
	return Struct.make( make( params ), { x, y } )
}
