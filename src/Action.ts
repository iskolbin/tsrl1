export interface Init {
	kind: 'Init'
	width: number
	height: number
}

export interface SetTile {
	kind: 'SetTile'
	x: number
	y: number
	w: number
	h: number
	ch: string
	color: string
	blocked: boolean
	opaque: boolean
}

export interface MoveProp {
	kind: 'MoveProp'
	id: number
	dx: number
	dy: number
}

export interface AddProp {
	kind: 'AddProp'
	x: number
	y: number
	ch: string
	color: string
}

export interface NextRandom {
	kind: 'NextRandom'
}

export type Action
	= Init
	| MoveProp
	| AddProp
	| SetTile
	| NextRandom
