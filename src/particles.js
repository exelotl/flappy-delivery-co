import { Actor } from './engine'

const smokeColors = ['#6d758d', '#b3b9d1', '#8b93af', '#f9a31b', '#ffd541']

export class Smoke extends Actor {
	
	constructor(x,y) {
		super(x + Math.random()*4-2,y + Math.random()*4-2)
		this.div(3,3)
		this.el.style.backgroundColor = smokeColors[Math.random()*smokeColors.length | 0]
		this.t = Math.random() * 30 + 30
		this.vx = -1 - Math.random()
		this.vy = -0.5 - Math.random()*0.5
		this.angle = Math.random()*360
		this.rotSpeed = Math.random() * 50
	}
	
	update() {
		this.x += this.vx
		this.y += this.vy
		if (this.t-- <= 0) {
			this.scene.remove(this)
		}
		this.angle += this.rotSpeed
	}
	
	draw() {
		super.draw()
		this.el.style.transform += ` rotate(${this.angle}deg)`
	}
	
}


export class SweatDrop extends Actor {
	
	constructor(x,y) {
		super(x + Math.random()*4-2,y + Math.random()*4-2)
		this.div(2,2)
		this.el.style.backgroundColor = '#249fde'
		this.t = 5
		this.vx = Math.random()*4 - 2
		this.vy = -2
		this.angle = Math.random()*360
	}
	
	update() {
		this.x += this.vx
		this.y += this.vy
		if (this.t-- <= 0) {
			this.scene.remove(this)
		}
	}
	
	draw() {
		super.draw()
		this.el.style.transform += ` rotate(${this.angle}deg)`
	}
	
}