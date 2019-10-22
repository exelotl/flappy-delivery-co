import { Actor } from './engine'
import { Smoke, SweatDrop } from './particles'
import { EnemyBird } from './bird'
import { boomboxMusic } from './assets'

class Item extends Actor {
	constructor() {
		super(0,0)
		this.weight = 0   // how much to add to the bird's gravity
		this.offsetX = 0  // to line up the centre of the item with the bird's feet
		this.offsetY = 0  // how much to displace the bird
		this.snap = true
		this.vx = 0
		this.vy = 0
		this.angle = 0
		this.flip = false
		
		this.on('reset', () => {
			this.snap = true
			this.angle = 0
		})
		
		this.on('bird-crash', () => {
			this.snap = false
			this.vx = Math.random()*4 - 2
			this.vy = -1
		})
		
		this.on('begin-flight', () => {
			this.takeoff()
		})
		
		this.on('begin-landing', (island) => {
			this.snap = false
			this.vy = -2
			if (island.side == 'left') {
				this.vx = -3
			} else {
				this.vx = 3
			}
			this.land()
		})
	}
	added() {
		let bird = this.scene.bird
		if (bird) {
			bird.y -= this.offsetY
		}
	}
	update() {
		let bird = this.scene.bird
		if (bird && this.snap) {
			this.x = bird.feetX() + this.offsetX
			this.y = bird.feetY()
			this.flip = (bird.facing == 'left')
		} else {
			this.vy += this.weight+0.1
			this.x += this.vx
			this.y += this.vy
			this.angle -= 10
		}
	}
	draw() {
		super.draw()
		this.el.style.transform += ` rotate(${this.angle}deg) scaleX(${this.flip ? -1 : 1})`
	}
	
	// hooks for additional behaviour on takeoff and landing
	takeoff() {}
	land() {}
	
}

export class Letter extends Item {
	constructor() {
		super()
		this.image('letter.png')
		this.setHitbox(0, 0, 9, 5)
		this.offsetX = 0
		this.offsetY = 5
	}
}

export class Kitten extends Item {
	constructor() {
		super()
		this.image('kitten.png')
		this.setHitbox(1, 0, 11, 15)
		this.offsetX = -2
		this.offsetY = 14
		this.weight = 0.1
	}
}

export class JetEngine extends Item {
	constructor() {
		super()
		this.image('jet.png')
		this.setHitbox(0, 0, 16, 11)
		this.offsetX = -4
		this.offsetY = 11
		this.weight = -0.05
		this.vx = -1
	}
	update() {
		let bird = this.scene.bird
		if (bird && bird.mode == 'flying') {
			this.vx += 0.1
			bird.x += Math.min(this.vx, 2)
			if (Math.random() < 0.8) {
				this.scene.add(new Smoke(this.x, this.y+4))
			}
		}
		super.update()
	}
}

export class Boombox extends Item {
	constructor() {
		super()
		this.image('boombox.png')
		this.setHitbox(0, 0, 16, 10)
		this.offsetX = -4
		this.offsetY = 10
		this.weight = 0.05
	}
	added() {
		super.added()
		this.scene.add()
	}
	removed() {
		super.removed()
	}
	takeoff() {
		boomboxMusic.play()
	}
	land() {
		boomboxMusic.pause()
	}
}

export class BoxOfFish extends Item {
	constructor() {
		super()
		this.image('box-of-fish.png')
		this.setHitbox(0, 0, 11, 9)
		this.offsetX = -1
		this.offsetY = 9
		this.weight = 0.05
	}
	update() {
		let oldX = this.x
		super.update()
		
		if (oldX < 280 && this.x >= 280) {
			// spawn the flock
			// flock should auto-remove itself upon reset
			for (let i=0; i<6; i++) {
				this.scene.add(new EnemyBird(this.x - 100 - i*60, -20 - Math.random()*60))
			}
		}
	}
}

export class Elephant extends Item {
	constructor() {
		super()
		this.image('elephant.png')
		this.setHitbox(0, 0, 17, 18)
		this.offsetX = -5
		this.offsetY = 18
		this.weight = 0.4
	}
	update() {
		super.update()
		let bird = this.scene.bird
		if (bird.mode == 'flying' && Math.random() < 0.15) {
			this.scene.add(new SweatDrop(bird.x+7, bird.y+5))
		}
	}
}

export class BagOfMoney extends Item {
	constructor() {
		super()
		this.image('bag-of-money.png')
		this.setHitbox(0, 0, 10, 12)
		this.offsetX = -1
		this.offsetY = 12
	}
}
