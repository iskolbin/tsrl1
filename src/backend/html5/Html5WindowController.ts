export class Html5WindowController {
	constructor() {
	}

	installKeyboard(mapping: {[key: string]: () => any} ) { 
		window.addEventListener( 'keydown', ({keyCode}) => {
			const ch = String.fromCharCode( keyCode ).toUpperCase()
			if ( mapping.hasOwnProperty( ch )) {
				mapping[ch]()
			}
		})
	}
}
