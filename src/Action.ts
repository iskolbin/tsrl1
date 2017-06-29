import * as Tile from './Tile'
import * as Prop from './Prop'

export interface Init {
	type: 'Init'
	width: number
	height: number
}

export interface SetTile {
	type: 'SetTile'
	x: number
	y: number
	params: Partial<Tile.Data>
}

export interface MoveProp {
	type: 'MoveProp'
	id: number
	dx: number
	dy: number
}

export interface AddProp {
	type: 'AddProp'
	params: Partial<Prop.Data>
}

export interface AddPlayer {
	type: 'AddPlayer'
	params: Partial<Prop.Data>
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
