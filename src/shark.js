import { Actor } from './engine'
import * as items from './items'

export default class Shark extends Actor {
	
	constructor(x, y) {
		super(x, y)
		this.sprite('shark.png',19,37)
		
		this.sensor = {
			x: x,
			y: y-300,
			hitbox: { x: 0, y: 0, w: 20, h:300 }
		}
		
		this.vy = 0
		this.startY = y
	}
	
	update() {
		let {bird, item} = this.scene
		
		if (bird && bird.collide(this.sensor)) {
			if (item instanceof items.Kitten || item instanceof items.BoxOfFish) {
				this.vy = -3.8
			}
		}
		
		if (this.vy < 0 || this.y < this.startY) {
			this.vy += 0.3
			this.y += this.vy
			this.frame = this.vy < 0 ? 0 : 1
		}
		
		this.emit('test-collision', this)
	}
	
}