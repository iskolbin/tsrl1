import * as Struct from './Struct'

export interface Data {
	blocked: boolean
	opaque: boolean
	ch: string
	color: string
	explored: boolean
	visible: boolean
}

const DEFAULT: Data = {
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
