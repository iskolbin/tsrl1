import { Tile } from './Tile'
import { Prop } from './Prop'

export interface Init {
	type: 'Init'
	width: number
	height: number
}

export interface SetTile {
	type: 'SetTile'
	x: number
	y: number
	params: Partial<Tile>
}

export interface MoveProp {
	type: 'MoveProp'
	id: number
	dx: number
	dy: number
}

export interface AddProp {
	type: 'AddProp'
	params: Partial<Prop>
}

export interface AddPlayer {
	type: 'AddPlayer'
	params: Partial<Prop>
}

export interface NextRandom {
	type: 'NextRandom'
}

export type Action
	= Init
	| MoveProp
	| AddProp
	| AddPlayer
	| SetTile
	| NextRandom
