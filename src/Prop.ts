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

export function setCoord( prop: Data, x: number, y: number ): Data {
	return {...prop, x, y}
}

export function updateCoord( prop: Data, updateX: (x: number) => number, updateY: (y: number) => number ): Data {
	return {...prop, x: updateX( prop.x ), y: updateY( prop.y )}
}
