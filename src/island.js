import { Actor } from './engine'
import Pipe from './pipe'

class Npc extends Actor {
	constructor(x,y) {
		super(x,y)
		this.image('boss-man-overworld.png')
	}
}

// each island has an NPC and a landing spot.
// if the island is expecting a delivery, it will cause the bird to land upon 
export default class Island extends Actor {
	
	constructor (src) {
		super(0,0)
		this.image(src)
		this.y = 0
		if (src == 'island-left.png') {
			this.side = 'left'
			this.x = -300
			this.npc = new Npc(this.x+337, this.y+66)
			this.landX = this.x+364
			this.landY = this.y+70
			this.setHitbox(348, 86, 40, 94)
		} else {
			this.side = 'right'
			this.x = 940
			// this.x = 200
			this.npc = new Npc(this.x+67, this.y+84)
			this.landX = this.x+16
			this.landY = this.y+90
			this.setHitbox(12, 106, 6, 74)
		}
	}
	added() {
		this.scene.add(this.npc)
	}
	removed() {
		this.scene.remove(this.npc)
	}
	
	setNpc(prefix) {
		this.npc.el.src = `assets/${prefix}-overworld.png`
	}
	
	update() {
		this.emit('test-collision', this)  // the bird can crash into the island
		
		let bird = this.scene.bird
		if (bird && bird.canDeliver && bird.mode == 'flying') {
			if (this.side == 'right') {
				if (bird.facing == 'right' && bird.x >= this.landX) {
					this.emit('begin-landing', this)
				}
			} else {
				if (bird.facing == 'left' && bird.x <= this.landX) {
					this.emit('begin-landing', this)
				}
			}
		}
	}
	
}