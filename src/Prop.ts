import * as Struct from './Struct'

export interface Data {
	id: number
	x: number
	y: number
	ch: string
	color: string
	visibleRange: number
	blocked: boolean
}

const DEFAULT: Data = {
	id: -1,
	x: 0,
	y: 0,
	ch: '',
	color: '#000000',
	visibleRange: 5,
	blocked: true
}

export function make( params?: Partial<Data> ): Data {
	return Struct.make( DEFAULT, params )
}
