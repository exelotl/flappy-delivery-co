import { Actor, Scene } from './engine'
import { preload } from './assets'

export default class Preloader extends Scene {
	
	constructor(root, callback) {
		super(root)
		
		this.userInputAllowed = false
		
		const barX = 60
		const barY = 84
		const barWidth = 200
		const barHeight = 3
		
		let barBack = new Actor(barX-1, barY-1)
		barBack.div(barWidth+2, barHeight+2)
		barBack.el.style.background = '#fff'
		this.add(barBack)
		
		let barFront = new Actor(barX, barY)
		barFront.div(barWidth, barHeight)
		barFront.el.style.background = '#111'
		this.add(barFront)
		
		let playText = new Actor(110, 100)
		playText.div(100, 20)
		playText.el.style.color = '#fff'
		playText.el.style.textAlign = 'center'
		playText.el.innerText = 'SPACE or TAP to start'
		
		preload((type, item, loadedAssets, totalAssets) => {
			console.log(`[${loadedAssets}/${totalAssets}]`, item)
			
			let width = Math.floor(barWidth * loadedAssets/totalAssets)
			barFront.el.style.width = `${barWidth-width}px`
			barFront.x = barX + width
			
			if (loadedAssets === totalAssets) {
				this.add(playText)
				this.userInputAllowed = true
				this.on('flap', () => callback()) // when received input, start the game
			}
		})
	}
	
}
