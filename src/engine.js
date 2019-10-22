// simple framework where entities are bound to DOM elements

export class Scene {
	
	constructor (root) {
		this.root = root
		this.el = document.createElement('div')
		this.el.className = 'scene'
		this.root.appendChild(this.el)
		
		this.w = root.clientWidth
		this.h = root.clientHeight
		
		this.camX = 0
		this.camY = 0
		
		this.actors = []
		this.addList = []
		this.removeList = []
		
		// as part of separating update/draw, we need separate lists for adding and removing HTML elements :\
		this.addElList = []
		this.removeElList = []
		
		// a simple observer system:
		// when an actor is added or removed, so are its listeners (i.e. those registered with actor.on())
		// listeners that are registered with scene.on() should be unregistered manually
		this.listeners = {}  // mapping from event-name to array of functions
	}
	
	add(...actors) {
		for (let actor of actors) {
			this.addList.push(actor)			
		}
	}
	remove(...actors) {
		for (let actor of actors) {
			this.removeList.push(actor)
		}
	}
	
	// register a listener
	on(eventName, f) {
		let arr = this.listeners[eventName]
		if (arr == null) {
			arr = []
			this.listeners[eventName] = arr
		}
		arr.push(f)
	}
	// unregister a listener
	off(eventName, f) {
		let arr = this.listeners[eventName]
		if (arr) {
			let i = arr.indexOf(f)
			if (i != -1) {
				arr.splice(i, 1)
			}
		}
	}
	// broadcast an event
	emit(eventName, ...args) {
		let arr = this.listeners[eventName]
		if (arr) {
			for (let f of arr) {
				f(...args)
			}
		}
	}
	
	update() {
		// update entities
		for (let actor of this.actors) {
			actor.update()
		}
		
		// add/remove pending entities:
		// queue them for DOM insertion/removal
		// register/unregister their listeners
		for (let actor of this.addList) {
			// don't add an actor that is already in the scene
			if (this.actors.indexOf(actor) == -1) {
				this.actors.push(actor)
				if (actor.el != null) {
					this.addElList.push(actor.el)
					// edge case: cancel removal of an actor that was added again before draw()
					let removeIndex = this.removeElList.indexOf(actor.el)
					if (removeIndex != -1) {
						this.removeElList.splice(removeIndex, 1)
					}
				}
				// add all the actor's listeners
				for (let k in actor.listeners) {
					this.on(k, actor.listeners[k])
				}
				actor.scene = this
				actor.added()
			}
		}
		for (let actor of this.removeList) {
			let n = this.actors.indexOf(actor)
			// can't remove an actors that isn't in the scene.
			if (n != -1) {
				actor.removed()
				this.actors.splice(n, 1)
				if (actor.el != null) {
					this.removeElList.push(actor.el)
					// edge case: cancel addition of an actor that was removed again before draw()
					let addIndex = this.addElList.indexOf(actor.el)
					if (addIndex != -1) {
						this.addElList.splice(addIndex, 1)
					}
				}
				for (let k in actor.listeners) {
					this.off(k, actor.listeners[k])
				}
				actor.scene = null
			}
		}
		this.addList = []
		this.removeList = []
	}
	
	draw() {
		// update camera
		this.el.style.transform = `translate(${-this.camX}px,${-this.camY}px)`
		
		for (let el of this.addElList) {
			this.el.appendChild(el)
		}
		for (let el of this.removeElList) {
			this.el.removeChild(el)
		}
		this.addElList = []
		this.removeElList = []
		
		for (let actor of this.actors) {
			actor.draw()
		}
	}
	
}

// general purpose base class for all game objects
// if you want the actor to be visible, make sure 'el' is defined before adding it to the stage
export class Actor {
	
	constructor (x, y) {
		this.scene = null
		this.el = null
		this.x = x
		this.y = y
		
		// the hitbox is relative to the current x/y position
		// and independent of the DOM element
		this.hitbox = {x:0,y:0,w:0,h:0}
		
		// mapping of event name to a function (under the assumption that an actor only listens to each event once)
		// this is used to make removal of the actor more efficient
		this.listeners = {}
	}
	
	added() {}   // called when the actor is added to the scene (but before it's added to the DOM)
	removed() {} // called when the actor is removed from the scene
	
	// setup functions for various types of graphics
	image(src) {
		this.el = document.createElement('img')
		this.el.src = `assets/${src}`
		this.el.classList.add('actor')
		this.el.draggable = false
	}
	canvas(w, h) {
		this.el = document.createElement('canvas')
		this.el.width = w
		this.el.height = h
		this.ctx = this.el.getContext('2d')
		this.el.classList.add('actor')
		this.el.draggable = false
	}
	div(w=0, h=0) {
		this.el = document.createElement('div')
		this.el.style.width = `${w}px`
		this.el.style.height = `${h}px`
		this.el.classList.add('actor')
	}
	sprite(src, frameW, frameH) {
		this.div(frameW, frameH)
		this.el.style.backgroundImage = `url("assets/${src}")`
		this.el.style.backgroundPosition = `0 0`
		this.sheet = document.createElement('img')
		// this.sheet.src = `assets/${src}`
		// this.sheet.style.transform = 'translate(0, 0)'
		// this.el.appendChild(this.sheet)
		this.frame = 0
		this.frameW = frameW
		this.frameH = frameH
		this.el.classList.add('actor', 'sprite')
	}
	
	setHitbox(x,y,w,h) {
		this.hitbox.x = x
		this.hitbox.y = y
		this.hitbox.w = w
		this.hitbox.h = h
	}
	
	centerX() {
		return this.x + this.hitbox.x + this.hitbox.w / 2
	}
	centerY() {
		return this.y + this.hitbox.y + this.hitbox.h / 2
	}
	
	// aabb collision check against another entity
	collide(other) {
		let al = this.x + this.hitbox.x 
		let au = this.y + this.hitbox.y
		let ar = al + this.hitbox.w
		let ad = au + this.hitbox.h
		let bl = other.x + other.hitbox.x 
		let bu = other.y + other.hitbox.y
		let br = bl + other.hitbox.w
		let bd = bu + other.hitbox.h
		return ar > bl && al < br && ad > bu && au < bd
	}
	
	update() {}
	
	draw() {
		if (this.el != null) {
			this.el.style.transform = `translate(${this.x}px, ${this.y}px)`
			if (this.sheet) {
				let x = -this.frame * this.frameW
				this.el.style.backgroundPosition = `${x}px 0`
				// this.sheet.style.transform = `translate(${x}px, 0)`
			}
		}
	}
	
	on(eventName, f) {
		if (this.listeners[eventName]) {
			console.error(this)
			throw new Error(`actor already has a listener for event ${eventName}`)
		}
		this.listeners[eventName] = f
		if (this.scene) {
			this.scene.on(eventName, f)
		}
	}
	off(eventName, f) {
		delete this.listeners[eventName]
		if (this.scene) {
			this.scene.off(eventName, f)
		}
	}
	emit(eventName, ...args) {
		this.scene.emit(eventName, ...args)
	}
	
}


// animation component for those actors which use spritesheets
// you can change the currently playing animation by calling play(frameList)
// the list of frames can have additional properties:
//   loop (bool) - whether the anim should repeat
//   speed (int) - how many frames to wait before progressing to the next anim frame.

const defaultFrames = [0]

export class Anim {
	constructor (actor) {
		this.actor = actor
		this.frames = defaultFrames
		this.timer = 0
		this.speed = 0
		this.index = 0
		this.playing = false
		this.looping = false
	}
	play(frames) {
		// only reset the animation if it's different to the last, or if it previously finished
		if (this.frames != frames || (!this.playing && this.index == frames.length-1)) {
			this.frames = frames
			this.index = 0
			this.actor.frame = this.frames[0]
		}
		this.speed = frames.speed || 1
		this.timer = this.speed
		this.looping = !!frames.loop
		this.playing = true
	}
	stop() {
		this.index = 0
		this.actor.frame = this.frames[0]
	}
	update() {
		if (!this.playing) return
		
		this.timer--
		if (this.timer > 0) return
		
		this.timer = this.speed
		this.index++
		
		if (this.index >= this.frames.length) {
			if (this.looping) {
				this.index = 0
				this.timer = this.speed
			} else {
				this.playing = false
				this.index--
			}
		}
		
		this.actor.frame = this.frames[this.index]
	}
}
