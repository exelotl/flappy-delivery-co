import {Actor} from './engine'

// a repeating background with parallax (finite size)
export class Background extends Actor {
	constructor(x,y,w,h, src, zIndex, parallax) {
		super()
		this.div(w,h)
		this.baseX = x
		this.baseY = y
		this.el.style.backgroundImage = `url("assets/${src}")`
		this.el.style.backgroundPosition = '0, 0'
		this.el.style.zIndex = `${zIndex}`
		this.parallax = parallax
	}
	update() {
		super.update()
		this.x = this.baseX + this.scene.camX * this.parallax
		this.y = this.baseY + this.scene.camY
	}
}

export class MainBackground extends Background {
	constructor() {
		super(-800, 0, 2000, 180, 'background.png', 0, 0.75)
	}
}
export class WaterForeground extends Background {
	constructor() {
		super(-800, 160, 2200, 45, 'water.png', 2, -0.1)
	}
}