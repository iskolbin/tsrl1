import { Color } from './Color'

export interface Init {
	type: 'Init'
	width: number
	height: number
}

export interface SetTile {
	type: 'SetTile'
	x: number
	y: number
	ch: string
	color: Color
	blocked: boolean
	opaque: boolean
}

export interface MoveProp {
	type: 'MoveProp'
	id: number
	dx: number
	dy: number
}

export interface AddProp {
	type: 'AddProp'
	x: number
	y: number
	ch: string
	color: Color
}

export type Action
	= Init
	| MoveProp
	| AddProp
	| SetTile
