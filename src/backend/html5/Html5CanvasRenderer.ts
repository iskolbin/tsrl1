import { mustBe } from '../../mustBe'
import { Color } from '../../Color'

export type Html5CanvasRendererParams = {
	fontSize: number
	fontFamily: string
}

export class Html5CanvasRenderer {
	protected _width: number
	protected _height: number
	protected _canvas: HTMLCanvasElement
	protected _context: CanvasRenderingContext2D
	protected _charWidth: number
	protected _params: Html5CanvasRendererParams

	constructor( rootId: string, width: number, height: number, params: { fontSize: number, fontFamily: string } ) {
		const rootElement = mustBe<HTMLElement>( document.getElementById( rootId ))
		const canvas = mustBe<HTMLCanvasElement>( document.createElement( "canvas" ))
		rootElement.appendChild( canvas )
		const context: CanvasRenderingContext2D = mustBe<CanvasRenderingContext2D>(canvas.getContext('2d'))
		this._charWidth = Math.round( params.fontSize * 2/3 )
		canvas.width = this._charWidth * width
		canvas.height = params.fontSize * height
		context.font = `${params.fontSize}pt ${params.fontFamily}`
		this._canvas = canvas 
		this._context = context
		this._width = width
		this._height = height
		this._params = params
	}

	draw( ch: string, x0: number, y0: number, w = 1, h = 1, color?: Color ): void {
		if ( color ) {
			this._context.fillStyle = color
		}
		for ( let x = 0; x < w; x++ ) {
			for ( let y = 0; y < h; y++ ) {
				this._context.fillText( ch, (x+x0) * this._charWidth, (y+y0+1) * this._params.fontSize ) 
			}
		}
	}

	clear(): void {
		this._context.clearRect( 0, 0, this._canvas.width, this._canvas.height )
	}
}
