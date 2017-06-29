import * as Struct from './Struct'

export interface Data {
	x: number
	y: number
	w: number
	h: number
}

const DEFAULT = {
	x: 0,
	y: 0,
	w: 0,
	h: 0
}

export function make( params?: Partial<Data> ) {
	return Struct.make( DEFAULT, params )
}

export function getX0( {x}: Data ) { 
	return x
}

export function getX1( {x,w}: Data ) {
	return x + w
}

export function getY0( {y}: Data ) {
	return y
}

export function getY1( {y,h}: Data ) {
	return y + h
}

export function centerX( {x,w}: Data ) {
	return Math.floor(( x + x + w ) / 2)
}

export function centerY( {y,h}: Data ) {
	return Math.floor(( y + y + h ) / 2)
}

export function center( rect: Data ): [number,number] {
	return [centerX( rect ), centerY( rect )]
}
	
export function intersect( {x,y,w,h}: Data, {x:x_,y:y_,w:w_,h:h_}: Data ) {
	return x <= x_ + w_ && x_ <= x + w && y <= y_ + h_ && y_ <= y + h
}
