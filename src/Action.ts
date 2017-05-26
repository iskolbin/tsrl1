import { Color } from './Color'

export interface Move {
	type: "Move"
	dx: number
	dy: number
}

export interface AddProp {
	type: "AddProp"
	x: number
	y: number
	ch: string
	color: Color
}

export type Action
	= Move
	| AddProp
