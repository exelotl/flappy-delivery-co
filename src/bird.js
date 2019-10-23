import { Actor, Anim } from './engine'
import { flapSfx, deathSfx } from './assets'

const animIdle = [5]

const animFlap = [2,3,4,5,6,7,8,9,1,10]
animFlap.loop = false
animFlap.speed = 3

export default class Bird extends Actor {
	
	constructor (x, y) {
		super(x, y)
		this.setHitbox(4,6,10,6)
		this.sprite('bird.png', 16, 16)
		this.el.style.zIndex = '1'
		this.anim = new Anim(this)
		this.anim.play(animIdle)
		this.vx = 1
		this.vy = 0
		this.gravity = 0.15
		this.mode = 'resting' // 'flying', 'falling', 'landing'
		this.facing = 'left'
		this.angle = 0
		this.landX = x
		this.landY = y
		this.canDeliver = true
		
		this.on('reset', () => {
			this.angle = 0
			this.gravity = 0.15
			this.land()
			if (this.scene.item) {
				this.y -= this.scene.item.offsetY
			}
		})
		
		this.on('begin-flight', () => {
			this.mode = 'flying'
			this.vx = this.facing == 'left' ? -1 : 1
			this.emit('flap')
		})
		
		this.on('begin-landing', (island) => {
			this.mode = 'landing'
			this.landX = island.landX
			this.landY = island.landY
		})
		
		this.on('flap', () => {
			if (this.mode == 'flying') {
				this.anim.stop()
				this.anim.play(animFlap)
				this.vy = -3
				flapSfx.pause()
				flapSfx.currentTime = 0
				flapSfx.play()
			}
		})
		
		this.on('bird-crash', (obstacle) => {
			if (this.mode == 'flying') {
				this.mode = 'falling'
				this.vx = 0
				this.vy = -1
				this.gravity = 0.1
				deathSfx.play()
			}
			setTimeout(() => {
				this.emit('reset')
			}, 1200)
		})
		
		this.on('test-collision', (obstacle) => {
			if (this.mode == 'flying') {
				let item = this.scene.item
				if (this.collide(obstacle) || (item && item.collide(obstacle))) {
					this.emit('bird-crash', obstacle)
				}
			}
		})
	}
	
	update() {
		switch (this.mode) {
		case 'flying':
			this.vy += this.gravity
			this.x += this.vx
			this.y += this.vy
			if (this.scene.item) {
				this.vy += this.scene.item.weight
			}
			// limit height
			if (this.y < -40) this.y = -40
			// die if we went too low
			if (this.y > 160) this.emit('bird-crash')
			break
		
		case 'falling':
			this.vy += this.gravity
			this.y += this.vy
			this.angle += 10
			break
		
		case 'landing':
			this.x = this.landX
			if (this.y < this.landY) {
				this.y += 1
			} else {
				this.emit('bird-land')
				this.land()
			}
			break
		
		case 'resting':
			break
		}
		
		this.anim.update()
	}
	
	draw() {
		super.draw()
		this.el.style.transform += ` rotate(${this.angle}deg) scaleX(${this.facing=='right' ? 1 : -1})`
	}
	
	
	land() {
		this.mode = 'resting'
		this.x = this.landX
		this.y = this.landY
		this.anim.play(animIdle)
	}
	
	feetX() {
		return this.x + (this.facing == 'left' ? 5 : 2)
	}
	feetY() {
		return this.y + 14
	}
}

export class EnemyBird extends Actor {
	constructor(x, y) {
		super(x, y)
		this.setHitbox(4,6,10,6)
		this.sprite('bird.png', 16, 16)
		this.anim = new Anim(this)
		this.anim.play(animFlap)
		this.vx = 1.7
		this.vy = 0
		this.t = Math.random()*60
		this.flapInterval = Math.random()*5 + 60
		this.on('reset', () => {
			this.scene.remove(this)
		})
	}
	update() {
		this.vy += 0.1
		this.x += this.vx
		this.y += Math.min(this.vy, 1.5)
		this.anim.update()
		
		this.t--
		if (this.t <= 0) {
			this.t = this.flapInterval
			this.vy = -1.5
			this.anim.stop()
			this.anim.play(animFlap)
		}
		if (this.y > 100) {
			this.flapInterval = 10
		}
		else if (this.y < -200) {
			this.scene.remove(this)
		}
		
		this.emit('test-collision', this)
		// if we reach a certain depth, abort and fly upwards, then eventually despawn?
	}
}