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
		barFront.el.style.background = '#333'
		this.add(barFront)
		
		let playText = new Actor(120, 100)
		playText.div(80, 20)
		playText.el.style.color = '#fff'
		playText.el.style.textAlign = 'center'
		playText.el.innerText = 'space to start'
		
		preload((type, item, loadedAssets, totalAssets) => {
			console.log(`[${loadedAssets}/${totalAssets}]`, item)
			let w = Math.floor(barWidth * loadedAssets/totalAssets)
			barFront.el.style.width = `${barWidth-w}px`
			barFront.x = barX + w
			
			if (loadedAssets === totalAssets) {
				// done
				this.add(playText)
				
				this.userInputAllowed = true
				
				// when received input, start the game
				this.on('flap', () => {
					callback()
				})
			}
		})
	}
	
}
