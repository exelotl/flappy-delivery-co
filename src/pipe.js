import { Actor } from './engine'

export default class Pipe extends Actor {
	
	constructor (x, y, flip=false) {
		super(x, y)
		this.image('pipe.png')
		this.setHitbox(0, 0, 23, 128)
		this.flip = flip
	}
	
	update() {
		// any object that wants to be deadly to the bird, should emit this event every frame.
		this.emit('test-collision', this)
	}
	
	draw() {
		super.draw()
		if (this.flip) {
			this.el.style.transform += ' scaleY(-1)'
		}
	}
}

// movable pair of pipes with configurable separation
// you can also make them wiggle :^)
export class PipePair extends Actor {
	constructor (x, y, sep) {
		super(x, y)
		this.separation = sep
		this.upper = new Pipe(x, y-64 - sep, true)
		this.lower = new Pipe(x, y+64 + sep)
		this.baseY = y
		this.offsetY = 0
		this.t = 0
		this.oscSpeed = 0
		this.oscAmp = 0
	}
	added() {
		this.scene.add(this.upper, this.lower)
	}
	removed() {
		this.scene.remove(this.upper, this.lower)
	}
	update() {
		this.t += this.oscSpeed
		this.y = Math.floor(this.baseY + Math.sin(this.t) * this.oscAmp + this.offsetY)
		this.upper.y = this.y-64 - this.separation
		this.lower.y = this.y+64 + this.separation
	}
	randomize() {
		this.offsetY = Math.random()*80 - 40
	}
	oscillate(rate, amp) {
		this.t = 0
		this.oscSpeed = rate
		this.oscAmp = amp
	}
}